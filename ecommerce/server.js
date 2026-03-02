const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CYCLE_FILE = path.join(DATA_DIR, 'cycle.json');

// Initialize files
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, '[]');
if (!fs.existsSync(CYCLE_FILE)) {
    fs.writeFileSync(CYCLE_FILE, JSON.stringify({
        cycleStartDate: new Date().toISOString(),
        missionTarget: 50,
        ordersInCycle: 0
    }, null, 2));
}

const readData = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Temporary OTP Store
let otpStore = {};

// Auth Routes with OTP Simulation
app.post('/api/auth/request-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // In a real app, use nodemailer here.
    console.log(`[GMAIL SYNC] OTP for ${email}: ${otp}`);
    res.json({ message: 'OTP sent to your email (Check console for demo)' });
});

app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, otp } = req.body;
    if (otpStore[email] !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const users = readData(USERS_FILE);
    if (users.find(u => u.email === email)) return res.status(400).json({ message: 'User already exists' });

    const newUser = { id: Date.now().toString(), name, email, password, role: 'user' };
    users.push(newUser);
    writeData(USERS_FILE, users);
    delete otpStore[email];
    res.status(201).json({ message: 'User created successfully', user: newUser });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const users = readData(USERS_FILE);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', user });
});

// Status Tracker & Cycle Logic
const checkCycle = () => {
    let cycle = readData(CYCLE_FILE);
    const startDate = new Date(cycle.cycleStartDate);
    const now = new Date();
    const daysDiff = (now - startDate) / (1000 * 60 * 60 * 24);

    if (daysDiff >= 30 || cycle.ordersInCycle >= cycle.missionTarget) {
        cycle = {
            cycleStartDate: now.toISOString(),
            missionTarget: 50,
            ordersInCycle: 0
        };
        writeData(CYCLE_FILE, cycle);
        // Note: For a real production app, we'd archive the orders.json here.
        console.log("[MISSION CONTROL] Cycle Reset Triggered.");
    }
    return cycle;
};

// Admin Stats & Management
app.get('/api/admin/stats', (req, res) => {
    const cycle = checkCycle();
    const orders = readData(ORDERS_FILE);

    // Revenue for currently active cycle (filtered by cycleStartDate)
    let totalCredits = 0;
    orders.forEach(o => {
        if (new Date(o.timestamp) >= new Date(cycle.cycleStartDate)) {
            let subtotal = o.items.reduce((acc, item) => acc + item.price, 0);
            if (o.payment === 'Bank') subtotal *= 0.95;
            totalCredits += subtotal;
        }
    });

    const daysLeft = Math.max(0, 30 - Math.floor((new Date() - new Date(cycle.cycleStartDate)) / (1000 * 60 * 60 * 24)));

    res.json({
        totalCredits,
        orderCount: cycle.ordersInCycle,
        missionTarget: cycle.missionTarget,
        daysLeft: daysLeft
    });
});

app.get('/api/admin/orders', (req, res) => {
    res.json(readData(ORDERS_FILE));
});

app.post('/api/admin/products', (req, res) => {
    const product = req.body;
    const products = readData(PRODUCTS_FILE);
    products.push({ id: Date.now().toString(), ...product, inStock: true });
    writeData(PRODUCTS_FILE, products);
    res.json({ message: 'Product added successfully' });
});

app.patch('/api/admin/products/:id/stock', (req, res) => {
    const { id } = req.params;
    const { inStock } = req.body;
    const products = readData(PRODUCTS_FILE);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });

    products[idx].inStock = inStock;
    writeData(PRODUCTS_FILE, products);
    res.json({ message: `Product stock status updated to ${inStock}` });
});

app.delete('/api/admin/products/:id', (req, res) => {
    const { id } = req.params;
    const products = readData(PRODUCTS_FILE);
    const newProducts = products.filter(p => p.id !== id);
    writeData(PRODUCTS_FILE, newProducts);
    res.json({ message: 'Product removed from store' });
});

app.get('/api/products', (req, res) => {
    res.json(readData(PRODUCTS_FILE));
});

// Order Routes
app.post('/api/orders', (req, res) => {
    const order = req.body;
    const orders = readData(ORDERS_FILE);
    const newOrder = {
        id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        ...order,
        status: 'Processing',
        date: new Date().toISOString()
    };
    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);

    // Update Cycle Count
    const cycle = readData(CYCLE_FILE);
    cycle.ordersInCycle += 1;
    writeData(CYCLE_FILE, cycle);

    res.status(201).json({ message: 'Order received', orderId: newOrder.id });
});

app.get('/api/orders/:email', (req, res) => {
    const email = req.params.email;
    const orders = readData(ORDERS_FILE);
    const userOrders = orders.filter(o => o.user === email);
    res.json(userOrders);
});

app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orders = readData(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });

    orders[orderIndex].status = status;
    writeData(ORDERS_FILE, orders);
    res.json({ message: `Order ${id} updated to ${status}` });
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    let orders = readData(ORDERS_FILE);
    const initialCount = orders.length;
    orders = orders.filter(o => o.id !== id);

    if (orders.length === initialCount) return res.status(404).json({ message: 'Order not found' });

    writeData(ORDERS_FILE, orders);

    // Sync Cycle
    const cycle = readData(CYCLE_FILE);
    if (cycle.ordersInCycle > 0) {
        cycle.ordersInCycle -= 1;
        writeData(CYCLE_FILE, cycle);
    }

    res.json({ message: 'Mission Aborted: Order Cancelled' });
});

app.listen(PORT, () => {
    console.log(`RAYZ.SYS Backend running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Store references in memory for this simple backend
const references = [];

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received Contact Form Submission:');
    console.log(`Name: ${name}, Email: ${email}`);
    console.log(`Message: ${message}`);
    res.json({ success: true, message: 'Message received successfully!' });
});

app.post('/api/reference', (req, res) => {
    const { name, role, rating, feedback } = req.body;
    console.log('Received Reference Submission:');
    console.log(`Name: ${name}, Role: ${role}, Rating: ${rating}`);
    console.log(`Feedback: ${feedback}`);
    
    const newReference = { name, role, rating, feedback, date: new Date() };
    references.push(newReference);
    
    res.json({ success: true, message: 'Reference submitted successfully!' });
});

app.get('/api/references', (req, res) => {
    res.json(references);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

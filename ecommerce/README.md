# RAYZ.SYS Full-Stack E-Commerce

This project now features a Node.js/Express backend for real authentication and order management.

## Prerequisites
- **Node.js**: Install from [nodejs.org](https://nodejs.org/)

## Setup & Run
1. Open a terminal in the `ecommerce` directory.
2. Install dependencies:
   ```bash
   npm install express body-parser cors
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Access the website by opening `e-commerce.html` in your browser.

## Backend Features
- **Authentication**: `POST /api/auth/signup` and `/api/auth/login`.
- **Order Management**: `POST /api/orders` saves all successful purchases to `data/orders.json`.
- **Mock Database**: Data is stored locally in JSON files within the `data/` folder.

## Frontend Enhancements
- **Newcomer Deals**: Mega deals now include "Starter" and "Newcomer" editions with budget-friendly prices.
- **Persistent Cart**: The cart remains synced across Home, Shop, and Configurator.
- **Bank Transfer Discount**: 5% discount applied automatically on Bank Transfer selection.

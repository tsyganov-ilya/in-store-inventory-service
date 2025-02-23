const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Роуты
app.use('/api/products', productRoutes);
// app.use('/api/inventory', inventoryRoutes);

// Запуск сервера
app.listen(3000, () => {
    console.log('Inventory Service running on http://localhost:3000');
});
const pool = require('../config/dbConfig');

// Создание остатка
const createStock = async (req, res) => {

    const { product_id, shop_id, quantity_shelf, quantity_order } = req.body;

    if (!product_id || !shop_id || quantity_shelf === undefined || quantity_order === undefined) {
        return res.status(400).json({ error: 'Все поля (product_id, shop_id, quantity_shelf, quantity_order) обязательны' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO stock (product_id, shop_id, quantity_shelf, quantity_order) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [product_id, shop_id, quantity_shelf, quantity_order]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при создании остатка:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};  

// Увеличение остатка улучшенный вариант
const increaseStock = async (req, res) => {
    const { id, amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    try {
        const result = await pool.query(
            'UPDATE stock SET quantity_shelf = quantity_shelf + $1 WHERE id = $2 RETURNING *',
            [amount, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        res.json({
            message: 'Inventory updated successfully',
            updatedInventory: result.rows[0],
        });
    } catch (err) {
        console.error('Error updating inventory:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createStock, increaseStock };




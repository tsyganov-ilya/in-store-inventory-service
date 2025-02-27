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

/// Уменьшение остатка с проверками
const decreaseStock = async (req, res) => {
    const { id, amount } = req.body;

    // Проверка на правильность данных
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    try {
        // Проверка, существует ли товар с таким id
        const result = await pool.query(
            'SELECT quantity_shelf FROM stock WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Stock item not found' });
        }

        // Получаем текущее количество на полке
        const currentQuantity = result.rows[0].quantity_shelf;

        // Проверка на достаточность товара для уменьшения
        if (amount > currentQuantity) {
            return res.status(400).json({ error: 'Amount to decrease exceeds current stock' });
        }

        // Обновление количества на полке
        const updatedResult = await pool.query(
            'UPDATE stock SET quantity_shelf = quantity_shelf - $1 WHERE id = $2 RETURNING *',
            [amount, id]
        );

        res.json({
            message: 'Stock decreased successfully',
            updatedStock: updatedResult.rows[0],
        });
    } catch (err) {
        console.error('Error decreasing stock:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getStockByFilters = async (req, res) => {
    const { plu, shop_id, quantity_shelf_min, quantity_shelf_max, quantity_order_min, quantity_order_max } = req.query;

    let query = 'SELECT * FROM stock WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (plu) {
        query += ` AND product_id = $${paramIndex}`;
        params.push(plu);
        paramIndex++;
    }

    if (shop_id) {
        query += ` AND shop_id = $${paramIndex}`;
        params.push(shop_id);
        paramIndex++;
    }

    if (quantity_shelf_min) {
        query += ` AND quantity_shelf >= $${paramIndex}`;
        params.push(quantity_shelf_min);
        paramIndex++;
    }

    if (quantity_shelf_max) {
        query += ` AND quantity_shelf <= $${paramIndex}`;
        params.push(quantity_shelf_max);
        paramIndex++;
    }

    if (quantity_order_min) {
        query += ` AND quantity_order >= $${paramIndex}`;
        params.push(quantity_order_min);
        paramIndex++;
    }

    if (quantity_order_max) {
        query += ` AND quantity_order <= $${paramIndex}`;
        params.push(quantity_order_max);
        paramIndex++;
    }

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении остатков:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};



module.exports = { createStock, increaseStock, decreaseStock, getStockByFilters };




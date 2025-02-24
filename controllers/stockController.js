const pool = require('../config/dbConfig');

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

module.exports = { createStock };




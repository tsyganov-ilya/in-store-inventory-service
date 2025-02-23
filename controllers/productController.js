const pool = require('../config/dbConfig');

// Создание товара
const createProduct = async (req, res) => {
    const { plu, name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *',
            [plu, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};  

// const createProduct = async (req, res) => {
//     const { plu, name } = req.body;

//     // Проверяем, что оба поля переданы
//     if (!plu || !name) {
//         return res.status(400).json({ error: 'PLU и Name обязательны для заполнения' });
//     }

//     try {
//         // Выполняем вставку в таблицу products
//         const result = await pool.query(
//             'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *',
//             [plu, name]
//         );

//         // Возвращаем созданный товар
//         res.status(201).json(result.rows[0]);
//     } catch (err) {
//         // Возвращаем ошибку с подробным сообщением
//         console.error('Ошибка при добавлении товара:', err);
//         res.status(500).json({ error: err.message });
//     }
// };


// Получение товаров по фильтрам
const getProducts = async (req, res) => {
    const { plu, name } = req.query;
    try {
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (plu) {
            params.push(plu);
            query += ` AND plu = $${params.length}`;
        }

        if (name) {
            params.push(`%${name}%`);
            query += ` AND name ILIKE $${params.length}`;
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createProduct, getProducts };

const { Pool } = require('pg');  // Импортируем Pool из библиотеки pg
require('dotenv').config();

// Настройка подключения к базе данных PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,            // Имя пользователя базы данных из переменных окружения
    host: process.env.DB_HOST,            // Хост базы данных из переменных окружения
    database: process.env.DB_NAME,        // Имя базы данных из переменных окружения
    password: process.env.DB_PASSWORD,    // Пароль для пользователя из переменных окружения
    port: process.env.DB_PORT || 5432,    // Порт, на котором работает PostgreSQL (если не задан, используем 5432)
});

// Проверка подключения к базе данных
pool.connect()
    .then(() => {
        console.log('Успешное подключение к базе данных');
    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных:', err);
    });

// Экспортируем pool, чтобы другие файлы могли использовать подключение к базе
module.exports = pool;
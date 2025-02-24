const express = require('express');
const { createStock } = require('../controllers/stockController.js');

const router = express.Router();

router.post('/', createStock);

module.exports = router; 
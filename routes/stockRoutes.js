const express = require('express');
const { createStock, increaseStock } = require('../controllers/stockController.js');

const router = express.Router();

router.post('/', createStock); //POST http://localhost:3000/api/stocks
// {
//     "product_id": 1,
//     "shop_id": 1,
//     "quantity_shelf": 50,
//     "quantity_order": 10
// }
router.patch('/', increaseStock); //PATCH http://localhost:3000/api/stocks/
// {
//     "id": 3,
//     "amount": 10
//   }
  

module.exports = router; 
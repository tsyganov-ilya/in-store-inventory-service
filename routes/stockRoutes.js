const express = require('express');
const { createStock, increaseStock, decreaseStock } = require('../controllers/stockController.js');

const router = express.Router();

router.post('/', createStock); //POST http://localhost:3000/api/stocks
// {
//     "product_id": 1,
//     "shop_id": 1,
//     "quantity_shelf": 50,
//     "quantity_order": 10
// }
router.patch('/increase', increaseStock); //PATCH http://localhost:3000/api/stocks/increase
// {
//     "id": 3,
//     "amount": 10
//   }
router.patch('/decrease', decreaseStock); // PATH http://localhost:3000/api/stocks/decrease
 // {
//     "id": 3,
//     "amount": 10
//   } 

module.exports = router; 
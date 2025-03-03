const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateProduct = require('../middlewares/validateProduct'); 

router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', validateProduct, productController.createProduct);
router.put('/:pid', validateProduct, productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;

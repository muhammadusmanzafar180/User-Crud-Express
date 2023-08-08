    const express = require('express');

    const Product = require('../models/product');
    const isAuth = require('../middleware/is-auth');
    const isAdmin = require('../middleware/is-admin');

    const productController = require('../controllers/product');
    const router = express.Router();

    router.post('/add-product', isAuth, isAdmin,productController.addProduct);
    router.get('/get-products', isAuth, productController.getProduct);
    router.get('/get-product', isAuth, productController.getProductByTitle);
    router.delete('/delete-product/:id', isAuth, productController.deleteProduct);

    module.exports = router;
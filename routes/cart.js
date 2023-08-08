    const express = require('express');

    const cart = require('../models/cart');
    const isAuth = require('../middleware/is-auth');

    const cartController = require('../controllers/cart');
    const router = express.Router();

    router.post('/add-cart', isAuth, cartController.addToCart);
    router.post('/deleteById', isAuth, cartController.deleteByProdId);
    router.post('/checkout', isAuth, cartController.checkout);

    module.exports = router;
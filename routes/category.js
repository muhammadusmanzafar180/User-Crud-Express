    const express = require('express');

    const category = require('../models/category');
    const isAuth = require('../middleware/is-auth');

    const categoryController = require('../controllers/category');
    const router = express.Router();

    router.post('/add-category', isAuth, categoryController.addCategory);
    router.delete('/delete-category/:id', isAuth, categoryController.deleteCategory);

    module.exports = router;
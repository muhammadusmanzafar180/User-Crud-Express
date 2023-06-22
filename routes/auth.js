const express = require('express');
const { check, body } = require('express-validator/check');

const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

const authController = require('../controllers/auth')
const router = express.Router();

router.post(
    '/signup',
    [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists!');
                    }
            })
        })
        .normalizeEmail(),
        body('password')
        .trim()
        .isLength({min: 8}),
        body('name')
        .trim()
        .not().isEmpty()
],authController.signUp);

router.post('/login', authController.login);
router.post('/update',isAuth, [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email address already exists!');
                    }
            })
        })
        .normalizeEmail(),
        body('name')
        .trim()
        .not().isEmpty()
], authController.updateUser);

router.post('/deleteUser', authController.deleteUser);
module.exports = router;
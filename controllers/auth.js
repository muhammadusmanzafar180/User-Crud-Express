 const { validationResult } = require('express-validator/check');
 const bcrypt = require('bcryptjs');
 const jwt = require("jsonwebtoken");
 const User = require('../models/user');
 
 exports.signUp = (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         const error = new Error('Validation failed.');
         error.statusCode = 422;
         error.data = errors.array();
         throw error;
     }
     const email = req.body.email;
     const name = req.body.name;
     const password = req.body.password;
     bcrypt.hash(password, 12)
     .then(hashedPw => {
         const user = new User({
             email: email,
             password: hashedPw,
             name: name
         });
         return user.save();
     })
     .then(result => {
         res.status(200).json({
             message: 'User Created',
             userId: result._id
         })
     })
     .catch(err => {
         if(!err.statusCode) {
             err.statusCode = 500;
         }
         next(err);
     })
 };
 
 //we always end up in the .then() block if no error is thrown 
 exports.login = (req, res, next) => {
     const email = req.body.email;
     const password = req.body.password;
     let loadedUser;
     User.findOne({
         email:email
     })
     .then(user => {
         if(!user) {
             const error = new Error('A user with this email doesnot exist.');
             error.statusCode = 401;
             throw error;
         }
         loadedUser = user;
         bcrypt.compare(password, user.password)
         .then(isEqual => {
             if(!isEqual) {
                 const error = new Error('Incorrect Password!');
                 error.statusCode = 401;
                 throw error;
             }
             const token = jwt.sign(
             {
                 email: loadedUser.email,
                 userId: loadedUser._id.toString()
             }, 
             'secret',
             {
                 expiresIn: '1h'
             });
             res.status(200).json({
                 token: token,
                 userId: loadedUser._id.toString()
             })
         })
     }
 
     )
     .catch(err => {
         if(!err.statusCode) {
             err.statusCode = 500;
         }
         next(err);
     })
 }
 exports.updateUser = (req, res, next) => {
     const id = req.body._id;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         const error = new Error('Validation failed.');
         error.statusCode = 422;
         error.data = errors.array();
         throw error;
     }
     let loadedUser;
     User.findOne({
         _id: id
     })
     .then(user => {
         if(!user) {
             const error = new Error('A user with this ID doesnot exist.');
             error.statusCode = 401;
             throw error;
         }
         loadedUser = user;
         User.updateOne(
             {
                 _id: loadedUser._id
             },{
                 $set: {
                     email: req.body.email,
                     name: req.body.name,
             }
         })
         .then(() => {
             res.status(200).json({
                 message: 'User Updated',
             })
         })
     })
     
     .catch(err => {
         if(!err.statusCode) {
             err.statusCode = 500;
         }
         next(err);
     })
 }
 
 exports.deleteUser = (req, res, next) => {
     const id = req.body._id;
     // const errors = validationResult(req);
     // if (!errors.isEmpty()) {
     //     const error = new Error('Validation failed.');
     //     error.statusCode = 422;
     //     error.data = errors.array();
     //     throw error;
     // }
     let loadedUser;
     User.findOne({
         _id: id
     })
     .then(user => {
         if(!user) {
             const error = new Error('A user with this ID doesnot exist.');
             error.statusCode = 401;
             throw error;
         }
         loadedUser = user;
         User.deleteOne(
             {
                 _id: loadedUser._id
             })
         .then(() => {
             res.status(200).json({
                 message: 'User Deleted',
             })
         })
     })
     
     .catch(err => {
         if(!err.statusCode) {
             err.statusCode = 500;
         }
         next(err);
     })
 }
  const express = require('express');
  const bodyParser = require('body-parser');
  const mongoose = require('mongoose');

  const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/product');
  const categoryRoutes = require('./routes/category');
  const cartRoutes = require('./routes/cart');

  const app = express();

  app.use(bodyParser.json());

  const MONGODB_URI =
    'mongodb://localhost:27017/users-crud';

  app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
  });

  app.use('/auth', authRoutes);
  app.use('/product', productRoutes);
  app.use('/category', categoryRoutes);
  app.use('/cart', cartRoutes);

  app.use((error, req, res, next) => {
      console.log(error);
      const status = error.statusCode || 500;
      const message = error.message;
      const data = error.data;
      res.status(status).json({
          message: message, data: data
      });
  })

  mongoose
    .connect(
      MONGODB_URI, { useNewUrlParser: true }
    )
    .then(result => {
      app.listen(8080);
    })
    .catch(err => {
      console.log(err);
    });

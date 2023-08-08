    const Category = require('../models/category');
    const Product = require('../models/product');
    const nodeMailer = require('nodemailer');

    const html = `
        <h1> Hello World </h1>
        <p> Email through NodeMailer! </p>`;

    async function main() {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: '',
                pass: ''
            }
        });

        const info = await transporter.sendMail({
            from: '',
            to: '',
            subject: 'Nodemailer Email',
            html: html       
        })

        console.log('Message sent' + info.messageId);
    }
    exports.addProduct = async (req, res, next) => {
        // console.log(req.body);
        
        try {
            const { title, price, description, quantity, categoryId } = req.body; 
        
            const category = await Category.findOne({_id: categoryId})
            
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            const product = new Product({
                title,
                description,
                price,
                quantity,
                category: category._id
            });

            // save product into the database    
            const newProduct = await product.save();
            res.status(201).json(newProduct);
        }
        catch(error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
        }
    }

    exports.deleteProduct = (req, res, next) => {
        //console.log(req.params)
        const id = req.params.id;
        //console.log(id);
        let loadedProduct;
        Product.findOne({
            _id: id
        })
        .then(product => {
            if(!product) {
                const error = new Error('A product with this ID doesnot exist.')
                error.statusCode = 401;
                throw error;
            }
            loadedProduct = product;
            Product.deleteOne(
                {
                    _id: loadedProduct._id
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Product Deleted',
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

    exports.getProduct = async (req, res, next) => {
        const products = await Product.find({})
        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }
        res.status(201).json(products);
    }
    exports.getProductByTitle = async (req, res, next) => {
        const { title } = req.query;
        try {
        const products = await Product.find({title})
        
        if (products.length == 0) {
            return res.status(404).json({ error: 'No Product with this name' });
        }
        res.status(201).json(products);
        }
        catch(error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
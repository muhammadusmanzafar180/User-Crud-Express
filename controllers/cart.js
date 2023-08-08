    // const cart = require('../models/cart');
    const Cart = require('../models/cart');
    const Category = require('../models/category');
    const Product = require('../models/product');
    const User = require('../models/user');
    const mongoose = require('mongoose');

    exports.deleteByProdId = async (req, res, next) => {
        // cartId, -- prod ObjId, prodId
        // find and then delete prod ObjId
        // add prod quantity for prodId
        const { cartId, userId, prodCartId, productId} = req.body;

        const cart = await Cart.findOne({ _id: cartId, user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found or does not belong to the specified user' });
        }
        console.log(cart);
        
        let isDelete = true;
        await updateProductQuantity(cart.product[0].product_id, cart.product[0].quantity, isDelete);
        
        // delete cart objects
        await Cart.updateOne(
            { 'product._id': cart.product[0]._id }, // Match the cart with the specific item
            { $pull: { product: { _id:  cart.product[0]._id} } } // Remove the item from the cart's items array
        );
        res.json(cart);
    }

    exports.checkout = async (req, res, next) => {
        try {
            // console.log(req)
            const { userId, cartId } = req.body; 
            console.log(userId);
            console.log(cartId);

            // validate cartId and userId are correct and same cartId for userId
            const cart = await Cart.findOne({ _id: cartId, user: userId });
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found or does not belong to the specified user' });
            }

            const userExist = await User.findOne({ _id: userId });
            if (!userExist) {
                return res.status(404).json({ error: 'User not found' });
            }

            const previousOrders =  cart.product.map(item => ({
                _id: new mongoose.Types.ObjectId(),
                product_id: item.product_id,
                quantity: item.quantity,
                category_id: item.category_id,
            }))

            console.log(previousOrders);
            // Create new order documents and push them to the userExist.orders array
            previousOrders.forEach(order => {
            userExist.orders.push(order);
            });
            await userExist.save();


            // delete cart objects
            await Cart.deleteOne({ _id: cartId})
            res.json(userExist);
        }
        catch(error) {
            console.log(error);
            res.status(500).json({ error: 'Server error'});
        }
    }
    exports.addToCart = async (req, res, next) => {
        //console.log(req.body);
        // console.log(req.userId);
        
        try {
            const { user, product } = req.body; 
            
            console.log(user);
            console.log(product);

            const prod = await Product.findById(product[0].product_id)
            // console.log(prod);

            // to check if product exist
            if(!prod) {
                return res.status(404).json({error: 'Product not found'});
            }

            // to check if category exist
            const cat = await Category.findById(product[0].category_id);
            if(!cat) {
                return res.status(404).json({error: 'Category not found'});
            }

            // to check if product quantity is less than new req
            if(prod.quantity < product[0].quantity) {
                return res.status(404).json({error: 'Product quantity too much'});
            }

            let isDelete = false;
            // code to check if a user with the id exist
            // find the cart by the userId
            // if cart doesnot exist then add as new
            const userCartExist = await Cart.findOne({ user });
                if (!userCartExist) {
                    const newCart = new Cart({ user, product: [{
                    product_id: product[0].product_id,
                    category_id: product[0].category_id,
                    quantity: product[0].quantity 
                }] 
            });

            await newCart.save();
            await updateProductQuantity(product[0].product_id, product[0].quantity, isDelete)
            return res.json(newCart);
        }


            const existingCartItem = userCartExist.product.find(item => item.product_id == product[0].product_id) 
            // {
            //     if(item.product_id == product[0].product_id) {
            //         return true;
            //     }
            //     else {
            //         return false;
            //     }
            // });
            
            // if the product already exists, update the quantity
            if (existingCartItem) {
            existingCartItem.quantity += product[0].quantity;
            } 
            // If the product doesn't exist, add it to the cart
            else {
            userCartExist.product.push({
                    product_id: product[0].product_id,
                    category_id: product[0].category_id,
                    quantity: product[0].quantity 
                });
            }

            await userCartExist.save();
            await updateProductQuantity(product[0].product_id, product[0].quantity, isDelete)
            res.json(userCartExist);
        }
        catch(error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
        }
    }

    exports.deleteCategory = (req, res, next) => {
        console.log(req.userId)
        // console.log(req.params)
        const id = req.params.id;
        // console.log(id);
        let loadedCategory;
        Category.findOne({
            _id: id
        })
        .then(cat => {
            if(!cat) {
                const error = new Error('A category with this ID doesnot exist.')
                error.statusCode = 401;
                throw error;
            }
            loadedCategory = cat;
            Category.deleteOne(
                {
                    _id: loadedCategory._id
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Category Deleted',
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

    // Function to update product quantity in the Product collection
    async function updateProductQuantity(productId, quantity, isDelete) {
        try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        // Subtract the product quantity and save it
        if (isDelete) {
            product.quantity += quantity;
        }
        else {
        product.quantity -= quantity;
        }
        await product.save();
        } catch (err) {
        throw err;
        }
    }
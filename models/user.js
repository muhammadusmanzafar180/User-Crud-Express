    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const userSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            default: [],
            required: false
        },
        orders: [{
            product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
            },
            category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
            },
            quantity: {
                type: Number,
                // required: true
            },
        }],
    });

    module.exports = mongoose.model('User', userSchema);
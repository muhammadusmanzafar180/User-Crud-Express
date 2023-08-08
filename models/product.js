    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const productSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // reference to the 'Category' model
            required: true
        }
    })
    module.exports = mongoose.model('Product', productSchema);
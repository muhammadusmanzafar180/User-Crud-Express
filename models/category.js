    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const categoryScehma = new Schema({
        categoryName: {
            type: String,
            required: true
        }
    })
    module.exports = mongoose.model('Category', categoryScehma)
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.String,
        ref: 'Employee',
        required: true
    },
    image: String
})

module.exports = mongoose.model('Product', ProductSchema)
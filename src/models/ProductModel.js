const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    userID: {type: mongoose.Schema.ObjectId}
}, { timestamps: true, versionKey: false });

const ProductModel = mongoose.model('products', DataSchema);

module.exports = ProductModel;

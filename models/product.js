const mongoose = require('mongoose');

const productdb = new mongoose.Schema({
    productname: { type: String, required: true }, price: { type: Number, required: true }, stock: { type: Number, default: 0 }
});

const product = mongoose.model('product', productdb);
module.exports = product;
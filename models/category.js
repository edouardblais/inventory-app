const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, maxLength: 50},
});

CategorySchema.virtual('url').get(function() {
    return `/shop/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GearSchema = new Schema({
    name: { type: String, required: true, maxLength: 50},
    brand: { type: String, required: true, maxLength: 50},
    description: { type: String, required: true, maxLength: 200},
    price: { type: Number, required: true, min: 0, default: 0},
    number_in_stock: { type: Number, required: true, min: 0, default: 0},
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true}
});

GearSchema.virtual('url').get(function() {
    return `/shop/gear/${this._id}`;
});

module.exports = mongoose.model('Gear', GearSchema);
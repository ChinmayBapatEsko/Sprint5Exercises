const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    calories: { type: Number, required: true },
    cost: { type: Number, required: true }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
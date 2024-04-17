

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    ingredients: [{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
        quantity: { type: Number, required: true }
    }],
    totalCalories: { type: Number, default: 0 } // Default totalCalories to 0
});

// Define a pre-save hook to calculate totalCalories based on ingredients
recipeSchema.pre('save', async function (next) {
    try {
        let totalCalories = 0;

        // Calculate total calories by iterating through ingredients array
        for (const item of this.ingredients) {
            const ingredient = await mongoose.model('Ingredient').findById(item.ingredient);
            if (ingredient) {
                totalCalories += (ingredient.calories * item.quantity)/100; // Calculate calories based on quantity
            }
        }

        // Set the calculated totalCalories to the recipe before saving
        this.totalCalories = totalCalories;
        next();
    } catch (error) {
        next(error);
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

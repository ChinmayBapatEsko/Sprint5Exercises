
const mongoose = require('mongoose');

const biscuitSchema = new mongoose.Schema({
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    shape: { type: String, enum: ['Rectangle', 'Triangle', 'Circle'], required: true },
    bakingTime: { type: Number, required: true },
    name: { type: String, required: true },
    bakingTemperature: { type: Number, required: true },
    cost: { type: Number, default: 0 } // Default cost to 0
});

// Define a pre-save hook to calculate the cost based on baking time and ingredient costs
biscuitSchema.pre('save', async function (next) {
    try {
        let bakingCost = 0;
        let ingredientCost = 0;

        // Calculate baking cost based on baking time
        bakingCost = Math.ceil(this.bakingTime / 10) * 5; // Cost for baking is 5 rupees per 10 mins

        // Calculate ingredient cost by fetching the recipe details and summing up ingredient costs
        const Recipe = mongoose.model('Recipe');
        const recipe = await Recipe.findById(this.recipe).populate('ingredients.ingredient');

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        // Calculate ingredient cost based on quantities used in the recipe
        for (const item of recipe.ingredients) {
            ingredientCost += (item.quantity / 100) * item.ingredient.cost;
        }

        // Set the calculated cost to the biscuit before saving
        this.cost = Math.ceil(bakingCost + ingredientCost);
        next();
    } catch (error) {
        next(error);
    }
});

const Biscuit = mongoose.model('Biscuit', biscuitSchema);

module.exports = Biscuit;

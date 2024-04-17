const Ingredient = require('../models/Ingredient');

exports.getAllIngredients = async () => {
    try {
        const ingredients = await Ingredient.find({});
        return ingredients;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createIngredient = async (ingredientData) => {
    try {
        const ingredient = new Ingredient(ingredientData);
        await ingredient.save();
        return ingredient;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.updateAllIngredients = async (updateData) => {
    try {
        const updatedIngredients = [];
        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                const updatedIngredient = await Ingredient.findByIdAndUpdate(key,updateData[key],{ new: true });
                updatedIngredients.push(updatedIngredient);
            }
        }
        return updatedIngredients;
    } catch (error) {
        throw new Error(error.message);
    }
};
const Recipe = require('../models/Recipe');
const Biscuit = require('../models/Biscuit');

exports.getAllRecipes = async () => {
    try {
        const recipes = await Recipe.find({});
        return recipes;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createRecipe = async (recipeData) => {
    try {
        const recipe = new Recipe(recipeData);
        await recipe.save();
        return recipe;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getRecipeByBiscuitId = async (biscuitId) => {
    try {
        if (!biscuitId) {
            throw new Error("Biscuit ID must be provided.");
        }
        const biscuit = await Biscuit.findById(biscuitId);
        if (!biscuit) {
            throw new Error("Biscuit not found.");
        }
        const recipeId = biscuit.recipe;
        if (!recipeId) {
            throw new Error("Recipe ID not found for this biscuit.");
        }
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            throw new Error("Recipe not found.");
        }
        return recipe;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getIngredientListForRecipe = async (recipeId) => {
    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const ingredientIds = recipe.ingredients.map(ingredient => ingredient.ingredient);
        return ingredientIds;

    } catch (error) {
        console.error('Failed to retrieve ingredient IDs:', error);
        throw error;
    }
};

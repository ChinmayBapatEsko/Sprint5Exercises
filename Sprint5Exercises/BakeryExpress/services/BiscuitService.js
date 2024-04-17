const Biscuit = require('../models/Biscuit');
const Recipe = require('../models/Recipe');
const recipeService = require('../services/RecipeService');


exports.getAllBiscuits = async () => {
    try {
        const biscuits = await Biscuit.find({});
        return biscuits;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createBiscuit = async (biscuitData) => {
    try {
        const biscuit = new Biscuit(biscuitData);
        await biscuit.save();
        return biscuit;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getTotalCalories = async (biscuitId) => {
    try {
        const biscuit = await Biscuit.findById(biscuitId);
        if (!biscuit) {
            throw new Error('Biscuit not found');
        }

        const recipeId = biscuit.recipe;
        if (!recipeId) {
            throw new Error('Recipe not found for this biscuit');
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        return recipe.totalCalories;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getAllBiscuitIngredients = async () =>{
    const biscuits = await exports.getAllBiscuits();
    if(!biscuits){
        throw new Error('Biscuits not found');
    }
    const ingredientLists = {};

    for (const biscuit of biscuits) {
        const ingredientIds = await recipeService.getIngredientListForRecipe(biscuit.recipe);
        if(!ingredientIds){
            throw new Error('Ingredients for a biscuit not found');
        }
        ingredientLists[biscuit._id] = ingredientIds;
    }

    return ingredientLists;
}

exports.getBiscuitById = async(biscuitId) =>{
    const biscuit = Biscuit.findById(biscuitId);
    if(!biscuit){
        throw new Error('Biscuit Not Found');
    }
    return biscuit;
}
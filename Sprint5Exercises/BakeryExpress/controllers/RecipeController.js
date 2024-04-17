
const recipeService = require('../services/RecipeService');

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await recipeService.getAllRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRecipe = async (req, res) => {
    try {
        const recipe = await recipeService.createRecipe(req.body);
        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRecipeByBiscuitId = async (req, res) => {
    try {
        const biscuitId = req.params.biscuitId;
        const recipe = await recipeService.getRecipeByBiscuitId(biscuitId);
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const ingredientService = require('../services/IngredientService');

exports.getAllIngredients = async (req, res) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientService.createIngredient(req.body);
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAllIngredients = async (req, res) => {
    const updateData = req.body;
    try {
        const updatedIngredients = await ingredientService.updateAllIngredients(updateData);
        res.status(200).json(updatedIngredients);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
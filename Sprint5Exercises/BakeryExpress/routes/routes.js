const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/IngredientController');
const recipeController = require('../controllers/RecipeController');
const biscuitController = require('../controllers/BiscuitController');
const biscuitOrderController = require('../controllers/BiscuitOrderController');

// Ingredient routes
router.get('/ingredients', ingredientController.getAllIngredients);
router.post('/ingredients', ingredientController.createIngredient);
router.put('/ingredients', ingredientController.updateAllIngredients);

// Recipe routes
router.get('/recipes', recipeController.getAllRecipes);
router.post('/recipes', recipeController.createRecipe);
router.get('/recipes/:biscuitId', recipeController.getRecipeByBiscuitId)

// Biscuit routes
router.get('/biscuits', biscuitController.getAllBiscuits);
router.post('/biscuits', biscuitController.createBiscuit);
router.get('/biscuits/get-ingredients', biscuitController.getAllBiscuitIngredients);
router.get('/biscuit/:biscuitId', biscuitController.getBiscuitById);

// BiscuitOrder routes
router.get('/biscuit-orders', biscuitOrderController.getAllBiscuitOrders);
router.post('/biscuit-orders', biscuitOrderController.createBiscuitOrder);
router.put('/biscuit-orders/:biscuitOrderId', biscuitOrderController.updateBiscuitOrder);
router.get('/biscuit-order/getCalories/:biscuitOrderId', biscuitOrderController.getTotalCaloriesInOrder);

module.exports = router;

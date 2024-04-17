const biscuitService = require('../services/BiscuitService');

exports.getAllBiscuits = async (req, res) => {
    try {
        const biscuits = await biscuitService.getAllBiscuits();
        res.status(200).json(biscuits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBiscuit = async (req, res) => {
    try {
        const biscuit = await biscuitService.createBiscuit(req.body);
        res.status(201).json(biscuit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTotalCalories = async (req, res) => {
    try {
        const { biscuitId } = req.params;
        const totalCalories = await biscuitService.getTotalCalories(biscuitId);
        res.status(200).json({ totalCalories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBiscuitIngredients = async(req, res) =>{
    try{
        const biscuitIngredientMap = await biscuitService.getAllBiscuitIngredients();
        res.status(200).json(biscuitIngredientMap);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

exports.getBiscuitById = async(req, res) =>{
    try{
        const { biscuitId } = req.params;
        const biscuit = await biscuitService.getBiscuitById(biscuitId);
        res.status(200).json(biscuit);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

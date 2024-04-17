const biscuitOrderService = require('../services/BiscuitOrderService');

exports.getAllBiscuitOrders = async (req, res) => {
    try {
        const orders = await biscuitOrderService.getAllBiscuitOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBiscuitOrder = async (req, res) => {
    try {
        const biscuitOrder = await biscuitOrderService.createBiscuitOrder(req.body);
        res.status(201).json(biscuitOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBiscuitOrder = async (req, res) => {
    try{
        const biscuitOrderId = req.params.biscuitOrderId;
        const biscuitOrder = await biscuitOrderService.updateBiscuitOrder(biscuitOrderId, req.body);
        res.status(200).json(biscuitOrder);
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}

exports.getTotalCaloriesInOrder = async (req, res) => {
    try {
        const biscuitOrderId = req.params.biscuitOrderId;
        const totalCalories = await biscuitOrderService.getTotalCaloriesInOrder(biscuitOrderId);
        res.status(200).json({ totalCalories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const BiscuitOrder = require('../models/BiscuitOrder');
const { getTotalCalories } = require('./BiscuitService');

exports.getAllBiscuitOrders = async () => {
    try {
        const orders = await BiscuitOrder.find({});
        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createBiscuitOrder = async (orderData) => {
    try {
        const biscuitOrder = new BiscuitOrder(orderData);
        await biscuitOrder.save();
        return biscuitOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.updateBiscuitOrder = async (biscuitOrderId, updatedBiscuitOrder) => {
    try {
        const updatedOrder = await BiscuitOrder.findByIdAndUpdate(biscuitOrderId,updatedBiscuitOrder,{ new: true });
        if (!updatedOrder) {
            throw new Error('Biscuit order not found');
        }
        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getTotalCaloriesInOrder = async (orderId) => {
    try {
        const order = await BiscuitOrder.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        let totalCalories = 0;
        for (const item of order.orderItems) {
            const calories = await getTotalCalories(item.biscuit);
            totalCalories += calories * item.quantity;
        }

        return totalCalories;
    } catch (error) {
        throw new Error(error.message);
    }
};

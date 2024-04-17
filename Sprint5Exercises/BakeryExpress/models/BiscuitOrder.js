const mongoose = require('mongoose');

const biscuitOrderSchema = new mongoose.Schema({
    orderItems: [{ biscuit: { type: mongoose.Schema.Types.ObjectId, ref: 'Biscuit' }, quantity: Number }],
    totalCost: { type: Number, default: 0 }, // Default totalCost to 0
    isPaid: { type: Boolean, default: false }
});

// Define a pre-save hook to calculate the total cost based on order items
biscuitOrderSchema.pre('save', async function (next) {
    try {
        let totalCost = 0;

        // Calculate total cost by iterating through order items array
        for (const item of this.orderItems) {
            const biscuit = await mongoose.model('Biscuit').findById(item.biscuit);
            if (biscuit) {
                totalCost += biscuit.cost * item.quantity; // Calculate cost based on quantity
            }
        }

        // Set the calculated totalCost to the biscuit order before saving
        this.totalCost = totalCost;
        next();
    } catch (error) {
        next(error);
    }
});

const BiscuitOrder = mongoose.model('BiscuitOrder', biscuitOrderSchema);

module.exports = BiscuitOrder;

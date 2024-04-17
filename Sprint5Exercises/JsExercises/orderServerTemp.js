const axios = require("axios");
const { json } = require("express");
const url = "http://localhost:3000/api"

const jsonOrder = {
    "orderItems": [
        { "biscuit": "6617ccf9e1def80eda1caf42", "quantity": 4 }, // Circular Biscuit
        { "biscuit": "6617cdb63eabafff389d6731", "quantity": 5 }, // Triangular Biscuit
        { "biscuit": "6617ce313eabafff389d6739", "quantity": 5 }  // Rectangular Biscuit
    ]
}

const useIngredients = (recipe, inventoryMap) => {
    // Check each ingredient in the recipe to see if it can be fulfilled by the inventory map
    for (const ingredient of recipe.ingredients) {
        const inventoryItem = inventoryMap[ingredient.ingredient];
        // If the ingredient is not found in inventory map, or not enough quantity, return false
        if (!inventoryItem || inventoryItem.quantity < ingredient.quantity) {
            return false;
        }
    }
    // All ingredients are available in sufficient quantity; reduce the quantities in inventory map
    for (const ingredient of recipe.ingredients) {
        inventoryMap[ingredient.ingredient].quantity -= ingredient.quantity;
    }
    return true;
};

const createInventoryMap = (inventory) => {
    const inventoryMap = inventory.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
    }, {});
    return inventoryMap;
}

const convertMapToArray = (inventoryMap) => {
    const inventoryArray = [];
    for (const key in inventoryMap) {
        if (inventoryMap.hasOwnProperty(key)) {
            inventoryArray.push(inventoryMap[key]);
        }
    }
    return inventoryArray;
};

const createBiscuitOrder = async (jsonOrder) => {
    try{
        const response = await axios.post(`${url}/biscuit-orders`, jsonOrder);
        return (response.data);

    }
    catch(error){
        console.error(error);
        return null;
    }
}

const getCurrentInventory = async () =>{
    try{
        const response = await axios.get(`${url}/ingredients`);
        return (response.data);
    }
    catch(err){
        console.log(err);
        return null;
    }
}

const getBiscuitRecipe = async(biscuitId) =>{
    try{
        const response = await axios.get(`${url}/recipes/${biscuitId}`);
        return response.data;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

const updateInventory = async(inventoryMap) => {
    try{
        const response = await axios.put(`${url}/ingredients`, inventoryMap);
        return response.data;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

const updateBiscuitOrder = async(biscuitOrder, biscuitOrderId) => {
    try{
        const response = await axios.put(`${url}/biscuit-orders/${biscuitOrderId}`, biscuitOrder);
        return response.data;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

class Solution{

    constructor(permutation, solutionInventoryMap, orderToServe){
        this.permutation = permutation;
        this.solutionInventoryMap = solutionInventoryMap;
        this.orderToServe = orderToServe;
        this.completedOrders = [];
        this.uncompletedOrders = [];
    }

    toString() {
        const formatOrderItems = (orderItems) => {
            return orderItems.map(item => `{ "biscuit": "${item.biscuit}", "quantity": ${item.quantity} }`).join(', ');
        };

        const formatInventoryItems = (inventoryItems) => {
            return inventoryItems.map(item => `{"_id": "${item._id}", "name": "${item.name}", "quantity": ${item.quantity}}`).join(', ');
        };

        // Permutation: [${formatOrderItems(this.permutation)}]
        // Order to Serve: ${JSON.stringify(this.orderToServe)}
        // Solution Inventory Map: [${formatInventoryItems(this.solutionInventory)}]
        return `
        Completed Orders: ${JSON.stringify(this.completedOrders)}
        Uncompleted Orders: ${JSON.stringify(this.uncompletedOrders)}
        ------------------------------------------------------------------------------
        `;
    }

    checkOrder = async () => {
        const inventoryMap = this.solutionInventoryMap;
        const orders = this.permutation;
        // let inventoryMap = createInventoryMap(inventory);

        for (let order of orders) {
            let orderFulfilled = true;
            let biscuitId = order.biscuit;
            let orderQuantity = order.quantity;
            let recipe = await getBiscuitRecipe(biscuitId);
            if (!recipe) {
                throw new Error(`Recipe does not exist.`);
            }
    
            let remainingOrderQuantity = orderQuantity;
            // Try to use ingredients and create as many biscuits as possible for this order
            while (remainingOrderQuantity > 0 && useIngredients(recipe, inventoryMap)) {
                remainingOrderQuantity--;
            }
    
            if (remainingOrderQuantity > 0) {
                orderFulfilled = false;
                this.uncompletedOrders = [... this.uncompletedOrders, { biscuitId: biscuitId, quantity: remainingOrderQuantity }];
                this.completedOrders = [...this.completedOrders, {biscuitId: biscuitId, quantity : orderQuantity - remainingOrderQuantity}];
            }
    
            if (orderFulfilled) {
                this.completedOrders = [...this.completedOrders, {biscuitId: biscuitId, quantity : orderQuantity - remainingOrderQuantity}];
            }
        }

        this.solutionInventoryMap = inventoryMap;
    }
}

const generatePermutations = (orderItems) => {
    const result = [];

    const permute = (arr, current = []) => {
        if (arr.length === 0) {
            result.push(current.slice());
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
            current.push(arr[i]);
            permute(remaining, current);
            current.pop();
        }
    };

    permute(orderItems);
    return result;
};

const validateOrder = (order) => {
    if (!order || !order.orderItems || !Array.isArray(order.orderItems) || order.orderItems.length === 0) {
        return false;
    }
    for (const item of order.orderItems) {
        if (!item || typeof item !== "object" || !item.biscuit || !item.quantity || typeof item.quantity !== "number") {
            return false;
        }
        if (item.quantity < 0) {
            return false;
        }
    }
    return true;
};


//order to Serve -> Object of biscuit order -> jsonOrder for testing 

const processOrder = async (jsonOrder) => {
    try {
        if(validateOrder(jsonOrder)){
            const currentBiscuitOrder = await createBiscuitOrder(jsonOrder);
            const allPermutations = generatePermutations(currentBiscuitOrder.orderItems);
            const currentInventory = await getCurrentInventory();
            const currentInventoryMap = createInventoryMap(currentInventory);
            const allSolutions = [];
            let orderCompleteConfig;
            let orderCompleteFlag = false;
            for (let permutedOrders of allPermutations) {
                const initialInventoryMap = JSON.parse(JSON.stringify(currentInventoryMap));
                temp = new Solution(permutedOrders, initialInventoryMap, jsonOrder);
                await temp.checkOrder();
                allSolutions.push(temp);
                if(temp.uncompletedOrders.length == 0) {
                    orderCompleteConfig = temp;
                    orderCompleteFlag = true;
                    break;
                }
            }
            
            if(!orderCompleteFlag){
                return [orderCompleteFlag, allSolutions];
            }
            else{
                return [orderCompleteFlag, [orderCompleteConfig]];

            }
        }
        else{
            throw new Error("Invalid Input or format of the order passed");
        }
    } catch (error) {
        console.error("Error:", error.message);
        return [false, [null]];
    }
}

const testMe = async () => {
    const [completeOrder, solution] = await processOrder(jsonOrder);
    if(completeOrder){
        console.log(solution[0].toString());
    }
    else{
        console.log("Order partially completed");
    }    
};
testMe();

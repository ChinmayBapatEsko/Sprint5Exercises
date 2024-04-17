class Recipe {
    constructor(name, flour, butter, soda, sugar) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error("Recipe name must be a non-empty string.");
        }
        if (!Number.isInteger(flour) || !Number.isInteger(butter) || !Number.isInteger(soda) || !Number.isInteger(sugar)) {
            throw new Error("Ingredient amounts must be integers.");
        }
        if (flour < 0 || butter < 0 || soda < 0 || sugar < 0) {
            throw new Error("Ingredient amounts cannot be negative.");
        }

        this.name = name.trim();
        this.flour = flour;
        this.butter = butter;
        this.soda = soda;
        this.sugar = sugar;
    }
}

class Inventory {
    constructor(flour, butter, soda, sugar) {
        if (!Number.isInteger(flour) || !Number.isInteger(butter) || !Number.isInteger(soda) || !Number.isInteger(sugar)) {
            throw new Error("Ingredient amounts must be integers.");
        }
        if (flour < 0 || butter < 0 || soda < 0 || sugar < 0) {
            throw new Error("Ingredient amounts cannot be negative.");
        }

        this.flour = flour;
        this.butter = butter;
        this.soda = soda;
        this.sugar = sugar;
    }

    useIngredients(recipe) {
        if (this.flour >= recipe.flour && this.butter >= recipe.butter &&
            this.soda >= recipe.soda && this.sugar >= recipe.sugar) {
            this.flour -= recipe.flour;
            this.butter -= recipe.butter;
            this.soda -= recipe.soda;
            this.sugar -= recipe.sugar;
            return true;
        }
        return false;
    }

    toString() {
        return `Remaining Ingredients [Flour: ${this.flour}, Butter: ${this.butter}, Soda: ${this.soda}, Sugar: ${this.sugar}]`;
    }
}

const biscuitRecipes = [
    new Recipe("Circular", 1, 2, 0, 3),
    new Recipe("Triangular", 2, 1, 1, 2),
    new Recipe("Rectangular", 3, 1, 2, 1)
];

class Solution{
    constructor(permutation, currentInventory){
        this.permutation = permutation;
        this.currentInventory = currentInventory;
        this.completedOrders = [];
        this.uncompletedOrders = [];
    }

    toString(){
        const formatOrders = (orders) => {
            return orders.map(order => `${order.biscuitType}: ${order.quantity}`).join(', ');
        };
        const result = "Completed Orders: " + `${formatOrders(this.completedOrders)}` +"\n"
        + "Uncompleted Orders: " + `${formatOrders(this.uncompletedOrders)}` + "\n"
        + `${this.currentInventory.toString()}` + "\n";

        return result;
    }

    checkOrder = () => {
        const inventory = this.currentInventory;
        const orders = this.permutation;

        for (let order of orders) {
            let orderFulfilled = true;
            let recipe = biscuitRecipes.find(recipe => recipe.name === order.name);
            if (!recipe) {
                throw new Error(`Recipe '${order.name}' does not exist.`);
            }
    
            let remainingQuantity = order.quantity;
    
            // Try to use ingredients and create as many biscuits as possible for this order
            while (remainingQuantity > 0 && inventory.useIngredients(recipe)) {
                remainingQuantity--;
            }
    
            if (remainingQuantity > 0) {
                orderFulfilled = false;
                this.uncompletedOrders = [... this.uncompletedOrders, { biscuitType: recipe.name, quantity: remainingQuantity }];
                this.completedOrders = [...this.completedOrders, {biscuitType: order.name, quantity : order.quantity - remainingQuantity}];
            }
    
            if (orderFulfilled) {
                this.completedOrders = [...this.completedOrders, {biscuitType: order.name, quantity : order.quantity - remainingQuantity}];
            }
        }

        this.currentInventory = inventory;
    }
}

const generatePermutations = (arr) => {
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

    permute(arr);
    return result;
};

const main = () => {
    try {
        const orders = [
            { name: "Circular", quantity: 4 },
            { name: "Rectangular", quantity: 5 },
            { name: "Triangular", quantity: 3 }
        ];
        
        const allPermutations = generatePermutations(orders);
        const allSolutions = [];
        let orderCompleteConfig;
        let orderCompleteFlag = false;
        for (let permutedOrders of allPermutations) {
            const initialInventory = new Inventory(30, 16, 17, 28);
            temp = new Solution(permutedOrders, initialInventory);
            temp.checkOrder();
            allSolutions.push(temp);
            if(temp.uncompletedOrders.length == 0) {
                orderCompleteConfig = temp;
                orderCompleteFlag = true;
                console.log("-------ORDER COMPLETED-------");
                console.log(temp.toString());
                break;
            }
        }
        
        if(!orderCompleteFlag){
            for(let solution of allSolutions){
                console.log(solution.toString());
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();

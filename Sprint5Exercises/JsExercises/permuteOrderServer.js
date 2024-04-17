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

const checkOrder = (inventory, orders) => {
    let possibleOrder = [];
    let remainingInventory = new Inventory(inventory.flour, inventory.butter, inventory.soda, inventory.sugar);

    for (let order of orders) {
        let orderFulfilled = true; // Reset orderFulfilled for each order check
        let recipe = biscuitRecipes.find(recipe => recipe.name === order.name);
        if (!recipe) {
            throw new Error(`Recipe '${order.name}' does not exist.`);
        }

        let remainingQuantity = order.quantity; // Initialize remainingQuantity with the order quantity

        // Try to use ingredients and create as many biscuits as possible for this order
        while (remainingQuantity > 0 && inventory.useIngredients(recipe)) {
            remainingQuantity--;
        }

        if (remainingQuantity > 0) {
            orderFulfilled = false;
            possibleOrder.push({ name: recipe.name, quantity: remainingQuantity });
            console.log(`Order: ${order.name} delivered ${order.quantity - remainingQuantity} biscuits!`);
            console.log(inventory.toString());
        }

        if (orderFulfilled) {
            console.log(`Order: ${order.name} delivered ${order.quantity} biscuits!`);
            console.log(inventory.toString());
        }
    }

    if (possibleOrder.length > 0) {
        console.log("Order cannot be fully fulfilled. Order Items that cannot be served: ");
        for (let item of possibleOrder) {
            console.log(`${item.quantity} ${item.name}`);
        }
        console.log(remainingInventory.toString());
    }
}

// Function to generate all permutations of orders array
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
        const initialInventory = new Inventory(10, 16, 17, 9); // Example initial inventory
        const orders = [
            { name: "Circular", quantity: 2 },
            { name: "Triangular", quantity: 3 },
            { name: "Rectangular", quantity: 1 }
            // { name: "Heart-shaped", quantity: 4 } // Non-existing type to test possible order
        ];

        const allPermutations = generatePermutations(orders);
        for (let permutedOrders of allPermutations) {
            console.log("Permutation:", permutedOrders);
            // checkOrder(initialInventory, permutedOrders);

            console.log("\n\n");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

main();

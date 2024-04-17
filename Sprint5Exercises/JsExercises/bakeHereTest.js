
const getStateKey = (inventoryState) =>{
    const values = Object.values(inventoryState);
    const resultString = values.join('-');
    return resultString;
}

const checkSufficientIngredients = (biscuitRequirement, currentInventoryState) => {
    for (const ingredientId in biscuitRequirement) {
        const requiredQuantity = biscuitRequirement[ingredientId];

        if (!currentInventoryState[ingredientId] || currentInventoryState[ingredientId] < requiredQuantity) {
            return false;
        }
    }

    return true;
};

const useIngredients = (biscuitRequirement, currentInventoryState) =>{
    for(ingredientId in biscuitRequirement){
        const requiredQuantity = biscuitRequirement[ingredientId];
        currentInventoryState[ingredientId]-=requiredQuantity;
    }
    return currentInventoryState;
}

const memo = {};

//biscuitRecipes -> eligibleBiscuits
//remaining .. -> inventoryState
//current -> currentSolution
//solutions -> allSolutions

const findCombinations = (inventoryState, currentSolution, allSolutions) => {
    const stateKey = getStateKey(inventoryState);

    if (memo[stateKey]) {
        return;
    }
    memo[stateKey] = true;

    let isSolutionAdded = false;

    eligibleBiscuits.forEach(biscuit => {
        if (checkSufficientIngredients(biscuit.ingredients, inventoryState)) {
            const updatedInventoryState = useIngredients(biscuit.ingredients, inventoryState);
            let newSolution = new Solution(updatedInventoryState);
            newSolution.possibleBiscuits = [...currentSolution.possibleBiscuits, biscuit];
            newSolution.possibleBiscuits.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            findCombinations(newSolution.solutionInventory, newSolution, allSolutions);
            isSolutionAdded = true;
        }
    });

    if (!isSolutionAdded && currentSolution.possibleBiscuits.length > 0) {
        allSolutions.push(currentSolution);
    }
};


class Solution {
    constructor() {
        this.possibleBiscuits = [];
        this.solutionInventory = inventory;
    }

    addBiscuit(biscuit) {
        this.possibleBiscuits.push(biscuit);
    }

    getUniqueCounts() {
        const uniqueCounts = {};
        this.possibleBiscuits.forEach(biscuit => {
            const biscuitName = biscuit.name;
            if (!uniqueCounts.hasOwnProperty(biscuitName)) {
                uniqueCounts[biscuitName] = 0;
            }
            uniqueCounts[biscuitName]++;
        });
        return uniqueCounts;
    }
}

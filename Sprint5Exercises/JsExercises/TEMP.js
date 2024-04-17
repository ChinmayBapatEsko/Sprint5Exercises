class Recipe {
    constructor(name, flour, butter, soda, sugar) {
        if (flour < 0 || butter < 0 || soda < 0 || sugar < 0) {
            throw new Error("Ingredient amounts cannot be negative.");
        }
        this.name = name;
        this.flour = flour;
        this.butter = butter;
        this.soda = soda;
        this.sugar = sugar;
    }
}

class Solution {
    constructor(flour, butter, soda, sugar) {
        this.biscuits = [];
        this.remainingFlour = flour;
        this.remainingButter = butter;
        this.remainingSoda = soda;
        this.remainingSugar = sugar;
    }

    addBiscuit(biscuitName) {
        this.biscuits.push(biscuitName);
    }

    toString() {
        const temp = JSON.stringify(this.getUniqueCounts(this.biscuits));
        return temp + ` Remaining Ingredients [Flour: ${this.remainingFlour}, Butter: ${this.remainingButter}, Soda: ${this.remainingSoda}, Sugar: ${this.remainingSugar}]` + "\n";
    }

    getUniqueCounts(biscuits){
        const uniqueElements = {};
        biscuits.forEach((element) => {
        if (!uniqueElements.hasOwnProperty(element)) {
            uniqueElements[element] = 0;
        }
        uniqueElements[element]++;
        });
        return uniqueElements;
    }
}

const biscuitRecipes = [
    new Recipe("Circular", 1, 2, 0, 3),
    new Recipe("Triangular", 2, 1, 1, 2),
    new Recipe("Rectangular", 3, 1, 2, 1)
];

const findCombinations = (flour, butter, soda, sugar, current, solutions) => {
    let isSolutionAdded = false;

    biscuitRecipes.forEach(recipe => {
        if (flour >= recipe.flour && butter >= recipe.butter &&
            soda >= recipe.soda && sugar >= recipe.sugar) {
            // Create a new solution based on this recipe
            let newSolution = new Solution(flour - recipe.flour,
                                           butter - recipe.butter,
                                           soda - recipe.soda,
                                           sugar - recipe.sugar);
            newSolution.biscuits = [...current.biscuits, recipe.name].sort(); // Ensure biscuits are sorted for consistency

            // Continue exploring with the remaining ingredients
            findCombinations(newSolution.remainingFlour, newSolution.remainingButter,
                             newSolution.remainingSoda, newSolution.remainingSugar,
                             newSolution, solutions);
            isSolutionAdded = true;
        }
    });

    // If no new biscuit could be added but the current solution has biscuits, add it to solutions
    if (!isSolutionAdded && current.biscuits.length > 0) {
        // Check if the solution is already in the solutions array to avoid duplicates
        let currentSolString = JSON.stringify(current.biscuits);
        if (!solutions.some(sol => JSON.stringify(sol.biscuits) === currentSolString)) {
            solutions.push(current);
        }
    }
};

const main = () => {
    try {
        // console.time("TIME");
        let solutions = [];
        let visited = new Set();
        findCombinations(30, 20, 14, 24, new Solution(30, 20, 14, 24), solutions);
        for (let sol of solutions) {
            console.log(sol.toString());
        }
        console.log(solutions.length);
        // console.timeEnd("TIME");
    } catch (e) {
        console.error("Error: " + e.message);
    }
}

main();

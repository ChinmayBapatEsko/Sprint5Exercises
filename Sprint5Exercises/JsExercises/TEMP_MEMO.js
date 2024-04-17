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

const memo = {};

const findCombinations = (flour, butter, soda, sugar, current, solutions) => {
    const stateKey = `${flour}-${butter}-${soda}-${sugar}`;

    // Check if this state has been visited before
    if (memo[stateKey]) {
        return;
    }
    memo[stateKey] = true;

    let isSolutionAdded = false;

    biscuitRecipes.forEach(recipe => {
        if (flour >= recipe.flour && butter >= recipe.butter &&
            soda >= recipe.soda && sugar >= recipe.sugar) {
            let newSolution = new Solution(flour - recipe.flour,
                                           butter - recipe.butter,
                                           soda - recipe.soda,
                                           sugar - recipe.sugar);
            newSolution.biscuits = [...current.biscuits, recipe.name].sort();

            findCombinations(newSolution.remainingFlour, newSolution.remainingButter,
                             newSolution.remainingSoda, newSolution.remainingSugar,
                             newSolution, solutions);
            isSolutionAdded = true;
        }
    });

    if (!isSolutionAdded && current.biscuits.length > 0) {
        solutions.push(current);
    }
};


const main = () => {
    try {
        // console.time("TIME");
        let solutions = [];
        findCombinations(30, 45, 54, 23, new Solution(30, 45, 54, 23), solutions);
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

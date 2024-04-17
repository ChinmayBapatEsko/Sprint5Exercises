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
    if (flour < 0 || butter < 0 || soda < 0 || sugar < 0) {
        throw new Error("Ingredient amounts cannot be negative.");
    }
    let added = false;
    for (let recipe of biscuitRecipes) {
        if (flour >= recipe.flour && butter >= recipe.butter &&
            soda >= recipe.soda && sugar >= recipe.sugar) {
            let newSolution = new Solution(flour - recipe.flour,
                                           butter - recipe.butter,
                                           soda - recipe.soda,
                                           sugar - recipe.sugar);
            newSolution.biscuits = [...current.biscuits];
            newSolution.addBiscuit(recipe.name);

            findCombinations(newSolution.remainingFlour, newSolution.remainingButter,
                             newSolution.remainingSoda, newSolution.remainingSugar,
                             newSolution, solutions);
            added = true;
        }
    }
    if (!added && current.biscuits.length > 0) {
        solutions.push(current);
    }
}

const main = () => {
    try {
        let solutions = [];
        findCombinations(10, 16, 17, 9, new Solution(10, 16, 17, 9), solutions);
        for (let sol of solutions) {
            console.log(sol.toString());
        }
        console.log(solutions.length);
    } catch (e) {
        console.error("Error: " + e.message);
    }
}

main();

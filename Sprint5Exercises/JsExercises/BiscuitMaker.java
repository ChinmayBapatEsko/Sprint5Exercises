import java.util.ArrayList;
import java.util.List;

public class BiscuitMaker {
    static class Recipe {
        int flour, butter, soda, sugar;

        public Recipe(int flour, int butter, int soda, int sugar) {
            if (flour < 0 || butter < 0 || soda < 0 || sugar < 0) {
                throw new IllegalArgumentException("Ingredient amounts cannot be negative.");
            }
            this.flour = flour;
            this.butter = butter;
            this.soda = soda;
            this.sugar = sugar;
        }
    }

    static class Biscuit {
        String name;
        Recipe recipe;

        public Biscuit(String name, Recipe recipe) {
            this.name = name;
            this.recipe = recipe;
        }
    }

    static class Solution {
        List<String> biscuits = new ArrayList<>();
        int remainingFlour, remainingButter, remainingSoda, remainingSugar;

        public Solution(int flour, int butter, int soda, int sugar) {
            this.remainingFlour = flour;
            this.remainingButter = butter;
            this.remainingSoda = soda;
            this.remainingSugar = sugar;
        }

        public void addBiscuit(String biscuit) {
            biscuits.add(biscuit);
        }

        @Override
        public String toString() {
            return biscuits.toString() + " Remaining Ingredients [Flour: " + remainingFlour + ", Butter: " + remainingButter + ", Soda: " + remainingSoda + ", Sugar: " + remainingSugar + "]";
        }
    }

    static Recipe[] recipes = {
            new Recipe(1, 2, 0, 3), // Circular
            new Recipe(2, 1, 1, 2), // Triangular
            new Recipe(3, 1, 2, 1)  // Rectangular
    };
    static String[] biscuitNames = {"Circular", "Triangular", "Rectangular"};

    public static void findCombinations(int flour, int butter, int soda, int sugar, Solution current, List<Solution> solutions) {
        if (flour < 0 || butter < 0 || soda < 0 || sugar < 0) {
            throw new IllegalArgumentException("Ingredient amounts cannot be negative.");
        }
        boolean added = false;
        for (int i = 0; i < recipes.length; i++) {
            if (flour >= recipes[i].flour && butter >= recipes[i].butter &&
                soda >= recipes[i].soda && sugar >= recipes[i].sugar) {
                Solution newSolution = new Solution(flour - recipes[i].flour,
                                                    butter - recipes[i].butter,
                                                    soda - recipes[i].soda,
                                                    sugar - recipes[i].sugar);
                newSolution.biscuits.addAll(current.biscuits);
                newSolution.addBiscuit(biscuitNames[i]);

                findCombinations(newSolution.remainingFlour, newSolution.remainingButter,
                                 newSolution.remainingSoda, newSolution.remainingSugar,
                                 newSolution, solutions);
                added = true;
            }
        }
        if (!added && !current.biscuits.isEmpty()) { // Ensure we only add solutions that actually produced biscuits
            solutions.add(current);
        }
    }

    public static void main(String[] args) {
        try {
            List<Solution> solutions = new ArrayList<>();
            findCombinations(10, 16, 17, 9, new Solution(10, 16, 17, 9), solutions); // Example ingredients
            for (Solution sol : solutions) {
                System.out.println(sol);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An unexpected error occurred: " + e.getMessage());
        }
    }
}

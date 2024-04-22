
/*

    This react component is responsible to handle the feature of the bakery of taking ingredients and baking them and serving the order. 
    The various ingredients will be displayed as cards to the user, the user can now add as many quantities he wants. Once clicked submit ingredients, the user will 
    be popped up with a modal that will show all the biscuits combinations that are possible to be made from this inventory. 
    Once the user clicks pay now, order is served and the inventry is updated. The extra user ingredients will be added to the bakery inventory. 
    And while total cost is generated, bakery will only include service cost of baking (60% of total cost).

    User will have a toggle option that will decide if the bakery inventory will be used or the user inventory will be used.
    Incase of the bakery inventory, highest cost order will be shown as the choice to the user to select.
      
*/

import React from "react";
import '../css/BakeIngredients.css';
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

import BakingSoda from '../assets/BakingSoda.png';
import Butter from '../assets/Butter.png';
import DryFruits from '../assets/DryFruits.png';
import Flour from '../assets/Flour.png';
import Sugar from '../assets/Sugar.png';
import attentionIcon from '../assets/attention.png'
import InventoryModal from './InventoryModal';
import IngredientOrderModal from "./IngredientOrderModal";

const BakeIngredients = () => {

    ///// CONSTANTS /////

    const url = "http://localhost:3000/api";

    ///// USESTATE HOOKS /////

    const [inventory, setInventory] = useState([]); // json object received from the database about full inventory state.
    const [userChosenIngredients, setUserChosenIngredients] = useState([]); //array of elements => [ingredientId: quantity, ....]
    const [biscuitIngredientMap, setBiscuitIngredientMap] = useState({}) // object that stores " biscuitId : [ingredientIds, ..] " map.
    const [eligibleBiscuits, setEligibleBiscuits] = useState([]); //contains objects of BiscuitDetails class. All those biscuits that are eligible to be considered for baking.
    const [showInventory, setShowInventory] = useState(false); // state to store the flag to show the inventory modal or not.
    const [orderSolutions, setOrderSolutions] = useState([]); //state to store all the possible solutions.
    const [userInventoryToggle, setUserInventoryToggle] = useState(true) //state to store the flag if the user inventory is being used or not.
    const [showOrder, setShowOrder] = useState(false); // state to store the flag as to show the ingredient order modal or not.

    ///// USEEFFECT HOOKS /////

    //fetch all ingredients on load of the component.
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(`${url}/ingredients`);
                setInventory(response.data);
            }
            catch(err){
                console.log(err);
            }
        };
    
        fetchData();
    }, []);


    //effect to create the eligible biscuits once the biscuit ingredient map is set. This map stores, which biscuit uses which ingredient.
    useEffect(() => {
        const fetchData = async () => {
            try {
                await createEligibleBiscuits();
            } catch (err) {
                console.log(err);
            }
        };
    
        fetchData();
    }, [biscuitIngredientMap]);


    //Effect to search for all combinations once eligible biscuits are set.
    useEffect(() => {
        const checkAllCombinations = () => {
            try {
                getAllCombinations();
            } catch (err) {
                console.log(err);
            }
        };
    
        checkAllCombinations();
    }, [eligibleBiscuits]);


    // Effect to reset values as required once toggles are made between inventories. 
    useEffect(() => {
        const setInventoryWhenToggled = () => {
            try {
                if(!userInventoryToggle){
                    const bakeryInventoryState = convertInventoryToSolutionFormat(inventory)
                    setUserChosenIngredients(bakeryInventoryState);
                }
            } catch (err) {
                console.log(err);
            }
        };
        setInventoryWhenToggled();
    },[userInventoryToggle]);

    ///// CLASSES /////

    class BiscuitDetails{
        constructor (biscuitId){
            this.biscuitId = biscuitId;
            this.name;
            this.totalCalories;
            this.ingredients;
            this.shape;
            this.bakingTime;
            this.cost;
            this.bakingTemperature;
        }
    
        //Function to fetch the details of the biscuit and its recipe and set in the class.
        fetchAndAssignBiscuitDetails = async(biscuitId) =>{
            const biscuit = await axios.get(`${url}/biscuit/${biscuitId}`);
            this.name = biscuit.data.name;
            this.shape = biscuit.data.shape;
            this.bakingTime = biscuit.data.bakingTime;
            this.bakingTemperature = biscuit.data.bakingTemperature;
            this.cost = biscuit.data.cost;
    
            const recipe = await axios.get(`${url}/recipes/${biscuitId}`);
            this.totalCalories = recipe.data.totalCalories;
            this.ingredients = this.simplifyIngredients(recipe.data.ingredients);
        }
    
        // Function to destructure the ingredients object into a simpler format for easier data lookup.
        simplifyIngredients(ingredients) {
            const result = {};
            ingredients.forEach(item => {
                result[item.ingredient] = item.quantity;
            });
            return result;
        }
    }
    
    class Solution {
        constructor(inventoryInSolutionFormat) {
            this.possibleBiscuits = [];
            this.solutionInventory = inventoryInSolutionFormat;
            this.uniqueBiscuitDescription;
            this.solutionCost;
            this.solutionCalories;
            this.solutionBakingTime;
        }
    
        addBiscuit(biscuit) {
            this.possibleBiscuits.push(biscuit);
        }
    
        // Function to get the biscuit: count as to the entire possible biscuits.
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
    
        setTotalSolutionCost(){
            let totalCost = 0;
            this.possibleBiscuits.forEach(biscuit => {
                totalCost+=biscuit.cost;
            })
            this.solutionCost = totalCost;
        }
    
        setTotalSolutionCalories(){
            let totalCalories = 0;
            this.possibleBiscuits.forEach(biscuit => {
                totalCalories+=biscuit.totalCalories;
            })
            this.solutionCalories = Math.floor(totalCalories);
        }
    
        setTotalSolutionBakingTime(){
            let totalBakingTime = 0;
            this.possibleBiscuits.forEach(biscuit => {
                totalBakingTime+=biscuit.bakingTime;
            })
            this.solutionBakingTime = totalBakingTime;
        }
    
        sortSolutionOnCost(){
            let totalCost = 0;
            this.possibleBiscuits.forEach(biscuit => {
                totalCost+=biscuit.cost;
            })
            this.solutionCost = totalCost;
        }
    }

    ///// STATE SETTER HELPER FUNCTIONS /////

    // Filter all the possible biscuits that can be made using the provided ingredients.
    const filterBiscuitsByIngredients = () => {
        const filteredBiscuits = Object.keys(biscuitIngredientMap).filter(biscuitId => {
            const ingredients = biscuitIngredientMap[biscuitId];
            return ingredients.every(ingredientId => userChosenIngredients.hasOwnProperty(ingredientId));
        });
        return filteredBiscuits;
    };

    //Create all the biscuit objects of the biscuits that are eligible to be made.
    const createEligibleBiscuits = async () => {
        try {
            const eligibleBiscuitIds = filterBiscuitsByIngredients();
            const tempBiscuits = [];
            for (const id of eligibleBiscuitIds){
                const temp = new BiscuitDetails(id);
                await temp.fetchAndAssignBiscuitDetails(id);
                tempBiscuits.push(temp);
            }
            setEligibleBiscuits([...eligibleBiscuits, ...tempBiscuits]);
        } catch (error) {
            console.log(error);
            return;
        }
    }

    // Construct the biscuit ingredient map from the database.
    const createBiscuitIngredientMap = async() =>{
        try{
            const response = await axios.get(`${url}/biscuits/get-ingredients`);
            setBiscuitIngredientMap(response.data);
        }
        catch(err){
            console.log(err);
        }
    }

    ///// SOLUTION CLASS HELPER FUNCTIONS /////

    const convertInventoryToSolutionFormat = (inventory) => {
        const convertedInventory = {};
        inventory.forEach(item => {
            convertedInventory[item._id] = item.quantity;
        });
        return convertedInventory;
    };

    const sortBySolutionCost = (solutionsArray) => {
        solutionsArray.sort((a, b) => {
            return b.solutionCost - a.solutionCost;
        });
    }

    const sortBySolutionBakingTime = (solutionsArray) => {
        solutionsArray.sort((a, b) => {
            return b.solutionBakingTime - a.solutionBakingTime;
        });
    }

    ///// FIND ALL COMBINATIONS AND ITS HELPER FUNCTIONS /////
    
    //generating all possible combinations and exploring each combination till the very end (maximize use of ingredients.)
    // Using memoization to make the process time-wise efficient
    const memo = {};
    const findCombinations = (inventoryState, currentSolution, allSolutions) => {
        const stateKey = getStateKey(inventoryState);
        if (memo[stateKey]) {
            return;
        }
        memo[stateKey] = true;
        let isSolutionAdded = false;
        eligibleBiscuits.forEach(biscuit => {
            if (checkSufficientIngredients(biscuit.ingredients, inventoryState)) {
                const updatedInventoryState = {...inventoryState};
                useIngredients(biscuit.ingredients, updatedInventoryState);
                let newSolution = new Solution(updatedInventoryState);
                newSolution.possibleBiscuits = [...currentSolution.possibleBiscuits, biscuit];
                newSolution.possibleBiscuits.sort((a, b) => a.name.localeCompare(b.name));

                findCombinations(newSolution.solutionInventory, newSolution, allSolutions);
                isSolutionAdded = true;
            }
        });

        if (!isSolutionAdded && currentSolution.possibleBiscuits.length > 0) {
            currentSolution.uniqueBiscuitDescription = currentSolution.getUniqueCounts();
            currentSolution.setTotalSolutionBakingTime();
            currentSolution.setTotalSolutionCalories();
            currentSolution.setTotalSolutionCost();
            allSolutions.push(currentSolution);
        }
    };

   // After finding all the combinations, get them and process them according to the inventory toggle. 
    const getAllCombinations = () =>{
        const userInventoryState = userChosenIngredients;
        const bakeryInventoryState = convertInventoryToSolutionFormat(inventory)
        // console.log(bakeryInventoryState);
        let solutions = [];
        if(userInventoryToggle){
            findCombinations(userInventoryState, new Solution(bakeryInventoryState), solutions);
        }
        else{
            findCombinations(bakeryInventoryState, new Solution(bakeryInventoryState), solutions);
        }
        if(userInventoryToggle){
            sortBySolutionBakingTime(solutions);
        }
        else{
            sortBySolutionCost(solutions);
        }
        setOrderSolutions([...solutions]);
        // console.log(orderSolutions);
    }

    // Get the memoization state key from the solutionInventory state from the solution class object.
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
        for(const ingredientId in biscuitRequirement){
            const requiredQuantity = biscuitRequirement[ingredientId];
            currentInventoryState[ingredientId]-=requiredQuantity;
        }
        return currentInventoryState;
    }

    ///// HTML RENDER HELPER FUNCTIONS /////

    const getImageForItem = itemName => {
        switch (itemName) {
            case 'Flour':
                return Flour;
            case 'Butter':
                return Butter;
            case 'Baking Soda':
                return BakingSoda
            case 'Sugar':
                return Sugar;
            case 'Dry Fruits':
                return DryFruits;
            default:
                return '';
        }
    };

    ///// EVENT RESPONDERS /////

    const handleQuantityChange = (itemId, quantity) => {
        // If quantity is greater than 0, update the state directly
        if (quantity > 0) {
            setUserChosenIngredients(prevState => ({
                ...prevState,
                [itemId]: quantity
            }));
        } else {
            // If quantity is 0 or empty, remove the item from the state
            setUserChosenIngredients(prevState => {
                const updatedState = { ...prevState };
                delete updatedState[itemId];
                return updatedState;
            });
        }
    };

    const handleReset = () =>{
        setUserChosenIngredients([]);
        setOrderSolutions([]);
        setEligibleBiscuits([]);
    }

    const handleSubmitIngredients = async () => {
        try {
            await createBiscuitIngredientMap();
            setShowOrder(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleToggle = async () => {
        setUserInventoryToggle(prev => {
            if (prev === false) {
                handleReset();
            }
            return !prev;
        });
    };

    ///// INVENTORY MODAL HELPER FUNCTIONS /////

    const handleOpenInventoryModal = () => {
        const userInput = prompt("Please enter your access code:");
        if (userInput === "admin") {
            setShowInventory(true);
        } else {
            alert("Access Denied");
        }
    };

    const createInventoryMap = (inventory) => {
        const inventoryMap = inventory.reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
        }, {});
        return inventoryMap;
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

    const getCurrentInventory = async () =>{
        try{
            const response = await axios.get(`${url}/ingredients`);
            return (response.data);
        }
        catch(err){
            console.log(err);
            return null;
        };
    }

///// RENDERED HTML /////

    return (
        <>
        <Navbar />
        <div className="noticeHolder">
        <div className="notice">
            <img src={attentionIcon} style={{width:25, padding:3}} alt="" />
            Note: Simple Chai, Shahi Butter, Healthy Nuts Biscuits have same primitive configuration of ingredients. 
            Flour: 160gm, Sugar: 80gm, Baking Soda: 10gm.
        </div>
        <div className="constraints">
            <img src={attentionIcon} style={{width:25, padding:3}} alt="" />
            Butter Biscuit uses 40gm Butter, No Dry Fruits. Nuts Biscuit uses 10gm Dry Fruits, no Butter.
        </div>
        </div>
        <div className="container mt-5">
                <div className="row justify-content-center">
                    {inventory.map(item => (
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={item._id}>
                            <div className="card ingredientCard" onDoubleClick={() => handleQuantityChange(item._id, 0)}>
                                <img src={getImageForItem(item.name)} className="card-img-top ingredientImage" alt={item.name} />
                                <div className="card-body ingredientCardBody">
                                    <h5 className="card-title ingredientCardTitle">{item.name}</h5>
                                    <p className="card-text">
                                        Calories: {item.calories} cal / 100gm<br/>
                                        Cost: <span>&#x20B9;</span>{item.cost} / 100gm
                                    </p>
                                    <span className="span">Quantity to Submit to Bakery: </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="form-control"
                                        placeholder="Quantity (gms)"
                                        value={userChosenIngredients[item._id] || ''}
                                        onChange={e => {
                                            const inputValue = e.target.value.trim(); // Remove leading/trailing spaces
                                            const parsedValue = parseInt(inputValue); // Parse the input as an integer
                                            if (!isNaN(parsedValue) && parsedValue >= 0) {
                                                handleQuantityChange(item._id, parsedValue); // Update the state with valid input
                                            } else if (inputValue === '') {
                                                handleQuantityChange(item._id, ''); // Allow empty input
                                            }
                                        }}
                                        disabled={!userInventoryToggle} // Disable input field based on userInventoryToggle
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button-holder mt-4">
                    <button className="btn btn-primary" onClick={handleSubmitIngredients}>Submit Ingredients</button>
                    <button className="btn btn-info " data-toggle="button" aria-pressed="false" onClick={handleToggle}>{userInventoryToggle ? "Using User Inventory" : "Using Bakery Inventory"}</button>
                    <button className="btn btn-warning" onClick={handleOpenInventoryModal}>See Inventory</button>
                    <button className="btn btn-danger" onClick={handleReset}>Reset Values</button>
                </div>
            </div>
            <InventoryModal showModal={showInventory} handleCloseModal={() => setShowInventory(false)} getInventory={getCurrentInventory} updateInventory={updateInventory} createMap={createInventoryMap}/>
            <IngredientOrderModal showModal={showOrder} handleCloseModal={() => setShowOrder(false)} orderSolutions={orderSolutions} userInventoryToggle={userInventoryToggle} inventory={inventory} updateInventory={updateInventory} createMap={createInventoryMap} handleReset={handleReset}/>
        </>
    );
}

export default BakeIngredients;

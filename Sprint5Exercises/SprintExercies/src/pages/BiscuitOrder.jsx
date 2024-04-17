
/*

    This react page handles the user orders. Displays the various items that the bakery provides and then lets user choose the biscuits of its choice.
    After the user chooses the order, user must click on order items. After that, all the order properties will be prepared and a modal will pop up
    that will display the details of the order like the calories and cost of the order. Details per biscuit are mentioned on the card itself.
    The modal after pop up will show a QR Code that can be used to further inculcate the payment functionality too. 
    After the user pays, other/same user is free to place another order.


    Unimplemented feature on Frontend: When the user makes a big order and just because of insufficient ingredients, one biscuit could not be made, 
    in this case Bakery should recommend the user some other options that the user can take that the bakery can prepare with whatever ingredients it has.
    All combinations of the possiblities to be presented to the user and user would choose the preference, or exit. If preference chosen, go with that order and remove the
    inventory only as per the newly picked order.

 */


import Navbar from "./Navbar";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import circularBiscuit from '../assets/circularBiscuit.png'
import triangularBiscuit from '../assets/triangularBiscuit.png'
import rectangularBiscuit from '../assets/rectangularBiscuit.png'
import './BiscuitOrder.css';
import OrderModal from './OrderModal'
import InventoryModal from "./InventoryModal";


const BiscuitOrder =() =>{
    
    ///// CONSTANTS /////

    const url = "http://localhost:3000/api";
    
    ///// USESTATE HOOKS /////

    const [showInventory, setShowInventory] = useState(false); //state to store the flag as to when to show the Inventory Modal.
    const [orderCost, setOrderCost] = useState(0); // state to store the current order cost.
    const [quantities, setQuantities] = useState({basicChaiBiscuit: 0,shahiButterBiscuit: 0,healthyNutsBiscuit: 0}); //state to keep track of the order, how much of what type of biscuit. This approach is not scalable, I know! Can dynamically create an array based on number of items getting fetched from the database and update the quantity by searching through ID
    const [biscuitData, setBiscuitData] = useState([]); // stores the biscuit data to show on the card. (JSON response received from the server)
    const [showModal, setShowModal] = useState(false); // state to store the flag as to when to show the Order Modal
    const [isOrderComplete, setIsOrderComplete] = useState(false); //state to check if the order is possible or not.
    const [orderSolution, setOrderSolution] = useState([]); // stores the final solution of the order created (remaining inventory, cost, etc).
    const [orderCalories, setOrderCalories] = useState(0); //stores the calories of the order getting formed.
    
    ///// USEEFFECT HOOKS /////

    //Effect to fetch data regarding all available biscuits on load of the component.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${url}/biscuits`);
                setBiscuitData(response.data);
            } catch (error) {
                console.error("Error fetching biscuit data:", error);
            }
        };
    
        fetchData();
    }, []);

    ///// ASYNC API CALL FUNCTIONS ////
    
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
    
    // Optional function that I had made to update the isPaid attribute in the order after the user clicks Pay Now.
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
    
    const getTotalCaloriesForOrder = async(orderId) => {
        try{
            const response = await axios.get(`${url}/biscuit-order/getCalories/${orderId}`);
            return response.data;
        }
        catch(err){
            console.error(err);
            return null;
        }
    }
    
    ///// CLASS FOR SOLUTION ENCAPSULATION /////
    
    class Solution{
    
        constructor(permutation, solutionInventoryMap, orderToServe){
            this.permutation = permutation; // since order checking is done by iterating the order linearly, making permutations of the same order array so that more number of possiblities get generated.
            this.solutionInventoryMap = solutionInventoryMap; //Inventory state after order is fulfilled.Returned inventory from the server is converted to a map, for efficient loop up and updates.
            this.orderToServe = orderToServe; // stores the final order to serve to the user.
            this.completedOrders = []; //stores completed order items
            this.uncompletedOrders = []; //stores incomplete order items.
        }
    
        //Function to check if the order item can be fulfilled. (from the inventory perspective -> Sufficient Ingredients?)
        checkOrder = async () => {
            const inventoryMap = this.solutionInventoryMap; // inventory map of the solution object for easier data retrieval.
            const orders = this.permutation; //permutation of orders the solution class will deal with.
    

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
        
                // if partial order remains, check for any alternative orders that can be served to the user (Note: Combination of orders between the Selected biscuit types)
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

    ///// HELPER FUNCTIONS FOR SOLUTION /////

    //consume the ingredients
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

    //function to convert the inventory object retrieved from the database into the prefered format for efficient data lookup.
    const createInventoryMap = (inventory) => {
        const inventoryMap = inventory.reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
        }, {});
        return inventoryMap;
    }

    //Function to trace back to the original inventory format.
    const convertMapToArray = (inventoryMap) => {
        const inventoryArray = [];
        for (const key in inventoryMap) {
            if (inventoryMap.hasOwnProperty(key)) {
                inventoryArray.push(inventoryMap[key]);
            }
        }
        return inventoryArray;
    };

    // function to generate permutations of various orders. These will be passed one by one to check for order.
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

    // Validate the order before further processing is done. Negative, non numerical values, etc.
    const validateOrder = (order) => {
        if (!order || !order.orderItems || order.orderItems.length === 0) {
            return false;
        }
        for (const item of order.orderItems) {
            if (!item  || !item.biscuit || typeof item.quantity !== "number" || item.quantity < 0) {
                return false;
            }
        }
        return true;
    };

    // Function to process the order
    const processOrder = async (jsonOrder) => {
        try {
            if(validateOrder(jsonOrder)){
                const currentBiscuitOrder = await createBiscuitOrder(jsonOrder);
                setOrderCost(currentBiscuitOrder.totalCost);
                const orderCal = await getTotalCaloriesForOrder(currentBiscuitOrder._id);
                setOrderCalories(orderCal)
                const allPermutations = generatePermutations(currentBiscuitOrder.orderItems);
                const currentInventory = await getCurrentInventory();
                const currentInventoryMap = createInventoryMap(currentInventory);
                const allSolutions = [];
                let orderCompleteConfig;
                let orderCompleteFlag = false;
                for (let permutedOrders of allPermutations) {
                    const initialInventoryMap = JSON.parse(JSON.stringify(currentInventoryMap));
                    let temp = new Solution(permutedOrders, initialInventoryMap, jsonOrder);
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

    // Function to handle the order after the button to place the order is clicked. Including making the order, and then processing it.
    const handleOrder = async () => {
        const orderItems = [
            { biscuit: biscuitData[0]._id, quantity: quantities.basicChaiBiscuit },
            { biscuit: biscuitData[1]._id, quantity: quantities.shahiButterBiscuit },
            { biscuit: biscuitData[2]._id, quantity: quantities.healthyNutsBiscuit }
        ];

        const jsonOrder = { orderItems };
        const [completeOrder, solution] = await processOrder(jsonOrder);
        setIsOrderComplete(completeOrder);
        setOrderSolution(solution);
    };
    
    ///// UI RENDERING HELPER FUNCTIONS /////

    const handleIncrease = (item) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [item]: prevQuantities[item] + 1
        }));
    };

    const handleDecrease = (item) => {
        if (quantities[item] > 0) {
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [item]: prevQuantities[item] - 1
            }));
        }
    };

    const handleReset = () => {
        setQuantities({
            basicChaiBiscuit: 0,
            shahiButterBiscuit: 0,
            healthyNutsBiscuit: 0
        });
        setOrderCost(0);
    };

    const renderCardBody = (biscuit) => {
        if (!biscuitData || !biscuitData.length || !biscuit) {
            return null;
        }
        return (
            <div className="card-body">
                <div>Shape: {biscuit.shape}</div>
                <div>Baking Time: {biscuit.bakingTime} minutes</div>
                <div>Baking Temperature: {biscuit.bakingTemperature} &#x2103;</div>
            </div>
        );
    };

    //Handle post order ops. Reset values, update inventory
    const handlePostOrderFunctions = () =>{
        if(isOrderComplete){
            alert("Order Placed!");
            console.log("Order placed!");
            updateInventory(orderSolution[0].solutionInventoryMap);
            console.log(orderSolution[0].solutionInventoryMap)
            console.log("Updated Inventory");
            setShowModal(false);
            handleReset();
        }
        else{
            if(orderSolution[0] == null){
                alert("Unknown Error Occurred!");
            }
            else{
                alert("Order not completed due to lack of sufficient ingredients!");
                console.log(orderSolution);
                setShowModal(false);
                handleReset();
            }
        }
    }

    //Asking for a key to the user to see the inventory. Very much not recommended. But had to have a basic authentication. Ideally should make a different login crediential for this.
    const handleOpenInventoryModal = () => {
        const userInput = prompt("Please enter your access code:");
        if (userInput === "admin") {
            setShowInventory(true);
        } else {
            alert("Access Denied");
        }
    };

    return(
        <>
        <Navbar/>
        <div className="biscuitHolders">
            <div className="card">
            <h4 className="card-title text-center">Basic Chai Biscuit</h4>
            <h6 className="card-subtitle mb-2 text-muted text-center"><span>&#x20B9;</span>24</h6>
            <img className="card-img-top" src={circularBiscuit} alt="Card image cap"/>
            <div className="card-body description">Enhance your "Chai" Experience with our biscuit specially made for you!</div>
            {renderCardBody(biscuitData[0])}
            <div className="quantity-controls">
                <button className="decreaseButton" onClick={() => handleDecrease('basicChaiBiscuit')}>↓</button>
                <span className="itemQuantity">{quantities.basicChaiBiscuit}</span>
                <button className="increaseButton" onClick={() => handleIncrease('basicChaiBiscuit')}>↑</button>
            </div>
            </div>
            <div className="card">
            <h4 className="card-title text-center">Shahi Butter Biscuit</h4>
            <h6 className="card-subtitle mb-2 text-muted text-center"><span>&#x20B9;</span>51</h6>
            <img className="card-img-top" src={triangularBiscuit} alt="Card image cap"/>
            <div className="card-body description">Royalty will come to you! Buttery, crispy baked biscuits! An absolute triangular masterclass! </div>
            {renderCardBody(biscuitData[1])}
            <div className="quantity-controls">
                <button className="decreaseButton" onClick={() => handleDecrease('shahiButterBiscuit')}>↓</button>
                <span className="itemQuantity">{quantities.shahiButterBiscuit}</span>
                <button className="increaseButton" onClick={() => handleIncrease('shahiButterBiscuit')}>↑</button>
            </div>
            </div>
            <div className="card">
            <h4 className="card-title text-center">Healthy Nuts Biscuit</h4>
            <h6 className="card-subtitle mb-2 text-muted text-center"><span>&#x20B9;</span>37</h6>
            <img className="card-img-top rectImage" src={rectangularBiscuit} alt="Card image cap"/>
            <div className="card-body description">This one's for all those fitness freaks! Healthy, loaded with Dry Fruits!</div>
            {renderCardBody(biscuitData[2])}
            <div className="quantity-controls">
                <button className="decreaseButton" onClick={() => handleDecrease('healthyNutsBiscuit')}>↓</button>
                <span className="itemQuantity">{quantities.healthyNutsBiscuit}</span>
                <button className="increaseButton" onClick={() => handleIncrease('healthyNutsBiscuit')}>↑</button>
            </div>
            </div>
        </div>
        <div className="actionButtonHolder">
            <button className="btn btn-primary" onClick={() => {setShowModal(true); handleOrder();}}>Order Now!</button>
            <button className="btn btn-danger" onClick={handleReset}>Reset Values</button>
            <button className="btn btn-warning" onClick={handleOpenInventoryModal}>See Inventory</button>
        </div>
        <OrderModal showModal={showModal} handleCloseModal={() => setShowModal(false)} handlePostOrderFunctions={handlePostOrderFunctions} cost={orderCost} calories={orderCalories} />
        <InventoryModal showModal={showInventory} handleCloseModal={() => setShowInventory(false)} getInventory={getCurrentInventory} updateInventory={updateInventory} createMap={createInventoryMap}/>

        </>
    )
}


export default BiscuitOrder;
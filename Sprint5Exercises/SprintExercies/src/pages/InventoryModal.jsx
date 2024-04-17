
/* 

    Inventory Modal allows the user to view the Bakery Inventory state. User can only update the ingredient quantity, ofcourse not the calorie and cost values.
    One can edit the value by double clicking on the quantity value you want to edit.

*/


import React from "react";
import '../css/InventoryModal.css';
import { useEffect, useState } from "react";

const InventoryModal = ({ showModal, handleCloseModal, getInventory, updateInventory, createMap}) => {
    
    const [inventory, setInventory] = useState([]); // state to store the latest updated inventory.

    // Effect to fetch the inventory from the server on change in the showModal flag. That is will only fetch if the modal is to be shown.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventoryData = await getInventory();
                setInventory(inventoryData);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        };

        fetchData();
    }, [showModal]);

    // Functionalities to avoid invalid input and then set the inventory as the most recent, if valid.
    const handleQuantityChange = (id, newValue) => {
        if(newValue == 0){
            alert("Cmon! Dont Empty our Inventory!");
            return;
        }
        if(newValue == '' || isNaN(newValue) ||  newValue < 0){
            alert("Wrong Input, please give valid number as input");
            return;
        }
        const updatedInventory = inventory.map(item => {
            if (item._id === id) {
                return { ...item, quantity: newValue };
            }
            return item;
        });
        setInventory(updatedInventory);
    };

    //Function to update the inventory to the database as the most recent updated inventory. One more thing that can be implemented is that, inventory can be updated on closing of the modal, but bakery inventory being a very vital part, cannot take that risk.
    const handleUpdateInventory = () => {
        const inventoryMap = createMap(inventory);
        updateInventory(inventoryMap);
        handleCloseModal();
    };
    
    return (
        <div className={`modal fade ${showModal ? "show" : ""}`} id="inventoryModal" tabIndex="-1" role="dialog" aria-labelledby="inventoryModalTitle" aria-hidden="true"  style={{ display: showModal ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="inventoryModalTitle">Inventory Management</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Calories per 100gm</th>
                                    <th scope="col">Cost per 100gm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td
                                            onDoubleClick={() => {
                                                const newValue = prompt("Enter new quantity:");
                                                if (newValue !== null) {
                                                    handleQuantityChange(item._id, newValue);
                                                }
                                            }}
                                        >
                                            {item.quantity}
                                        </td>
                                        <td>{item.calories}</td>
                                        <td>{item.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseModal}>Close</button>
                        <button type="button" className="btn btn-warning" onClick={handleUpdateInventory}>Update Inventory</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;

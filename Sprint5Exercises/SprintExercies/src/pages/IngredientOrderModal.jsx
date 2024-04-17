
/*

React component to handle the Choice of order to go for when the user gives its ingredients to the bakery to bake for him. 
Contains a dropdown that will help to set the preference of the user. 

*/


import React, { useState, useEffect } from 'react';
import './IngredientOrderModal.css';
import qrCode from '../assets/qrcode.png';

const IngredientOrderModal = ({ showModal, handleCloseModal, orderSolutions, userInventoryToggle, inventory, updateInventory, createMap, handleReset}) => {
    const [selectedPreference, setSelectedPreference] = useState(null); // state to store the selected preference of the user.
    
    //Effect to keep listening for a press of escape button to remove the preference set.
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handlePreferenceChange = (event) => {
        const selectedSolution = JSON.parse(event.target.value);
        setSelectedPreference(selectedSolution);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setSelectedPreference(null); // Reset to null on Escape key
        }
    };

    // Pay now function takes care of the post pay ops. Updating inventory and resetting values to default. Inventory must be updated in the specific format.
    const handlePayNow = async () => {
        if (selectedPreference) {
            const solutionInventory = selectedPreference.solutionInventory;

            const updatedInventory = inventory.map(item => {
                if (solutionInventory[item._id]) {
                    return userInventoryToggle ? { ...item, quantity: item.quantity + solutionInventory[item._id] } : { ...item, quantity: solutionInventory[item._id] };
                }
                return item;
            });

            const inventoryMap = createMap(updatedInventory);

            await updateInventory(inventoryMap);
        }

        resetInventoryModal();
        handleCloseModal();
        handleReset();
    };

    const resetInventoryModal = () => {
        setSelectedPreference(null);
    };


    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="orderModalLabel" aria-modal="true" aria-hidden={!showModal}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header ing-modal-header">
                        <h5 className="modal-title ing-title" id="orderModalLabel">Are you Sure?</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                    </div>
                    <div className="modal-body ing-body">
                        <img className='qrcode' src={qrCode} alt="Order" />
                        <h5 className="mt-3 ing-dropdown-desc">Which Order Do you Prefer?</h5>
                        {(!userInventoryToggle && orderSolutions.length > 0) ? (
                            <select className="form-control dropDown mt-2" value={selectedPreference ? JSON.stringify(selectedPreference) : ''} onChange={handlePreferenceChange}>
                                <option value="" disabled>Select your preference</option>
                                {orderSolutions.slice(0, 1).map((solution, index) => (
                                    <option className='dropdownElement' key={index} value={JSON.stringify(solution)}>
                                        {Object.entries(solution.uniqueBiscuitDescription).map(([key, value]) => (
                                            `${key} - ${value} , `
                                        ))}
                                        {`Cost: ${solution.solutionCost}`}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <>
                                <select className="form-control dropDown mt-2" value={selectedPreference ? JSON.stringify(selectedPreference) : ''} onChange={handlePreferenceChange}>
                                    <option value="" disabled>Select your preference</option>
                                    {orderSolutions.map((solution, index) => (
                                        <option className='dropdownElement' key={index} value={JSON.stringify(solution)}>
                                            {Object.entries(solution.uniqueBiscuitDescription).map(([key, value]) => (
                                                `${key} - ${value} , `
                                            ))}
                                            {`Service Cost: ${solution.solutionBakingTime*0.6}`}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={handleCloseModal}>Close</button>
                        <button type="button" className="btn btn-success" onClick={handlePayNow}>Pay Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngredientOrderModal;

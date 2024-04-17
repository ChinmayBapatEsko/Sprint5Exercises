
/*

    This react component is responsible to render the order modal once the order is placed. Handles the post order functionalities too.

*/

import React from "react";
import qrCode from '../assets/qrcode.png'
import '../css/OrderModal.css'

const OrderModal = ({ showModal, handleCloseModal, handlePostOrderFunctions, cost, calories}) => {

    return (
        <div className={`modal fade ${showModal ? "show" : ""}`} id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"  style={{ display: showModal ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Order Details</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="para">Are you sure you want to place this order? If yes, SCAN!</p>
                    </div>
                    <img className="qrcode" src={qrCode} alt="QR Code" />
                    <div className="orderData">
                        <p>Total Cost: &#x20B9;{cost}</p>
                        <p>Total Order Calories: {calories.totalCalories}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseModal}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handlePostOrderFunctions}>Pay Now!</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
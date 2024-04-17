
/*

Component to play a Simple mini game to arrange all the cards as per the order deck from Ace to King, using drag and drop.  
User can remove the widget from the deck by double clicking it.

*/

import '../css/DragDrop.css';
import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';

const DragDrop = () =>{

    const [widgets, setWidgets] = useState([]); //state to keep track of what widgets / cards are dropped in the drop area.

    // Always runs when the state of the widgets has been changed and checks if the user has completed the game.  
    useEffect (() =>{
        function arraysEqual(a, b) {
            if (a.length !== b.length) 
                return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) 
                    return false;
            }
            return true;
        }
        function handleSuccessAll(){
            const idealWidgets = ['1 ♣', '2 ♣', '3 ♣', '4 ♣', '5 ♣', '6 ♣', '7 ♣', '8 ♣', '9 ♣', '10 ♣', '🎃 ♣', '👸 ♣', "🤴 ♣"]
            if (widgets.length === idealWidgets.length && arraysEqual(widgets, idealWidgets)) {
                alert("Perfect Pack!");
                handleReset();
            }
        }
        handleSuccessAll();
    }, [widgets]);

    // Funcion to define what to do when a drag starts.
    function handleOnDrag(e, widgetType){
        e.dataTransfer.setData("widgetType", widgetType);
    }

    // Function to define what to do when the object is dropped.
    function handleOnDrop(e){
        const widgetType = e.dataTransfer.getData("widgetType");
        console.log(widgets);
        if(widgets.includes(widgetType) == false){
            if(widgetType != ""){setWidgets([...widgets, widgetType])};
        }
    }

    // Function to define what to do when the drag is over (object still held, but not dropped);
    function handleDragOver(e){
        e.preventDefault();
    }

    function handleRemoveWidget(widgetToRemove){
        setWidgets(widgets.filter(widget => widget !== widgetToRemove));
    }

    //Removes the widget off the drop area if double clicked.
    function handleOnDoubleClick(widgetType){
        handleRemoveWidget(widgetType);
    }

    const handleReset =() =>{
        setWidgets([]);
    }


    return(
        <>
        <Navbar/>
        <h1 className='cardHeader'>CLUB CARD STACK HOLDER</h1>
        <div className='dragapp'>
            <div className='widgets'>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "9 ♣")}>
                    9 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "2 ♣")}>
                    2 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "1 ♣")}>
                    1 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "4 ♣")}>
                    4 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "3 ♣")}>
                    3 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "5 ♣")}>
                    5 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "🤴 ♣")}>
                    🤴 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "8 ♣")}>
                    8 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "6 ♣")}>
                    6 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "🎃 ♣")}>
                    🎃 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "7 ♣")}>
                    7 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "10 ♣")}>
                    10 ♣
                </div>
                <div className='widget' draggable onDragStart={(e) => handleOnDrag(e, "👸 ♣")}>
                    👸 ♣
                </div>
            </div>
            <div className='dropContainer' onDrop={handleOnDrop} onDragOver={handleDragOver}
            style={{ backgroundColor: widgets.length === 0 ? 'aliceblue' : 'beige' }}>
                {widgets.map((widget, index) => (
                <div draggable className='dropped-widget' key={index}
                onDoubleClick={() => handleOnDoubleClick(widget)}>
                {widget}
                </div>
                ))}
            </div>
        </div>

        </>
    )
}

export default DragDrop;
/*

    Landing page for the bakery website. Gives a small description of what the bakery does and includes button to explore the same functionalities.

*/

import './Bakery.css';
import React from 'react';
import {useState, useEffect} from 'react';
import Navbar from './Navbar';
import biscuitImage from '../assets/biscuits2.png'
import { Link } from 'react-router-dom';

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia"></link>

const Bakery = () => {
    return(
        <>
        <Navbar/>
        <div className='bakeryContainer'>
            <div className='side leftSide'>
                <div className='textAbove'>
                    <h1 className='upText'>Baking for You! 🤝</h1>
                    <h3 className='middleText'>" Feeling crumby? A trip to the bakery will fix that! "</h3>
                    <h2 className='downText'>We will Cook for You! 👨‍🍳</h2>
                </div>
                <div className='buttonHolder'><Link to="/bakery/bake-for-me" className='btn bakeryButton'>Bake for me!</Link></div>
                <div className='textBelow'>
                    <h2 className='downText'>Sweetness in Every Bite! 🤤</h2>
                    <h3 className='middleText'>" Life is what you bake of it! "</h3>
                    <h1 className='upText'>Bake, Love, Repeat 🥯</h1>
                </div>
            </div>
            <div className='side rightSide'>
            <div className='textAbove'>
                <h1 className='upText'>Order with Trust 🎈</h1>
                <h3 className='middleText'>" Biscuits that make you go Nuts!"🤯</h3>
                <h2 className='downText'>Served with Love 💕</h2>
            </div>
            <div className='buttonHolder'><Link to="/bakery/order-biscuits" className='btn bakeryButton'>Order Here!</Link></div>
            <div className='textBelow'>
                <h2 className='downText'>Served with Love 💕</h2>
                <h3 className='middleText'>" Indulging in the simplicity and beauty of freshly baked goodness."</h3>
                <h1 className='upText'>Order with Trust 🎈</h1>
            </div>
            </div>
            <img src={biscuitImage} alt="Dividing Image" className='center-image'/>
        </div>
        </>
    )
}

export default Bakery;
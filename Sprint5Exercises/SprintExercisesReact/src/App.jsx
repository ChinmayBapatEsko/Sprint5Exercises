import React, { useEffect } from 'react'
import Datatable from './pages/Datatable'
import './App.css'
import Navbar from './pages/Navbar';
import Progress from './pages/Progress';
import {Routes, Route} from "react-router-dom"
import DragDrop from './pages/DragDrop'
import Bakery from './pages/Bakery'
import BiscuitOrder from './pages/BiscuitOrder'
import BakeIngredients from './pages/BakeIngredients';

const App = () => {

  return (
    <div className="mainContainer">
      <Routes>
        <Route path="/" element={<Datatable/>}/>
        <Route path='/table' element={<Datatable/>}/>
        <Route path="/progress" element={<Progress/>}/>
        <Route path="/bakery" element={<Bakery/>}/>
        <Route path="/drag" element={<DragDrop/>}/>
        <Route path="/bakery/order-biscuits" element={<BiscuitOrder/>}/>
        <Route path='/bakery/bake-for-me' element={<BakeIngredients/>}></Route>
      </Routes>
    </div>
  );
};

export default App;
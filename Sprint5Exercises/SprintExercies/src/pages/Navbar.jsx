import React, {useState} from "react";
import './Navbar.css'
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="#">Sprint 5</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav justify-content-end">
              <li className="nav-item active">
                <Link className="nav-link" to="/table">Employee DataTable</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/drag">Card Drag</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/progress">Progress Bar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bakery">Bakery</Link>
              </li>
            </ul>
          </div>
        </nav>
      );
}

export default Navbar;
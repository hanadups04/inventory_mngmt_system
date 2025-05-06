import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainDish from "./Components/Category";
import SideDish from "./Components/Ingredients";
import Desserts from "./Components/StockIngredients";
import Drinks from "./Components/Recipe";
import AddMenu from "./Components/MenuItem";
import Orders from "./Components/Orders";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-custom">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              INVENTORY MANAGEMENT SYSTEM
            </a>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link active">
                    CATEGORY
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/ingredients" className="nav-link active">
                    INGREDIENTS
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/stocks" className="nav-link active">
                    STOCKS
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/menuItems" className="nav-link active">
                    MENU ITEMS
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/recipe" className="nav-link active">
                    RECIPES
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Orders" className="nav-link active">
                    ORDERS
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<MainDish />} />
          <Route path="/ingredients" element={<SideDish />} />
          <Route path="/stocks" element={<Desserts />} />
          <Route path="/menuItems" element={<AddMenu />} />
          <Route path="/recipe" element={<Drinks />} />
          <Route path="/Orders" element={<Orders />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

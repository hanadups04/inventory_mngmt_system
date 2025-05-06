import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockIngredients.css";

export default function StockIngredients() {
  const [stockIngredients, setStockIngredients] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost/RestaurantManagementsystem/PHP/api/read/readStockIngredientsTbl.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200 && response.data.data.length > 0) {
          console.log(response.data.data);
          setStockIngredients(response.data.data);
        } else {
          setStockIngredients([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [ingredientName, setIngredientName] = useState("");
  const [qty, setQty] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ingredient_name: ingredientName,
      qty: qty,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertStockIngredients.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Stock Ingredients added successfully!");
        setIngredientName("");
        setQty("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add Stock Ingredients. Please try again.");
      });
  };

  return (
    <>
      <div className="StockIngredients-Parent">
        <div className="StockIngredients-Header">
          <p className="title"> Welcome, Admin!</p>
          <p className="descrip">Here are the latest updates.</p>
        </div>
        <div className="StockIngredients-Body">
          <div className="StockIngredients-TableCont">
            <p className="title"> STOCK INGREDIENTS</p>
            <div className="TableCont">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">INGREDIENT ID</th>
                    <th scope="col">INGREDIENT NAME</th>
                    <th scope="col">QUANTITY</th>
                    <th scope="col">TOTAL STOCK</th>
                    <th scope="col">TOTAL PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {stockIngredients.length > 0
                    ? stockIngredients.map((stockIngredient, key) => (
                        <tr key={key}>
                          <td>{stockIngredient.ingredients_id}</td>
                          <td>{stockIngredient.ingredient_name}</td>
                          <td>{stockIngredient.qty}</td>
                          <td>{stockIngredient.total_stock}</td>
                          <td>₱ {stockIngredient.total_price}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
          <div className="StockIngredients-FormCont">
            <form onSubmit={handleSubmit}>
              <h3>STOCK INGREDIENTS FORM</h3>
              <div className="FormCont-Body">
                <label htmlFor="ingredient_name">Ingredient Name: </label>
                <input
                  type="text"
                  id="ingredient_name"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  required
                />
                <label htmlFor="qty">Quantity</label>
                <input
                  type="number"
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
              </div>
              <div className="FormCont-Buttons">
                <button
                  type="button"
                  className="Cancel"
                  onClick={() => {
                    setIngredientName("");
                    setQty("");
                  }}
                >
                  CANCEL
                </button>
                <button type="submit" className="Add">
                  ADD STOCK
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

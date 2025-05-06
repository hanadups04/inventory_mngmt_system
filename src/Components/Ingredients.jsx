import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Ingredients.css";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [categoryName, setCategoryName] = useState(""); // Changed to categoryName for clarity
  const [unitPrice, setUnitPrice] = useState("");
  useEffect(() => {
    axios
      .get(
        "http://localhost/RestaurantManagementsystem/PHP/api/read/readIngredientsTbl.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200 && response.data.data.length > 0) {
          console.log(response.data.data);
          setIngredients(response.data.data);
        } else {
          setIngredients([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [ingredientName, setIngredientName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ingredient_name: ingredientName,
      measurement_unit: measurementUnit,
      category_name: categoryName,
      unit_price: unitPrice,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertIngredients.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Ingredient added successfully!");
        setIngredientName("");
        setMeasurementUnit("");
        setCategoryName("");
        setUnitPrice("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add category. Please try again.");
      });
  };

  return (
    <>
      <div className="Ingredient-Parent">
        <div className="Ingredient-Header">
          <p className="title"> Welcome, Admin!</p>
          <p className="descrip">Here are the latest updates.</p>
        </div>
        <div className="Ingredient-Body">
          <div className="Ingredient-TableCont">
            <p className="title">INGREDIENTS</p>
            <div className="TableCont">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">INGREDIENT ID</th>
                    <th scope="col">INGREDIENT NAME</th>
                    <th scope="col">MEASUREMENT UNIT</th>
                    <th scope="col">CATEGORY NAME</th>
                    <th scope="col">UNIT PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.length > 0
                    ? ingredients.map((ingredient, key) => (
                        <tr key={key}>
                          <td>{ingredient.ingredients_id}</td>
                          <td>{ingredient.ingredient_name}</td>
                          <td>{ingredient.measurement_unit}</td>
                          <td>{ingredient.category_name}</td>
                          <td>₱ {ingredient.unit_price}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
          <div className="Ingredient-FormCont">
            <form onSubmit={handleSubmit}>
              <h3>INGREDIENTS FORM</h3>
              <div className="FormCont-Body">
                <label htmlFor="ingredient_name">Ingredient Name </label>
                <input
                  type="text"
                  id="ingredient_name"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  required
                />

                <label htmlFor="measurement_unit">Measurement Unit</label>
                <input
                  type="text"
                  id="measurement_unit"
                  value={measurementUnit}
                  onChange={(e) => setMeasurementUnit(e.target.value)}
                  required
                />

                <label htmlFor="category_name">Category Name</label>
                <input
                  type="text"
                  id="category_name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
                <label htmlFor="unit_price">Unit Price</label>
                <input
                  type="number"
                  id="unit_price"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                />
              </div>
              <div className="FormCont-Buttons">
                <button
                  type="button"
                  className="Cancel"
                  onClick={() => {
                    setIngredientName("");
                    setMeasurementUnit("");
                    setCategoryName("");
                    setUnitPrice("");
                  }}
                >
                  CANCEL
                </button>
                <button type="submit" className="Add">
                  ADD INGREDIENT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

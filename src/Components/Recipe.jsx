import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Recipe.css";
import RecipeCard from "./RecipeCardTemp.jsx";

export default function Recipe() {
  const [recipeItems, setRecipeItems] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost/RestaurantManagementsystem/PHP/api/read/singleReadRecipeIngTbl.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200 && response.data.data.length > 0) {
          console.log(response.data.data);
          setRecipeItems(response.data.data);
        } else {
          setRecipeItems([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [menuItemId, setMenuItemId] = useState("");
  const [ingredientsId, setIngredientsId] = useState("");
  const [ingredientsId2, setIngredientsId2] = useState("");
  const [ingredientsId3, setIngredientsId3] = useState("");
  const [seling_price, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantity2, setQuantity2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      menu_item_name: menuItemId,
      selling_price: seling_price,
      items: [
        {
          ingredient_name: ingredientsId,
          quantity: quantity,
        },
      ],
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertRecipe.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Recipe added successfully!");
        setMenuItemId("");
        setIngredientsId("");
        setQuantity("");
        setSellingPrice("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add recipe. Please try again.");
      });
  };

  return (
    <>
      <div className="Recipe-Parent">
        <div className="Recipe-Header">
          <p className="title"> Welcome, Admin!</p>
          <p className="descrip">Here are the latest updates.</p>
        </div>
        <div className="Recipe-Body">
          <div className="Recipe-TableCont">
            <p className="title">RECIPES</p>
            <div className="CardCont">
              {recipeItems.map((menuItem, index) => (
                <RecipeCard
                  key={index}
                  ItemName={menuItem.menu_item_name || "Unknown Item"}
                  ingredients={menuItem.ingredients || []}
                />
              ))}
            </div>
          </div>
          <div className="Recipe-FormCont">
            <form onSubmit={handleSubmit}>
              <h3>RECIPES FORM</h3>
              <div className="FormCont-Body">
                <label htmlFor="menu_item_id">Menu Item Name</label>
                <input
                  type="text"
                  id="menu_item_id"
                  value={menuItemId}
                  onChange={(e) => setMenuItemId(e.target.value)}
                  required
                />
                <label htmlFor="ingredients_id">Ingredient Name</label>
                <input
                  type="text"
                  id="ingredients_id"
                  value={ingredientsId}
                  onChange={(e) => setIngredientsId(e.target.value)}
                  required
                />

                <label htmlFor="quantity">Quantity</label>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />

                <label htmlFor="selling_price">Selling Price</label>
                <input
                  type="text"
                  id="selling_price"
                  value={seling_price}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  required
                />
              </div>
              <div className="FormCont-Buttons">
                <button
                  type="button"
                  className="Cancel"
                  onClick={() => {
                    setMenuItemId("");
                    setIngredientsId("");
                    setQuantity("");
                  }}
                >
                  CANCEL
                </button>
                <button type="submit" className="Add">
                  ADD RECIPE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from "react";

const AddRecipeIngredientForm = () => {
  const [menuItemId, setMenuItemId] = useState("");
  const [ingredientsId, setIngredientsId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      menu_item_id: menuItemId,
      ingredients_id: ingredientsId,
      quantity: quantity,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertRecipeIngredient.php",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        console.log(response.data);
        alert("Recipe Ingredient added!");
        setMenuItemId(response.data.data);
        setIngredientsId(response.data.data);
        setQuantity(response.data.data);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Recipe Ingredient</h2>
      <div>
        <label htmlFor="menu_item_id">Menu Item ID</label>
        <input
          type="number"
          id="menu_item_id"
          value={menuItemId}
          onChange={(e) => setMenuItemId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="ingredients_id">Ingredient ID</label>
        <input
          type="number"
          id="ingredients_id"
          value={ingredientsId}
          onChange={(e) => setIngredientsId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="text"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Recipe Ingredient</button>
    </form>
  );
};

export default AddRecipeIngredientForm;

import React, { useState } from "react";
import axios from "axios";

const AddStockIngredientForm = () => {
  const [ingredientsName, setIngredientsName] = useState(""); // Fixed camelCase naming
  const [qty, setQty] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    const formData = {
      ingredient_name: ingredientsName,
      qty: qty,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertStockIngredients.php",
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        const data = response.data;
        if (data.status === 200) {
          setSuccess("Stock Ingredient added successfully!");
          setIngredientsName(""); // Reset form fields
          setQty("");
        } else {
          setError(data.message || "Failed to add stock ingredient.");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Stock Ingredient</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error messages */}
      {success && <p style={{ color: "green" }}>{success}</p>}{" "}
      {/* Display success messages */}
      <div>
        <label htmlFor="ingredientsName">Ingredient Name</label>
        <input
          type="text"
          id="ingredientsName" // Fixed id to match the field name
          value={ingredientsName}
          onChange={(e) => setIngredientsName(e.target.value)} // Fixed camelCase naming
          required
        />
      </div>
      <div>
        <label htmlFor="qty">Quantity</label>
        <input
          type="number"
          id="qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Stock Ingredient</button>
    </form>
  );
};

export default AddStockIngredientForm;

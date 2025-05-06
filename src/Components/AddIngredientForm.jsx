import React, { useState } from "react";
import axios from "axios";

const AddIngredientForm = () => {
  const [ingredientName, setIngredientName] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [categoryName, setCategoryName] = useState(""); // Changed to categoryName for clarity
  const [unitPrice, setUnitPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = {
      ingredient_name: ingredientName,
      measurement_unit: measurementUnit,
      category_name: categoryName,
      unit_price: unitPrice,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertIngredient.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200) {
          setSuccess("Ingredient added successfully!");
          setIngredientName("");
          setMeasurementUnit("");
          setCategoryName("");
          setUnitPrice("");
        } else {
          setError(response.data.message || "Failed to add ingredient.");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Ingredient</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <div>
        <label htmlFor="ingredient_name">Ingredient Name</label>
        <input
          type="text"
          id="ingredient_name"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="measurement_unit">Measurement Unit</label>
        <input
          type="text"
          id="measurement_unit"
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="category_name">Category Name</label>
        <input
          type="text"
          id="category_name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="unit_price">Unit Price</label>
        <input
          type="number"
          id="unit_price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Ingredient</button>
    </form>
  );
};

export default AddIngredientForm;

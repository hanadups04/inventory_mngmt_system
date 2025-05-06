import React, { useState } from "react";
import axios from "axios";

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { category_name: categoryName };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertCategory.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        setCategoryName(response.data.data);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Category</h2>
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
      <button type="submit">Add Category</button>
    </form>
  );
};

export default AddCategoryForm;

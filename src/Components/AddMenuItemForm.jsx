import React, { useState } from "react";

const AddMenuItemForm = () => {
  const [menuItemName, setMenuItemName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      menu_item_name: menuItemName,
      selling_price: sellingPrice,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertMenuItem.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        setMenuItemName("");
        response.data.data;
        setSellingPrice("");
        response.data.data;
        alert("Menu Item added!");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Menu Item</h2>
      <div>
        <label htmlFor="menu_item_name">Menu Item Name</label>
        <input
          type="text"
          id="menu_item_name"
          value={menuItemName}
          onChange={(e) => setMenuItemName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="selling_price">Selling Price</label>
        <input
          type="number"
          id="selling_price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Menu Item</button>
    </form>
  );
};

export default AddMenuItemForm;

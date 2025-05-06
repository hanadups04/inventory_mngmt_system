import React, { useState } from "react";

const AddOrderForm = () => {
  const [menuName, setmenuName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      menu_item_name: menuName,
      quantity: quantity,
      total_price: totalPrice,
    };

    axios
      .post(
        "http://localhost/RestaurantManagementsystem/PHP/api/create/insertOrder.php",
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
      .then(function (response) {
        console.log(response.data);
        alert("Order added!");
        setmenuName(response.data.data);
        setQuantity(response.data.data);
        setTotalPrice(response.data.data);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Order</h2>
      <div>
        <label htmlFor="menu_item_id">Menu name</label>
        <input
          type="text"
          id="menu_item_name"
          value={menuName}
          onChange={(e) => setmenuName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="total_price">Total Price</label>
        <input
          type="number"
          id="total_price"
          value={totalPrice}
          onChange={(e) => setTotalPrice(e.target.value)}
          required
        />
      </div>

      <button type="submit">Add Order</button>
    </form>
  );
};

export default AddOrderForm;

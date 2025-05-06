import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost/RestaurantManagementsystem/PHP/api/read/readOrdersTbl.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200 && response.data.data.length > 0) {
          console.log(response.data.data);
          setOrders(response.data.data);
        } else {
          setOrders([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        alert("Order added successfully!");
        setmenuName("");
        setQuantity("");
        setTotalPrice("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add Order. Please try again.");
      });
  };

  return (
    <>
      <div className="Orders-Parent">
        <div className="Orders-Header">
          <p className="title"> Welcome, Admin!</p>
          <p className="descrip">Here are the latest updates.</p>
        </div>
        <div className="Orders-Body">
          <div className="Orders-TableCont">
            <p className="title">ORDERS</p>
            <div className="TableCont">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">ORDER ID</th>
                    <th scope="col">MENU ITEM NAME</th>
                    <th scope="col">QUANTITY</th>
                    <th scope="col">TOTAL PRICE</th>
                    <th scope="col">ORDER DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0
                    ? orders.map((order, key) => (
                        <tr key={key}>
                          <td>{order.order_id}</td>
                          <td>{order.menu_item_name}</td>
                          <td>{order.quantity}</td>
                          <td>₱ {order.total_price}</td>
                          <td>{order.order_date}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
          <div className="Orders-FormCont">
            <form onSubmit={handleSubmit}>
              <h3>ORDER FORM</h3>
              <div className="FormCont-Body">
                <label htmlFor="menu_item_id">Menu name</label>
                <input
                  type="text"
                  id="menu_item_name"
                  value={menuName}
                  onChange={(e) => setmenuName(e.target.value)}
                  required
                />

                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />

                <label htmlFor="total_price">Total Price</label>
                <input
                  type="number"
                  id="total_price"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  required
                />
              </div>
              <div className="FormCont-Buttons">
                <button
                  type="button"
                  className="Cancel"
                  onClick={() => {
                    setmenuName("");
                    setQuantity("");
                    setTotalPrice("");
                  }}
                >
                  CANCEL
                </button>
                <button type="submit" className="Add">
                  ADD ORDER
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

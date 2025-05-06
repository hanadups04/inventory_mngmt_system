import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MenuItem.css";

export default function MenuItem() {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost/RestaurantManagementsystem/PHP/api/read/readMenuItemsTbl.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200 && response.data.data.length > 0) {
          console.log(response.data.data);
          setMenuItems(response.data.data);
        } else {
          setMenuItems([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div className="MenuItem-Parent">
        <div className="MenuItem-Header">
          <p className="title"> Welcome, Admin!</p>
          <p className="descrip">Here are the latest updates.</p>
        </div>
        <div className="MenuItem-Body">
          <div className="MenuItem-TableCont">
            <p className="title">MENU ITEMS</p>
            <div className="TableCont">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">MENU ITEM ID</th>
                    <th scope="col">MENU ITEM NAME</th>
                    <th scope="col">SELLING PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length > 0
                    ? menuItems.map((item, key) => (
                        <tr key={key}>
                          <td>{item.menu_item_id}</td>
                          <td>{item.menu_item_name}</td>
                          <td>₱ {item.selling_price}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

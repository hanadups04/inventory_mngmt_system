import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Category.css";

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(
        "http://localhost/RestaurantManagementsystem/PHP/api/read/readCategoryTbl.php",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200 && response.data.data.length > 0) {
          console.log(response.data.data);
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
      .then((response) => {
        console.log(response.data);
        alert("Category added successfully!");
        setCategoryName("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add category. Please try again.");
      });
  };

  return (
    <>
      <div className="Category-Parent">
        <div className="Category-Header">
          <p className="title"> Welcome, Admin!</p>
          <p className="descrip">Here are the latest updates.</p>
        </div>
        <div className="Category-Body">
          <div className="Category-TableCont">
            <p className="title">CATEGORIES</p>
            <div className="TableCont">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">CATEGORY ID</th>
                    <th scope="col">CATEGORY NAME</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0
                    ? categories.map((category, key) => (
                        <tr key={key}>
                          <td>{category.category_id}</td>
                          <td>{category.category_name}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
          <div className="Category-FormCont">
            <form onSubmit={handleSubmit}>
              <h3>CATEGORY FORM</h3>
              <div className="FormCont-Body">
                <label htmlFor="category_name">Category Name </label>
                <input
                  type="text"
                  id="category_name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="FormCont-Buttons">
                <button
                  type="button"
                  className="Cancel"
                  onClick={() => setCategoryName("")}
                >
                  CANCEL
                </button>
                <button type="submit" className="Add">
                  ADD CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
// import "./TableDisplay.css";

const TableDisplay = ({ data }) => {
  console.log("Data passed to TableDisplay:", data); // Debugging
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p style={{ padding: "1rem" }}>No data to display.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDisplay;

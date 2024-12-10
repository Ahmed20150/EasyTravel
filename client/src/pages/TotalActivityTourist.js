import React, { useState } from "react";
import axios from "axios";

const TotalTouristsReport = () => {
  const [month, setMonth] = useState("");
  const [totalTourists, setTotalTourists] = useState(null);
  const [allTourists, setAllTourists] = useState(null);
  const [error, setError] = useState(null);

  // Handle the month selection change
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  // Fetch total tourists for the selected month
  const fetchTouristData = async () => {
    if (!month || month < 1 || month > 12) {
      setError("⚠️ Please select a valid month (1-12).");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/total-tourists?month=${month}`
      );
      setTotalTourists(response.data.totalTourists);
      setError(null);
    } catch (error) {
      console.error("Error fetching tourist report:", error);
      setError("❌ Failed to fetch the tourist report. Please try again later.");
      setTotalTourists(null);
    }
  };

  // Fetch total tourists across all months
  const fetchAllTourists = async () => {
    try {
      const response = await axios.get("http://localhost:3000/total-tourists");
      setAllTourists(response.data.totalTourists);
      setError(null);
    } catch (error) {
      console.error("Error fetching total tourists:", error);
      setError("❌ Failed to fetch the total tourists. Please try again later.");
      setAllTourists(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        padding: "25px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "22px",
          color: "#333",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        📊 Tourists Report
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="month"
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
            display: "block",
          }}
        >
          Select Month (1-12):
        </label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={handleMonthChange}
          min="1"
          max="12"
          placeholder="Enter month"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button
        onClick={fetchTouristData}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          color: "#fff",
          backgroundColor: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "15px",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#333")} // Dark gray on hover
        onMouseOut={(e) => (e.target.style.backgroundColor = "#000")} // Black on mouse out
      >
        Get Tourist Data for Selected Month
      </button>

      <button
        onClick={fetchAllTourists}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          color: "#fff",
          backgroundColor: "#000", // Black background
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#333")} // Dark gray on hover
        onMouseOut={(e) => (e.target.style.backgroundColor = "#000")} // Black on mouse out
        >
        View All Tourists
      </button>

      {error && (
        <div
          style={{
            color: "#e74c3c",
            backgroundColor: "#fdecea",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      {totalTourists !== null && (
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#f0f9ff",
            marginBottom: "15px",
            textAlign: "center",
            color: "#007bff",
          }}
        >
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>
            Total Tourists for Month {month}
          </h2>
          {totalTourists > 0 ? (
            <p style={{ fontSize: "14px" }}>
              🎉 {totalTourists} tourists have used the itineraries in this
              month.
            </p>
          ) : (
            <p style={{ fontSize: "14px", color: "#e74c3c" }}>
              ⚠️ No tourists came to this activity this month.
            </p>
          )}
        </div>
      )}

      {allTourists !== null && (
        <div
          style={{
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#e8f5e9",
            textAlign: "center",
            color: "#28a745",
          }}
        >
          <h2 style={{ fontSize: "16px", marginBottom: "10px" }}>
            Total Tourists Across All Months
          </h2>
          <p style={{ fontSize: "14px" }}>
            🌍 {allTourists} tourists have used the itineraries across all
            months.
          </p>
        </div>
      )}
    </div>
  );
};

export default TotalTouristsReport;


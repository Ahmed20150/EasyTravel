import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
const CreateComplaint = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [touristId, setTouristId] = useState(""); // Assuming touristId is available
  const [message, setMessage] = useState("");
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const username = cookies.username; // Access the username


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/complaint/create", {
        title,
        body,
        username: username, // Replace with the actual tourist ID
      });

      setMessage(response.data.message);
      setTitle("");
      setBody("");
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
          <Link to="/home"><button>Back</button></Link>
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="title" style={{ display: "block", marginBottom: "5px" }}>
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="body" style={{ display: "block", marginBottom: "5px" }}>
            Problem Description:
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              minHeight: "100px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit Complaint
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "4px",
            color: "white",
            backgroundColor: message.toLowerCase().includes("error")
              ? "#f44336"
              : "#4CAF50",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateComplaint;

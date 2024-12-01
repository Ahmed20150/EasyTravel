import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To access the complaint id from the URL
import { Link } from 'react-router-dom';

const ComplaintDetails = () => {
  const { complaintId } = useParams(); // Get the complaintId from the URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState(""); // State to hold the reply
  const [submitError, setSubmitError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/complaint/${complaintId}`);
        setComplaint(response.data); // Assuming the response contains a single complaint object
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch complaint details.");
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [complaintId]);

  // Handle reply input change
  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  // Handle submit reply
  const handleSubmitReply = async () => {
    if (!reply.trim()) {
      setSubmitError("Reply cannot be empty.");
      setSuccessMessage("");
      return;
    }
    try {
      const updatedComplaint = {
        ...complaint,
        reply: reply.trim(), // Add the reply to the complaint object
      };
      await axios.put(`http://localhost:3000/complaint/reply/${complaintId}`, updatedComplaint);
      setComplaint(updatedComplaint); // Update the complaint state with the reply
      setReply(""); // Clear the reply input
      setSubmitError(""); // Clear any previous submit errors
      setSuccessMessage("Reply added successfully!"); // Set the success message
    } catch (err) {
      setSubmitError("Failed to submit reply.");
    }
  };

  // Handle status toggle (Pending/Resolved)
  const handleStatusToggle = async () => {
    const newStatus = complaint.status === "pending" ? "resolved" : "pending";
    try {
      const updatedComplaint = { ...complaint, status: newStatus };
      await axios.put(`http://localhost:3000/complaint/status/${complaintId}`, updatedComplaint);
      setComplaint(updatedComplaint); // Update the complaint state with the new status
    } catch (err) {
      setStatusError("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ fontSize: "1.5rem", color: "#555" }}>Loading complaint details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ fontSize: "1.2rem", color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>No complaint found.</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "900px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <Link to="/complaint/view"><button>Back</button></Link>
      <h2 style={{ fontSize: "2rem", color: "#333", textAlign: "center", marginBottom: "20px" }}>
        Complaint Details
      </h2>

      <div style={{ marginBottom: "15px" }}>
        <strong style={{ fontWeight: "600", color: "#555", display: "block", marginBottom: "5px" }}>
          Title:
        </strong>
        <p style={{ fontSize: "1rem", color: "#333", margin: 0 }}>
          {complaint.title}
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <strong style={{ fontWeight: "600", color: "#555", display: "block", marginBottom: "5px" }}>
          Date Issued:
        </strong>
        <p style={{ fontSize: "1rem", color: "#333", margin: 0 }}>
          {new Date(complaint.dateIssued).toLocaleDateString()}
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <strong style={{ fontWeight: "600", color: "#555", display: "block", marginBottom: "5px" }}>
          Status:
        </strong>
        <p style={{
          fontSize: "1rem", 
          color: complaint.status === "Pending" ? "orange" : "green",
          fontWeight: "bold"
        }}>
          {complaint.status}
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <strong style={{ fontWeight: "600", color: "#555", display: "block", marginBottom: "5px" }}>
          Description:
        </strong>
        <p style={{ fontSize: "1rem", color: "#333", margin: 0 }}>
          {complaint.body}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong style={{ fontWeight: "600", color: "#555", display: "block", marginBottom: "5px" }}>
          Reply:
        </strong>
        <textarea
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            resize: "vertical",
          }}
          value={reply}
          onChange={handleReplyChange}
        />
        <button
          onClick={handleSubmitReply}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Submit Reply
        </button>
        {submitError && <p style={{ color: "red", marginTop: "10px" }}>{submitError}</p>}
        {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleStatusToggle}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            marginRight: "10px",
          }}
        >
          Mark as {complaint.status === "pending" ? "Resolved" : "Pending"}
        </button>
        {statusError && <p style={{ color: "red", marginTop: "10px" }}>{statusError}</p>}
      </div>
    </div>
  );
};

export default ComplaintDetails;

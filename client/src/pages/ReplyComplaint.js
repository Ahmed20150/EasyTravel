import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To access the complaint id from the URL
import { Link } from 'react-router-dom';
import { buttonStyle, cardStyle ,navbarStyle } from "../styles/AbdallahStyles"; 
import { Navbar, Button, Card, Footer } from "flowbite-react";
import HomeBanner from "../components/HomeBanner";
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
    <div>
      <HomeBanner />
      
      {/* Back Button */}
      <Link to="/complaint/view">
        <Button
        style={{ position: 'absolute', top: '30px', left: '10px' }}
        className={buttonStyle}
       >
          Back
        </Button>
      </Link>

      <div 
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          marginTop: "200px"
        }}
      >
        <div className="flex flex-col items-center justify-center">

          {/* Complaint Title */}
          <h2 className="text-5xl font-bold mb-8 text-center text-gray-800">Complaint Details</h2>

          {/* Title Section */}
          <div style={{ marginBottom: "20px", width: "100%" }}>
            <strong className="text-gray-800 text-3xl">Title:</strong>
            <p className="text-gray-800 text-2xl mt-2">{complaint.title}</p>
          </div>

          {/* Date Issued Section */}
          <div style={{ marginBottom: "20px", width: "100%" }}>
            <strong  className="text-gray-800 text-3xl">Date Issued:</strong>
            <p className="text-gray-800 text-2xl mt-2">
              {new Date(complaint.dateIssued).toLocaleDateString()}
            </p>
          </div>

          {/* Status Section */}
          <div style={{ marginBottom: "20px", width: "100%" }}>
            <strong  className="text-gray-800 text-3xl">Status:</strong>
            <p className={`text-2xl mt-2 font-semibold ${complaint.status === "Pending" ? "text-orange-600" : "text-green-600"}`}>
              {complaint.status}
            </p>
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: "20px", width: "100%" }}>
            <strong  className="text-gray-800 text-3xl">Description:</strong>
            <p className="text-gray-800 text-2xl mt-2">{complaint.body}</p>
          </div>

          {/* Reply Section */}
          <div style={{ marginBottom: "30px", width: "100%" }}>
            <strong  className="text-gray-800 text-3xl">Reply:</strong>
            <textarea
              style={{
                width: "100%",
                height: "120px",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginTop: "10px",
                resize: "vertical",
              }}
              value={reply}
              onChange={handleReplyChange}
            />
            <Button
              onClick={handleSubmitReply}
              // style={{
              //   padding: "12px 25px",
              //   backgroundColor: "#4CAF50",
              //   color: "white",
              //   border: "none",
              //   borderRadius: "5px",
              //   cursor: "pointer",
              //   fontSize: "1rem",
              //   marginTop: "10px"
              // }}
              className={buttonStyle}
            >
              Submit Reply
            </Button>
            {submitError && <p style={{ color: "red", marginTop: "10px" }}>{submitError}</p>}
            {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
          </div>

          {/* Status Toggle Section */}
          <div style={{ marginTop: "30px", width: "100%" }}>
            <Button
              onClick={handleStatusToggle}
              // style={{
              //   padding: "12px 25px",
              //   backgroundColor: "#007BFF",
              //   color: "white",
              //   border: "none",
              //   borderRadius: "5px",
              //   cursor: "pointer",
              //   fontSize: "1rem",
              //   marginRight: "15px",
              // }}
              className={buttonStyle}
            >
              Mark as {complaint.status === "pending" ? "Resolved" : "Pending"}
            </Button>
            {statusError && <p style={{ color: "red", marginTop: "10px" }}>{statusError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const username = cookies.username; // Access the username
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!username) {
        setError("Username is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/complaint/view/${username}`);

        if (response.data && Array.isArray(response.data.complaints)) {
          setComplaints(response.data.complaints); // Make sure complaints is an array
        } else {
          setError("No complaints found for this tourist.");
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch complaints.");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [username]);

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (complaints.length === 0) {
    return <p>No complaints found.</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
          <Link to="/home"><button>Back</button></Link>
      <h2>My Complaints</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Title</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Description</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Date Issued</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Status</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>Reply</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint._id}>
              <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                {complaint.title}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                {complaint.body}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                {new Date(complaint.dateIssued).toLocaleDateString()}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                {complaint.status}
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                {complaint.reply}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyComplaints;

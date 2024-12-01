import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'resolved'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:3000/complaint/view");
        setComplaints(response.data);
        setFilteredComplaints(response.data); // Initialize filtered complaints with all complaints
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch complaints.");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on the selected status
  useEffect(() => {
    let filtered = complaints;

    if (statusFilter !== "all") {
      filtered = complaints.filter((complaint) => complaint.status === statusFilter);
    }

    // Sort complaints by dateIssued based on the sortOrder
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.dateIssued);
      const dateB = new Date(b.dateIssued);
      if (sortOrder === "asc") {
        return dateA - dateB; // Ascending order
      } else {
        return dateB - dateA; // Descending order
      }
    });

    setFilteredComplaints(filtered);
  }, [statusFilter, complaints, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
          <Link to="/home"><button>Back</button></Link>
      <h2>All Complaints</h2>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="status-filter" style={{ marginRight: "10px" }}>
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Sort Button */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleSortToggle}>
          Sort by {sortOrder === "asc" ? "Older" : "Newer"} Date
        </button>
      </div>

      {loading ? (
        <p>Loading complaints...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : filteredComplaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
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
              <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>
                Title
              </th>
              <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>
                Date Issued
              </th>
              <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}>
                Status
              </th>
              <th style={{ borderBottom: "2px solid #ddd", padding: "10px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint._id}>
                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                  {complaint.title}
                </td>
                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                  {new Date(complaint.dateIssued).toLocaleDateString()}
                </td>
                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                  {complaint.status}
                </td>
                <td style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                  <Link to={`/complaint/reply/${complaint._id}`}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewComplaints;

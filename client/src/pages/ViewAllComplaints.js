import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react";
import HomeBanner from "../components/HomeBanner";
import { buttonStyle, cardStyle ,navbarStyle } from "../styles/AbdallahStyles"; 
import { Navbar, Button, Card, Footer } from "flowbite-react";



const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:3000/complaint/view");
        setComplaints(response.data);
        setFilteredComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch complaints.");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    let filtered = complaints;

    if (statusFilter !== "all") {
      filtered = complaints.filter((complaint) => complaint.status === statusFilter);
    }

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.dateIssued);
      const dateB = new Date(b.dateIssued);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredComplaints(filtered);
  }, [statusFilter, complaints, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (

    <div>
      
      <HomeBanner />
    
      <Link to="/home">
      <Button
               style={{ position: 'absolute', top: '30px', left: '10px' }}
               className={buttonStyle}
               >Back</Button>
      </Link>
      <div className="flex flex-col items-center justify-center mt-8">
      <h2 className="text-4xl font-bold mb-8 flex justify-center ">All Complaints</h2>
      
      <div className="text-2xl  mb-8 ">
        <label htmlFor="status-filter" className="mr-2">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="mb-8">
        <Button
          className={buttonStyle}
          onClick={handleSortToggle}
          
        >
          Sort by {sortOrder === "asc" ? "Older" : "Newer"} Date
        </Button>
      </div>
      </div>

      {loading ? (
        <p>Loading complaints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredComplaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell className="text-gray-800 text-2xl mt-2">Title</Table.HeadCell>
              <Table.HeadCell className="text-gray-800 text-2xl mt-2">Date Issued</Table.HeadCell>
              <Table.HeadCell className="text-gray-800 text-2xl mt-2">Status</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Details</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredComplaints.map((complaint) => (
                <Table.Row key={complaint._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="text-gray-800 text-2xl mt-2">
                    {complaint.title}
                  </Table.Cell>
                  <Table.Cell className="text-gray-800 text-2xl mt-2">{new Date(complaint.dateIssued).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className="text-gray-800 text-2xl mt-2">{complaint.status}</Table.Cell>
                  <Table.Cell className="text-gray-800 text-2xl mt-2">
                    <Link
                      to={`/complaint/reply/${complaint._id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      View Details
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
    
  );
};

export default ViewComplaints;

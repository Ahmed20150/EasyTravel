import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react"; // Import Table from Flowbite
import GeneralNavbar from "../components/GeneralNavbar";
import HomeBanner from "../components/HomeBanner";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle } from "../styles/gasserStyles"; 
import { Navbar, Button, Card, Footer } from "flowbite-react";
const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cookies] = useCookies(["userType", "username"]);
  const username = cookies.username;

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
          setComplaints(response.data.complaints);
        } else {
          setError("No complaints found for this tourist.");
        }
        setLoading(false);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || err.response.data.message || "Failed to fetch complaints.");
        } else {
          setError("An unknown error occurred.");
        }
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [username]);

  return (
    <div>
      <HomeBanner />
      <Link to="/home">
            <Button
               style={{ position: 'absolute', top: '30px', left: '10px' }}
               className={buttonStyle}
               >Back</Button>
            </Link>
      <div className="overflow-x-auto p-4">
        {loading ? (
          <p>Loading complaints...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <>
           
            <h2 className="text-2xl font-bold mb-4">My Complaints</h2>
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Date Issued</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Reply</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {complaints.map((complaint) => (
                  <Table.Row
                    key={complaint._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {complaint.title}
                    </Table.Cell>
                    <Table.Cell>{complaint.body}</Table.Cell>
                    <Table.Cell>
                      {new Date(complaint.dateIssued).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{complaint.status}</Table.Cell>
                    <Table.Cell>{complaint.reply}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;

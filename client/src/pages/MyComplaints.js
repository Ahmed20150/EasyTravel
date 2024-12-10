import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { Button, Card, Input, Label, Select, Checkbox, Modal, TextInput, Blockquote, Table } from "flowbite-react";// import "./AddcomplaintPage.css";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle , centerContent} from "../styles/gasserStyles"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        // Handle different error responses based on status code
        if (err.response) {
          // This will display the error message returned from the backend
          setError(err.response.data.error || err.response.data.message || "Failed to fetch complaints.");
        } else {
          setError("An unknown error occurred.");
        }
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
 <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">My Complaints</h1>
      </div>


      <figure className="mx-auto max-w-screen-md text-center mb-5">
      <svg
        className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 14"
      >
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
      </svg>
      <Blockquote>
        <p className="text-2xl font-medium italic text-gray-900 dark:text-white">
          "At EasyTravel, Your feedback is highly appreciated and valued, and we Thank you for taking time to give us your thoughts about our website and service. If your status still pending, dont worry, it usually takes admins about 3-5 business days to handle complaints. So please be patient and we will get back to you as soon as possible."
        </p>
      </Blockquote>
      <figcaption className="mt-6 flex items-center justify-center space-x-3">
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <cite className="pr-3 font-medium text-gray-900 dark:text-white">Customer Service Department</cite>
          <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">EasyTravel</cite>
        </div>
      </figcaption>
    </figure>


          <Link to="/home"><button>Back</button></Link>
          {complaints.map((complaint) => (
<>

<Table>
        <Table.Head>
          <Table.HeadCell>Complaint Title</Table.HeadCell>
          <Table.HeadCell>Complaint Body</Table.HeadCell>
          <Table.HeadCell>Date Issued</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Reply</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {complaint.title}
            </Table.Cell>
            <Table.Cell>{complaint.body}</Table.Cell>
            <Table.Cell> {new Date(complaint.dateIssued).toLocaleDateString()}</Table.Cell>
            <Table.Cell>{complaint.status}</Table.Cell>
            <Table.Cell>{complaint.status === 'pending' ? 'Reply is pending...' : complaint.reply}</Table.Cell>
           
          </Table.Row>
        </Table.Body>
      </Table>
            </>

          ))}
    </div>
  );
};

export default MyComplaints;

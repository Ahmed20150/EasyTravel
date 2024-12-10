import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { Navbar, Button, Card, Footer, Blockquote } from "flowbite-react";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle, homeCardContainer, flexRowContainer, flexRowItem } from "../styles/gasserStyles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

      toast.success(response.data.message);
      setTitle("");
      setBody("");
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
          <Link to="/home"><button>Back</button></Link>
          <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">File a Complaint</h1>
      </div> 

        <div className="flex flex-col items-center text-2xl  mb-8 mt-10">

        <figure className="mx-auto max-w-screen-md text-center mb-10">
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
          "Our support Team will respond to your request as soon as possible, please stay patient!"
        </p>
      </Blockquote>
      <figcaption className="mt-6 flex items-center justify-center space-x-3">
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <cite className="pr-3 font-medium text-gray-900 dark:text-white">Human Relations Department</cite>
          <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">EasyTravel</cite>
        </div>
      </figcaption>
    </figure>        </div>       
      <div className="w-full max-w-md bg-white border border-gray-300 shadow-lg p-6 rounded">
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
        <Button
          type="submit"
          className={buttonStyle}
          style={{
            display: "block",
            margin: "0 auto",
          }}
        >
          Submit Complaint
        </Button>
      </form>
      </div>
      <ToastContainer/>
      {/* {message && (
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
      )} */}
    </div>
  );
};

export default CreateComplaint;

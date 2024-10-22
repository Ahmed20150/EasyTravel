// src/components/Itineraries/ItineraryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem"; // Import the ItineraryItem component
import { useNavigate, Link } from "react-router-dom";
import "../css/ItineraryList.css"; // Import the CSS file
import { useCookies } from "react-cookie";

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [cookies] = useCookies(["username", "userType"]);
  const username = cookies.username;
  const userType = cookies.userType; // Access the userType
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/itinerary"); // Replace with your API endpoint

        // Filter itineraries where the creator matches the username in the cookies
        const filteredItineraries = response.data.filter(
          (itinerary) => itinerary.creator === username
        );
        setItineraries(filteredItineraries); // Store the filtered itineraries in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      // Fetch itineraries only if username is available
      fetchItineraries();
    }
  }, [username]);

  const handleDelete = async (id) => {
    try {
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${id}`
      );
      if (itinerary.data.touristsBooked.length == 0) {
        await axios.delete(`http://localhost:3000/itinerary/${id}`); // Make sure to update the endpoint
        setItineraries(itineraries.filter((itinerary) => itinerary._id !== id)); // Update the state
      } else {
        alert(
          `Cannot delete an itinerary with ${itinerary.data.touristsBooked.length} bookings `
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    localStorage.clear();
    navigate(`/itinerary/edit/${id}`);
  };
  const handleCreate = () => {
    navigate(`/itinerary/create`);
  };

  if (loading) {
    return <p>Loading itineraries...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Itineraries</h1>
      <div className="button-container">
        <button className="create-button" onClick={() => handleCreate()}>
          Create New Itinerary
        </button>
        <Link to="/home">
          <button>Back</button>
        </Link>
      </div>
      <div className="itinerary-list">
        {itineraries.map((itinerary) => (
          <ItineraryItem
            key={itinerary._id}
            itinerary={itinerary}
            onDelete={handleDelete}
            onEdit={handleEdit}
            userType={userType}
          />
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;

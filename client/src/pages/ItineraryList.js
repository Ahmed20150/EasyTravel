// src/components/Itineraries/ItineraryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem"; // Import the ItineraryItem component
import { useNavigate, Link } from "react-router-dom";
import "../css/ItineraryList.css"; // Import the CSS file

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/itinerary"); // Replace with your API endpoint
        setItineraries(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/itinerary/${id}`); // Make sure to update the endpoint
      setItineraries(itineraries.filter((itinerary) => itinerary._id !== id)); // Update the state
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
          Create New Activity
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
          />
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;

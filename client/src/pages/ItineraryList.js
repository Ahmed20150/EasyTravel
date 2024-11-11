import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem";
import { useNavigate, Link } from "react-router-dom";
import "../css/ItineraryList.css";
import { useCookies } from "react-cookie";

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["username", "userType"]);
  const username = cookies.username;
  const userType = cookies.userType;

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/itinerary");
        const filteredItineraries = userType === "admin"
          ? response.data
          : response.data.filter((itinerary) => itinerary.creator === username);

        setItineraries(filteredItineraries);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      if (userType === "tourGuide") {
        try {
          const response = await axios.get(`http://localhost:3000/itinerary/notifications/${username}`);
          setNotifications(response.data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error.message);
        }
      }
    };

    if (username) {
      fetchItineraries();
      fetchNotifications(); // Fetch notifications only if userType is "tourGuide"
    }
  }, [username, userType]);

  const handleDelete = async (id) => {
    try {
      const itinerary = await axios.get(`http://localhost:3000/itinerary/${id}`);
      if (itinerary.data.touristsBooked.length === 0) {
        await axios.delete(`http://localhost:3000/itinerary/${id}`);
        setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
      } else {
        alert(`Cannot delete an itinerary with ${itinerary.data.touristsBooked.length} bookings.`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActivation = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/itinerary/toggleActivation/${id}`);
      setItineraries(
        itineraries.map((itinerary) =>
          itinerary._id === id
            ? { ...itinerary, activated: !itinerary.activated }
            : itinerary
        )
      );
    } catch (error) {
      console.error("Error toggling activation:", error);
      alert("Failed to toggle activation. Please try again.");
    }
  };

  const handleEdit = (id) => {
    localStorage.clear();
    navigate(`/itinerary/edit/${id}`);
  };

  const handleCreate = () => {
    navigate(`/itinerary/create`);
  };

  const handleFlag = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3000/itinerary/${id}/flag`);
      setItineraries(
        itineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, flagged: "yes" } : itinerary
        )
      );
      alert(`Itinerary flagged successfully: ${response.data.message}`);
    } catch (error) {
      console.error("Error flagging itinerary:", error);
      alert("Failed to flag the itinerary.");
    }
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
      {userType === "tourGuide" && notifications.length > 0 && (
        <div className="notifications">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="button-container">
        {userType !== "admin" && (
          <button className="create-button" onClick={handleCreate}>
            Create New Itinerary
          </button>
        )}
        <Link to="/home">
          <button>Back</button>
        </Link>
      </div>
      <div className="itinerary-list">
        {itineraries.map((itinerary) => (
          <div key={itinerary._id} className="itinerary-item-container">
            <ItineraryItem
              itinerary={itinerary}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onActivationToggle={handleToggleActivation}
              userType={userType}
            />
            {userType === "admin" && (
              <div className="admin-actions">
                <p>Created by: {itinerary.creator}</p>
                <p>Flagged: {itinerary.flagged}</p>
                <button
                  className="flag-button"
                  onClick={() => handleFlag(itinerary._id)}
                >
                  Flag
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;

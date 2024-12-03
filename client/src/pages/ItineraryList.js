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
  const [creatorEmails, setCreatorEmails] = useState({}); // State for storing emails by creator username
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

        // Fetch emails for each unique creator if userType is "admin"
        if (userType === "admin") {
          const creatorUsernames = [...new Set(filteredItineraries.map(itinerary => itinerary.creator))];
          const emailPromises = creatorUsernames.map(async (creator) => {
            try {
              const response = await axios.get(`http://localhost:3000/api/email/${creator}`);
              return { [creator]: response.data.email };
            } catch (error) {
              console.error(`Error fetching email for ${creator}:`, error);
              return { [creator]: "Not available" };
            }
          });

          const emails = await Promise.all(emailPromises);
          setCreatorEmails(Object.assign({}, ...emails));
        }
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
    localStorage.clear();
    navigate(`/itinerary/edit/${id}`);
  };

  const handleCreate = () => {
    navigate(`/itinerary/create`);
  };

  // Function to send a notification email to the creator
  const sendNotificationEmail = async (creator) => {
    const email = creatorEmails[creator];
    const message = `Your itinerary has been flagged as inappropriate. Please review the details and take necessary actions.`;

    if (email) {
      try {
        await axios.post("http://localhost:3000/itinerary/sendNotification", {
          email,
          text: message,
        });
        alert("Notification email sent successfully.");
      } catch (error) {
        console.error("Error sending notification email:", error);
        alert("Failed to send notification email.");
      }
    } else {
      alert("Creator's email not available.");
    }
  };

  const handleFlag = async (id, creator) => {
    try {
      const response = await axios.patch(`http://localhost:3000/itinerary/${id}/flag`);
      setItineraries(
        itineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, flagged: "yes" } : itinerary
        )
      );
      alert("Itinerary flagged successfully");

      // Call the function to send the email notification to the creator
      await sendNotificationEmail(creator);
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
                <p>Email: {creatorEmails[itinerary.creator] || "Not available"}</p>
                <p>Flagged: {itinerary.flagged}</p>
                <button
                  className="flag-button"
                  onClick={() => handleFlag(itinerary._id, itinerary.creator)}
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
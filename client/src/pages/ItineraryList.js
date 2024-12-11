import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem";
import { useNavigate, Link } from "react-router-dom";
// import "../css/ItineraryList.css";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import {
  cardStyle,
  buttonStyle,
  walletSectionStyle,
  itineraryListStyle,
  promoCodeListStyle,
  userLevelBadge,
  fadeIn
} from "../styles/AmrStyles"; // Import styles
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
        const response = await axios.get("http://localhost:3000/itineraries");
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
          const response = await axios.get(`http://localhost:3000/itineraries/notifications/${username}`);
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
      const itinerary = await axios.get(`http://localhost:3000/itineraries/${id}`);
      if (itinerary.data.touristsBooked.length === 0) {
        await axios.delete(`http://localhost:3000/itineraries/${id}`);
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
      const response = await axios.put(`http://localhost:3000/itineraries/toggleActivation/${id}`);
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
        await axios.post("http://localhost:3000/itineraries/sendNotification", {
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
      const response = await axios.patch(`http://localhost:3000/itineraries/${id}/flag`);
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
    <div className={`relative flex flex-col items-center h-screen bg-gray-100 ${fadeIn} p-6 overflow-auto`}>
      <button
        className={`${buttonStyle} absolute top-4 left-4 py-2 px-4 rounded-lg`}
        onClick={() => navigate('/home')}
      >
        Back to Home Page
      </button>
      <form className="w-full max-w-6xl p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Itineraries</h1>
  
        {/* Notifications */}
        {userType === "tourGuide" && notifications.length > 0 && (
          <div className="notifications mb-6 p-4 bg-white shadow-lg rounded-lg">
            <div className="notifications-header flex justify-between items-center mb-4">
              <h2 className="text-xl">Notifications</h2>
            </div>
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification._id} className="text-lg">{notification.message}</li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Create New Itinerary Button */}
        <div className="button-container mb-6 flex justify-center">
          {userType !== "admin" && (
            <Button
              className={`${buttonStyle} w-100 py-3 text-lg rounded-lg`}
              onClick={handleCreate}
            >
              Create New Itinerary
            </Button>
          )}
        </div>
  
        {/* Itinerary List */}
        <div className="itinerary-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary._id} className="p-6 shadow-lg rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{itinerary.name}</h3>
                <span
                  className={`badge ${
                    itinerary.activated ? 'bg-green-500' : 'bg-gray-500'
                  } text-white py-1 px-3 rounded`}
                >
                  {itinerary.activated ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-gray-700 mb-4">
                <p>
                  <strong>Creator:</strong> {itinerary.creator}
                </p>
                <p>
                  <strong>Details:</strong>
                </p>
                <p>- Timeline: {itinerary.timeline}</p>
                <p>- Language: {itinerary.languageOfTour}</p>
                <p>- Price: {itinerary.priceOfTour}</p>
              </div>
  
              {/* Admin Actions */}
              {userType === 'admin' && (
                <div className="admin-actions space-y-4">
                  <p>Email: {creatorEmails[itinerary.creator] || 'Not available'}</p>
                  <p>Flagged: {itinerary.flagged}</p>
                  <Button
                    className="flag-button bg-red-500 text-white"
                    onClick={() => handleFlag(itinerary._id, itinerary.creator)}
                  >
                    Flag
                  </Button>
                </div>
              )}
  
              {/* User Actions */}
              <div className="flex space-x-4 mt-6">
                <Button
                  className={`${buttonStyle} w-40 py-3 text-lg rounded-lg`}
                  onClick={() => handleEdit(itinerary._id)}
                >
                  Edit
                </Button>
                <Button
                  className={`${buttonStyle} w-40 py-3 text-lg rounded-lg`}
                  onClick={() => handleDelete(itinerary._id)}
                >
                  Delete
                </Button>
                <Button
                  className={`${buttonStyle} w-40 py-3 text-lg rounded-lg`}
                  onClick={() => handleToggleActivation(itinerary._id)}
                >
                  {itinerary.activated ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </form>
    </div>
  );
};
  
  export default ItineraryList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem";
import { useNavigate, Link } from "react-router-dom";
// import "../css/ItineraryList.css";
import { useCookies } from "react-cookie";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { buttonStyle, buttonStyle2 ,cardStyle ,navbarStyle } from "../styles/AbdallahStyles"; 
import { Navbar, Button, Card, Footer } from "flowbite-react";
import HomeBanner from "../components/HomeBanner";


const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorEmails, setCreatorEmails] = useState({});
  const navigate = useNavigate();
  const [cookies] = useCookies(["username", "userType"]);
  const username = cookies.username;
  const userType = cookies.userType;

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/itinerary");
        const filteredItineraries =
          userType === "admin"
            ? response.data
            : response.data.filter((itinerary) => itinerary.creator === username);

        setItineraries(filteredItineraries);

        if (userType === "admin") {
          const creatorUsernames = [
            ...new Set(filteredItineraries.map((itinerary) => itinerary.creator)),
          ];
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
          const response = await axios.get(
            `http://localhost:3000/itinerary/notifications/${username}`
          );
          setNotifications(response.data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error.message);
        }
      }
    };

    if (username) {
      fetchItineraries();
      fetchNotifications();
    }
  }, [username, userType]);

  if (loading) {
    return (
      <div>
      <HomeBanner />
    
       <p className="text-4xl font-bold mb-8 mt-8 flex justify-center ">Loading itineraries...</p>
      </div> 

    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <HomeBanner />

      <Link to="/home">
      <Button
               style={{ position: 'absolute', top: '30px', left: '10px' }}
               className={buttonStyle}
               >Back</Button>
      </Link> 
      <h1 className="text-4xl font-bold mb-8 mt-8 flex justify-center ">Itineraries</h1>

      {userType === "tourGuide" && notifications.length > 0 && (
        <div>
          {showNotifications ? (
            <div className="notifications">
              <div className="notifications-header">
                <h2>Your Notifications</h2>
                <button
                  className="close-button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close Notifications"
                >
                  &times;
                </button>
              </div>
              <ul>
                {notifications.map((notification) => (
                  <li key={notification._id}>{notification.message}</li>
                ))}
              </ul>
            </div>
          ) : (
            <button
              className="show-notifications-button"
              onClick={() => setShowNotifications(true)}
            >
              <NotificationsIcon />
            </button>
          )}
        </div>
      )}

      <div className="button-container">
        {userType !== "admin" && (
          <button className="create-button" onClick={() => navigate(`/itinerary/create`)}>
            Create New Itinerary
          </button>
        )}

      </div>

      <div className="itinerary-list">
        {itineraries.map((itinerary) => (
          <Card href="#" className="h-99 w-99 text-2xl mb-8" key={itinerary._id}>
            <ItineraryItem
              itinerary={itinerary}
              onDelete={(id) =>
                setItineraries(itineraries.filter((it) => it._id !== id))
              }
              onEdit={(id) => navigate(`/itinerary/edit/${id}`)}
              onActivationToggle={(id) =>
                setItineraries(
                  itineraries.map((it) =>
                    it._id === id ? { ...it, activated: !it.activated } : it
                  )
                )
              }
              userType={userType}
            />
            {userType === "admin" && (
              <div className="admin-actions">
                <p>Created by: {itinerary.creator}</p>
                <p>Email: {creatorEmails[itinerary.creator] || "Not available"}</p>
                <p className="mb-8">Flagged: {itinerary.flagged}</p>
                <Button
                  
                  className={buttonStyle}
                  onClick={() => {
                    setItineraries(
                      itineraries.map((it) =>
                        it._id === itinerary._id ? { ...it, flagged: "yes" } : it
                      )
                    );
                  }}
                >
                  Flag
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;

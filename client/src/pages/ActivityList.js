import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import "../css/ActivityLists.css";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["username", "userType"]);

  const username = cookies.username;
  const userType = cookies.userType;

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/activities");

      const filteredActivities = userType === 'admin'
        ? response.data
        : response.data.filter((activity) => activity.creator === username);

      if (userType === 'admin') {
        const activitiesWithEmails = await Promise.all(filteredActivities.map(async (activity) => {
          try {
            const emailResponse = await axios.get(`http://localhost:3000/advertiser/emailAdv/${activity.creator}`);
            return { ...activity, creatorEmail: emailResponse.data.email };
          } catch (error) {
            console.error(`Error fetching email for creator ${activity.creator}:`, error);
            return activity;
          }
        }));

        setActivities(activitiesWithEmails);
      } else {
        setActivities(filteredActivities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (userType !== 'admin' && username) {
        const response = await axios.get(`http://localhost:3000/notifications/${username}`);
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userType === 'admin') {
      fetchActivities();
    } else if (username) {
      fetchActivities();
      fetchNotifications();
    }
  }, [username, userType]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/activities/${id}`);
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/activities/edit/${id}`);
  };

  const handleCreate = () => {
    navigate(`/activities/create`);
  };

  // New function to send email notification to the creator
  const sendFlagNotification = async (creatorEmail, category) => {
    try {
      await axios.post("http://localhost:3000/api/send/send-notification", {
        email: creatorEmail,
        text: `Your activity "${category}" has been flagged as inappropriate.`,
      });
      alert("Notification email sent to creator.");
    } catch (error) {
      console.error("Error sending notification email:", error);
      alert("Failed to send notification email. Please try again.");
    }
  };

  const handleFlag = async (id, creatorEmail, category) => {
    try {
      await axios.patch(`http://localhost:3000/activities/${id}`, {
        flagged: "yes",
      });

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id ? { ...activity, flagged: "yes" } : activity
        )
      );

      alert("Activity has been successfully flagged!");
      sendFlagNotification(creatorEmail, category);  // Send email to creator
    } catch (error) {
      console.error("Error flagging activity:", error);
      alert("Failed to flag activity. Please try again.");
    }
  };

  return (
    <div className="activity-list">
      <h1>Activities</h1>

      {userType !== 'admin' && notifications.length > 0 && (
        <div className="notifications">
          <h2>Your Notifications</h2>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <p>{notification.message}</p>
                <p><small>{new Date(notification.timestamp).toLocaleString()}</small></p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="button-container">
        {userType !== 'admin' && (
          <button className="create-button" onClick={handleCreate}>
            Create New Activity
          </button>
        )}
        <Link to="/home">
          <button>Back</button>
        </Link>
      </div>

      <div className="card-container">
        {activities.map((activity) => (
          <div className="card" key={activity._id}>
            <h3 className="activity-category">{activity.category}</h3>
            <p className="activity-location">{activity.location?.address}</p>
            <p className="activity-price">
              Price: <span className="price-min">${activity.price?.min}</span> -{" "}
              <span className="price-max">${activity.price?.max}</span>
            </p>

            {userType === 'admin' && (
              <div className="activity-details">
                <p className="activity-creator">Creator: {activity.creator}</p>
                <p className="activity-creator-email">Email: {activity.creatorEmail || "Not available"}</p>
                <p className="activity-flagged">Flagged: {activity.flagged}</p>
              </div>
            )}

            <div className="button-group">
              <button
                className="edit-button"
                onClick={() => handleEdit(activity._id)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(activity._id)}
              >
                Delete
              </button>

              {userType === 'admin' && (
                <button
                  className="flag-button"
                  style={{ backgroundColor: "purple", color: "white" }}
                  onClick={() => handleFlag(activity._id, activity.creatorEmail, activity.category)}  // Pass category for the notification message
                >
                  Flag
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLists;

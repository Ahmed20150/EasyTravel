import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import "../css/ActivityLists.css";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]); // State to hold activities
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [cookies] = useCookies(["username", "userType"]);

  const username = cookies.username; // Access the username from cookies
  const userType = cookies.userType; // Access the userType

  // Fetch activities based on user type
  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/activities");

      const filteredActivities = userType === 'admin'
        ? response.data // Admins see all activities
        : response.data.filter((activity) => activity.creator === username); // Filtered for regular users

      // Fetch email for each creator in activities if user is admin
      if (userType === 'admin') {
        const activitiesWithEmails = await Promise.all(filteredActivities.map(async (activity) => {
          try {
            const emailResponse = await axios.get(`http://localhost:3000/advertiser/emailAdv/${activity.creator}`);
            return { ...activity, creatorEmail: emailResponse.data.email }; // Add email to each activity
          } catch (error) {
            console.error(`Error fetching email for creator ${activity.creator}:`, error);
            return activity; // Return activity without email if fetch fails
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

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    try {
      if (userType !== 'admin' && username) {
        // Fetch notifications for the logged-in user
        const response = await axios.get(`http://localhost:3000/notifications/${username}`);
        setNotifications(response.data);  // Update state with the fetched notifications
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Call functions on mount or when username/userType changes
  useEffect(() => {
    if (userType === 'admin') {
      fetchActivities(); // Fetch all activities for admin
    } else if (username) {
      fetchActivities(); // Fetch user-specific activities
      fetchNotifications(); // Fetch notifications for the user
    }
  }, [username, userType]); // Depend on username and userType

  // Function to handle deletion of an activity
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

  const handleFlag = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/activities/${id}`, {
        flagged: "yes",  // Ensure the correct value 'yes' is being sent
      });

      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id ? { ...activity, flagged: "yes" } : activity
        )
      );

      alert("Activity has been successfully flagged!");
    } catch (error) {
      console.error("Error flagging activity:", error);
      alert("Failed to flag activity. Please try again.");
    }
  };

  return (
    <div className="activity-list">
      <h1>Activities</h1>

      {/* Display notifications for non-admin users */}
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
        {/* Hide Create button for admin */}
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

            {/* Show username and email if admin */}
            {userType === 'admin' && (
              <div className="activity-details">
                <p className="activity-creator">Creator: {activity.creator}</p>
                <p className="activity-creator-email">Email: {activity.creatorEmail || "Not available"}</p> {/* Display creator's email here */}
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

              {/* Add Flag button for admin */}
              {userType === 'admin' && (
                <button
                  className="flag-button"
                  style={{ backgroundColor: "purple", color: "white" }}
                  onClick={() => handleFlag(activity._id)}
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

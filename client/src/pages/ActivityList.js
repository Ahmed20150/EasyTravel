import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import NotificationsIcon from "@mui/icons-material/Notifications";
import * as styles from "../styles/HossStyles.js"; // Importing styles from HossStyles.js
import { buttonStyle } from "../styles/GeneralStyles.js"; // Importing buttonStyle from GeneralStyles.js

const ActivityLists = () => {
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true); // State to toggle visibility
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
    <div className={styles.pageContainer}> {/* Use the page container from HossStyles */}

    
      <h1 className={styles.header}>Activities</h1>

      {userType !== 'admin' && notifications.length > 0 && showNotifications && (
        <div className={styles.notificationContainer}>
          <div className={styles.notificationHeader}>
            <h2 className={styles.notificationTitle}>Your Notifications</h2>
            <button
              className={styles.closeButton}
              onClick={() => setShowNotifications(false)}
              aria-label="Close Notifications"
            >
              &times;
            </button>
          </div>
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

      {!showNotifications && notifications.length > 0 && (
        <button
          className={styles.showNotificationsButton}
          onClick={() => setShowNotifications(true)}
        >
          <NotificationsIcon />
        </button>
      )}

      <div className={styles.buttonContainer}>
        {userType !== 'admin' && (
          <button className={styles.giftFormButton} onClick={handleCreate}>
            Create New Activity
          </button>
        )}
        <Link to="/home">
          <button className={styles.giftFormButton}>Back</button>
        </Link>
      </div>

      <div className={styles.giftItemGrid}>
        {activities.map((activity) => (
          <div className={styles.cardBorderStyle} key={activity._id}> {/* Using the updated border style */}
          <h3 className={styles.activityCategory}>{activity.category}</h3>
            <p className={styles.activityLocation}>{activity.location?.address}</p>
            <p className={styles.activityPrice}>
              Price: <span className={styles.priceMin}>${activity.price?.min}</span> -{" "}
              <span className={styles.priceMax}>${activity.price?.max}</span>
            </p>

            {userType === 'admin' && (
              <div className={styles.activityDetails}>
                <p className={styles.activityCreator}>Creator: {activity.creator}</p>
                <p className={styles.activityCreatorEmail}>Email: {activity.creatorEmail || "Not available"}</p>
                <p className={styles.activityFlagged}>Flagged: {activity.flagged}</p>
              </div>
            )}

            <div className={styles.adminButtons}>
              <button
                className={styles.giftFormButton}
                onClick={() => handleEdit(activity._id)}
              >
                Edit
              </button>
              <button
                className={styles.giftFormButton}
                onClick={() => handleDelete(activity._id)}
              >
                Delete
              </button>

              {userType === 'admin' && (
                <button
                  className={styles.giftFormButton}
                  style={{ backgroundColor: "purple", color: "white" }}
                  onClick={() => handleFlag(activity._id, activity.creatorEmail, activity.category)}
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

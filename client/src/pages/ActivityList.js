import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import NotificationsIcon from "@mui/icons-material/Notifications"; // Import Notifications Icon
//import "../css/ActivityLists.css";
import { buttonStyle, buttonStyle2 ,cardStyle ,navbarStyle } from "../styles/AbdallahStyles"; 
import { Navbar, Button, Table ,Card, Footer } from "flowbite-react";
import HomeBanner from "../components/HomeBanner";
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

    
    <div className="activity-list">
      <HomeBanner />

      <Link to="/home">
      <Button
               style={{ position: 'absolute', top: '30px', left: '10px' }}
               className={buttonStyle}
               >Back</Button>
      </Link> 
      
      <div className="flex flex-col items-center justify-center mt-8">  
      
      
      <h1  className="text-4xl font-bold mb-8 mt-8 flex justify-center ">Activities</h1>

      {userType !== 'admin' && notifications.length > 0 && showNotifications && (
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
          className="show-notifications-button"
          onClick={() => setShowNotifications(true)}
        >
          <NotificationsIcon />
        </button>
      )}

      <div className="button-container">
        {userType !== 'admin' && (
          <button className="create-button" onClick={handleCreate}>
            Create New Activity
          </button>
        )}
        
      </div>
 </div>
  <div className="overflow-x-auto">    
  <Table striped>
    <Table.Head>
      <Table.HeadCell className="text-gray-800 text-xl mt-2">Category</Table.HeadCell>
      <Table.HeadCell className="text-gray-800 text-xl mt-2">Address</Table.HeadCell>
      <Table.HeadCell className="text-gray-800 text-xl mt-2">Price Range</Table.HeadCell>
      {userType === 'admin' && (
        <>
          <Table.HeadCell className="text-gray-800 text-xl mt-2">Creator</Table.HeadCell>
          <Table.HeadCell className="text-gray-800 text-xl mt-2">Email</Table.HeadCell>
          <Table.HeadCell className="text-gray-800 text-xl mt-2">Flagged</Table.HeadCell>
        </>
      )}
      <Table.HeadCell className="text-gray-800 text-xl mt-2">Actions</Table.HeadCell>
    </Table.Head>
    <Table.Body className="divide-y">
      {activities.map((activity) => (
        <Table.Row key={activity._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {activity.category}
          </Table.Cell>
          <Table.Cell>{activity.location?.address || "Not available"}</Table.Cell>
          <Table.Cell>
            ${activity.price?.min} - ${activity.price?.max}
          </Table.Cell>
          {userType === 'admin' && (
            <>
              <Table.Cell>{activity.creator}</Table.Cell>
              <Table.Cell>{activity.creatorEmail || "Not available"}</Table.Cell>
              <Table.Cell>{activity.flagged ? "Yes" : "No"}</Table.Cell>
            </>
          )}
          <Table.Cell>
            <div className="flex gap-2">
              <Button
                className={buttonStyle}
                onClick={() => handleEdit(activity._id)}
              >
                Edit
              </Button>
              <Button
                className={buttonStyle2}
                onClick={() => handleDelete(activity._id)}
              >
                Delete
              </Button>
              {userType === 'admin' && (
                <Button
                  className="flag-button"
                  style={{ backgroundColor: "purple", color: "white" }}
                  onClick={() => handleFlag(activity._id, activity.creatorEmail, activity.category)}
                >
                  Flag
                </Button>
              )}
            </div>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</div>

      
      </div>
     
    // </div>
  );
};

export default ActivityLists;

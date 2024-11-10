import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import "../css/ActivityLists.css";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]); // State to hold activities
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [cookies] = useCookies(["username"]);

  const username = cookies.username; // Access the username from cookies

  const fetchActivities = async (username) => {
    // Accept username as an argument
    try {
      const response = await axios.get("http://localhost:3000/activities");

      // Filter activities where the creator matches the username in the cookies
      const filteredActivities = response.data.filter(
        (activity) => activity.creator === username
      );

      setActivities(filteredActivities); // Store the filtered activities in state
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    if (username) {
      // Call fetchActivities only if username is available
      fetchActivities(username);
    }
  }, [username]); // Depend on username to refetch activities if it changes

  // Function to handle deletion of an activity
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/activities/${id}`); // Send delete request
      // Update state to remove the deleted activity
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity. Please try again."); // Inform user of the error
    }
  };

  const handleEdit = (id) => {
    navigate(`/activities/edit/${id}`);
  };
  const handleCreate = () => {
    navigate(`/activities/create`);
  };

  return (
    <div className="activity-list">
      <h1>Activities</h1>
      <div className="button-container">
        <button className="create-button" onClick={() => handleCreate()}>
          Create New Activity
        </button>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLists;

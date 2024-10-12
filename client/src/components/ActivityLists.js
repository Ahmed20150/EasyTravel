import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ActivityLists.css";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]); // State to hold activities

  useEffect(() => {
    fetchActivities(); // Fetch activities when the component mounts
  }, []);

  // Function to fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/activities"); // Make sure to use the full URL since backend is running on port 3500
      setActivities(response.data); // Store the activities in state
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Function to handle deletion of an activity
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/activities/${id}`); // Send delete request
      // Update state to remove the deleted activity
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div className="activity-list">
      <h1>Activities</h1>
      <div className="card-container">
        {activities.map((activity) => (
          <div className="card" key={activity._id}>
            <h3>{activity.category}</h3>
            <p>{activity.location?.address}</p>
            <p>
              Price: ${activity.price?.min} - ${activity.price?.max}
            </p>
            <button onClick={() => handleDelete(activity._id)}>Delete</button>{" "}
            {/* Delete button */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLists;

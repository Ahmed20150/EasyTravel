import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div>
      <h1>Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <h3>{activity.category}</h3>
            <p>{activity.location?.address}</p>
            <p>
              Price: ${activity.price?.min} - ${activity.price?.max}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLists;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("/api/activities");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`/api/activities/${id}`);
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div>
      <h1>Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <h3>{activity.category}</h3>
            <p>{activity.location.address}</p>
            <p>
              Price: ${activity.price.min} - ${activity.price.max}
            </p>
            <button onClick={() => deleteActivity(activity._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLists;

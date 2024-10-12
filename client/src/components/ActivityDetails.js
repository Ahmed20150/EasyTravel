import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/activities/${id}`
      );
      setActivity(response.data);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  if (!activity) return <p>Loading...</p>;

  return (
    <div>
      <h1>{activity.category}</h1>
      <p>{activity.location.address}</p>
      <p>Date: {activity.date}</p>
      <p>Time: {activity.time}</p>
      <p>
        Price: ${activity.price.min} - ${activity.price.max}
      </p>
      <p>Special Discounts: {activity.specialDiscounts}</p>
    </div>
  );
};

export default ActivityDetails;

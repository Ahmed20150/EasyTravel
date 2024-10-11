import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivityForms = ({ activityId, onSave }) => {
  const [activityData, setActivityData] = useState({
    date: "",
    time: "",
    location: {
      address: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    price: { min: 0, max: 0 },
    category: "",
    tags: [],
    specialDiscounts: "",
    isBookingOpen: true,
  });

  useEffect(() => {
    if (activityId) {
      fetchActivity(activityId);
    }
  }, [activityId]);

  const fetchActivity = async (id) => {
    try {
      const response = await axios.get(`/api/activities/${id}`);
      setActivityData(response.data);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData({ ...activityData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activityId) {
        await axios.put(`/api/activities/${activityId}`, activityData);
      } else {
        await axios.post("/api/activities", activityData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date:{" "}
        <input
          type="date"
          name="date"
          value={activityData.date}
          onChange={handleChange}
        />
      </label>
      <label>
        Time:{" "}
        <input
          type="text"
          name="time"
          value={activityData.time}
          onChange={handleChange}
        />
      </label>
      <label>
        Address:{" "}
        <input
          type="text"
          name="location.address"
          value={activityData.location.address}
          onChange={handleChange}
        />
      </label>
      <label>
        Latitude:{" "}
        <input
          type="number"
          name="location.coordinates.lat"
          value={activityData.location.coordinates.lat}
          onChange={handleChange}
        />
      </label>
      <label>
        Longitude:{" "}
        <input
          type="number"
          name="location.coordinates.lng"
          value={activityData.location.coordinates.lng}
          onChange={handleChange}
        />
      </label>
      <label>
        Price Min:{" "}
        <input
          type="number"
          name="price.min"
          value={activityData.price.min}
          onChange={handleChange}
        />
      </label>
      <label>
        Price Max:{" "}
        <input
          type="number"
          name="price.max"
          value={activityData.price.max}
          onChange={handleChange}
        />
      </label>
      <label>
        Category:{" "}
        <input
          type="text"
          name="category"
          value={activityData.category}
          onChange={handleChange}
        />
      </label>
      <button type="submit">{activityId ? "Update" : "Create"} Activity</button>
    </form>
  );
};

export default ActivityForms;

import React, { useState } from "react";
import axios from "axios";

const ActivityForm = ({ onSave }) => {
  const [activityData, setActivityData] = useState({
    date: "",
    time: "",
    location: {
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    price: { min: 0, max: 0 },
    category: "",
    tags: [],
    specialDiscounts: "",
    isBookingOpen: true,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    if (nameParts.length > 1) {
      // Handle nested fields (like location.address)
      setActivityData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setActivityData({ ...activityData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      // Send a POST request to create a new activity
      const response = await axios.post(
        "http://localhost:3000/activities",
        activityData
      );

      // Handle the response (e.g., display success message)
      console.log("Activity created successfully:", response.data);

      // Trigger the onSave callback if provided
      if (onSave) {
        onSave();
      }

      // Reset the form after successful submission
      setActivityData({
        date: "",
        time: "",
        location: {
          address: "",
          coordinates: { lat: 0, lng: 0 },
        },
        price: { min: 0, max: 0 },
        category: "",
        tags: [],
        specialDiscounts: "",
        isBookingOpen: true,
      });
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Activity</h2>
      {/* Form fields... */}
      <div>
        <label>Date: </label>
        <input
          type="date"
          name="date"
          value={activityData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Time: </label>
        <input
          type="text"
          name="time"
          value={activityData.time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Address: </label>
        <input
          type="text"
          name="location.address"
          value={activityData.location.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Latitude: </label>
        <input
          type="number"
          name="location.coordinates.lat"
          value={activityData.location.coordinates.lat}
          onChange={handleChange}
          step="any"
          required
        />
      </div>
      <div>
        <label>Longitude: </label>
        <input
          type="number"
          name="location.coordinates.lng"
          value={activityData.location.coordinates.lng}
          onChange={handleChange}
          step="any"
          required
        />
      </div>
      <div>
        <label>Price Min: </label>
        <input
          type="number"
          name="price.min"
          value={activityData.price.min}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Price Max: </label>
        <input
          type="number"
          name="price.max"
          value={activityData.price.max}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category: </label>
        <input
          type="text"
          name="category"
          value={activityData.category}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Activity</button>
    </form>
  );
};

export default ActivityForm;

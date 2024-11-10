import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ActivityEdit.css";
import Map from "../components/Map";
import "../css/ActivityForm.css"; // Adjusted path to the CSS file
import mapboxgl from "mapbox-gl";

// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoieW91c3NlZm1lZGhhdGFzbHkiLCJhIjoiY2x3MmpyZzYzMHAxbDJxbXF0dDN1MGY2NSJ9.vrWqL8FrrRzm0yAfUNpu6g"; // Replace with your actual Mapbox token

const ActivityEdit = () => {
  const { id } = useParams(); // Get the ID from URL params
  const [activity, setActivity] = useState(null); // State to hold a single activity
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [errors, setErrors] = useState([]); // State to store validation errors
  const [categories, setCategories] = useState([]);


  // Fetch activity data when the component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/activities/${id}`
        );
        setActivity(response.data); // Store the activity in state
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchActivity();
    fetchCategories();
  }, [id]);

  // Handle form changes (for location, price, and other fields)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1]; // Get the location field
      setActivity((prevActivity) => ({
        ...prevActivity,
        location: {
          ...prevActivity.location,
          [locationField]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("price.")) {
      const priceField = name.split(".")[1]; // Get the price field
      setActivity((prevActivity) => ({
        ...prevActivity,
        price: {
          ...prevActivity.price,
          [priceField]: value,
        },
      }));
    } else {
      setActivity((prevActivity) => ({
        ...prevActivity,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/activities/${id}`, activity);
      navigate(`/activities`); // Navigate back to the activities list after update
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors);
        alert(`Error updating activity: ${err.response.data.errors}`);
      } else {
        console.error("An error occurred:", err);
      }
    }
  };

  // Handle location selection from the map
  const handleLocationSelect = useCallback(async (lng, lat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0].place_name;

      // Update the activity location with the selected address and coordinates
      setActivity((prevActivity) => ({
        ...prevActivity,
        location: {
          address,
          coordinates: {
            lat,
            lng,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }, []);

  if (!activity) {
    return <div>Loading...</div>; // Display loading state while fetching
  }
  const handleCancel = () => {
    localStorage.clear();
    navigate("/activities");
  };
  return (
    <div className="activity">
      <h1>Edit Activity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={new Date(activity.date).toISOString().split("T")[0]} // Format the date for the input
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={activity.time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="location.address"
            value={activity.location?.address || ""}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add the Map component here */}
        <div>
          <label>Select Location on Map:</label>
          <Map onLocationSelect={handleLocationSelect} />
        </div>
        <div>
          <label>Price Min:</label>
          <input
            type="number"
            name="price.min"
            value={activity.price.min}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price Max:</label>
          <input
            type="number"
            name="price.max"
            value={activity.price.max}
            onChange={handleChange}
            required
          />
        </div>

      <div>
        <label>
        Flagged:
        <input
          type="text"
          name="flagged"
          value={activity.flagged}
          onChange={handleChange}
          required
        />
      </label>
      </div>


        <div>
        <label>
        Category:
        <select
          name="category"
          value={activity.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={activity.tags.join(", ")} // Join tags for input display
            onChange={(e) =>
              handleChange({
                target: {
                  name: "tags",
                  value: e.target.value.split(", "), // Split input into an array
                },
              })
            }
          />
        </div>
        <div>
          <label>Special Discounts:</label>
          <input
            type="number"
            name="specialDiscounts"
            value={activity.specialDiscounts || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Is Booking Open:</label>
          <input
            type="checkbox"
            name="isBookingOpen"
            checked={activity.isBookingOpen}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ActivityEdit;

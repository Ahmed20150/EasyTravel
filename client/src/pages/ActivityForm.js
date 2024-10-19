import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import "../css/ActivityForm.css"; // Adjusted path to the CSS file
import mapboxgl from "mapbox-gl";

// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoieW91c3NlZm1lZGhhdGFzbHkiLCJhIjoiY2x3MmpyZzYzMHAxbDJxbXF0dDN1MGY2NSJ9.vrWqL8FrrRzm0yAfUNpu6g"; // Replace with your actual Mapbox token

const ActivityForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: {
      address: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
    price: {
      min: "",
      max: "",
    },
    category: "",
    tags: "",
    specialDiscounts: "",
    isBookingOpen: true,
  });
  const navigate = useNavigate();

  const handleLocationSelect = async (lng, lat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0].place_name;

      // Update location only without re-rendering entire form
      setFormData((prevState) => ({
        ...prevState,
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle location coordinates change
  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        coordinates: {
          ...formData.location.coordinates,
          [name]: value,
        },
      },
    });
  };
  const handleButtonClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/activities", {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      });
      navigate(`/activities`);
      console.log("Activity created:", response.data);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };
  return (
    <div className="activity-form">
      <h2>Create a New Activity</h2>
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Location Address:
        <Map onLocationSelect={handleLocationSelect} />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location.address} // Corrected to display selected address
          readOnly
        />
      </label>
      <label>
        Minimum Price:
        <input
          type="number"
          name="price.min"
          value={formData.price.min}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: {
                ...formData.price,
                min: e.target.value,
              },
            })
          }
          required
        />
      </label>
      <label>
        Maximum Price:
        <input
          type="number"
          name="price.max"
          value={formData.price.max}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: {
                ...formData.price,
                max: e.target.value,
              },
            })
          }
          required
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Tags (comma-separated):
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
      </label>
      <label>
        Special Discounts:
        <input
          type="text"
          name="specialDiscounts"
          value={formData.specialDiscounts}
          onChange={handleChange}
        />
      </label>
      <label>
        Is Booking Open:
        <input
          type="checkbox"
          name="isBookingOpen"
          checked={formData.isBookingOpen}
          onChange={(e) =>
            setFormData({ ...formData, isBookingOpen: e.target.checked })
          }
        />
      </label>
      <button type="button" onClick={handleButtonClick}>
        Create
      </button>
    </div>
  );
};

export default ActivityForm;

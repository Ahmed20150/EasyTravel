import React, { useState } from "react";
import axios from "axios";
import "../css/ActivityForm.css"; // Adjusted path to the CSS file

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

  // Simplified handleChange function to handle basic form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleButtonClick = async (e) => {
    e.preventDefault();
    try {
      alert("yes entered");
      const response = await axios.post("http://localhost:3000/activities", {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Process tags as an array
      });
      console.log("Activity created:", response.data);
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <div className="activity-form">
      {" "}
      {/* Added class here */}
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
        <input
          type="text"
          name="location.address"
          value={formData.location.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                address: e.target.value,
              },
            })
          }
        />
      </label>
      <label>
        Latitude:
        <input
          type="number"
          step="any"
          name="location.coordinates.lat"
          value={formData.location.coordinates.lat}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                coordinates: {
                  ...formData.location.coordinates,
                  lat: e.target.value,
                },
              },
            })
          }
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          step="any"
          name="location.coordinates.lng"
          value={formData.location.coordinates.lng}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                coordinates: {
                  ...formData.location.coordinates,
                  lng: e.target.value,
                },
              },
            })
          }
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

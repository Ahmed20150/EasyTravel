import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Map from "../components/Map"; 
import mapboxgl from "mapbox-gl"; // Import mapbox-gl CSS

const ActivityForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: {
      address: "",
    },
    price: {
      min: "",
      max: "",
    },
    category: "",
    tags: "",
    specialDiscounts: "",
    isBookingOpen: true,
    flagged: "",
  });
  const navigate = useNavigate();
  const [cookies] = useCookies(["username"]);
  const [categories, setCategories] = useState([]);

  const handleLocationSelect = async (lng, lat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0].place_name;
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: { address },
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancel = () => {
    navigate("/"); // Navigate to the desired route on cancel
  };

  const handleButtonClick = () => {
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div>
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
            type="time"
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
          Flagged:
          <input
            type="text"
            name="flagged"
            value={formData.flagged}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={formData.category}
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
          Special Discounts (in %):
          <input
            type="number"
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
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="button" onClick={handleButtonClick}>
          Create
        </button>
      </div>
    </div>
  );
};

export default ActivityForm;

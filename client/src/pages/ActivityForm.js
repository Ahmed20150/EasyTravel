import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import * as styles from "../styles/HossStyles.js"; // Import the styles
import Map from "../components/Map"; 
import mapboxgl from "mapbox-gl"; // Import mapbox-gl CSS

const ActivityForm = () => {
  const [errors, setErrors] = useState([]); // State to store validation errors
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
  });
  const navigate = useNavigate();
  const [cookies] = useCookies(["username"]);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    localStorage.clear();
    navigate("/activities");
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();
    
    // Price validation: Check if max price is less than min price
    if (parseFloat(formData.price.max) < parseFloat(formData.price.min)) {
      setErrors(["Maximum price cannot be less than minimum price"]);
      return; // Prevent form submission
    }

    try {
      const response = await axios.post("http://localhost:3000/activities", {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        creator: cookies.username || "default_username", // Pass the username from cookies
      });
      navigate(`/activities`);
      console.log("Activity created:", response.data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors);
        alert(`Error updating activity: ${err.response.data.errors}`);
      } else {
        console.error("An error occurred:", err);
      }
    }
    console.log("Form submitted:", formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1532423622396-10a3f979251a?ixid=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80)" }}>
      <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create a New Activity</h1>

        {errors.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleButtonClick} className="space-y-6">
          {/* Activity Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Activity Details</h2>
            <div className="border p-4 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-semibold">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border rounded-lg min-w-[180px]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Location</h2>
            <div className="border p-4 rounded-lg">
              <div>
                <label className="block text-gray-600 font-semibold">Address</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold">Select Location on Map</label>
                <Map onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <div className="border p-4 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-semibold">Price Min</label>
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
                    className="block w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Price Max</label>
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
                    className="block w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Category</h2>
            <div className="border p-4 rounded-lg">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="border p-4 rounded-lg">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="block w-full px-4 py-2 border rounded-lg"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          {/* Booking Open and Special Discount */} 
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Additional Options</h2>
            <div className="border p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBookingOpen"
                    checked={formData.isBookingOpen}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-gray-600 font-semibold">Is Booking Open</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="specialDiscounts"
                    value={formData.specialDiscounts}
                    onChange={handleChange}
                    className="block w-28 px-4 py-2 border rounded-lg"
                    placeholder="Discount"
                  />
                  <span className="ml-2 text-gray-600">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;

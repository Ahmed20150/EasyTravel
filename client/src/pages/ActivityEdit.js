import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Map from "../components/Map";
import mapboxgl from "mapbox-gl";




import { buttonStyle, buttonStyle3,buttonStyle2 ,cardStyle ,navbarStyle } from "../styles/AbdallahStyles"; 
import { Navbar, Button, Card, Footer,Checkbox, Label, TextInput } from "flowbite-react";
import HomeBanner from "../components/HomeBanner";
// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoieW91c3NlZm1lZGhhdGFzbHkiLCJhIjoiY2x3MmpyZzYzMHAxbDJxbXF0dDN1MGY2NSJ9.vrWqL8FrrRzm0yAfUNpu6g"; // Replace with your actual Mapbox token

const ActivityEdit = () => {
  const { id } = useParams(); // Get the ID from URL params
  const [activity, setActivity] = useState(null); // State to hold a single activity
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [errors, setErrors] = useState([]); // State to store validation errors
  const [categories, setCategories] = useState([]); // Categories for select dropdown

  // Fetch activity data when the component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/activities/${id}`);
        setActivity(response.data); // Store the activity in state
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchActivity();
    fetchCategories();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setActivity((prevActivity) => ({
        ...prevActivity,
        location: {
          ...prevActivity.location,
          [locationField]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("price.")) {
      const priceField = name.split(".")[1];
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
      navigate("/activities"); // Navigate back to activities list after update
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors);
      } else {
        console.error("An error occurred:", err);
      }
    }
  };

  // Handle location selection from map
  const handleLocationSelect = useCallback(async (lng, lat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0].place_name;

      // Update activity with selected address and coordinates
      setActivity((prevActivity) => ({
        ...prevActivity,
        location: {
          address,
          coordinates: { lat, lng },
        },
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }, []);

  if (!activity) {
    return <div>Loading...</div>; // Loading state
  }

  const handleCancel = () => {
    localStorage.clear();
    navigate("/activities");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1532423622396-10a3f979251a?ixid=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80)" }}>
      <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h1 className="text-2xl font-semibold mb-6 text-center">Edit Activity</h1>

        {errors.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={new Date(activity.date).toISOString().split("T")[0]} // Format date for input
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
                    value={activity.time}
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
                  name="location.address"
                  value={activity.location?.address || ""}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border rounded-lg"
                  required
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
                    value={activity.price.min}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Price Max</label>
                  <input
                    type="number"
                    name="price.max"
                    value={activity.price.max}
                    onChange={handleChange}
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
                value={activity.category}
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
                value={activity.tags.join(", ")} // Join tags for input display
                onChange={(e) =>
                  handleChange({
                    target: { name: "tags", value: e.target.value.split(", ") },
                  })
                }
                className="block w-full px-4 py-2 border rounded-lg"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          {/* Is Booking Open */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Booking</h2>
            <div className="border p-4 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isBookingOpen"
                  checked={activity.isBookingOpen}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-gray-600 font-semibold">Is Booking Open</label>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  name="specialDiscounts"
                  value={activity.specialDiscounts}
                  onChange={handleChange}
                  className="block w-28 px-4 py-2 border rounded-lg"
                  placeholder="Discount"
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button type="submit" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700">
              Save Changes
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityEdit;

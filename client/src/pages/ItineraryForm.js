import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ItineraryForm.css"; // Import the CSS file

const ItineraryForm = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [formData, setFormData] = useState({
    activities: [], // Keep this as an array to store Activity IDs
    locationsToVisit: [],
    timeline: "",
    duration: "",
    languageOfTour: "",
    priceOfTour: "",
    availableDates: [], // Initialize as an array
    availableTimes: [], // Initialize as an array
    accessibility: "",
    pickupLocation: "",
    dropoffLocation: "",
  });
  const location = useLocation();
  const { state } = location;
  const selectedActivities = state?.selectedActivities || [];
  const [activityCategories, setActivityCategories] = useState([]);
  useEffect(() => {
    if (selectedActivities.length > 0) {
      setActivityCategories(
        selectedActivities.map((activity) => activity.category)
      ); // Assuming each activity has a category field
      setFormData((prevState) => ({
        ...prevState,
        activities: selectedActivities.map((activity) => activity._id), // Store the selected activity IDs
      }));
    }
  }, [selectedActivities]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "locationsToVisit") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.split(",").map((item) => item.trim()), // Split by comma and trim spaces
      }));
    } else if (name === "availableDates" || name === "availableTimes") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.split(",").map((item) => item.trim()), // Split by comma and trim spaces
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting itinerary:", formData);

    try {
      // Transform activities to match the itinerary schema
      const updatedFormData = {
        ...formData,
        activities: selectedActivities.map((activity) => ({
          activity: activity._id,
        })), // Create an array of objects
      };

      const response = await axios.post(
        "http://localhost:3000/itinerary",
        updatedFormData
      );
      console.log("Itinerary created successfully:", response.data);
      navigate("/itinerary"); // Redirect to the itinerary list page
    } catch (error) {
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        alert(`Error: ${error.response.data.message || "An error occurred!"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleChooseActivities = () => {
    const locationsQuery = formData.locationsToVisit.join(","); // Join locations into a string
    navigate(
      `/itinerary/create/selectActivity?locations=${encodeURIComponent(
        locationsQuery
      )}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Itinerary</h2>
      <label>
        Locations to Visit (comma-separated):
        <input
          type="text"
          name="locationsToVisit"
          value={formData.locationsToVisit.join(", ")} // This will work now as locationsToVisit is an array
          onChange={handleChange}
        />
      </label>
      <button
        type="button"
        onClick={handleChooseActivities}
        disabled={
          formData.locationsToVisit.length === 0 ||
          formData.locationsToVisit[0] === ""
        }
      >
        Choose Activities
      </button>
      <h3>Selected Activities</h3>
      <ul>
        {selectedActivities.map((activity) => (
          <li key={activity._id}>
            Category: {activity.category || "N/A"}-location:{" "}
            {activity.location.address || "N/A"}
          </li>
        ))}
      </ul>
      <label>
        Timeline:
        <input
          type="text"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Duration (in hours):
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Language of Tour:
        <input
          type="text"
          name="languageOfTour"
          value={formData.languageOfTour}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Price of Tour:
        <input
          type="number"
          name="priceOfTour"
          value={formData.priceOfTour}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Available Dates (comma-separated):
        <input
          type="text"
          name="availableDates"
          value={formData.availableDates.join(", ")} // join for display
          onChange={handleChange}
        />
      </label>
      <label>
        Available Times (comma-separated):
        <input
          type="text"
          name="availableTimes"
          value={formData.availableTimes.join(", ")} // join for display
          onChange={handleChange}
        />
      </label>
      <label>
        Accessibility:
        <input
          type="text"
          name="accessibility"
          value={formData.accessibility}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Pickup Location:
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Dropoff Location:
        <input
          type="text"
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Create Itinerary</button>
    </form>
  );
};

export default ItineraryForm;

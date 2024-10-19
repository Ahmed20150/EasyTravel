import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/ItineraryEdit.css"; // Import the CSS file

const ItineraryEdit = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const { id } = useParams(); // Get itinerary ID from the URL
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

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/itinerary/${id}`
        );

        const itinerary = response.data;
        // Populate the form with existing data
        setFormData({
          activities: itinerary.activities.map((activity) => activity.activity),
          locationsToVisit: itinerary.locationsToVisit,
          timeline: itinerary.timeline,
          duration: itinerary.duration,
          languageOfTour: itinerary.languageOfTour,
          priceOfTour: itinerary.priceOfTour,
          availableDates: itinerary.availableDates,
          availableTimes: itinerary.availableTimes,
          accessibility: itinerary.accessibility,
          pickupLocation: itinerary.pickupLocation,
          dropoffLocation: itinerary.dropoffLocation,
        });
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        alert("Failed to fetch itinerary data.");
      }
    };

    fetchItinerary();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "locationsToVisit" ||
      name === "availableDates" ||
      name === "availableTimes"
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log("Updating itinerary:", formData);

    try {
      const updatedFormData = {
        ...formData,
        activities: formData.activities.map((activity) => ({
          activity,
        })), // Create an array of objects for the activities
      };

      const response = await axios.put(
        `http://localhost:3000/itinerary/${id}`,
        updatedFormData
      );
      console.log("Itinerary updated successfully:", response.data);
      alert("Itinerary updated successfully!");
      navigate("/itinerary"); // Redirect to the itinerary list page
    } catch (error) {
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        alert(`Error: ${error.response.data.message || "An error occurred!"}`);
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleChooseActivities = async () => {
    const updatedFormData = {
      ...formData,
      activities: formData.activities.map((activity) => ({
        activity: activity,
      })),
    };

    const response = await axios.put(
      `http://localhost:3000/itinerary/${id}`,
      updatedFormData
    );
    const locationsQuery = formData.locationsToVisit.join(","); // Join locations into a string
    navigate(
      `/itinerary/create/selectActivity?locations=${encodeURIComponent(
        locationsQuery
      )}`,
      {
        state: {
          returnTo: "edit", // Indicate that this is from the edit page
          selectedActivities: formData.activities, // Pass current selected activities
          formData: { ...formData }, // Pass the full form data
          itineraryId: id,
        },
      }
    );
  };

  console.log("Activities:", formData.activities);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Itinerary {id}</h2>
      <label>
        Locations to Visit (comma-separated):
        <input
          type="text"
          name="locationsToVisit"
          value={formData.locationsToVisit.join(", ")}
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
        {formData.activities.map((activity, index) => (
          <li key={index}>
            <div>
              Price: Min: {activity.price.min}, Max: {activity.price.max}
            </div>
            <div>Date: {new Date(activity.date).toLocaleDateString()}</div>
            <div>Time: {activity.time}</div>
            <div>Category: {activity.category}</div>
            <div>Is Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</div>
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
      <button type="submit">Update Itinerary</button>
    </form>
  );
};

export default ItineraryEdit;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

const ItineraryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["username"]);
  const [errors, setErrors] = useState({});
  const [activityCategories, setActivityCategories] = useState([]);


  // Initial form state matching the exact schema requirements
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    tags: [],
    activities: [],
    locationsToVisit: [],
    timeline: "",
    duration: "",
    languageOfTour: "",
    priceOfTour: "",
    availableDates: [],
    availableTimes: [],
    accessibility: "",
    pickupLocation: "",
    dropoffLocation: "",
    flagged: "no",
    creator: cookies.username || ""
  });

  const [selectedActivities, setSelectedActivities] = useState([]);



  	
  const handleChooseActivities = () => {
    const locationsQuery = formData.locationsToVisit.join(","); // Join locations into a string with comma
    const selectedActivityIds = selectedActivities.map(
      (activity) => activity._id // Directly map from selectedActivities to get IDs
    );
    console.log(selectedActivityIds);
    navigate(
      `/itinerary/create/selectActivity?locations=${encodeURIComponent(
        locationsQuery
      )}`,
      {
        state: {
          selectedActivities,
          selectedActivityIds,
          formData,
          returnTo: "create", // Indicate that the source is from the edit
        },
      } // Pass the selected activities and form data
    );
  };
  

  const handleCancel = () => {
    localStorage.clear();
    navigate("/itinerary");
  };


  // Effect to update selected activities from routing state
  useEffect(() => {
    if (location.state?.selectedActivities) {
      setSelectedActivities(location.state.selectedActivities);
    }
  }, [location.state]);


  useEffect(() => {
    if (selectedActivities.length > 0) {
      setActivityCategories(
        selectedActivities.map((activity) => activity.category)
      );
      setFormData((prevState) => ({
        ...prevState,
        activities: selectedActivities.map((activity) => activity._id), // Store the selected activity IDs
      }));
    }
  }, [selectedActivities]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "locationsToVisit" || name==="tags") {
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
      alert(`username: ${cookies.username}`);
      const updatedFormData = {
        ...formData,
        activities: selectedActivities.map((activity) => ({
          activity: activity._id,
        })),
        creator: cookies.username || "default_username",
      };

      const response = await axios.post(
        "http://localhost:3000/itinerary",
        updatedFormData
      );

      console.log("Itinerary created successfully:", response.data);
      navigate("/itinerary"); // Redirect to the itinerary list page
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors);
        alert(`Error updating activity: ${err.response.data.errors}`);
      } else {
        console.error("An error occurred:", err);
      }
    }
  };




  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Itinerary</h2>

      {/* Name Input */}
      <div>
        <label>Itinerary Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p>{errors.name}</p>}
      </div>

      {/* Category Input */}
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        {errors.category && <p>{errors.category}</p>}
      </div>

      {/* Tags Input */}
      <div>
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          name="tags"
          value={formData.tags.join(",")}
          onChange={handleChange}
        />
      </div>

      {/* Locations & Activities Section */}
      <label>
        Locations to Visit (comma-separated):
        <input
          type="text"
          name="locationsToVisit"
          value={formData.locationsToVisit.join(", ")} // Join for display with comma
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
            Category: {activity.category || "N/A"} - Location:{" "}
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
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
      <button type="submit">Create Itinerary</button>
    </form>
  );
};

export default ItineraryForm;
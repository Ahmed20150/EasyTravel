import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
// import "../css/ItineraryEdit.css"; // Import the CSS file
//TODO error when clicking on edit, price is null

const ItineraryEdit = () => {
  const [errors, setErrors] = useState([]); // State to store validation errors
  const navigate = useNavigate(); // Use useNavigate for navigation
  const { id } = useParams(); // Get itinerary ID from the URL
  const location = useLocation();
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
    flagged: "",
  });

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        // Check for existing data in local storage
        const existingData = localStorage.getItem("formData");

        if (existingData) {
          // If local storage has data, parse it and set the form data
          const parsedData = JSON.parse(existingData);
          setFormData(parsedData);
          console.log("Loaded data from local storage:", parsedData);
        } else {
          // If no data in local storage, fetch from API
          const response = await axios.get(
            `http://localhost:3000/itinerary/${id}`
          );
          console.log("Fetching itinerary from API:", response.data);
          const itinerary = response.data;

          // Populate the form with existing data
          const fetchedFormData = {
            activities: itinerary.activities.map(
              (activity) => activity.activity
            ),
            locationsToVisit: Array.isArray(itinerary.locationsToVisit)
              ? itinerary.locationsToVisit
              : [],
            timeline: itinerary.timeline,
            duration: itinerary.duration,
            languageOfTour: itinerary.languageOfTour,
            priceOfTour: itinerary.priceOfTour,
            availableDates: itinerary.availableDates,
            availableTimes: itinerary.availableTimes,
            accessibility: itinerary.accessibility,
            pickupLocation: itinerary.pickupLocation,
            dropoffLocation: itinerary.dropoffLocation,
            flagged: itinerary.flagged,
          };

          // Set the fetched data as the form data
          setFormData(fetchedFormData);

          // Save to local storage for future use
          localStorage.setItem("formData", JSON.stringify(fetchedFormData));
          console.log(
            `Local storage data set: ${JSON.stringify(fetchedFormData)}`
          );
        }

        // If there are selected activities passed back, update the activities
        if (location.state?.selectedActivities) {
          setFormData((prevState) => ({
            ...prevState,
            activities: location.state.selectedActivities, // Update with selected activities
          }));
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        alert("Failed to fetch itinerary data.");
      }
    };

    fetchItinerary();
  }, [id, location.state]); // Add location.state as a dependency
  // Add location.state as a dependency

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the formData accordingly based on input name
    if (
      name === "locationsToVisit" ||
      name === "availableDates" ||
      name === "availableTimes"
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value, // Store the full input as a string
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    localStorage.clear();

    e.preventDefault(); // Prevent the default form submission
    console.log("Updating itinerary:", formData);

    // Prepare updatedFormData
    const updatedFormData = {
      ...formData,
      // If locationsToVisit is an array, you might want to keep it as is
      locationsToVisit: Array.isArray(formData.locationsToVisit)
        ? formData.locationsToVisit // Keep as is if already an array
        : formData.locationsToVisit.split(",").map((item) => item.trim()), // Otherwise, split as needed
      availableDates: Array.isArray(formData.availableDates)
        ? formData.availableDates // Keep as is if already an array
        : formData.availableDates.split(",").map((item) => item.trim()), // Split if it's not an array
      availableTimes: Array.isArray(formData.availableTimes)
        ? formData.availableTimes // Keep as is if already an array
        : formData.availableTimes.split(",").map((item) => item.trim()), // Split if it's not an array
      activities: formData.activities.map((activity) => ({
        activity,
      })), // Map activities to the required format
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/itinerary/${id}`,
        updatedFormData
      );
      console.log("Itinerary updated successfully:", response.data);
      alert("Itinerary updated successfully!");
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

  const handleChooseActivities = () => {
    // Store the current formData in local storage
    localStorage.setItem("formData", JSON.stringify(formData));
    alert("Activities saved to local storage!");
    const locationsQuery = formData.locationsToVisit.join(",");
    const selectedActivityIds = formData.activities.map(
      (activity) => activity._id // Ensure you are mapping to the correct property
    );

    navigate(
      `/itinerary/create/selectActivity?locations=${encodeURIComponent(
        locationsQuery
      )}`,
      {
        state: {
          returnTo: "edit", // Indicate that this is from the edit page
          selectedActivityIds, // Pass current selected activity IDs
          formData: { ...formData }, // Pass the full form data
          itineraryId: id,
        },
      }
    );
  };

  const handleCancel = () => {
    localStorage.clear();
    navigate("/itinerary");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Itinerary {id}</h2>
      <label>
        Locations to Visit (comma-separated):
        <input
          type="text"
          name="locationsToVisit"
          value={formData.locationsToVisit} // Use the string value directly
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
            {activity && activity.price ? (
              <>
                <div>
                  Price: Min: {activity.price.min}, Max: {activity.price.max}
                </div>
                <div>Date: {new Date(activity.date).toLocaleDateString()}</div>
                <div>Time: {activity.time}</div>
                <div>Category: {activity.category}</div>
                <div>
                  Is Booking Open: {activity.isBookingOpen ? "Yes" : "No"}
                </div>
              </>
            ) : (
              <div>No price information available for this activity.</div>
            )}
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
          value={formData.availableDates} // Use the string value directly
          onChange={handleChange}
        />
      </label>
      <label>
        Available Times (comma-separated):
        <input
          type="text"
          name="availableTimes"
          value={formData.availableTimes} // Use the string value directly
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
        Cancel Changes
      </button>
      <button type="submit">Update Itinerary</button>
    </form>
  );
};

export default ItineraryEdit;

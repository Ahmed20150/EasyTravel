import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import {
  cardStyle,
  buttonStyle,
  walletSectionStyle,
  itineraryListStyle,
  promoCodeListStyle,
  userLevelBadge,
  fadeIn
} from "../styles/AmrStyles"; // Import styles
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
            `http://localhost:3000/itineraries/${id}`
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
        `http://localhost:3000/itineraries/${id}`,
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
    <div className={`min-h-screen overflow-auto ${fadeIn} p-6`}>
      <div className="flex justify-center items-center bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">Edit Itinerary {formData.id}</h2>

          {/* Locations to Visit */}


          {/* Choose Activities Button */}
          <div className="text-center">
            <Button
              className={`${buttonStyle} w-full py-3 text-lg rounded-lg`}
              type="button"
              onClick={handleChooseActivities}
              disabled={!formData.locationsToVisit}
            >
              Choose Activities
            </Button>
          </div>
          <div>
            {/* <label className="block text-lg font-medium text-gray-700 mb-2">
              Locations to Visit (comma-separated):
            </label>
            <input
              type="text"
              name="locationsToVisit"
              value={formData.locationsToVisit}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              disabled
            /> */}
          </div>
          {/* Selected Activities */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Selected Activities</h3>
            <ul className="space-y-4">
              {formData.activities.map((activity, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                  {activity && activity.price ? (
                    <>
                      <p><strong>Price:</strong> Min: {activity.price.min}, Max: {activity.price.max}</p>
                      <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {activity.time}</p>
                      <p><strong>Category:</strong> {activity.category}</p>
                      <p><strong>Is Booking Open:</strong> {activity.isBookingOpen ? "Yes" : "No"}</p>
                    </>
                  ) : (
                    <p>No price information available for this activity.</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Timeline:
              </label>
              <input
                type="text"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Duration (in hours):
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>
          </div>

          {/* More Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Flagged:
              </label>
              <input
                type="text"
                name="flagged"
                value={formData.flagged}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div> */}

            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Language of Tour:
              </label>
              <input
                type="text"
                name="languageOfTour"
                value={formData.languageOfTour}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Price of Tour:
              </label>
              <input
                type="number"
                name="priceOfTour"
                value={formData.priceOfTour}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Available Dates (comma-separated):
              </label>
              <input
                type="text"
                name="availableDates"
                value={formData.availableDates}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Available Times (comma-separated):
              </label>
              <input
                type="text"
                name="availableTimes"
                value={formData.availableTimes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Accessibility:
              </label>
              <input
                type="text"
                name="accessibility"
                value={formData.accessibility}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Pickup Location:
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Dropoff Location:
              </label>
              <input
                type="text"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 space-x-4">
            <Button
              className="w-40 py-3 text-lg rounded-lg bg-red-500 text-white"
              type="button"
              onClick={handleCancel}
            >
              Cancel Changes
            </Button>
            <Button
              className="w-40 py-3 text-lg rounded-lg bg-blue-500 text-white"
              type="submit"
            >
              Update Itinerary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryEdit;
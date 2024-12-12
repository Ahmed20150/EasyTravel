import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const ItineraryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["username"]);
  const [errors, setErrors] = useState({});
  const [activityCategories, setActivityCategories] = useState([]);
  const [categories, setCategories] = useState([]);

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

    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting itinerary:", formData);

    try {
      // Transform activities to match the itinerary schema
      toast.success("Itinerary Created Succesfully!");
      const updatedFormData = {
        ...formData,
        activities: selectedActivities.map((activity) => ({
          activity: activity._id,
        })),
        creator: cookies.username || "default_username",
      };

      const response = await axios.post(
        "http://localhost:3000/itineraries",
        updatedFormData
      );

      console.log("Itinerary created successfully:", response.data);
      navigate("/itinerary"); // Redirect to the itinerary list page
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors);
        toast.error(`Error updating activity: ${err.response.data.errors}`);
      } else {
        console.error("An error occurred:", err);
      }
    }
  };



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      alert("Failed to fetch categories.");
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex justify-center items-start bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-6">Create New Itinerary</h2>
  
           {/* Locations & Activities */}
           <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Locations to Visit (comma-separated):</label>
          <input
            type="text"
            name="locationsToVisit"
            value={formData.locationsToVisit.join(", ")}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="button"
          onClick={handleChooseActivities}
          disabled={formData.locationsToVisit.length === 0 || formData.locationsToVisit[0] === ""}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4 disabled:bg-gray-400"
        >
          Choose Activities
        </button>
  
        <h3 className="mt-4 text-xl font-semibold">Selected Activities</h3>
        <ul className="list-disc pl-5">
          {selectedActivities.map((activity) => (
            <li key={activity._id} className="mt-2">
              Category: {activity.category || "N/A"} - Location: {activity.location.address || "N/A"}
            </li>
          ))}
        </ul>
  



        {/* Itinerary Name */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Itinerary Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
  
        {/* Category */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Category:</label>
         
          <select
              id="categorySelect"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
  
        {/* Tags */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Tags (comma-separated):</label>
          <input
            type="text"
            name="tags"
            value={formData.tags.join(",")}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
     
        {/* Timeline */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Timeline:</label>
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Duration */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Duration (in hours):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Language of Tour */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Language of Tour:</label>
          <input
            type="text"
            name="languageOfTour"
            value={formData.languageOfTour}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Price of Tour */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Price of Tour:</label>
          <input
            type="number"
            name="priceOfTour"
            value={formData.priceOfTour}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Available Dates */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Available Dates (comma-separated):</label>
          <input
            type="text"
            name="availableDates"
            value={formData.availableDates.join(", ")}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Available Times */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Available Times (comma-separated):</label>
          <input
            type="text"
            name="availableTimes"
            value={formData.availableTimes.join(", ")}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Accessibility */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Accessibility:</label>
          <input
            type="text"
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Pickup Location */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Pickup Location:</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Dropoff Location */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700 mb-2">Dropoff Location:</label>
          <input
            type="text"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white py-2 px-6 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded"
          >
            Create Itinerary
          </button>
        </div>
      </div>
      <ToastContainer/>
    </form>
  );
};

export default ItineraryForm;
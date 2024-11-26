import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

const ItineraryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["username"]);
  const [errors, setErrors] = useState({});

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

  // Handle input changes with type-specific processing
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    switch(name) {
      case 'tags':
      case 'locationsToVisit':
      case 'availableTimes':
        setFormData(prev => ({
          ...prev,
          [name]: value.split(',').map(item => item.trim())
        }));
        break;
      case 'availableDates':
        setFormData(prev => ({
          ...prev,
          [name]: value.split(',').map(item => new Date(item.trim()))
        }));
        break;
      case 'duration':
      case 'priceOfTour':
        setFormData(prev => ({
          ...prev,
          [name]: type === 'number' ? parseFloat(value) : value
        }));
        break;
      default:
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }
  };

  // Navigate to activity selection
  const handleChooseActivities = () => {
    navigate('/itinerary/create/selectActivity', {
      state: { 
        locations: formData.locationsToVisit,
        existingFormData: formData
      }
    });
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Transform activities to match schema
      const submissionData = {
        ...formData,
        activities: selectedActivities.map(activity => ({ activity: activity._id })),
        creator: cookies.username || "anonymous"
      };

      const response = await axios.post(
        "http://localhost:3000/itinerary", 
        submissionData
      );

      navigate("/itinerary");
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMap = err.response.data.errors.reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {});
        setErrors(errorMap);
      }
    }
  };

  // Effect to update selected activities from routing state
  useEffect(() => {
    if (location.state?.selectedActivities) {
      setSelectedActivities(location.state.selectedActivities);
    }
  }, [location.state]);

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
          value={formData.tags.join(", ")}
          onChange={handleChange}
        />
      </div>

      {/* Locations & Activities Section */}
      <div>
        <label>Locations to Visit (comma-separated):</label>
        <input
          type="text"
          name="locationsToVisit"
          value={formData.locationsToVisit.join(", ")}
          onChange={handleChange}
        />
        <button 
          type="button" 
          onClick={handleChooseActivities}
          disabled={!formData.locationsToVisit.length}
        >
          Choose Activities
        </button>
      </div>

      {/* Timeline */}
      <div>
        <label>Timeline:</label>
        <input
          type="text"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          required
        />
      </div>

      {/* Duration */}
      <div>
        <label>Duration (hours):</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      {/* Language of Tour */}
      <div>
        <label>Language of Tour:</label>
        <input
          type="text"
          name="languageOfTour"
          value={formData.languageOfTour}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price of Tour */}
      <div>
        <label>Price of Tour:</label>
        <input
          type="number"
          name="priceOfTour"
          value={formData.priceOfTour}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      {/* Available Dates */}
      <div>
        <label>Available Dates (comma-separated):</label>
        <input
          type="text"
          name="availableDates"
          value={formData.availableDates.map(date => date.toISOString().split('T')[0]).join(", ")}
          onChange={handleChange}
        />
      </div>

      {/* Available Times */}
      <div>
        <label>Available Times (comma-separated):</label>
        <input
          type="text"
          name="availableTimes"
          value={formData.availableTimes.join(", ")}
          onChange={handleChange}
        />
      </div>

      {/* Accessibility */}
      <div>
        <label>Accessibility:</label>
        <input
          type="text"
          name="accessibility"
          value={formData.accessibility}
          onChange={handleChange}
          required
        />
      </div>

      {/* Pickup Location */}
      <div>
        <label>Pickup Location:</label>
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          required
        />
      </div>

      {/* Dropoff Location */}
      <div>
        <label>Dropoff Location:</label>
        <input
          type="text"
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          required
        />
      </div>

      {/* Flagged Status */}
      <div>
        <label>Flagged:</label>
        <select
          name="flagged"
          value={formData.flagged}
          onChange={handleChange}
          required
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div>
        <button type="submit">Create Itinerary</button>
        <button type="button" onClick={() => navigate('/itinerary')}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ItineraryForm;
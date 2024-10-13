import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/SelectActivity.css"; // Import CSS for styling

const SelectActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locationsToVisit = queryParams.get("locations")
    ? queryParams
        .get("locations")
        .split(",")
        .map((loc) => loc.trim()) // Trim spaces
    : []; // Split the string into an array

  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location

  useEffect(() => {
    // Fetch all activities from the API
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/activities"); // Adjust the endpoint as necessary
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleSelectActivity = (activityId) => {
    setSelectedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId); // Deselect if already selected
      }
      return [...prev, activityId]; // Select if not selected
    });
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value); // Update selected location
  };

  const handleDone = () => {
    const selectedActivitiesWithDetails = activities.filter((activity) =>
      selectedActivities.includes(activity._id)
    );

    navigate("/itinerary/create", {
      state: { selectedActivities: selectedActivitiesWithDetails }, // Pass selected activities with details
    });
  };


  // Filter activities based on the selected location
  const filteredActivities = activities.filter((activity) => {
    if (!selectedLocation) return true; // If no location is selected, show all activities
    return activity.location?.address === selectedLocation; // Match the selected location
  });

  return (
    <div className="select-activity-container">
      <h2>Select Activities</h2>
      <label>
        <strong>Filter by Location:</strong>
        <select value={selectedLocation} onChange={handleLocationChange}>
          <option value="">All Locations</option>
          {locationsToVisit.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>
      <ul>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <li key={activity._id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity._id)}
                  onChange={() => handleSelectActivity(activity._id)}
                />
                {activity.name} {/* Displaying activity name */}
                <div>
                  <strong>Location:</strong>{" "}
                  {activity.location?.address || "N/A"}
                </div>
                <div>
                  <strong>Description:</strong>{" "}
                  {activity.description || "No description available."}
                </div>
                <div>
                  <strong>Price:</strong>
                  {typeof activity.price === "object"
                    ? `Min: ${activity.price.min}, Max: ${activity.price.max}`
                    : activity.price || "N/A"}
                </div>
              </label>
            </li>
          ))
        ) : (
          <p>No activities available.</p>
        )}
      </ul>
      <button onClick={handleDone}>Done</button>
    </div>
  );
};

export default SelectActivity;

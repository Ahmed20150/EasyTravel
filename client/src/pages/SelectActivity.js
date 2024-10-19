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
        .split(",") // Split using a comma
        .map((loc) => loc.trim()) // Trim spaces
    : []; // Split the string into an array

  const { state } = location; // Get state from location
  const initialSelectedActivities = state?.selectedActivityIds || []; // Get selected activities from state
  const initialFormData = state?.formData || {}; // Get form data from state

  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState(
    initialSelectedActivities
  );

  useEffect(() => {
    // Fetch all activities from the API
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/activities"); // Adjust the endpoint as necessary

        // Filter activities based on whether the address contains any of the specified locations
        const filteredActivities = response.data.filter((activity) => {
          const activityAddress = activity.location?.address
            ?.trim()
            .toLowerCase(); // Normalize the activity address
          return locationsToVisit.some(
            (location) => activityAddress.includes(location.toLowerCase()) // Check if activity address includes the location
          );
        });

        setActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [locationsToVisit]); // Dependency on locationsToVisit to refetch if it changes

  const handleSelectActivity = (activityId) => {
    setSelectedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId); // Deselect if already selected
      }
      return [...prev, activityId]; // Select if not selected
    });
  };

  const handleDone = () => {
    const selectedActivitiesWithDetails = activities.filter((activity) =>
      selectedActivities.includes(activity._id)
    );

    const returnTo = state?.returnTo; // Get the return flag from state
    if (returnTo === "edit") {
      const itineraryId = state?.itineraryId;
      // Get the itinerary ID from state
      if (itineraryId) {
        navigate(`/itinerary/edit/${itineraryId}`, {
          state: {
            selectedActivities: selectedActivitiesWithDetails,
            formData: initialFormData,
          },
        });
      } else {
        console.error("Itinerary ID is undefined, cannot navigate to edit.");
        alert("Itinerary ID is not available.");
      }
    } else if (returnTo === "create") {
      navigate("/itinerary/create", {
        state: {
          selectedActivities: selectedActivitiesWithDetails,
          formData: initialFormData,
        },
      });
    } else {
      console.error("Unknown return path");
    }
  };

  return (
    <div className="select-activity-container">
      <h2>Select Activities</h2>
      <ul>
        {activities.length > 0 ? (
          activities.map((activity) => (
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
          <p>No activities available for the selected locations.</p>
        )}
      </ul>
      <button onClick={handleDone}>Done</button>
    </div>
  );
};

export default SelectActivity;

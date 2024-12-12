import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { buttonStyle } from "../styles/gasserStyles";
import { Button } from "flowbite-react";
// import "../css/SelectActivity.css"; // Import CSS for styling
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
        alert("error fetching");
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
      alert("Unknown return path");
    }
  };

  return (
    <div
    className="select-activity-container"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      margin: '20px auto',
      border: '2px solid #ccc',
      borderRadius: '10px',
      maxWidth: '800px',
      backgroundColor: '#f5f5f5',
    }}
  >
    <h2
      style={{
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333',
      }}
    >
      Select Activities
    </h2>
    <ul
      style={{
        listStyleType: 'none',
        padding: '0',
        width: '100%',
      }}
    >
      {activities.length > 0 ? (
        activities.map((activity) => (
          <li
            key={activity._id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={selectedActivities.includes(activity._id)}
                onChange={() => handleSelectActivity(activity._id)}
                style={{
                  marginBottom: '10px',
                  width: '20px',
                  height: '20px',
                }}
              />
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                }}
              >
                {activity.name}
              </span>
              <div
                style={{
                  marginTop: '10px',
                  color: '#555',
                }}
              >
                <strong>Location:</strong> {activity.location?.address || 'N/A'}
              </div>
              <div
                style={{
                  marginTop: '5px',
                  color: '#555',
                }}
              >
                <strong>Description:</strong>{' '}
                {activity.description || 'No description available.'}
              </div>
              <div
                style={{
                  marginTop: '5px',
                  color: '#555',
                }}
              >
                <strong>Price:</strong>{' '}
                {typeof activity.price === 'object'
                  ? `Min: $${activity.price.min}, Max: $${activity.price.max}`
                  : `$${activity.price || 'N/A'}`}
              </div>
            </label>
          </li>
        ))
      ) : (
        <p
          style={{
            textAlign: 'center',
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          No activities available for the selected locations.
        </p>
      )}
    </ul>
    <Button
      onClick={handleDone}
      style={{
        padding: '10px 20px',
        marginTop: '20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#3498db',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
      }}

      className={buttonStyle}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = '#2980b9')
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = '#3498db')
      }
    >
      Done
    </Button>
  </div>
  );
};

export default SelectActivity;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ActivityLists.css";

const UserList = () => {
  const [activities, setActivities] = useState([]); // State to hold activities
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    fetchActivities(); // Fetch activities when the component mounts
  }, []);

  // Function to fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Request/requestDelete");
      setActivities(response.data); // Store the activities in state
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Function to handle deletion of an activity
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/delete-user`); // Send delete request
      // Update state to remove the deleted activity
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity. Please try again."); // Inform user of the error
    }
  };
 return (
   <div className="activity-list">
     <h1>Activities</h1>
     <div className="button-container">
       <button className="create-button" onClick={() => handleCreate()}>
         Create New Activity
       </button>
     </div>
     <div className="card-container">
       {activities.map((activity) => (
         <div className="card" key={activity._id}>
           <h3 className="activity-category">{activity.category}</h3>
           <p className="activity-location">{activity.location?.address}</p>
           <p className="activity-price">
             Price: <span className="price-min">${activity.price?.min}</span> -{" "}
             <span className="price-max">${activity.price?.max}</span>
           </p>
           <div className="button-group">
             <button
               className="edit-button"
               onClick={() => handleEdit(activity._id)}
             >
               Edit
             </button>
             <button
               className="delete-button"
               onClick={() => handleDelete(activity._id)}
             >
               Delete
             </button>
           </div>
         </div>
       ))}
     </div>
   </div>
 );

};

export default UserList;

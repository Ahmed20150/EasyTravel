import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link} from "react-router-dom";
import "../css/ActivityLists.css";

const UserList = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/viewRequests"); // Update the endpoint to match your backend route
      setUsers(response.data); // Store the fetched users in state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle deletion of a user
  const handleDelete = async (username,role) => {
    //const input = { username, role };
    try {
        // Construct the URL with the username and role as query parameters
        alert(`enter ${role}`)
        await axios.delete(`http://localhost:3000/admin/delete-user/${username}/${role}`); 
        // Update state to remove the deleted user
        setUsers(users.filter((user) => user.username !== username)); // Filter out the deleted user from the UI
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again."); // Inform user of the error
    }
};


  return (
    <div className="activity-list">
      <h1>Delete Requests </h1>
      <Link to="/adminAccountManagement"><button>Back</button></Link>
      <div className="button-container"></div>
      <div className="card-container">
        {users.map((user) => (
          <div className="card" key={user.username}>
            <h2 className="user-role"> {user.role}</h2>
            <h4 className="user-username">Username: {user.username}</h4>
            <h4 className="user-email">Email: {user.email}</h4> 
            <div className="button-group">
            <button
                                className="delete-button"
                                onClick={()=>{handleDelete(user.username,user.role)}}  // Pass the correct user details
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

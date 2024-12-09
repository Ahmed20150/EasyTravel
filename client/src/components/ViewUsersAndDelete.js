import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Button } from "flowbite-react"; // Import Flowbite components

const UserList = () => {
    const [users, setUsers] = useState([]); // State to hold users

    // Fetch users from the backend when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/admin/viewAllUsers");
                setUsers(response.data); // Store the fetched users in state
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDelete = async (username, role) => {
        try {
            await axios.delete(`http://localhost:3000/admin/delete-user/${username}/${role}`);
            setUsers(users.filter((user) => user.username !== username)); // Update the state
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again."); // Inform user of the error
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Link to="/adminAccountManagement">
                    <Button>Back</Button>
                </Link>
                <h1 className="text-2xl font-bold text-center flex-1">User List</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                    <Card key={user.username} className="relative">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-gray-800">{user.role}</h2>
                            <p>
                                <strong>Username:</strong> {user.username}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p> 
                        </div>
                        <Button
                            className="mt-4"
                            color="failure"
                            onClick={() => handleDelete(user.username, user.role)}
                        >
                            Delete
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default UserList;

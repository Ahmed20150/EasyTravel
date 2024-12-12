import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Button, Spinner } from "flowbite-react"; // Import Flowbite components

const UserList = () => {
    const [users, setUsers] = useState([]); // State to hold users
    const [loading, setLoading] = useState(true); // Loading state for fetching users
    const [deleting, setDeleting] = useState(null); // Track which user is being deleted (null means no user is being deleted)

    // Fetch users from the backend when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/admin/viewAllUsers");
                setUsers(response.data); // Store the fetched users in state
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };

        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDelete = async (username, role) => {
        setDeleting(username); // Set the user as being deleted
        try {
            await axios.delete(`http://localhost:3000/admin/delete-user/${username}/${role}`);
            setUsers(users.filter((user) => user.username !== username)); // Update the state after deletion
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again."); // Inform user of the error
        } finally {
            setDeleting(null); // Reset the deleting state after the deletion attempt
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

            {/* Show loading spinner while fetching users */}
            {loading ? (
                <div className="flex justify-center ml-16 mt-40">
                    <Spinner size="lg" aria-label="Loading users..." />
                </div>
            ) : (
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
                                disabled={deleting !== null && deleting !== user.username} // Disable only for the deleting user
                            >
                                {deleting === user.username ? (
                                    <Spinner size="sm" aria-label="Deleting user..." />
                                ) : (
                                    "Delete"
                                )}
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;

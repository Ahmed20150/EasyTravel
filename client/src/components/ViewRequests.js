import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Modal, Card } from "flowbite-react";

const UserList = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedUser, setSelectedUser] = useState(null); // User to delete

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/viewRequests");
      setUsers(response.data); // Store fetched users in state
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle deletion of a user
  const handleDelete = async () => {
    if (!selectedUser) return;

    const { username, role } = selectedUser;

    try {
      await axios.delete(`http://localhost:3000/admin/delete-user/${username}/${role}`);
      setUsers(users.filter((user) => user.username !== username)); // Update UI
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Function to open the modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Flexbox container for title and back button */}
      <div className="flex justify-between items-center mb-4">
        <Link to="/adminAccountManagement">
          <Button color="gray" className="w-auto">
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">
          Delete Requests
        </h1>
      </div>

      {/* User cards container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.length === 0 ? (
    <p className="text-center col-span-full text-gray-500">No user requests found.</p>
  ) : (
    users.map((user) => (
      <Card key={user.username} className="shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
        <p className="text-gray-600">Role: {user.role}</p>
        <Button
          color="failure"
          onClick={() => openDeleteModal(user)}
          className="mt-4"
        >
          Delete
        </Button>
      </Card>
    ))
  )}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Delete Confirmation</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedUser?.username}</span> with
            role <span className="font-semibold">{selectedUser?.role}</span>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;

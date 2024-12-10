import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Label, TextInput, Card, Tabs, Select } from "flowbite-react";
import {
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineViewList,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { buttonStyle } from "../styles/GeneralStyles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PreferencePage = () => {
  const [preferenceName, setPreferenceName] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [updateOldName, setUpdateOldName] = useState("");
  const [updateNewName, setUpdateNewName] = useState("");
  const [deletePreferenceName, setDeletePreferenceName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllPreferences");
      setPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences", error);
      toast.error("Failed to fetch preferences.");
    }
  };

  const createPreference = async () => {
    setLoading(true);
  
    // Check if the preference name is empty or contains only spaces
    if (!preferenceName.trim()) {
      toast.error("Preference name cannot be empty!");
      setLoading(false);
      return;
    }
  
    // Check if the preference name is too short
    if (preferenceName.length < 3) {
      toast.error("Preference name must be at least 3 characters long.");
      setLoading(false);
      return;
    }
  

    // Check if the preference already exists
    if (preferences.some((preference) => preference.name.toLowerCase() === preferenceName.toLowerCase())) {
      toast.error("This preference already exists!");
      setLoading(false);
      return;
    }
  
    try {
      await axios.post("http://localhost:3000/api/preference", { name: preferenceName });
      toast.success("Preference created successfully!");
      fetchPreferences();
      setPreferenceName(""); // Clear input field
    } catch (error) {
      console.error("Error creating preference", error);
  
      // Check if the error is related to duplication at the backend level
      if (error.response && error.response.data && error.response.data.message === "Duplicate preference") {
        toast.error("This preference already exists!");
      } else {
        toast.error("An error occurred while creating the preference.");
      }
    }
    setLoading(false);
  };
  

  const deletePreference = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/preference/${deletePreferenceName}`);
      toast.success("Preference deleted successfully!");
      fetchPreferences();
      setDeletePreferenceName("");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting preference", error);
      toast.error("Failed to delete preference. Preference not found.");
    }
    setLoading(false);
  };

  const updatePreference = async () => {
    setLoading(true);
  
    // Check if the new preference name is empty or contains only spaces
    if (!updateNewName.trim()) {
      toast.error("Preference name cannot be empty!");
      setLoading(false);
      return;
    }
  
    // Check if the new preference name is too short
    if (updateNewName.length < 3) {
      toast.error("Preference name must be at least 3 characters long.");
      setLoading(false);
      return;
    }
  
  
    // Check if the new preference name already exists (but is not the same as the current preference being updated)
    if (preferences.some((preference) => preference.name.toLowerCase() === updateNewName.toLowerCase() && preference.name !== updateOldName)) {
      toast.error("This preference already exists!");
      setLoading(false);
      return;
    }
  
    try {
      await axios.put(`http://localhost:3000/api/preference/${updateOldName}`, {
        name: updateNewName,
      });
      toast.success("Preference updated successfully!");
      fetchPreferences();
      setUpdateOldName("");
      setUpdateNewName("");
    } catch (error) {
      console.error("Error updating preference", error);
      toast.error("Failed to update preference. Preference not found.");
    }
    setLoading(false);
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Preferences</h1>

      <Link to="/home">
        <Button className={`${buttonStyle} mb-5`}>Back</Button>
      </Link>

      <Tabs aria-label="Preference Management" variant="fullWidth" className="mb-4">
        <Tabs.Item title="Create" icon={HiOutlinePlusCircle}>
          <div className="space-y-4">
            <Label htmlFor="preferenceName" className="block text-lg font-semibold">
              Enter Preference Name
            </Label>
            <TextInput
              id="preferenceName"
              name="preferenceName"
              placeholder="Enter preference name"
              value={preferenceName}
              onChange={(e) => setPreferenceName(e.target.value)}
              className="mb-4"
            />
            <Button onClick={createPreference} className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Preference"}
            </Button>
          </div>
        </Tabs.Item>

        <Tabs.Item title="Read" icon={HiOutlineViewList}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preferences.map((preference) => (
              <Card
                key={preference._id}
                className="text-center shadow-md transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-100"
              >
                <h3 className="text-lg font-semibold">{preference.name}</h3>
              </Card>
            ))}
          </div>
        </Tabs.Item>

        <Tabs.Item title="Update" icon={HiOutlinePencilAlt}>
          <div className="space-y-4">
            <Label htmlFor="updateOldName" className="block text-lg font-semibold">
              Select Preference to Update
            </Label>
            <Select
              id="updateOldName"
              value={updateOldName}
              onChange={(e) => setUpdateOldName(e.target.value)}
              className="mb-4"
            >
              <option value="">Select a preference</option>
              {preferences.map((preference) => (
                <option key={preference._id} value={preference.name}>
                  {preference.name}
                </option>
              ))}
            </Select>

            <Label htmlFor="updateNewName" className="block text-lg font-semibold">
              New Preference Name
            </Label>
            <TextInput
              id="updateNewName"
              placeholder="Enter new preference name"
              value={updateNewName}
              onChange={(e) => setUpdateNewName(e.target.value)}
              className="mb-4"
            />
            <Button onClick={updatePreference} className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Preference"}
            </Button>
          </div>
        </Tabs.Item>

        <Tabs.Item title="Delete" icon={HiOutlineTrash}>
          <div className="space-y-4">
            <Label htmlFor="deletePreference" className="block text-lg font-semibold">
              Select Preference to Delete
            </Label>
            <Select
              id="deletePreference"
              value={deletePreferenceName}
              onChange={(e) => setDeletePreferenceName(e.target.value)}
              className="mb-4"
            >
              <option value="">-- Select a Preference --</option>
              {preferences.map((preference) => (
                <option key={preference._id} value={preference.name}>
                  {preference.name}
                </option>
              ))}
            </Select>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full"
              disabled={loading || !deletePreferenceName}
            >
              Delete Preference
            </Button>
          </div>
        </Tabs.Item>
      </Tabs>

      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Modal.Header>Delete Preference</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this preference?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={deletePreference} color="failure" disabled={loading}>
            {loading ? "Deleting..." : "Confirm"}
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(false)} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default PreferencePage;

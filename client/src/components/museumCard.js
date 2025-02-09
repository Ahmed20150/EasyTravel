import React, { useState } from "react";
import axios from "axios";
import { fadeIn, buttonStyle ,promoCodeListStyle,cardStyle } from "../styles/HipaStyles"; // Import styles

// Predefined tags for selection
const predefinedTags = [
  "Monuments",
  "Museums",
  "Religious Sites",
  "Palaces/Castles",
];

const MuseumCard = ({ museum, onDelete, refreshMuseums }) => {
  const [editing, setEditing] = useState(false);
  const [newData, setNewData] = useState(museum);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setNewData(museum); // Reset newData to the original museum data on cancel
    setErrorMessage(""); // Clear error message on cancel
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 5) {
        alert("File size exceeds the limit of 5MB.");
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewData({ ...newData, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    // Simple validation check
    if (
      !newData.name ||
      !newData.location ||
      !newData.description ||
      !newData.openingHours ||
      !newData.ticketPrices.foreigner ||
      !newData.ticketPrices.native ||
      !newData.ticketPrices.student
    ) {
      setErrorMessage("Please fill in all fields."); // Set error message
      return;
    }

    axios
      .put(`http://localhost:3000/museums/${museum._id}`, newData)
      .then(() => {
        refreshMuseums();
        setEditing(false);
        setErrorMessage(""); // Clear error message on successful update
      })
      .catch((error) => {
        console.error("Error updating museum:", error);
        setErrorMessage("Failed to update museum. Please try again."); // Set error message on failure
      });
  };

  const handleTagChange = (tag) => {
    const updatedTags = newData.tags.includes(tag)
      ? newData.tags.filter((t) => t !== tag) // Remove tag if already selected
      : [...newData.tags, tag]; // Add tag if not selected

    setNewData({ ...newData, tags: updatedTags }); // Update newData with modified tags
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this museum?")) {
      onDelete(museum._id); // Call the delete function if confirmed
    }
  };

  return (
    <div className="museum-card">
      {museum.picture && (
        <img src={museum.picture} alt={museum.name} className="museum-image" />
      )}
      <div className="museum-details">
        {editing ? (
          <div className="edit-museum-form">
            <h3>Edit Museum</h3>
            {errorMessage && <div className="alert">{errorMessage}</div>}
            <input
              type="text"
              value={newData.name}
              onChange={(e) => setNewData({ ...newData, name: e.target.value })}
              placeholder="Museum Name"
            />
            <input
              type="text"
              value={newData.location}
              onChange={(e) =>
                setNewData({ ...newData, location: e.target.value })
              }
              placeholder="Location"
            />
            <textarea
              value={newData.description}
              onChange={(e) =>
                setNewData({ ...newData, description: e.target.value })
              }
              placeholder="Description"
              rows="4"
            />
            <div className="image-upload">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                id="image-upload" // Add an id for the file input
                required
              />
              <label htmlFor="image-upload">Upload Image</label>
              {newData.picture && (
                <img
                  src={newData.picture}
                  alt="Uploaded Preview"
                  className={newData.picture ? "active" : ""}
                />
              )}{" "}
              {/* Display uploaded image */}
            </div>
            {/* Time range for opening hours */}
            <div className="time-range">
              <label>Opening Hours From:</label>
              <input
                type="time"
                value={newData.openingHours.from}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    openingHours: {
                      ...newData.openingHours,
                      from: e.target.value,
                    },
                  })
                }
                required
              />
              <label>To:</label>
              <input
                type="time"
                value={newData.openingHours.to}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    openingHours: {
                      ...newData.openingHours,
                      to: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            <input
              type="number"
              value={newData.ticketPrices.foreigner}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  ticketPrices: {
                    ...newData.ticketPrices,
                    foreigner: e.target.value,
                  },
                })
              }
              placeholder="Ticket Price for Foreigners"
            />
            <input
              type="number"
              value={newData.ticketPrices.native}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  ticketPrices: {
                    ...newData.ticketPrices,
                    native: e.target.value,
                  },
                })
              }
              placeholder="Ticket Price for Natives"
            />
            <input
              type="number"
              value={newData.ticketPrices.student}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  ticketPrices: {
                    ...newData.ticketPrices,
                    student: e.target.value,
                  },
                })
              }
              placeholder="Ticket Price for Students"
            />

            <div className="tag-selection">
              <label>Tags:</label>
              {predefinedTags.map((tag) => (
                <label key={tag}>
                  <input
                    type="checkbox"
                    checked={newData.tags.includes(tag)} // Check if tag is selected
                    onChange={() => handleTagChange(tag)} // Handle tag change
                  />
                  {tag}
                </label>
              ))}
            </div>

            <button className="update-button" onClick={handleUpdate}>
              Update
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h2>{museum.name}</h2>
            <p className="location">{museum.location}</p>
            <p>{museum.description}</p>
            <p>
              Opening Hours: {museum.openingHours.from} -{" "}
              {museum.openingHours.to}
            </p>{" "}
            <p>
              Ticket: Foreigner: ${museum.ticketPrices.foreigner}
              <br />
              Native: ${museum.ticketPrices.native}
              <br />
              Student: ${museum.ticketPrices.student}
            </p>
            {/* Display Tags */}
            <div className="tags-container">
              {museum.tags &&
                museum.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    {tag}
                  </span>
                ))}
            </div>
            <button 
              className={`${buttonStyle} mr-2 px-4 py-2 rounded-full bg-black-500 text-white hover:bg-blue-600`} 
              onClick={handleEdit}
            >
              Edit
            </button>
            <button 
              className={`${buttonStyle} px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600`} 
              onClick={handleDelete}
            >
              Delete
            </button>
            {" "}
            {/* Use handleDelete here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MuseumCard;

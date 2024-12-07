import React, { useState } from "react";
import axios from "axios";

// Predefined tags for selection
const predefinedTags = [
  "Monuments",
  "Museums",
  "Religious Sites",
  "Palaces/Castles",
];

const AddMuseumForm = ({ username, refreshMuseums }) => {
  const [newMuseum, setNewMuseum] = useState({
    name: "",
    location: "",
    description: "",
    openingHours: {
      from: "",
      to: "",
    },
    picture: "", // Add picture field to store base64 string
    ticketPrices: {
      foreigner: "",
      native: "",
      student: "",
    },
    tags: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

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
        setNewMuseum({ ...newMuseum, picture: reader.result }); // Set picture as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation check
    if (
      !newMuseum.name ||
      !newMuseum.location ||
      !newMuseum.description ||
      !newMuseum.openingHours.from || // Validate openingHours from time
      !newMuseum.openingHours.to || // Validate openingHours to time
      !newMuseum.picture || // Validate picture field
      !newMuseum.ticketPrices.foreigner ||
      !newMuseum.ticketPrices.native ||
      !newMuseum.ticketPrices.student
    ) {
      setErrorMessage("Please fill in all fields."); // Set error message
      return;
    }
    // Add the username to the creator field before making the POST request
    const museumWithCreator = {
      ...newMuseum,
      creator: username, // Set the creator field dynamically
    };

    axios
      .post("http://localhost:3000/museums", museumWithCreator)
      .then(() => {
        refreshMuseums();
        setNewMuseum({
          name: "",
          location: "",
          description: "",
          openingHours: {
            from: "",
            to: "",
          },
          picture: "",
          ticketPrices: {
            foreigner: "",
            native: "",
            student: "",
          },
          tags: [], // Reset tags after successful addition
        });
        setErrorMessage(""); // Clear error message on successful add
      })
      .catch((error) => {
        console.error("Error adding museum:", error);
        setErrorMessage("Failed to add museum. Please try again."); // Set error message on failure
      });
  };

  const handleTagChange = (tag) => {
    const updatedTags = newMuseum.tags.includes(tag)
      ? newMuseum.tags.filter((t) => t !== tag) // Remove tag if already selected
      : [...newMuseum.tags, tag]; // Add tag if not selected

    setNewMuseum({ ...newMuseum, tags: updatedTags }); // Update newMuseum with modified tags
  };

  return (
    <form onSubmit={handleSubmit} className="add-museum-form">
      <h3>Add New Museum</h3>
      {errorMessage && <div className="alert">{errorMessage}</div>}
      <input
        type="text"
        value={newMuseum.name}
        onChange={(e) => setNewMuseum({ ...newMuseum, name: e.target.value })}
        placeholder="Museum Name"
        required
      />
      <input
        type="text"
        value={newMuseum.location}
        onChange={(e) =>
          setNewMuseum({ ...newMuseum, location: e.target.value })
        }
        placeholder="Location"
        required
      />
      <textarea
        value={newMuseum.description}
        onChange={(e) =>
          setNewMuseum({ ...newMuseum, description: e.target.value })
        }
        placeholder="Description"
        rows="4"
        required
      />

      {/* Time range for opening hours */}
      <div className="time-range">
        <label>Opening Hours From:</label>
        <input
          type="time"
          value={newMuseum.openingHours.from}
          onChange={(e) =>
            setNewMuseum({
              ...newMuseum,
              openingHours: { ...newMuseum.openingHours, from: e.target.value },
            })
          }
          required
        />

        <label>To:</label>
        <input
          type="time"
          value={newMuseum.openingHours.to}
          onChange={(e) =>
            setNewMuseum({
              ...newMuseum,
              openingHours: { ...newMuseum.openingHours, to: e.target.value },
            })
          }
          required
        />
      </div>

      {/* File input for image upload */}
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
        {newMuseum.picture && (
          <img
            src={newMuseum.picture}
            alt="Uploaded Preview"
            className={newMuseum.picture ? "active" : ""}
          />
        )}{" "}
        {/* Display uploaded image */}
      </div>

      <input
        type="number"
        value={newMuseum.ticketPrices.foreigner}
        onChange={(e) =>
          setNewMuseum({
            ...newMuseum,
            ticketPrices: {
              ...newMuseum.ticketPrices,
              foreigner: e.target.value,
            },
          })
        }
        placeholder="Ticket Price for Foreigners"
        required
      />
      <input
        type="number"
        value={newMuseum.ticketPrices.native}
        onChange={(e) =>
          setNewMuseum({
            ...newMuseum,
            ticketPrices: {
              ...newMuseum.ticketPrices,
              native: e.target.value,
            },
          })
        }
        placeholder="Ticket Price for Natives"
        required
      />
      <input
        type="number"
        value={newMuseum.ticketPrices.student}
        onChange={(e) =>
          setNewMuseum({
            ...newMuseum,
            ticketPrices: {
              ...newMuseum.ticketPrices,
              student: e.target.value,
            },
          })
        }
        placeholder="Ticket Price for Students"
        required
      />

      {/* Tag selection */}
      <div className="tag-selection">
        <label>Tags:</label>
        {predefinedTags.map((tag) => (
          <label key={tag}>
            <input
              type="checkbox"
              checked={newMuseum.tags.includes(tag)} // Check if tag is selected
              onChange={() => handleTagChange(tag)} // Handle tag change
            />
            {tag}
          </label>
        ))}
      </div>

      <button type="submit" className="add-button">
        Add Museum
      </button>
    </form>
  );
};

export default AddMuseumForm;

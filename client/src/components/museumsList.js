import React, { useState, useEffect } from "react";
import axios from "axios";
import "../museumList.css"; // Importing updated CSS file for styles

const MuseumsList = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMuseum, setEditingMuseum] = useState(null);
  const [newData, setNewData] = useState({
    name: "",
    location: "",
    description: "",
    ticketPrice: "",
    openingHours: "",
    picture: "", // Add picture to the new data state
  });
  const [addingMuseum, setAddingMuseum] = useState(false); // State for adding museum

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = () => {
    axios
      .get("http://localhost:3000/museums")
      .then((response) => {
        setMuseums(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching museums:", error);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/museums/${id}`)
      .then(() => {
        fetchMuseums(); // Refresh the list after deletion
      })
      .catch((error) => {
        console.error("Error deleting museum:", error);
      });
  };

  const handleEdit = (museum) => {
    setEditingMuseum(museum._id);
    setNewData({
      name: museum.name,
      location: museum.location,
      description: museum.description,
      ticketPrice: museum.ticketPrice,
      openingHours: museum.openingHours,
      picture: museum.picture, // Include picture for editing
    });
  };

  const handleUpdate = (id) => {
    axios
      .put(`http://localhost:3000/museums/${id}`, newData)
      .then(() => {
        fetchMuseums(); // Refresh the list after updating
        setEditingMuseum(null);
        resetForm(); // Reset the form data
      })
      .catch((error) => {
        console.error("Error updating museum:", error);
      });
  };

  const handleAddMuseum = () => {
    axios
      .post("http://localhost:3000/museums", newData)
      .then(() => {
        fetchMuseums(); // Refresh the list after adding
        setAddingMuseum(false);
        resetForm(); // Reset the form data
      })
      .catch((error) => {
        console.error("Error adding museum:", error);
      });
  };

  const resetForm = () => {
    setNewData({
      name: "",
      location: "",
      description: "",
      ticketPrice: "",
      openingHours: "",
      picture: "", // Reset picture field
    });
  };

  return (
    <div className="museums-container">
      <h1 className="title">Museums and Historical Places</h1>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="museums-list">
          {museums.map((museum) => (
            <div
              className={`museum-card ${
                editingMuseum === museum._id ? "edit-mode" : ""
              }`}
              key={museum._id}
            >
              {museum.picture && (
                <img
                  className="museum-image"
                  src={museum.picture}
                  alt={museum.name}
                />
              )}
              <div className="museum-details">
                {editingMuseum === museum._id ? (
                  <div>
                    <input
                      type="text"
                      value={newData.name}
                      onChange={(e) =>
                        setNewData({ ...newData, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={newData.location}
                      onChange={(e) =>
                        setNewData({ ...newData, location: e.target.value })
                      }
                    />
                    <textarea
                      value={newData.description}
                      onChange={(e) =>
                        setNewData({ ...newData, description: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={newData.ticketPrice}
                      onChange={(e) =>
                        setNewData({ ...newData, ticketPrice: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={newData.openingHours}
                      onChange={(e) =>
                        setNewData({ ...newData, openingHours: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={newData.picture} // Add picture input
                      onChange={(e) =>
                        setNewData({ ...newData, picture: e.target.value })
                      }
                      placeholder="Image URL" // Placeholder for image URL
                    />
                    <button
                      className="update"
                      onClick={() => handleUpdate(museum._id)}
                    >
                      Update
                    </button>
                    <button
                      className="cancel"
                      onClick={() => setEditingMuseum(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="museum-name">{museum.name}</h2>
                    <p className="museum-location">{museum.location}</p>
                    <p className="museum-description">{museum.description}</p>
                    <div className="museum-footer">
                      <span className="museum-ticket">
                        Ticket: ${museum.ticketPrice}
                      </span>
                      <span className="museum-hours">
                        Hours: {museum.openingHours}
                      </span>
                      <button
                        className="edit"
                        onClick={() => handleEdit(museum)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(museum._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Add button to show add museum form */}
          {addingMuseum ? (
            <div className="museum-card">
              <h3>Add New Museum</h3>
              <input
                type="text"
                value={newData.name}
                onChange={(e) =>
                  setNewData({ ...newData, name: e.target.value })
                }
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
              />
              <input
                type="number"
                value={newData.ticketPrice}
                onChange={(e) =>
                  setNewData({ ...newData, ticketPrice: e.target.value })
                }
                placeholder="Ticket Price"
              />
              <input
                type="text"
                value={newData.openingHours}
                onChange={(e) =>
                  setNewData({ ...newData, openingHours: e.target.value })
                }
                placeholder="Opening Hours"
              />
              <input
                type="text"
                value={newData.picture}
                onChange={(e) =>
                  setNewData({ ...newData, picture: e.target.value })
                }
                placeholder="Image URL"
              />
              <button className="update" onClick={handleAddMuseum}>
                Add Museum
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setAddingMuseum(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="addMuseum" onClick={() => setAddingMuseum(true)}>
              Add Museum
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MuseumsList;

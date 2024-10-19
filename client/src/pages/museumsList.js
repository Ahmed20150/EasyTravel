import React, { useState, useEffect } from "react";
import axios from "axios";
import MuseumCard from "../components/museumCard";
import AddMuseumForm from "../components/AddMuseumForm";
import "../styles/museumList.css"; // Import CSS styles

const MuseumsList = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = () => {
    setLoading(true);
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
      .then(() => fetchMuseums()) // Refresh the list after deletion
      .catch((error) => console.error("Error deleting museum:", error));
  };

  return (
    <div className="museums-container">
      <h1 className="title">Museums and Historical Places</h1>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="museums-list">
          {museums.map((museum) => (
            <MuseumCard
              key={museum._id}
              museum={museum}
              onDelete={() => handleDelete(museum._id)}
              refreshMuseums={fetchMuseums}
            />
          ))}
        </div>
      )}
      <AddMuseumForm refreshMuseums={fetchMuseums} />
    </div>
  );
};

export default MuseumsList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import MuseumCard from "../components/museumCard";
import "../css/museumList.css"; // Import CSS styles
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { fadeIn, buttonStyle ,promoCodeListStyle,cardStyle } from "../styles/HipaStyles"; // Import styles
import { Navbar, Button, Card, Footer } from "flowbite-react";

const MuseumsList = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["username"]);
  const navigate = useNavigate();
  const username = cookies.username;

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/museums")
      .then((response) => {
        setMuseums(
          response.data.filter((museum) => museum.creator === username)
        );
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
      <h1 className="title" style={{ color: 'black' }}>Museums and Historical Places</h1>

      {/* Add New Museum Button */}
      <div
  style={{
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'flex-start', // Align to the top
    marginTop: '20px', // Add space from the top
  }}
>
  <button
    className={buttonStyle}
    style={{
      marginBottom: '20px',
      padding: '10px 20px',
      backgroundColor: '#000', // Black background
      color: '#fff', // White text
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => navigate('/add-museum')}
  >
    Add New Museum
  </button>
</div>


      {/* Loading Indicator */}
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

      {/* Back to Home Button */}
      <button
        className={buttonStyle}
        style={{ position: 'absolute', top: '10px', left: '10px' }}
        onClick={() => navigate('/home')}
      >
        Back to Home Page
      </button>
    </div>
  );
};

export default MuseumsList;

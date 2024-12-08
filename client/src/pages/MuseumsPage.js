import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewMuseumCard from "../components/ViewMuseumCard";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MuseumsPage = () => {
  // Museum-related state
  const [museums, setMuseums] = useState([]);
  const [filteredMuseums, setFilteredMuseums] = useState([]);
  const [loadingMuseums, setLoadingMuseums] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchMuseumName, setSearchMuseumName] = useState("");
  const [searchMuseumTags, setSearchMuseumTags] = useState("");
  const museumScrollRef = useRef(null);

  // Get cookies for nationality and occupation
  const [cookies] = useCookies(["nationality", "occupation"]);
  const nationality = cookies.nationality;
  const occupation = cookies.occupation;

  const predefinedTags = [
    "Monuments",
    "Museums",
    "Religious Sites",
    "Palaces/Castles",
  ];

  // Scroll handling
  const handleScroll = (direction) => {
    const amount = direction === "left" ? -340 : 340;
    museumScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Fetch museums on component mount
  useEffect(() => {
    fetchMuseums();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFiltersMuseums();
  }, [museums, selectedTags, searchMuseumName, searchMuseumTags]);

  const fetchMuseums = async () => {
    setLoadingMuseums(true);
    try {
      const response = await axios.get("http://localhost:3000/museums");
      setMuseums(response.data);
      setFilteredMuseums(response.data);
    } catch (error) {
      console.error("Error fetching museums:", error);
    } finally {
      setLoadingMuseums(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSearchMuseumNameChange = (e) => {
    setSearchMuseumName(e.target.value);
  };

  const handleSearchMuseumTagsChange = (e) => {
    setSearchMuseumTags(e.target.value);
  };

  const applyFiltersMuseums = () => {
    let filtered = [...museums];

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((museum) =>
        museum.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Filter by museum name
    if (searchMuseumName) {
      filtered = filtered.filter((museum) =>
        museum.name.toLowerCase().includes(searchMuseumName.toLowerCase())
      );
    }

    // Filter by museum tags
    if (searchMuseumTags) {
      filtered = filtered.filter((museum) =>
        museum.tags.some((tag) =>
          tag.toLowerCase().includes(searchMuseumTags.toLowerCase())
        )
      );
    }

    setFilteredMuseums(filtered);
  };

  return (
    <div className="explore-page">
      <ToastContainer />
      <h1>Museums & Historical Places</h1>
      <Link to="/home" className="back-button">
        &larr; Back
      </Link>

      {/* Museum Filter Section */}
      <div className="filter-section">
        <h2 className="filters-title">Filter Museums</h2>
        <div className="filters">
          <div className="filter">
            <label htmlFor="museum-name">Search by Museum Name:</label>
            <input
              type="text"
              id="museum-name"
              value={searchMuseumName}
              onChange={handleSearchMuseumNameChange}
              placeholder="Enter museum name"
            />
          </div>
          <div className="filter">
            <label htmlFor="museum-tags">Search by Tags:</label>
            <input
              type="text"
              id="museum-tags"
              value={searchMuseumTags}
              onChange={handleSearchMuseumTagsChange}
              placeholder="Enter tags"
            />
          </div>
        </div>
      </div>

      {/* Tag Filter Section */}
      <div className="museum-tag-filter">
        {predefinedTags.map((tag) => (
          <div
            key={tag}
            className={`tag ${selectedTags.includes(tag) ? "active" : ""}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Museums Section */}
      <div className="section">
        <h2 className="section-title">Museums & Historical Places</h2>
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left")}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={museumScrollRef}>
            {loadingMuseums ? (
              <div className="loader">Loading Museums...</div>
            ) : filteredMuseums.length > 0 ? (
              filteredMuseums.map((museum) => (
                <ViewMuseumCard
                  key={museum._id}
                  museum={museum}
                  nationality={nationality}
                  occupation={occupation}
                />
              ))
            ) : (
              <div className="no-results">No Museums match the filters</div>
            )}
          </div>
          <button
            onClick={() => handleScroll("right")}
            className="scroll-button right"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MuseumsPage; 
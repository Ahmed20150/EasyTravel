import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewItineraryCard from "../components/ViewItineraryCard";
import ViewActivityCard from "../components/ViewActivityCard";
import ViewMuseumCard from "../components/ViewMuseumCard";
import { useCookies } from "react-cookie";
import "../css/ExplorePage.css";

const ExplorePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [scrollDistance, setScrollDistance] = useState(340);

  const [loadingItineraries, setLoadingItineraries] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingMuseums, setLoadingMuseums] = useState(true);

  const [sortOptionItineraries, setSortOptionItineraries] = useState("default");
  const [sortOptionActivities, setSortOptionActivities] = useState("default");

  const [cookies] = useCookies(["nationality", "occupation"]);
  const nationality = cookies.nationality;
  const occupation = cookies.occupation;

  const itineraryScrollRef = useRef(null);
  const activityScrollRef = useRef(null);
  const museumScrollRef = useRef(null);

  const handleScroll = (direction, ref) => {
    const amount = direction === "left" ? -scrollDistance : scrollDistance;
    ref.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const predefinedTags = [
    "Monuments",
    "Museums",
    "Religious Sites",
    "Palaces/Castles",
  ];
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchItineraries();
    fetchActivities();
    fetchMuseums();
  }, []);

  const fetchItineraries = async () => {
    setLoadingItineraries(true);
    const response = await axios.get("http://localhost:3000/itinerary");
    setItineraries(response.data);
    setLoadingItineraries(false);
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    const response = await axios.get("http://localhost:3000/activities");
    setActivities(response.data);
    setLoadingActivities(false);
  };

  const fetchMuseums = async () => {
    setLoadingMuseums(true);
    const response = await axios.get("http://localhost:3000/museums");
    setMuseums(response.data);
    setLoadingMuseums(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const filteredMuseums = selectedTags.length
    ? museums.filter((museum) =>
        museum.tags.some((tag) => selectedTags.includes(tag))
      )
    : museums;

  // Sorting for itineraries
  const handleSortItineraries = (e) => {
    const option = e.target.value;
    setSortOptionItineraries(option);

    const sortedItineraries = [...itineraries];
    if (option === "rating") {
      sortedItineraries.sort((a, b) => b.avgRating - a.avgRating); // Descending by rating
    } else if (option === "price") {
      sortedItineraries.sort((a, b) => a.priceOfTour - b.priceOfTour); // Ascending by price
    }
    setItineraries(sortedItineraries);
  };

  // Sorting for activities
  const handleSortActivities = (e) => {
    const option = e.target.value;
    setSortOptionActivities(option);

    const sortedActivities = [...activities];
    if (option === "rating") {
      sortedActivities.sort((a, b) => b.avgRating - a.avgRating);
    } else if (option === "price") {
      sortedActivities.sort(
        (a, b) =>
          (a.price.min + a.price.max) / 2 - (b.price.min + b.price.max) / 2
      );
    }
    setActivities(sortedActivities);
  };

  return (
    <div className="explore-page">
      <h1>Explore Upcoming Attractions</h1>
      <p>Discover activities, itineraries, and historical places near you.</p>

      {/* Itineraries Section */}
      <div className="section">
        <h2 className="section-title">Itineraries</h2>

        {/* Sorting Options */}
        <div className="sort-options">
          <label htmlFor="sort-itineraries">Sort by:</label>
          <select
            id="sort-itineraries"
            value={sortOptionItineraries}
            onChange={handleSortItineraries}
          >
            <option value="default">Default</option>
            <option value="rating">Average Rating ⭐</option>
            <option value="price">Price</option>
          </select>
        </div>

        {/* Render Itineraries */}
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left", itineraryScrollRef)}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={itineraryScrollRef}>
            {loadingItineraries ? (
              <div className="loader">Loading Itineraries...</div>
            ) : (
              itineraries.map((itinerary) => (
                <ViewItineraryCard key={itinerary._id} itinerary={itinerary} />
              ))
            )}
          </div>
          <button
            onClick={() => handleScroll("right", itineraryScrollRef)}
            className="scroll-button right"
          >
            →
          </button>
        </div>
      </div>

      {/* Activities Section */}
      <div className="section">
        <h2 className="section-title">Activities</h2>
        <div className="sort-options">
          <label htmlFor="sort-activities">Sort by:</label>
          <select
            id="sort-activities"
            value={sortOptionActivities}
            onChange={handleSortActivities}
          >
            <option value="default">Default</option>
            <option value="rating">Average Rating ⭐</option>
            <option value="price">Starting Price</option>
          </select>
        </div>

        {/* Render Activities */}
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left", activityScrollRef)}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={activityScrollRef}>
            {loadingActivities ? (
              <div className="loader">Loading Activities...</div>
            ) : (
              activities.map((activity) => (
                <ViewActivityCard key={activity._id} activity={activity} />
              ))
            )}
          </div>
          <button
            onClick={() => handleScroll("right", activityScrollRef)}
            className="scroll-button right"
          >
            →
          </button>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Museums & Historical Places</h2>
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
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left", museumScrollRef)}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={museumScrollRef}>
            {loadingMuseums ? (
              <div className="loader">Loading Museums...</div>
            ) : (
              filteredMuseums.map((museum) => (
                <ViewMuseumCard
                  key={museum._id}
                  museum={museum}
                  nationality={nationality}
                  occupation={occupation}
                />
              ))
            )}
          </div>
          <button
            onClick={() => handleScroll("right", museumScrollRef)}
            className="scroll-button right"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

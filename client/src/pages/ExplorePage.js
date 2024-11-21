import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewItineraryCard from "../components/ViewItineraryCard";
import ViewActivityCard from "../components/ViewActivityCard";
import ViewMuseumCard from "../components/ViewMuseumCard";
import { useCookies } from "react-cookie";
import "../css/ExplorePage.css";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';


const ExplorePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [scrollDistance, setScrollDistance] = useState(340);

  const [loadingItineraries, setLoadingItineraries] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingMuseums, setLoadingMuseums] = useState(true);

  const [sortOptionItineraries, setSortOptionItineraries] = useState("default");
  const [sortOptionActivities, setSortOptionActivities] = useState("default");

  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]); // Store bookmarked itineraries


  const [cookies] = useCookies(["nationality", "occupation"]);
  const nationality = cookies.nationality;
  const occupation = cookies.occupation;

  const [filterCriteriaItineraries, setFilterCriteriaItineraries] = useState({
    maxBudget: "",
    date: "",
    language: "",
  });

  const [filterCriteriaActivities, setFilterCriteriaActivities] = useState({
    maxBudget: "",
    date: "",
  });

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

  useEffect(() => {
    applyFiltersItineraries();
  }, [filterCriteriaItineraries, itineraries]);

  useEffect(() => {
    applyFiltersActivities();
  }, [filterCriteriaActivities, activities]);

  const fetchItineraries = async () => {
    setLoadingItineraries(true);
    const response = await axios.get("http://localhost:3000/itinerary");
    const currentDate = new Date();
    const upcomingItineraries = response.data
      .filter((itinerary) => itinerary.flagged === "no") // Exclude flagged itineraries
      .map((itinerary) => ({
        ...itinerary,
        availableDates: itinerary.availableDates.filter(
          (date) => new Date(date) > currentDate
        ),
      }))
      .filter((itinerary) => itinerary.availableDates.length > 0);
    setItineraries(upcomingItineraries);
    setLoadingItineraries(false);
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    const response = await axios.get("http://localhost:3000/activities");
    const currentDate = new Date();
    const upcomingActivities = response.data
      .filter((activity) => activity.flagged === "no") // Exclude flagged activities
      .filter((activity) => new Date(activity.date) > currentDate);
    setActivities(upcomingActivities);
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

  const handleFilterChangeItineraries = (e) => {
    const { name, value } = e.target;
    setFilterCriteriaItineraries((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChangeActivities = (e) => {
    const { name, value } = e.target;
    setFilterCriteriaActivities((prev) => ({ ...prev, [name]: value }));
  };

  const applyFiltersItineraries = () => {
    let filtered = [...itineraries];

    // Budget filter
    if (filterCriteriaItineraries.maxBudget) {
      filtered = filtered.filter(
        (itinerary) =>
          itinerary.priceOfTour <= filterCriteriaItineraries.maxBudget
      );
    }

    // Date filter
    if (filterCriteriaItineraries.date) {
      const selectedDate = new Date(filterCriteriaItineraries.date);
      filtered = filtered.filter((itinerary) =>
        itinerary.availableDates.some(
          (date) =>
            new Date(date).toDateString() === selectedDate.toDateString()
        )
      );
    }

    // Language filter
    if (filterCriteriaItineraries.language) {
      filtered = filtered.filter((itinerary) =>
        itinerary.languageOfTour
          .toLowerCase()
          .includes(filterCriteriaItineraries.language.toLowerCase())
      );
    }

    setFilteredItineraries(filtered);
  };

  const applyFiltersActivities = () => {
    let filtered = [...activities];

    if (filterCriteriaActivities.maxBudget) {
      filtered = filtered.filter(
        (activity) => activity.price.max <= filterCriteriaActivities.maxBudget
      );
    }

    if (filterCriteriaActivities.date) {
      const selectedDate = new Date(filterCriteriaActivities.date);
      filtered = filtered.filter((activity) =>
        activity.availableDates.some(
          (date) =>
            new Date(date).toDateString() === selectedDate.toDateString()
        )
      );
    }

    setFilteredActivities(filtered);
  };

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

  const username = Cookies.get("username");
  const handleBookmark = async (id) => {
    try {
        // Toggle the itinerary in the bookmarked itineraries list
        await axios.patch("http://localhost:3000/api/bookmarkEvent", {
            username,
            eventId: id, // Send only the event ID
        });

        // Update the local state based on whether the event is already bookmarked
        setBookmarkedItineraries(prevBookmarkedItineraries => {
            const isBookmarked = prevBookmarkedItineraries.includes(id);

            // If it's already bookmarked, remove it; otherwise, add it
            if (isBookmarked) {
                return prevBookmarkedItineraries.filter(itineraryId => itineraryId !== id);  // Remove bookmark
            } else {
                return [...prevBookmarkedItineraries, id];  // Add bookmark
            }
        });
    } catch (error) {
        console.error("Error bookmarking itinerary:", error.response?.data || error.message);
    }
};

  return (
    <div className="explore-page">
      <h1>Explore Upcoming Attractions</h1>
      <p>Discover activities, itineraries, and historical places near you.</p>
      <Link to="/home" className="back-button"> {/* Adjust the path as needed */}
        &larr; Back
      </Link>
      {/* Itineraries Filter Section */}
      <div className="filter-section">
        <h2 className="filters-title">Filter Itineraries</h2>
        <div className="filters">
          {/* Sorting Options */}
          <div className="filter">
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
          <div className="filter">
            <label htmlFor="maxBudget">Max Budget:</label>
            <input
              type="number"
              id="maxBudget"
              name="maxBudget"
              value={filterCriteriaItineraries.maxBudget}
              onChange={handleFilterChangeItineraries}
              placeholder="Enter max budget"
            />
          </div>
          <div className="filter">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={filterCriteriaItineraries.date}
              onChange={handleFilterChangeItineraries}
            />
          </div>
          <div className="filter">
            <label htmlFor="language">Language:</label>
            <input
              type="text"
              id="language"
              name="language"
              value={filterCriteriaItineraries.language}
              onChange={handleFilterChangeItineraries}
              placeholder="Enter language"
            />
          </div>
        </div>
      </div>

      {/* Itineraries Section */}
      <div className="section">
        <h2 className="section-title">Itineraries</h2>

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
            ) : filteredItineraries.length > 0 ? (
              filteredItineraries.map((itinerary) => (
                <ViewItineraryCard key={itinerary._id} itinerary={itinerary} />
              ))
            ) : (
              <div className="no-results">No itineraries match the filters</div>
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

      {/* Activities Filter Section */}
      <div className="filter-section">
        <h2 className="filters-title">Filter Activities</h2>
        <div className="filters">
          {/* Sort */}
          <div className="filter">
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
          <div className="filter">
            <label htmlFor="maxBudget">Max Budget:</label>
            <input
              type="number"
              id="maxBudget"
              name="maxBudget"
              value={filterCriteriaActivities.maxBudget}
              onChange={handleFilterChangeActivities}
              placeholder="Enter max budget"
            />
          </div>
          <div className="filter">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={filterCriteriaActivities.date}
              onChange={handleFilterChangeActivities}
            />
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="section">
        <h2 className="section-title">Activities</h2>

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
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ViewActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <div className="no-results">No activities match the filters</div>
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

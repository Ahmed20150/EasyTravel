import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewItineraryCard from "../components/ViewItineraryCard";
import ViewActivityCard from "../components/ViewActivityCard";
import ViewMuseumCard from "../components/ViewMuseumCard";
import { useCookies } from "react-cookie";
import "../css/ExplorePage.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const ExplorePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [filteredMuseums, setFilteredMuseums] = useState([]);
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
    rating: "", // Added rating filter for activities
  });

  const [searchCategory, setSearchCategory] = useState(""); // Added state for category search
  const [searchTags, setSearchTags] = useState(""); // Added state for tag search for activities
  const [searchMuseumTags, setSearchMuseumTags] = useState(""); // Added state for tag search for museums
  const [searchMuseumName, setSearchMuseumName] = useState(""); // Added state for searching museums by name
  const [searchItineraryCreator, setSearchItineraryCreator] = useState(""); // Search by itinerary creator
  const [searchActivityCreator, setSearchActivityCreator] = useState(""); // Search by activity creator

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
  }, [filterCriteriaItineraries, itineraries, searchItineraryCreator]);

  useEffect(() => {
    applyFiltersActivities();
  }, [
    filterCriteriaActivities,
    activities,
    searchCategory,
    searchTags,
    searchActivityCreator,
  ]); // Added searchActivityCreator to the dependency array

  useEffect(() => {
    applyFiltersMuseums();
  }, [museums, searchMuseumTags, searchMuseumName]); // Re-run filter when searchMuseumTags or searchMuseumName changes

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

  const filteredMuseumsByTags = searchMuseumTags
    ? museums.filter((museum) =>
        museum.tags.some((tag) =>
          tag.toLowerCase().includes(searchMuseumTags.toLowerCase())
        )
      )
    : museums;

  const filteredMuseumsByName = searchMuseumName
    ? museums.filter((museum) =>
        museum.name.toLowerCase().includes(searchMuseumName.toLowerCase())
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

  const handleSearchCategoryChange = (e) => {
    setSearchCategory(e.target.value); // Handle category search input change
  };

  const handleSearchItineraryCreatorChange = (e) => {
    setSearchItineraryCreator(e.target.value); // Handle itinerary creator search input change
  };

  const handleSearchTagsChange = (e) => {
    setSearchTags(e.target.value); // Handle tags search input change
  };

  const handleSearchMuseumTagsChange = (e) => {
    setSearchMuseumTags(e.target.value); // Handle tags search for museums
  };

  const handleSearchMuseumNameChange = (e) => {
    setSearchMuseumName(e.target.value); // Handle name search for museums
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
    if (searchItineraryCreator) {
      filtered = filtered.filter(
        (itinerary) =>
          itinerary.creator &&
          itinerary.creator
            .toLowerCase()
            .includes(searchItineraryCreator.toLowerCase())
      );
    }

    setFilteredItineraries(filtered);
  };

  const applyFiltersActivities = () => {
    let filtered = [...activities];

    // Apply category search filter if present
    if (searchCategory) {
      filtered = filtered.filter(
        (activity) =>
          activity.category.toLowerCase().includes(searchCategory.toLowerCase()) // Filter by category
      );
    }

    if (searchActivityCreator) {
      filtered = filtered.filter(
        (activity) =>
          activity.creator &&
          activity.creator
            .toLowerCase()
            .includes(searchActivityCreator.toLowerCase())
      );
    }

    // Apply tag search filter if present
    if (searchTags) {
      filtered = filtered.filter((activity) =>
        activity.tags.some(
          (tag) => tag.toLowerCase().includes(searchTags.toLowerCase()) // Filter by tags
        )
      );
    }

    // Budget filter
    if (filterCriteriaActivities.maxBudget) {
      filtered = filtered.filter(
        (activity) => activity.price.max <= filterCriteriaActivities.maxBudget
      );
    }

    // Date filter
    if (filterCriteriaActivities.date) {
      const selectedDate = new Date(filterCriteriaActivities.date);
      filtered = filtered.filter((activity) =>
        activity.availableDates.some(
          (date) =>
            new Date(date).toDateString() === selectedDate.toDateString()
        )
      );
    }

    // Rating filter
    if (filterCriteriaActivities.rating) {
      filtered = filtered.filter(
        (activity) => activity.avgRating >= filterCriteriaActivities.rating
      );
    }

    setFilteredActivities(filtered);
  };

  const applyFiltersMuseums = () => {
    let filtered = [...filteredMuseumsByTags];

    // Apply museum name search filter if present
    if (searchMuseumName) {
      filtered = filtered.filter((museum) =>
        museum.name.toLowerCase().includes(searchMuseumName.toLowerCase())
      );
    }

    setFilteredMuseums(filtered); // Update filteredMuseums
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
      sortedActivities.sort((a, b) => b.avgRating - a.avgRating); // Descending by rating
    } else if (option === "price") {
      sortedActivities.sort((a, b) => a.price.max - b.price.max); // Ascending by price
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
      setBookmarkedItineraries((prevBookmarkedItineraries) => {
        const isBookmarked = prevBookmarkedItineraries.includes(id);

        // If it's already bookmarked, remove it; otherwise, add it
        if (isBookmarked) {
          return prevBookmarkedItineraries.filter(
            (itineraryId) => itineraryId !== id
          ); // Remove bookmark
        } else {
          return [...prevBookmarkedItineraries, id]; // Add bookmark
        }
      });
    } catch (error) {
      console.error(
        "Error bookmarking itinerary:",
        error.response?.data || error.message
      );
    }
  };

  const handleSearchActivityCreatorChange = (e) => {
    setSearchActivityCreator(e.target.value);
  };

  return (
    <div className="explore-page">
      <h1>Explore Upcoming Attractions</h1>
      <p>Discover activities, itineraries, and historical places near you.</p>
      <Link to="/home" className="back-button">
        {" "}
        {/* Adjust the path as needed */}
        &larr; Back
      </Link>
      {/* Itineraries Filter Section */}
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
              placeholder="Enter tags (comma separated)"
            />
          </div>
        </div>
      </div>

      {/* Museums Section */}
      <div className="section">
        <h2 className="section-title">Museums</h2>
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left", museumScrollRef)}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={museumScrollRef}>
            {loadingMuseums ? (
              <p>Loading museums...</p>
            ) : filteredMuseums.length > 0 ? (
              filteredMuseums.map((museum) => (
                <ViewMuseumCard key={museum._id} museum={museum} />
              ))
            ) : (
              <p>No museums match your filters or selected tags.</p>
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

      {/* Itinerary Filter Section */}
      <div className="filter-section">
        <h2 className="filters-title">Filter Itineraries</h2>
        <div className="filters">
          <div className="filter">
            <label htmlFor="maxBudget-itinerary">Max Budget:</label>
            <input
              type="number"
              id="maxBudget-itinerary"
              name="maxBudget"
              value={filterCriteriaItineraries.maxBudget}
              onChange={handleFilterChangeItineraries}
              placeholder="Enter max budget"
            />
          </div>
          <div className="filter">
            <label htmlFor="date-itinerary">Date:</label>
            <input
              type="date"
              id="date-itinerary"
              name="date"
              value={filterCriteriaItineraries.date}
              onChange={handleFilterChangeItineraries}
            />
          </div>
          <div className="filter">
            <label htmlFor="language-itinerary">Language:</label>
            <input
              type="text"
              id="language-itinerary"
              name="language"
              value={filterCriteriaItineraries.language}
              onChange={handleFilterChangeItineraries}
              placeholder="Enter language"
            />
          </div>
          <div className="filter">
            <label htmlFor="search-itinerary-creator">
              Search by Itinerary Creator:
            </label>
            <input
              type="text"
              id="search-itinerary-creator"
              value={searchItineraryCreator}
              onChange={handleSearchItineraryCreatorChange}
              placeholder="Enter creator name"
            />
          </div>
          <div className="filter">
            <label htmlFor="sort-itinerary">Sort By:</label>
            <select
              id="sort-itinerary"
              value={sortOptionItineraries}
              onChange={handleSortItineraries}
            >
              <option value="default">Default</option>
              <option value="rating">Average Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Itineraries Section */}
      <div className="section">
        <h2 className="section-title">Itineraries</h2>
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left", itineraryScrollRef)}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={itineraryScrollRef}>
            {loadingItineraries ? (
              <p>Loading itineraries...</p>
            ) : filteredItineraries.length > 0 ? (
              filteredItineraries.map((itinerary) => (
                <ViewItineraryCard key={itinerary._id} itinerary={itinerary} />
              ))
            ) : (
              <p>No itineraries match your filters.</p>
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
          <div className="filter">
            <label htmlFor="maxBudget-activity">Max Budget:</label>
            <input
              type="number"
              id="maxBudget-activity"
              name="maxBudget"
              value={filterCriteriaActivities.maxBudget}
              onChange={handleFilterChangeActivities}
              placeholder="Enter max budget"
            />
          </div>
          <div className="filter">
            <label htmlFor="date-activity">Date:</label>
            <input
              type="date"
              id="date-activity"
              name="date"
              value={filterCriteriaActivities.date}
              onChange={handleFilterChangeActivities}
            />
          </div>
          <div className="filter">
            <label htmlFor="category-activity">Category:</label>
            <input
              type="text"
              id="category-activity"
              value={searchCategory}
              onChange={handleSearchCategoryChange}
              placeholder="Enter category"
            />
          </div>
          <div className="filter">
            <label htmlFor="tags-activity">Search by Tags:</label>
            <input
              type="text"
              id="tags-activity"
              value={searchTags}
              onChange={handleSearchTagsChange}
              placeholder="Enter tags (comma separated)"
            />
          </div>
          <div className="filter">
            <label htmlFor="search-activity-creator">
              Search by Activity Creator:
            </label>
            <input
              type="text"
              id="search-activity-creator"
              value={searchActivityCreator}
              onChange={handleSearchActivityCreatorChange}
              placeholder="Enter creator name"
            />
          </div>

          <div className="filter">
            <label htmlFor="rating-activity">Min Rating:</label>
            <input
              type="number"
              id="rating-activity"
              name="rating"
              value={filterCriteriaActivities.rating}
              onChange={handleFilterChangeActivities}
              min="0"
              max="5"
              step="0.1"
              placeholder="Enter minimum rating"
            />
          </div>
          <div className="filter">
            <label htmlFor="sort-activity">Sort By:</label>
            <select
              id="sort-activity"
              value={sortOptionActivities}
              onChange={handleSortActivities}
            >
              <option value="default">Default</option>
              <option value="rating">Average Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="section">
        <h2 className="section-title">Activities</h2>
        <div className="card-scroll-container">
          <button
            onClick={() => handleScroll("left", activityScrollRef)}
            className="scroll-button left"
          >
            ←
          </button>
          <div className="card-scroll" ref={activityScrollRef}>
            {loadingActivities ? (
              <p>Loading activities...</p>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ViewActivityCard key={activity._id} activity={activity} />
              ))
            ) : (
              <p>No activities match your filters.</p>
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
    </div>
  );
};

export default ExplorePage;

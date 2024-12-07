import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewItineraryCard from "../components/ViewItineraryCard";
import ViewActivityCard from "../components/ViewActivityCard";
import ViewMuseumCard from "../components/ViewMuseumCard";
import { useCookies } from "react-cookie";
// import "../css/ExplorePage.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

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

  const [preferencesItineraries, setPreferencesItineraries] =
    useState("no prefrence");

  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]); // Store bookmarked itineraries

  const [cookies] = useCookies(["nationality", "occupation"]);
  const nationality = cookies.nationality;
  const occupation = cookies.occupation;

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [bookedItineraries, setBookedItineraries] = useState([]); // Store booked itineraries

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
  const [bookedItems, setBookedItems] = useState({ itineraries: [], activities: [] });

  const normalizedDate = Array.isArray(availableDates)
    ? availableDates
    : [availableDates];
  const normalizedTime = Array.isArray(availableTimes)
    ? availableTimes
    : [availableTimes];

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
  }, [museums, selectedTags, searchMuseumName]); // Re-run filter when searchMuseumTags or searchMuseumName changes

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
      .filter((itinerary) => itinerary.availableDates.length > 0)
      .filter((itinerary) => !itinerary.touristsBooked.includes(username));
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

  const filteredMuseumsByTags = selectedTags.length
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
    setPreferencesItineraries(option);

    const sortedItineraries = [...itineraries];
    if (option === "rating") {
      sortedItineraries.sort((a, b) => b.avgRating - a.avgRating); // Descending by rating
    } else if (option === "price") {
      sortedItineraries.sort((a, b) => a.priceOfTour - b.priceOfTour); // Ascending by price
    }
    setItineraries(sortedItineraries);
  };

  const handlePrefrenceItineraries = (e) => {
    const selectedPreference = e.target.value;
    setPreferencesItineraries(selectedPreference);

    // If "No Preference" is selected, reset the filtered itineraries to show all
    if (selectedPreference === "no prefrence") {
      setFilteredItineraries(itineraries);
    } else {
      // Otherwise, filter itineraries based on the selected preference
      const filtered = itineraries.filter((itinerary) => {
        // Ensure itinerary.tags is an array, then check if any tag matches the selected preference
        return (
          itinerary.tags &&
          itinerary.tags.some((tag) =>
            tag.toLowerCase().includes(selectedPreference.toLowerCase())
          )
        );
      });
      setFilteredItineraries(filtered);
    }
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

  const openModal = async (id) => {
    setSelectedItineraryId(id);
    setModalIsOpen(true);
    try {
      const itineraryResponse = await axios.get(
        `http://localhost:3000/itinerary/${id}`
      );
      setAvailableDates(itineraryResponse.data.availableDates);
      setAvailableTimes(itineraryResponse.data.availableTimes);
    } catch (itineraryError) {
      console.warn(
        "Itinerary not found, searching for activity...",
        itineraryError
      );
      try {
        const activityResponse = await axios.get(
          `http://localhost:3000/activities/${id}`
        );
        setAvailableDates(activityResponse.data.date);
        setAvailableTimes(activityResponse.data.time);
      } catch (activityError) {
        console.error("Activity not found", activityError);
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItineraryId(null);
    setAvailableDates([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const checkAge = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tourist/${username}`
      );
      const { dateOfBirth } = response.data;

      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 18;
    } catch (error) {
      console.error("Error checking age:", error);
      return false;
    }
  };


  

  const handleWalletPurchase = async () => {
    try {
      let itinerary;
      let activity;
      let isItinerary = true;

      try {
        itinerary = await axios.get(
          `http://localhost:3000/itinerary/${selectedItineraryId}`
        );
      } catch (itineraryError) {
        console.warn(
          "Itinerary not found, searching for activity...",
          itineraryError
        );
        isItinerary = false;
        try {
          activity = await axios.get(
            `http://localhost:3000/activities/${selectedItineraryId}`
          );
        } catch (activityError) {
          console.error("Activity not found", activityError);
          throw new Error("Neither itinerary nor activity found.");
        }
      }

      // const isOldEnough = await checkAge(username);
      // if (!isOldEnough) {
      //   toast.error("You must be 18 or older to book an itinerary.");
      //   return;
      // }

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

      if (isItinerary) {
        // Update Itinerary Purchases
        await axios.patch(
          `http://localhost:3000/itinerary/increment-purchases/${selectedItineraryId}`
        );

        const newBookedItineraries = [
          ...bookedItineraries,
          selectedItineraryId,
        ]; // Update Itineraries Booked List in Tourist Model

        // Updating Tourists Booked List in Itinerary
        const touristsBook = [...itinerary.data.touristsBooked, username];

        await axios.patch(
          `http://localhost:3000/itinerary/${selectedItineraryId}/touristsBook`,
          {
            touristsBooked: touristsBook,
          }
        );

        // Call the backend route to book the itinerary and update the wallet
        const response = await axios.patch(
          "http://localhost:3000/api/bookItinerary",
          {
            username,
            newBookedItineraries,
            selectedItineraryId,
          }
        );

        console.log("TOURIST USERNAME : ", username);
        console.log(username, selectedItineraryId, selectedDate, selectedTime);
        await axios.post("http://localhost:3000/booking/createBooking", {
          touristUsername: username,
          itineraryId: selectedItineraryId,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        });

        // Update the state with the new booked itineraries and wallet balance
        setBookedItineraries(response.data.bookedItineraries);

        // Send Email Receipt
        const user = await axios.get(
          `http://localhost:3000/api/tourist/${username}`
        );
        const email = user.data.email;

        const pickupLocation = itinerary.data.pickupLocation;
        const dropoffLocation = itinerary.data.dropoffLocation;
        const price = itinerary.data.priceOfTour;
        const text = `You have successfully booked an itinerary from ${pickupLocation} to ${dropoffLocation}. Your payment of ${price} Euro(s) by Wallet was successfully received. Please check your account for the payment details.`;
        await axios.post("http://localhost:3000/auth/sendPaymentEmail", {
          email,
          text,
        });

        toast.success("Event booked successfully!");
      } else {
        // Update Activity Purchases
        await axios.post(
          `http://localhost:3000/activities/increment/${selectedItineraryId}`
        );

        const newBookedItineraries = [
          ...bookedItineraries,
          selectedItineraryId,
        ]; // Update

        // await axios.post("http://localhost:3000/booking/createBooking", {
        //   touristUsername: username,
        //   itineraryId: selectedItineraryId,
        //   bookingDate: selectedDate,
        //   bookingTime: selectedTime,
        // });

        const user = await axios.get(
          `http://localhost:3000/api/tourist/${username}`
        );
        const email = user.data.email;

        const date = activity.data.date;
        const time = activity.data.time;
        const creator = activity.data.creator;
        const text = `You have successfully booked an activity at the following Date: ${date}, and the corresponding Time: ${time}. The Creator ${creator} is eager to meet you! Don't be late!! Please check your account for the payment details.`;
        await axios.post("http://localhost:3000/auth/sendPaymentEmail", {
          email,
          text,
        });

        toast.success("Event booked successfully!");
      }

      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error booking itinerary. Please try again.";
      toast.error(errorMessage);
    }
  };

  
  
  const handleCreditCardPurchase = async () => {
    const isOldEnough = await checkAge(username);
    if (!isOldEnough) {
      toast.error("You must be 18 or older to book an itinerary.");
      return;
    }

    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj <= today) {
      toast.error("The selected date must be after today's date.");
      return;
    }

    let itinerary;
    let activity;
    let isItinerary = true;

    try {
      itinerary = await axios.get(
        `http://localhost:3000/itinerary/${selectedItineraryId}`
      );
    } catch (itineraryError) {
      console.warn(
        "Itinerary not found, searching for activity...",
        itineraryError
      );
      isItinerary = false;
      try {
        activity = await axios.get(
          `http://localhost:3000/activities/${selectedItineraryId}`
        );
      } catch (activityError) {
        console.error("Activity not found", activityError);
        toast.error("Neither itinerary nor activity found.");
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/payment/create-checkout-session",
        {
          itineraryId: selectedItineraryId,
          itineraryName: isItinerary ? "Itinerary" : "Activity",
          price: isItinerary
            ? itinerary.data.priceOfTour
            : activity.data.price.max,
          selectedDate,
          selectedTime,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      console.log("RESPONSE : ", response);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error during credit card purchase:", error);
      toast.error(
        "An error occurred during the credit card purchase. Please try again."
      );
    }
  };

  return (
    <div className="explore-page">
      <ToastContainer />
      <h1>Explore Upcoming Attractions</h1>
      <p>Discover activities, itineraries, and historical places near you.</p>
      <Link to="/home" className="back-button">
        {" "}
        {/* Adjust the path as needed */}
        &larr; Back
      </Link>

      <Link to="/viewPastEvents">
          <button>View Past Itineraries</button>
        </Link>
        <Link to="/viewUpcomingEvents">
          <button>View Upcoming Itineraries</button>
        </Link>

      {/* Itineraries Filter Section */}
      <div className="filter-section">
        <h2 className="filters-title">Filter Itineraries</h2>
        <div className="filters">
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
            <label htmlFor="sort-itineraries">Prefrence:</label>
            <select
              id="prefrence"
              value={preferencesItineraries}
              onChange={handlePrefrenceItineraries}
            >
              <option value="no prefrence">No Prefrence</option>
              <option value="historic areas">Historic Areas</option>
              <option value="beaches">Beaches</option>
              <option value="family friendly">Family Friendly</option>
              <option value="shopping">Shopping</option>
            </select>
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
                <ViewItineraryCard
                  key={itinerary._id}
                  itinerary={itinerary}
                  openModal={openModal}
                />
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
                <ViewActivityCard
                  key={activity._id}
                  activity={activity}
                  openModal={openModal}
                />
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
        </div>
      </div>

      {/* Museums Section */}
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
            onClick={() => handleScroll("right", museumScrollRef)}
            className="scroll-button right"
          >
            →
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "60%", // Increase width
            height: "80%", // Increase height
            padding: "40px", // Increase padding
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h2>Payment Method</h2>
          <h3 style={{ marginBottom: "40px" }}>
            Please Choose your Payment Method
          </h3>
          <div style={{ display: "flex", gap: "40px" }}>
            <h3>Available Dates</h3>
            <h3>Available Times</h3>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="available-dates-radio-group-label"
                  name="available-dates-radio-group"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {normalizedDate.map((date, index) => (
                    <FormControlLabel
                      key={index}
                      value={date}
                      control={<Radio />}
                      label={date}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>

            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="available-dates-radio-group-label"
                  name="available-dates-radio-group"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {normalizedTime.map((time, index) => (
                    <FormControlLabel
                      key={index}
                      value={time}
                      control={<Radio />}
                      label={time}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <button onClick={handleWalletPurchase}>by Wallet</button>
            <button onClick={handleCreditCardPurchase}>by Credit Card</button>
          </div>
          <button style={{ marginTop: "50px" }} onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ExplorePage;

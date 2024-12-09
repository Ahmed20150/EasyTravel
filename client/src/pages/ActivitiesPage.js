import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../components/CurrencyContext";
import Modal from "react-modal";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

Modal.setAppElement("#root");

const DEFAULT_ACTIVITY_IMAGE = "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=749&auto=format&fit=crop";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCurrency, exchangeRates } = useCurrency();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRating, setSelectedRating] = useState("All Ratings");
  const [priceRange, setPriceRange] = useState([0, 200]); // Example range in EUR

  const [categories, setCategories] = useState([]);

  const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+", "3.0+"];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [cookies] = useCookies(["username", "token"]);

  // Add these states after other state declarations
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);

  // Add new state for booked activities
  const [bookedActivities, setBookedActivities] = useState([]);

  // Add these new states
  const [bookingStatuses, setBookingStatuses] = useState({});

  // Add these new states
  const [promoCodes, setPromoCodes] = useState([]);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add function to fetch user's booked activities
  const fetchBookedActivities = async () => {
    const username = Cookies.get("username");
    if (!username) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/tourist/${username}`);
      const bookedIds = response.data.bookedActivities || [];
      setBookedActivities(bookedIds);
    } catch (error) {
      console.error("Error fetching booked activities:", error);
    }
  };

  // Add useEffect to fetch booked activities
  useEffect(() => {
    fetchBookedActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/activities");
      const currentDate = new Date();

      const filteredActivities = response.data
        .filter(activity => activity.flagged === "no")
        .filter(activity => new Date(activity.date) > currentDate)
        .map(activity => ({
          ...activity,
          rating: activity.avgRating || "N/A"
        }));

      setActivities(filteredActivities);
      setFilteredActivities(filteredActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(["All Categories", ...response.data.map(category => category.name)]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleShare = async (activityId) => {
    const shareUrl = `${window.location.origin}/activity/${activityId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this activity!',
          text: 'I found this interesting activity on EasyTravel',
          url: shareUrl
        });
        toast.success('Shared successfully!', {

          autoClose: 3000,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!', {

          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share', {

        autoClose: 3000,
      });
    }
  };

  const convertPrice = (price) => {
    if (!exchangeRates || !price) return price;
    const rate = exchangeRates[selectedCurrency];
    const converted = price * rate;
    return converted.toFixed(2);
  };

  // Add useEffect to handle filters
  useEffect(() => {
    applyFilters();
  }, [activities, searchTerm, selectedCategory, selectedRating, priceRange]);

  const applyFilters = () => {
    if (!activities.length) return;

    let filtered = [...activities];

    // Search filter by title
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.name?.toLowerCase().includes(searchLower) ||
        activity.category?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(activity =>
        activity.category === selectedCategory
      );
    }

    // Rating filter
    if (selectedRating !== "All Ratings") {
      const minRating = parseFloat(selectedRating.replace("+", ""));
      filtered = filtered.filter(activity =>
        parseFloat(activity.avgRating || 0) >= minRating
      );
    }

    // Price range filter
    filtered = filtered.filter(activity => {
      const minPrice = activity.price?.min || 0;
      const maxPrice = activity.price?.max || 0;
      // Show activities where either min or max price falls within the range
      return (minPrice >= priceRange[0] && minPrice <= priceRange[1]) ||
        (maxPrice >= priceRange[0] && maxPrice <= priceRange[1]);
    });

    setFilteredActivities(filtered);
  };

  // Update price range handler
  const handlePriceRangeChange = (e) => {
    const maxPrice = parseInt(e.target.value);
    setPriceRange([0, maxPrice]);

    // Convert the filtered price back to EUR for filtering
    const rate = exchangeRates[selectedCurrency];
    const maxPriceEUR = rate ? maxPrice / rate : maxPrice;

    let filtered = [...activities];
    filtered = filtered.filter(activity => {
      const minPrice = activity.price?.min || 0;
      const maxPrice = activity.price?.max || 0;
      return (minPrice <= maxPriceEUR) || (maxPrice <= maxPriceEUR);
    });

    setFilteredActivities(filtered);
  };

  // Add reset filters function
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedRating("All Ratings");
    setPriceRange([0, 200]);
    setFilteredActivities(activities);
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      EUR: "€",
      USD: "$",
      GBP: "£",
      JPY: "¥",
      EGP: "E£"
    };
    return symbols[currency] || currency;
  };

  // Add these functions for modal handling
  const openModal = async (id) => {
    setSelectedActivityId(id);
    setModalIsOpen(true);
    setPromoCode("");
    setDiscount(0);

    try {
      const response = await axios.get(`http://localhost:3000/activities/${id}`);
      const activity = response.data;
      setOriginalPrice(activity.price.max);

      // Use the date directly from the activity
      setAvailableDates([activity.date]);

      // Use the time directly from the activity
      // If it's a string, convert it to an array with single value
      if (typeof activity.time === 'string') {
        setAvailableTimes([activity.time]);
      } else if (Array.isArray(activity.time)) {
        setAvailableTimes(activity.time);
      }

    } catch (error) {
      console.error("Error fetching activity details:", error);
      toast.error("Failed to load activity details");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedActivityId(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBooking = async (paymentMethod) => {
    const username = Cookies.get("username");
    if (!username) {
      toast.error("Please log in to book an activity", {

        autoClose: 3000,
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time", {

        autoClose: 3000,
      });
      return;
    }

    try {
      if (paymentMethod === "wallet") {
        await handleWalletBooking();
      } else {
        await handleCreditCardBooking();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed", {

        autoClose: 3000,
      });
    }
  };

  // Update the refreshData function to be more efficient
  const refreshData = async () => {
    try {
      // Only fetch the specific activity that was updated
      if (selectedActivityId) {
        const response = await axios.get(`http://localhost:3000/activities/${selectedActivityId}`);

        // Update the specific activity in the activities array
        setActivities(prevActivities => {
          const updatedActivities = prevActivities.map(activity =>
            activity._id === selectedActivityId ? { ...response.data } : activity
          );
          return updatedActivities;
        });

        // Update filtered activities as well
        setFilteredActivities(prevFiltered => {
          const updatedFiltered = prevFiltered.map(activity =>
            activity._id === selectedActivityId ? { ...response.data } : activity
          );
          return updatedFiltered;
        });

        // Update booking status for this activity
        await checkBookingStatus(selectedActivityId);
      }
    } catch (error) {
      console.error('Error refreshing activity data:', error);
      toast.error('Error updating activity information');
    }
  };

  // Add this function to refresh all data
  const refreshAllData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/activities");
      const currentDate = new Date();

      const filteredActivities = response.data
        .filter(activity => activity.flagged === "no")
        .filter(activity => new Date(activity.date) > currentDate)
        .map(activity => ({
          ...activity,
          rating: activity.avgRating || "N/A"
        }));

      setActivities(filteredActivities);
      setFilteredActivities(filteredActivities);

      // Check booking status for all activities
      for (const activity of filteredActivities) {
        await checkBookingStatus(activity._id);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Error updating activities');
    }
  };

  // Update handleWalletBooking
  const handleWalletBooking = async () => {
    try {
      const username = Cookies.get("username");

      // Validate date selection
      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

      // Validate required fields
      if (!selectedDate || !selectedTime) {
        toast.error("Please select both date and time for the booking");
        return;
      }

      // Create activity booking
      const bookingResponse = await axios.post(
        "http://localhost:3000/activityBooking/createActivityBooking",
        {
          touristUsername: username,
          activityId: selectedActivityId,
          bookingDate: selectedDate,
          bookingTime: selectedTime
        }
      );

      if (bookingResponse.status === 201) {
        // Update Activity Purchases
        await axios.post(
          `http://localhost:3000/activities/increment/${selectedActivityId}`
        );

        // Get activity details for email
        const activity = await axios.get(
          `http://localhost:3000/activities/${selectedActivityId}`
        );

        // Send confirmation email
        const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);
        const email = user.data.email;

        const emailText = `You have successfully booked an activity:
          Date: ${new Date(selectedDate).toLocaleDateString()}
          Time: ${selectedTime}
          Activity: ${activity.data.name}
          Creator: ${activity.data.creator}
          
          Don't be late! The creator is eager to meet you.
          Please check your account for payment details.`;

        await axios.post("http://localhost:3000/auth/sendPaymentEmail", {
          email,
          text: emailText,
        });

        toast.success("🎉 Activity booked successfully! Check your email for confirmation.", {

          autoClose: 5000,

        });

        await refreshAllData();
        closeModal();
      }
    } catch (error) {
      console.error('Error during wallet booking:', error);
      toast.error(error.response?.data?.message || "Failed to book with wallet", {

        autoClose: 3000,
      });
    }
  };

  // Update handleUnbook
  const handleUnbook = async (activityId) => {
    try {
      const bookingStatus = bookingStatuses[activityId];
      if (!bookingStatus?.isBooked) {
        toast.error("No booking found", {

          autoClose: 3000,
        });
        return;
      }

      // Check if unbooking is allowed (48 hours rule)
      const bookingDate = new Date(bookingStatus.bookingDate);
      const now = new Date();
      const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

      if (hoursUntilBooking < 48) {
        toast.error("Cannot unbook activities within 48 hours of the booking date", {

          autoClose: 5000,
        });
        return;
      }

      await axios.delete(`http://localhost:3000/activityBooking/unbook/${bookingStatus.bookingId}`);

      toast.success("Activity unbooked successfully!", {

        autoClose: 3000,
      });

      await refreshAllData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to unbook activity";
      toast.error(errorMessage, {

        autoClose: 3000,
      });
    }
  };

  // Update handleCreditCardBooking
  const handleCreditCardBooking = async () => {
    try {
      const username = Cookies.get("username");

      // Validate date selection
      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

      // Validate required fields
      if (!selectedDate || !selectedTime) {
        toast.error("Please select both date and time for the booking");
        return;
      }

      // Get activity details for payment
      const activity = await axios.get(
        `http://localhost:3000/activities/${selectedActivityId}`
      );

      // Use discounted price if available
      const finalPrice = discountedPrice || activity.data.price.max;

      const bookingResponse = await axios.post(
        "http://localhost:3000/activityBooking/createActivityBooking",
        {
          touristUsername: username,
          activityId: selectedActivityId,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          promoCode: enteredPromoCode,
          discount: discount
        }
      );

      if (bookingResponse.status === 201) {
        await refreshAllData();

        const response = await axios.post(
          "http://localhost:3000/payment/create-checkout-session",
          {
            itineraryId: selectedActivityId,
            itineraryName: "Activity",
            price: finalPrice,
            selectedDate,
            selectedTime,
            bookingType: 'activity',
            bookingId: bookingResponse.data.booking._id,
            promoCode: enteredPromoCode,
            discount: discount
          },
          {
            headers: { Authorization: `Bearer ${cookies.token}` }
          }
        );

        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error during credit card booking:", error);
      toast.error(
        error.response?.data?.message ||
        "An error occurred during booking. Please try again."
      );
    }
  };

  // Add this function to handle promo code
  const handlePromoCodeSubmit = async () => {
    if (!enteredPromoCode) {
      toast.error("Please enter a promo code", {
        autoClose: 3000,
      });
      return;
    }

    try {
      const promo = promoCodes.find((promo) => promo.promoCode === enteredPromoCode);

      if (promo) {
        const currentDate = new Date();
        const expiryDate = new Date(promo.expiryDate);

        if (currentDate <= expiryDate) {
          const newPrice = originalPrice * (1 - promo.discount / 100);
          setDiscountedPrice(newPrice);
          setDiscount(promo.discount);
          toast.success(`Promo code applied! ${promo.discount}% discount. New price: ${getCurrencySymbol(selectedCurrency)}${convertPrice(newPrice)}`, {

            autoClose: 5000,
          });
        } else {
          toast.error("Promo code has expired", {

            autoClose: 3000,
          });
        }
      } else {
        toast.error("Invalid promo code", {

          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      toast.error("Error validating promo code", {

        autoClose: 3000,
      });
    }
  };

  // Add function to check booking status
  const checkBookingStatus = async (activityId) => {
    const username = Cookies.get("username");
    if (!username) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/activityBooking/checkBooking/${activityId}/${username}`
      );
      setBookingStatuses(prev => ({
        ...prev,
        [activityId]: response.data
      }));
    } catch (error) {
      console.error("Error checking booking status:", error);
    }
  };

  // Add useEffect to check booking status when activities are loaded
  useEffect(() => {
    const checkAllBookings = async () => {
      if (activities.length > 0) {
        for (const activity of activities) {
          await checkBookingStatus(activity._id);
        }
      }
    };
    checkAllBookings();
  }, [activities]);

  // Add this useEffect for fetching promo codes
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Add the fetchPromoCodes function
  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/promo-codes/");
      setPromoCodes(response.data || []);
    } catch (err) {
      console.error("Error fetching promo codes", err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Activities</h1>
          <p className="text-gray-600">
            Discover exciting adventures and unique experiences at your destination
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors border border-gray-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Search Activities
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <div className="relative">
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {ratings.map(rating => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Price ({selectedCurrency})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={handlePriceRangeChange}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">
                  {getCurrencySymbol(selectedCurrency)}{convertPrice(priceRange[1])}
                </span>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== "All Categories" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All Categories")}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRating !== "All Ratings" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Rating: {selectedRating}
                <button
                  onClick={() => setSelectedRating("All Ratings")}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-gray-600">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="text-center text-gray-600">Loading activities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3]">
                  <img
                    src={DEFAULT_ACTIVITY_IMAGE}
                    alt={activity.name || "Activity"}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-75 text-white text-sm rounded-full">
                    {activity.category}
                  </div>
                  <button
                    onClick={() => handleShare(activity._id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  {/* Activity Creator */}
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    By {activity.creator || "Anonymous"}
                  </div>

                  {/* Activity Title and Tags */}
                  <h3 className="text-xl font-semibold mb-2">
                    {activity.name || "Unnamed Activity"}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activity.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Activity Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {/* Date and Time */}
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(activity.date).toLocaleDateString()} at {activity.time}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{activity.location?.address}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span>{activity.avgRating?.toFixed(1) || "New"}</span>
                      {activity.totalRatingCount > 0 && (
                        <span className="text-gray-500">({activity.totalRatingCount})</span>
                      )}
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500 mb-1">Price range per person:</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold">
                            {getCurrencySymbol(selectedCurrency)}{convertPrice(activity.price?.min)}
                            {" - "}
                            {getCurrencySymbol(selectedCurrency)}{convertPrice(activity.price?.max)}
                          </span>
                        </div>
                        {activity.specialDiscounts > 0 && (
                          <div className="text-green-600 text-sm mt-1">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {activity.specialDiscounts}% discount available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => bookingStatuses[activity._id]?.isBooked
                        ? handleUnbook(activity._id)
                        : openModal(activity._id)
                      }
                      className={`px-4 py-2 rounded-md transition-colors ${!activity.isBookingOpen
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : bookingStatuses[activity._id]?.isBooked
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-black text-white hover:bg-gray-800"
                        }`}
                      disabled={!activity.isBookingOpen}
                    >
                      {!activity.isBookingOpen
                        ? "Fully Booked"
                        : bookingStatuses[activity._id]?.isBooked
                          ? "Unbook Activity"
                          : "Book Now"
                      }
                    </button>
                  </div>

                  {/* Purchase Count */}
                  {activity.numofpurchases > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      {activity.numofpurchases} bookings made
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-xl p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Book Activity</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Select Date</h3>
              <div className="space-y-2">
                <FormControl component="fieldset" className="w-full">
                  <RadioGroup
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    {availableDates.map((date, index) => (
                      <FormControlLabel
                        key={index}
                        value={date}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: '#3B82F6',
                              },
                            }}
                          />
                        }
                        label={
                          <span className="text-sm">
                            {new Date(date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        }
                        className="rounded-lg hover:bg-gray-50 transition-colors p-2 -mx-2"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Select Time</h3>
              <div className="space-y-2">
                <FormControl component="fieldset" className="w-full">
                  <RadioGroup
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {availableTimes.map((time, index) => (
                      <FormControlLabel
                        key={index}
                        value={time}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: '#3B82F6',
                              },
                            }}
                          />
                        }
                        label={
                          <span className="text-sm font-medium">
                            {time}
                          </span>
                        }
                        className="rounded-lg hover:bg-gray-50 transition-colors p-2 -mx-2"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Add this before the Payment Buttons section */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={enteredPromoCode}
                onChange={(e) => setEnteredPromoCode(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handlePromoCodeSubmit}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span>{getCurrencySymbol(selectedCurrency)}{convertPrice(originalPrice)}</span>
              </div>
              {discount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%):</span>
                    <span>-{getCurrencySymbol(selectedCurrency)}
                      {convertPrice((originalPrice * discount / 100).toFixed(2))}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                    <span>Final Price:</span>
                    <span>{getCurrencySymbol(selectedCurrency)}
                      {convertPrice(discountedPrice)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between gap-4">
              <button
                onClick={() => handleBooking('wallet')}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Book with Wallet
              </button>
              <button
                onClick={() => handleBooking('credit')}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Book with Credit Card
              </button>
            </div>

            <button
              onClick={closeModal}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivitiesPage; 
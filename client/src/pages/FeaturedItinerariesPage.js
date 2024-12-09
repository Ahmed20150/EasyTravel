import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { useCurrency } from "../components/CurrencyContext";

Modal.setAppElement("#root");

const CATEGORY_IMAGES = {
    "Historic": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070", // Ancient Egypt/Pyramids
    "Cultural": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070", // Cultural Experience
    "default": "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070"   // General Tourism
};

const getImageForItinerary = (category) => {
    // Return the category-specific image or default if category doesn't match
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
};

const FeaturedItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [preferences, setPreferences] = useState("no preference");
    const [bookedItineraries, setBookedItineraries] = useState([]);
    const [cookies] = useCookies(["username", "token"]);

    // Modal states
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItineraryId, setSelectedItineraryId] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Filter states
    const [filterCriteria, setFilterCriteria] = useState({
        maxBudget: 1000,
        date: "",
        language: "",
    });
    const [searchItinerary, setSearchItinerary] = useState("");

    // Add currency context
    const { selectedCurrency, exchangeRates } = useCurrency();

    // Add getCurrencySymbol function
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

    // Add convertPrice function
    const convertPrice = (price) => {
        if (!exchangeRates || !price) return price;
        const rate = exchangeRates[selectedCurrency];
        const converted = price * rate;
        return converted.toFixed(2);
    };

    // Add these states at the top with other states
    const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);

    // Add these states for promo code
    const [promoCodes, setPromoCodes] = useState([]);
    const [enteredPromoCode, setEnteredPromoCode] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);

    // Add useEffect to fetch bookmarked events
    useEffect(() => {
        fetchBookmarkedItineraries();
    }, []);

    // Add useEffect to fetch promo codes
    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchBookmarkedItineraries = async () => {
        const username = Cookies.get("username");
        if (!username) return;

        try {
            const tourist = await axios.get(`http://localhost:3000/api/tourist/${username}`);
            setBookmarkedItineraries(tourist.data.bookmarkedEvents || []);
        } catch (err) {
            console.error("Error fetching bookmarked itineraries:", err);
        }
    };

    const handleBookmark = async (id) => {
        try {
            const username = Cookies.get("username");
            if (!username) {
                toast.error("Please log in to bookmark itineraries");
                return;
            }

            // Toggle the itinerary in the bookmarked itineraries list
            await axios.patch("http://localhost:3000/api/bookmarkEvent", {
                username,
                eventId: id,
            });

            // Update the local state based on whether the event is already bookmarked
            setBookmarkedItineraries((prevBookmarkedItineraries) => {
                const isBookmarked = prevBookmarkedItineraries.includes(id);

                // If it's already bookmarked, remove it; otherwise, add it
                if (isBookmarked) {
                    toast.success("Removed from bookmarks");
                    return prevBookmarkedItineraries.filter(
                        (itineraryId) => itineraryId !== id
                    );
                } else {
                    toast.success("Added to bookmarks");
                    return [...prevBookmarkedItineraries, id];
                }
            });
        } catch (error) {
            console.error("Error bookmarking itinerary:", error.response?.data || error.message);
            toast.error("Failed to update bookmark");
        }
    };

    const handleShare = async (itineraryId) => {
        const shareUrl = `${window.location.origin}/itinerary/${itineraryId}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Check out this itinerary!',
                    text: 'I found this interesting itinerary on EasyTravel',
                    url: shareUrl
                });
                toast.success('Shared successfully!');
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share');
        }
    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterCriteria, itineraries, searchItinerary]);

    const fetchItineraries = async () => {
        try {
            const response = await axios.get("http://localhost:3000/itinerary");
            const username = Cookies.get("username");
            const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);

            // Filter only activated itineraries
            const activatedItineraries = response.data.filter(
                (itinerary) =>
                    itinerary.activated ||
                    user.data.bookedItineraries.includes(itinerary._id)
            );

            // Store the activated itineraries in state
            setItineraries(activatedItineraries);
            setFilteredItineraries(activatedItineraries);

            // Fetch the tourist's booked itineraries
            const tourist = await axios.get(`http://localhost:3000/api/tourist/${username}`);
            setBookedItineraries(tourist.data.bookedItineraries || []);
            setBookmarkedItineraries(tourist.data.bookmarkedEvents || []);
        } catch (err) {
            console.error("Error fetching itineraries:", err);
            toast.error("Failed to load itineraries");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...itineraries];

        // Budget filter
        if (filterCriteria.maxBudget) {
            filtered = filtered.filter(
                itinerary => itinerary.priceOfTour <= filterCriteria.maxBudget
            );
        }

        // Date filter
        if (filterCriteria.date) {
            const selectedDate = new Date(filterCriteria.date);
            filtered = filtered.filter(itinerary =>
                itinerary.availableDates.some(
                    date => new Date(date).toDateString() === selectedDate.toDateString()
                )
            );
        }

        // Language filter
        if (filterCriteria.language) {
            filtered = filtered.filter(itinerary =>
                itinerary.languageOfTour
                    .toLowerCase()
                    .includes(filterCriteria.language.toLowerCase())
            );
        }

        // Itinerary name search filter
        if (searchItinerary) {
            filtered = filtered.filter(itinerary =>
                itinerary.name.toLowerCase().includes(searchItinerary.toLowerCase())
            );
        }

        setFilteredItineraries(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (e) => {
        const option = e.target.value;
        setSortOption(option);

        const sorted = [...filteredItineraries];
        if (option === "rating") {
            sorted.sort((a, b) => b.avgRating - a.avgRating);
        } else if (option === "price") {
            sorted.sort((a, b) => a.priceOfTour - b.priceOfTour);
        }
        setFilteredItineraries(sorted);
    };

    const handlePreferenceChange = (e) => {
        const selectedPreference = e.target.value;
        setPreferences(selectedPreference);

        if (selectedPreference === "no preference") {
            setFilteredItineraries(itineraries);
        } else {
            const filtered = itineraries.filter(itinerary =>
                itinerary.tags?.some(tag =>
                    tag.toLowerCase().includes(selectedPreference.toLowerCase())
                )
            );
            setFilteredItineraries(filtered);
        }
    };

    const openModal = async (id) => {
        setSelectedItineraryId(id);
        setModalIsOpen(true);

        try {
            const response = await axios.get(`http://localhost:3000/itinerary/${id}`);
            setAvailableDates(response.data.availableDates);
            setAvailableTimes(response.data.availableTimes);
            setOriginalPrice(response.data.priceOfTour); // Set original price
            setDiscountedPrice(null); // Reset discounted price
            setDiscount(0); // Reset discount
            setEnteredPromoCode(""); // Reset promo code
        } catch (error) {
            console.error("Error fetching itinerary details:", error);
            toast.error("Failed to load itinerary details");
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItineraryId(null);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    // Add these helper functions
    function convertTo24HourFormat(timeString) {
        const [time, modifier] = timeString.split(/(AM|PM)/i);
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier.toUpperCase() === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier.toUpperCase() === "AM" && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    // Add function to fetch booked itineraries
    const fetchBookedItineraries = async () => {
        const username = Cookies.get("username");
        if (!username) return;

        try {
            const tourist = await axios.get(`http://localhost:3000/api/tourist/${username}`);
            setBookedItineraries(tourist.data.bookedItineraries || []);
        } catch (err) {
            console.error("Error fetching booked itineraries:", err);
        }
    };

    // Update useEffect to fetch booked itineraries
    useEffect(() => {
        fetchBookedItineraries();
    }, []);

    // Add handleUnbook function
    const handleUnbook = async (id) => {
        try {
            const username = Cookies.get("username");
            const selectedItineraryId = id;

            const bookingResponse = await axios.get(
                `http://localhost:3000/booking/getBooking/${id}/${username}`
            );
            const booking = bookingResponse.data;

            if (!booking) {
                console.log("no booking exists for this itinerary for this user!");
                return;
            }

            // Check if the booking date and time is more than 48 hours before the current date and time
            const bookingTime24Hour = convertTo24HourFormat(booking.bookingTime);
            const bookingDate = new Date(booking.bookingDate).toISOString().split("T")[0];
            const currentDateTime = new Date();
            const bookingDateTime = new Date(`${bookingDate}T${bookingTime24Hour}:00`);
            console.log("BOOKING DATE : ", booking.bookingDate);
            console.log("BOOKING TIME : ", booking.bookingTime);
            console.log("BOOKING 24hr TIME : ", bookingTime24Hour);
            console.log("BOOKING DATE TIME : ", bookingDateTime);
            const timeDifference = bookingDateTime - currentDateTime;
            console.log("TIME DIFF : ", timeDifference);
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            if (hoursDifference < 48) {
                toast.error(
                    "You cannot unbook less than 48 hours before the booking date and time."
                );
                return;
            }

            console.log(`Unbooking itinerary: ${id} for user ${username}`);

            // Update Activity Purchases
            await axios.patch(
                `http://localhost:3000/itinerary/decrement-purchases/${selectedItineraryId}`
            );

            const itinerary = await axios.get(`http://localhost:3000/itinerary/${id}`);
            const touristsBook = itinerary.data.touristsBooked.filter(
                (user) => user !== username
            );

            await axios.patch(`http://localhost:3000/itinerary/${id}/touristsBook`, {
                touristsBooked: touristsBook,
            });

            const newBookedItineraries = bookedItineraries.filter(
                (itineraryId) => itineraryId !== id
            );

            // Update the user's booked itineraries on the server
            const response = await axios.patch(
                "http://localhost:3000/api/unbookItinerary",
                {
                    username,
                    newBookedItineraries,
                    selectedItineraryId,
                }
            );

            await axios.delete(
                `http://localhost:3000/booking/deleteBooking/${id}/${username}`
            );

            toast.success("Unbooking Successful, Amount is refunded to your wallet");
            const price = itinerary.data.priceOfTour;
            await axios.put("http://localhost:3000/itinerary/refundPoints", {
                price,
                username,
            });
            setBookedItineraries(newBookedItineraries);
            await refreshAllData();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Error Unbooking itinerary. Please try again.";
            toast.error(errorMessage);
        }
    };

    // Update handleWalletPurchase function
    const handleWalletPurchase = async () => {
        try {
            const username = Cookies.get("username");
            const today = new Date();
            const selectedDateObj = new Date(selectedDate);
            if (selectedDateObj <= today) {
                toast.error("The selected date must be after today's date");
                return;
            }

            // Update Activity Purchases
            await axios.patch(
                `http://localhost:3000/itinerary/increment-purchases/${selectedItineraryId}`
            );

            const newBookedItineraries = [...bookedItineraries, selectedItineraryId];

            // Update tourists booked list
            const itinerary = await axios.get(
                `http://localhost:3000/itinerary/${selectedItineraryId}`
            );
            const touristsBook = [...itinerary.data.touristsBooked, username];

            await axios.patch(
                `http://localhost:3000/itinerary/${selectedItineraryId}/touristsBook`,
                {
                    touristsBooked: touristsBook,
                }
            );

            // Book itinerary and update wallet
            const response = await axios.patch(
                "http://localhost:3000/api/bookItinerary",
                {
                    username,
                    newBookedItineraries,
                    selectedItineraryId,
                }
            );

            // Create booking record
            await axios.post("http://localhost:3000/booking/createBooking", {
                touristUsername: username,
                itineraryId: selectedItineraryId,
                bookingDate: selectedDate,
                bookingTime: selectedTime,
            });

            // Send email confirmation
            const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);
            const email = user.data.email;
            const pickupLocation = itinerary.data.pickupLocation;
            const dropoffLocation = itinerary.data.dropoffLocation;
            const price = itinerary.data.priceOfTour;

            const text = `You have successfully booked an itinerary from ${pickupLocation} to ${dropoffLocation}. Your payment of ${price} Euro(s) by Wallet was successfully received. Please check your account for payment details.`;
            
            await axios.post("http://localhost:3000/auth/sendPaymentEmail", {
                email,
                text,
            });

            // Update loyalty points
            await axios.put("http://localhost:3000/itinerary/loyaltyPoints", {
                price,
                username,
            });

            toast.success("Itinerary booked successfully!");
            setBookedItineraries(response.data.bookedItineraries);
            closeModal();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error booking itinerary";
            toast.error(errorMessage);
        }
    };

    const handleCreditCardPurchase = async () => {
        const today = new Date();
        const selectedDateObj = new Date(selectedDate);
        if (selectedDateObj <= today) {
            toast.error("The selected date must be after today's date");
            return;
        }

        const itinerary = await axios.get(
            `http://localhost:3000/itinerary/${selectedItineraryId}`
        );

        try {
            const response = await axios.post(
                "http://localhost:3000/payment/create-checkout-session",
                {
                    itineraryId: selectedItineraryId,
                    itineraryName: "Itinerary",
                    price: itinerary.data.priceOfTour,
                    selectedDate,
                    selectedTime,
                },
                {
                    headers: { Authorization: `Bearer ${cookies.token}` }
                }
            );
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error during credit card purchase:", error);
            toast.error("Failed to process credit card payment");
        }
    };

    // Add resetFilters function
    const resetFilters = () => {
        setFilterCriteria({
            maxBudget: 1000,
            date: "",
            language: "",
        });
        setSearchItinerary("");
        setPreferences("no preference");
        setSortOption("default");
        setFilteredItineraries(itineraries);
    };

    // Add this function after other function declarations
    const refreshAllData = async () => {
        try {
            // Fetch fresh itineraries data
            const response = await axios.get("http://localhost:3000/itinerary");
            const currentDate = new Date();
            
            const upcomingItineraries = response.data
                .filter(itinerary => itinerary.flagged === "no")
                .filter(itinerary =>
                    itinerary.availableDates.some(date => new Date(date) > currentDate)
                )
                .map(itinerary => ({
                    ...itinerary,
                    rating: itinerary.avgRating || "N/A"
                }));

            setItineraries(upcomingItineraries);
            setFilteredItineraries(upcomingItineraries);

            // Refresh booked itineraries
            const username = Cookies.get("username");
            if (username) {
                const touristResponse = await axios.get(`http://localhost:3000/api/tourist/${username}`);
                setBookedItineraries(touristResponse.data.bookedItineraries || []);
            }

            // Refresh bookmarked itineraries
            await fetchBookmarkedItineraries();

            // Reapply current filters
            applyFilters();
        } catch (error) {
            console.error('Error refreshing data:', error);
            toast.error('Error updating itineraries');
        }
    };

    // Add fetchPromoCodes function
    const fetchPromoCodes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/promo-codes/");
            setPromoCodes(response.data || []);
        } catch (err) {
            console.error("Error fetching promo codes", err);
        }
    };

    // Add handlePromoCodeSubmit function
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

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />

            {/* Header Section */}
            <div className="text-center py-12 bg-white border-b">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Itineraries</h1>
                <p className="text-lg text-gray-600">
                    Discover unique guided tours and experiences
                </p>
            </div>

            {/* Search and Filters Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Reset Filters button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset All Filters
                    </button>
                </div>

                {/* Main filters row */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search itineraries by name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchItinerary}
                            onChange={(e) => setSearchItinerary(e.target.value)}
                        />
                    </div>

                    {/* Date Filter */}
                    <div>
                        <input
                            type="date"
                            name="date"
                            value={filterCriteria.date}
                            onChange={handleFilterChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Preference Filter */}
                    <select
                        value={preferences}
                        onChange={handlePreferenceChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="no preference">All Preferences</option>
                        <option value="historic areas">Historic Areas</option>
                        <option value="beaches">Beaches</option>
                        <option value="family friendly">Family Friendly</option>
                        <option value="shopping">Shopping</option>
                    </select>

                    {/* Language Filter */}
                    <select
                        value={filterCriteria.language}
                        onChange={handleFilterChange}
                        name="language"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Languages</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={sortOption}
                        onChange={handleSort}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="default">Default</option>
                        <option value="rating">Average Rating ⭐</option>
                        <option value="price">Price</option>
                    </select>
                </div>

                {/* Price Range Slider - Moved after other filters */}
                <div className="mb-8 max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Price: {getCurrencySymbol(selectedCurrency)}{convertPrice(filterCriteria.maxBudget)}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filterCriteria.maxBudget}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxBudget', value: e.target.value } })}
                        className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{getCurrencySymbol(selectedCurrency)}0</span>
                        <span>{getCurrencySymbol(selectedCurrency)}{convertPrice(1000)}</span>
                    </div>
                </div>

                {/* Itineraries Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center py-12">Loading itineraries...</div>
                    ) : filteredItineraries.length > 0 ? (
                        filteredItineraries.map((itinerary) => (
                            <div key={itinerary._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Itinerary Image */}
                                <div className="relative h-40">
                                    <img
                                        src={itinerary.image || getImageForItinerary(itinerary.category)}
                                        alt={itinerary.name}
                                        className="w-full h-full object-cover rounded-t-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = CATEGORY_IMAGES.default;
                                        }}
                                    />
                                    {/* Category Badge */}
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-black bg-opacity-75 text-white text-base rounded-full">
                                        {itinerary.category}
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="absolute top-6 right-6 flex gap-3">
                                        <button 
                                            onClick={() => handleBookmark(itinerary._id)}
                                            className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <svg 
                                                className={`w-6 h-6 ${bookmarkedItineraries.includes(itinerary._id) ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                                                />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleShare(itinerary._id)}
                                            className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Itinerary Details */}
                                <div className="p-8">
                                    {/* Creator Info */}
                                    <div className="text-base text-blue-600 font-medium mb-3">
                                        By {itinerary.creator || "Anonymous"}
                                    </div>

                                    {/* Title and Tags */}
                                    <h3 className="text-2xl font-bold mb-4">{itinerary.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {itinerary.tags?.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Timeline */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold mb-2">Timeline</h4>
                                        <p className="text-gray-600">{itinerary.timeline}</p>
                                    </div>

                                    {/* Location and Duration Info */}
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <span className="text-gray-700">From: {itinerary.pickupLocation}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <span className="text-gray-700">To: {itinerary.dropoffLocation}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-700">{itinerary.duration} days</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                </svg>
                                                <span className="text-gray-700">{itinerary.languageOfTour}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Locations to Visit */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold mb-2">Locations</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {itinerary.locationsToVisit?.map((location, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {location}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating and Price */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center">
                                                <span className="text-2xl text-yellow-400">⭐</span>
                                                <span className="text-xl font-bold ml-2">{itinerary.avgRating?.toFixed(1) || "New"}</span>
                                            </div>
                                            {itinerary.totalRatingCount > 0 && (
                                                <span className="text-gray-500">
                                                    ({itinerary.totalRatingCount} reviews)
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {getCurrencySymbol(selectedCurrency)}{convertPrice(itinerary.priceOfTour)}
                                            </div>
                                            <div className="text-sm text-gray-500">per person</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => bookedItineraries.includes(itinerary._id) 
                                            ? handleUnbook(itinerary._id)
                                            : openModal(itinerary._id)
                                        }
                                        className={`w-full py-3 text-white text-lg font-semibold rounded-lg transition-colors ${
                                            bookedItineraries.includes(itinerary._id)
                                                ? "bg-red-500 hover:bg-red-600"
                                                : "bg-green-500 hover:bg-green-600"
                                        }`}
                                    >
                                        {bookedItineraries.includes(itinerary._id) ? "Cancel Booking" : "Book Now"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No itineraries match your filters
                        </div>
                    )}
                </div>
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
                        <h2 className="text-2xl font-bold">Book Itinerary</h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <span className="sr-only">Close</span>
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Select Date</h3>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    {availableDates.map((date, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={date}
                                            control={<Radio />}
                                            label={new Date(date).toLocaleDateString()}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Select Time</h3>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                >
                                    {availableTimes.map((time, index) => (
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
                        <div className="flex gap-4">
                            <button
                                onClick={handleWalletPurchase}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Pay with Wallet
                            </button>
                            <button
                                onClick={handleCreditCardPurchase}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Pay with Card
                            </button>
                        </div>
                        <button
                            onClick={closeModal}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FeaturedItinerariesPage; 
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../components/CurrencyContext";

const CATEGORY_IMAGES = {
    "Historic": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070",
    "Cultural": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070",
    "default": "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070"
};

const getImageForItinerary = (category) => {
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
};

const GuestItineraryPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [preferences, setPreferences] = useState("no preference");

    // Filter states
    const [filterCriteria, setFilterCriteria] = useState({
        maxBudget: 1000,
        date: "",
        language: "",
    });
    const [searchItinerary, setSearchItinerary] = useState("");

    // Currency context
    const { selectedCurrency, exchangeRates } = useCurrency();

    const navigate = useNavigate();

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

    const convertPrice = (price) => {
        if (!exchangeRates || !price) return price;
        const rate = exchangeRates[selectedCurrency];
        const converted = price * rate;
        return converted.toFixed(2);
    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterCriteria, itineraries, searchItinerary]);

    const fetchItineraries = async () => {
        try {
            const response = await axios.get("http://localhost:3000/itineraries");
            
            // Only show activated itineraries for guests
            const activatedItineraries = response.data.filter(itinerary => itinerary.activated);
            setItineraries(activatedItineraries);
            setFilteredItineraries(activatedItineraries);
        } catch (err) {
            console.error("Error fetching itineraries:", err);
            toast.error("Failed to load itineraries");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...itineraries];

        if (filterCriteria.maxBudget) {
            filtered = filtered.filter(
                itinerary => itinerary.priceOfTour <= filterCriteria.maxBudget
            );
        }

        if (filterCriteria.date) {
            const selectedDate = new Date(filterCriteria.date);
            filtered = filtered.filter(itinerary =>
                itinerary.availableDates.some(
                    date => new Date(date).toDateString() === selectedDate.toDateString()
                )
            );
        }

        if (filterCriteria.language) {
            filtered = filtered.filter(itinerary =>
                itinerary.languageOfTour
                    .toLowerCase()
                    .includes(filterCriteria.language.toLowerCase())
            );
        }

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

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />

            {/* Header Section */}
            <div className="text-center py-12 bg-white border-b relative">
                {/* Back Button */}
                <button 
                    onClick={handleBack}
                    className="absolute left-4 top-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back
                </button>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Itineraries</h1>
                <p className="text-lg text-gray-600">
                    Discover unique guided tours and experiences
                </p>
                <Link to="/login" className="mt-4 inline-block">
                    <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Login to Book
                    </button>
                </Link>
            </div>

            {/* Search and Filters Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
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

                                    {/* Login to Book Button */}
                                    <Link to="/login" className="w-full">
                                        <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                            Login to Book
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No itineraries available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestItineraryPage; 
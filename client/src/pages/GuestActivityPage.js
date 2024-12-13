import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../components/CurrencyContext";

const DEFAULT_ACTIVITY_IMAGE = "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=749&auto=format&fit=crop";

const GuestActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedCurrency, exchangeRates } = useCurrency();
    const navigate = useNavigate();

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedRating, setSelectedRating] = useState("All Ratings");
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [categories, setCategories] = useState([]);
    const ratings = ["All Ratings", "4.5+", "4.0+", "3.5+", "3.0+"];

    useEffect(() => {
        fetchActivities();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [activities, searchTerm, selectedCategory, selectedRating, priceRange]);

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

    const convertPrice = (price) => {
        if (!exchangeRates || !price) return price;
        const rate = exchangeRates[selectedCurrency];
        const converted = price * rate;
        return converted.toFixed(2);
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

    const applyFilters = () => {
        let filtered = [...activities];

        // Search filter
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
            const price = activity.price?.max || 0;
            return price <= priceRange[1];
        });

        setFilteredActivities(filtered);
    };

    return (
        <div className="min-h-screen bg-gray-50">
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Activities</h1>
                    <p className="text-gray-600">
                        Discover exciting adventures and unique experiences
                    </p>
                    <Link to="/login" className="mt-4 inline-block">
                        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                            Login to Book
                        </button>
                    </Link>
                </div>

                {/* Filters Section */}
                <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    {/* ... Add your filter components here ... */}
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">Loading activities...</div>
                    ) : filteredActivities.map((activity) => (
                        <div key={activity._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Activity Image */}
                            <div className="relative aspect-[4/3]">
                                <img
                                    src={DEFAULT_ACTIVITY_IMAGE}
                                    alt={activity.name || "Activity"}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-75 text-white text-sm rounded-full">
                                    {activity.category}
                                </div>
                            </div>

                            {/* Activity Details */}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">
                                    {activity.name || "Unnamed Activity"}
                                </h3>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {activity.tags?.map((tag, index) => (
                                        <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Price and Rating */}
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-lg font-bold">
                                        {getCurrencySymbol(selectedCurrency)}{convertPrice(activity.price?.max)}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-yellow-400 mr-1">⭐</span>
                                        <span>{activity.rating}</span>
                                    </div>
                                </div>

                                {/* Login to Book Button */}
                                <Link to="/login" className="mt-4 block">
                                    <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                        Login to Book
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuestActivityPage; 
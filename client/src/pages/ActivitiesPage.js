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

// Sample data for random generation
const activityTypes = {
  "Adventure": {
    titles: [
      "Desert Safari Experience",
      "Mountain Hiking Adventure",
      "Rock Climbing Expedition",
      "Camel Trek Journey",
      "Dune Buggy Adventure",
      "Scuba Diving Discovery",
      "Zip Line Adventure",
      "White Water Rafting",
      "Paragliding Experience",
      "Cave Exploration"
    ],
    descriptions: [
      "Experience the thrill of dune bashing, camel rides, and a traditional desert evening with barbecue and cultural performances.",
      "Challenge yourself with a guided trek through scenic mountain trails offering breathtaking panoramic views.",
      "Scale natural rock formations under expert guidance with all safety equipment provided.",
      "Journey through the desert on camelback, experiencing traditional Bedouin lifestyle.",
      "Race through desert dunes in powerful dune buggies for an adrenaline-pumping experience.",
      "Discover vibrant marine life and coral reefs in crystal clear waters.",
      "Soar through the air on our professional zip line course with stunning views.",
      "Navigate exciting rapids with experienced guides in beautiful river settings.",
      "Take to the skies with a tandem paragliding flight over spectacular landscapes.",
      "Venture into mysterious caves with professional spelunking equipment."
    ],
    images: [
      "https://images.unsplash.com/photo-1542401886-65d6c61db217",
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
      "https://images.unsplash.com/photo-1522163182402-834f871fd851",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      "https://images.unsplash.com/photo-1622473590773-f588134b6ce7",
      "https://images.unsplash.com/photo-1530866495561-96f0fb1d8691",
      "https://images.unsplash.com/photo-1503264116251-35a269479413",
      "https://images.unsplash.com/photo-1504391039613-b8c6c4c04f91"
    ]
  },
  "Photography": {
    titles: [
      "Wildlife Photography Tour",
      "City Lights Photo Walk",
      "Landscape Photography Workshop",
      "Street Photography Adventure",
      "Sunset Photography Session",
      "Architecture Photo Tour",
      "Portrait Photography Class",
      "Night Sky Photography",
      "Food Photography Workshop",
      "Nature Macro Photography"
    ],
    descriptions: [
      "Capture stunning wildlife photos in their natural habitat with professional guidance.",
      "Learn night photography techniques while exploring the city's most photogenic spots.",
      "Master landscape photography in breathtaking natural settings.",
      "Document urban life and culture through street photography techniques.",
      "Capture the perfect golden hour shots at scenic locations.",
      "Photograph historic and modern architecture with expert composition tips.",
      "Learn professional portrait photography techniques with live models.",
      "Photograph stars, planets, and the Milky Way with specialized equipment.",
      "Master the art of food photography for stunning culinary shots.",
      "Discover the tiny world of macro photography in nature settings."
    ],
    images: [
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553",
      "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1520974735549-3f0d0d2e7272",
      "https://images.unsplash.com/photo-1506744476757-2fa02eda7d51",
      "https://images.unsplash.com/photo-1616578738046-8d6bbb4ee28e",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
      "https://images.unsplash.com/photo-1550159930-40066082a4fc"
    ]
  },
  "Cultural": {
    titles: [
      "Traditional Cooking Class",
      "Historical Walking Tour",
      "Local Art Workshop",
      "Traditional Dance Class",
      "Cultural Heritage Tour",
      "Tea Ceremony Experience",
      "Pottery Making Workshop",
      "Local Market Tour",
      "Traditional Music Session",
      "Textile Weaving Class"
    ],
    descriptions: [
      "Learn authentic local recipes and cooking techniques from expert chefs.",
      "Explore historic sites and hidden gems with knowledgeable local guides.",
      "Create traditional art pieces using authentic local techniques.",
      "Learn traditional dance moves and their cultural significance.",
      "Discover local heritage sites and their fascinating histories.",
      "Experience the ancient art of tea ceremony with traditional masters.",
      "Create your own pottery pieces using traditional methods.",
      "Explore local markets and learn about traditional ingredients.",
      "Learn to play traditional instruments and understand local music.",
      "Master traditional weaving techniques on authentic looms."
    ],
    images: [
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf",
      "https://images.unsplash.com/photo-1467377791767-c929b5dc9a23",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4",
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec",
      "https://images.unsplash.com/photo-1545579133-99bb5ab189bd",
      "https://images.unsplash.com/photo-1532570204726-d530e9f9c886",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      "https://images.unsplash.com/photo-1529074963764-98f42f7254b1"
    ]
  }
};

// Add this function to generate random activity data
const generateRandomActivity = (category) => {
  const categoryData = activityTypes[category] || activityTypes["Cultural"];
  const randomIndex = Math.floor(Math.random() * categoryData.titles.length);
  
  return {
    name: categoryData.titles[randomIndex],
    description: categoryData.descriptions[randomIndex],
    image: categoryData.images[randomIndex]
  };
};

// Keep the activityTypes for generating titles and descriptions
const activityEnhancements = {
  "Adventure": [
    {
      titlePrefix: ["Thrilling", "Exciting", "Epic", "Ultimate"],
      descriptionTemplate: "Experience the thrill of {activity} with expert guides. Perfect for adventure seekers looking for an unforgettable experience."
    }
  ],
  "Photography": [
    {
      titlePrefix: ["Professional", "Scenic", "Artistic", "Creative"],
      descriptionTemplate: "Capture stunning moments during this {activity} session. Perfect for both beginners and experienced photographers."
    }
  ],
  "Cultural": [
    {
      titlePrefix: ["Traditional", "Authentic", "Local", "Heritage"],
      descriptionTemplate: "Immerse yourself in the culture through this {activity} experience. Learn about local traditions and customs."
    }
  ],
  "Default": [
    {
      titlePrefix: ["Amazing", "Wonderful", "Fantastic", "Memorable"],
      descriptionTemplate: "Join us for an incredible {activity} experience that you'll never forget."
    }
  ]
};

const enhanceActivity = (activity) => {
  const category = activity.category || "Default";
  const enhancement = activityEnhancements[category] || activityEnhancements["Default"];
  const { titlePrefix, descriptionTemplate } = enhancement[0];

  // Generate random title prefix
  const randomPrefix = titlePrefix[Math.floor(Math.random() * titlePrefix.length)];
  const enhancedTitle = `${randomPrefix} ${activity.name}`;

  // Generate description
  const enhancedDescription = descriptionTemplate.replace("{activity}", activity.name);

  return {
    ...activity,
    name: enhancedTitle,
    description: activity.description || enhancedDescription,
    rating: activity.rating || (Math.random() * (5 - 4) + 4).toFixed(1)
  };
};

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

  const categories = [
    "All Categories",
    ...Object.keys(activityTypes),
    "Outdoor"
  ];
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

  useEffect(() => {
    fetchActivities();
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
      
      const enhancedActivities = response.data
        .filter(activity => activity.flagged === "no")
        .filter(activity => new Date(activity.date) > currentDate)
        .map(activity => {
          if (!activity.name || !activity.image || !activity.description) {
            const randomData = generateRandomActivity(activity.category);
            return {
              ...activity,
              name: activity.name || randomData.name,
              description: activity.description || randomData.description,
              image: activity.image || randomData.image,
              rating: activity.avgRating || "N/A"
            };
          }
          return {
            ...activity,
            rating: activity.avgRating || "N/A"
          };
        });

      console.log("Enhanced activities:", enhancedActivities);
      setActivities(enhancedActivities);
      setFilteredActivities(enhancedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
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
        activity.name.toLowerCase().includes(searchLower) ||
        activityTypes[activity.category]?.titles.some(title => 
          title.toLowerCase().includes(searchLower)
        )
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
      toast.error("Please log in to book an activity");
      return;
    }

    try {
      if (paymentMethod === "wallet") {
        await handleWalletBooking();
      } else {
        await handleCreditCardBooking();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleWalletBooking = async () => {
    try {
      const username = Cookies.get("username");
      const activity = await axios.get(
        `http://localhost:3000/activities/${selectedActivityId}`
      );

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

      // Update Activity Purchases
      await axios.post(
        `http://localhost:3000/activities/increment/${selectedActivityId}`
      );

      // Send Email Receipt
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

      toast.success("🎉 Activity booked successfully! Check your email for confirmation.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      closeModal();
    } catch (error) {
      console.error('Error during wallet booking:', error);
      toast.error(error.response?.data?.message || "Failed to book with wallet");
    }
  };

  const handleCreditCardBooking = async () => {
    try {
      const activity = await axios.get(
        `http://localhost:3000/activities/${selectedActivityId}`
      );

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

      // Add discount to the payment data
      const finalPrice = discount > 0 
        ? originalPrice * (1 - discount / 100)
        : originalPrice;

      const response = await axios.post(
        "http://localhost:3000/payment/create-checkout-session",
        {
          itineraryId: selectedActivityId,
          itineraryName: "Activity",
          price: finalPrice,
          selectedDate,
          selectedTime,
          promoCode,
          discount
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` }
        }
      );

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error during credit card booking:", error);
      toast.error(
        error.response?.data?.message || 
        "An error occurred during the credit card payment. Please try again."
      );
    }
  };

  // Add this function to handle promo code
  const handlePromoCodeSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/validatePromoCode", {
        code: promoCode
      });
      
      if (response.data.valid) {
        setDiscount(response.data.discount);
        toast.success(`Promo code applied! ${response.data.discount}% discount`);
      } else {
        toast.error("Invalid promo code");
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      toast.error("Error validating promo code");
    }
  };

  // Add unbook function
  const handleUnbook = async (activityId) => {
    const username = Cookies.get("username");
    if (!username) {
      toast.error("Please log in first");
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/unbookActivity`, {
        username,
        activityId
      });

      // Update local state
      setBookedActivities(prev => prev.filter(id => id !== activityId));
      toast.success("Activity unbooked successfully!");
      
      // Refresh activities to update status
      fetchActivities();
    } catch (error) {
      console.error("Error unbooking activity:", error);
      toast.error(error.response?.data?.message || "Failed to unbook activity");
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                    src={activity.image || "https://placehold.co/600x400?text=Activity"}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400?text=Activity";
                    }}
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
                  <h3 className="text-xl font-semibold mb-2">{activity.name || "Unnamed Activity"}</h3>
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
                      onClick={() => bookedActivities.includes(activity._id) 
                        ? handleUnbook(activity._id)
                        : openModal(activity._id)
                      }
                      className={`px-4 py-2 rounded-md transition-colors ${
                        !activity.isBookingOpen 
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : bookedActivities.includes(activity._id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-black text-white hover:bg-gray-800"
                      }`}
                      disabled={!activity.isBookingOpen}
                    >
                      {!activity.isBookingOpen 
                        ? "Fully Booked" 
                        : bookedActivities.includes(activity._id)
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
        className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl"
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
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
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
                      {convertPrice((originalPrice * (1 - discount / 100)).toFixed(2))}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
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
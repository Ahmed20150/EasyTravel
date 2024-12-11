import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCurrency } from "../components/CurrencyContext";
// import "../styles/popup.css";

const CATEGORY_IMAGES = {
  "Historic": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070",
  "Cultural": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070",
  "Adventure": "https://images.unsplash.com/photo-1552751753-0fc84ae5b6c8?q=80&w=2070",
  "Nature": "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974",
  "default": "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070"
};

const ViewPastEvents = () => {
  const { selectedCurrency, exchangeRates } = useCurrency();

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

  const [bookings, setBookings] = useState([]);
  const [itineraries, setItineraries] = useState({});
  const [loading, setLoading] = useState({
    tours: true,
    activities: true
  });
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    entityId: null,
    entityType: "",
    rating: 0,
    comment: "",
  });
  const [activeTab, setActiveTab] = useState('activities');
  const [pastActivities, setPastActivities] = useState([]);
  const [activityDetails, setActivityDetails] = useState({});

  const getImageForCategory = (category) => {
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
  };

  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        const username = Cookies.get("username");
        if (!username) {
          setError("Username not found in cookies");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/booking/pastBookings",
          {
            params: { username },
          }
        );
        setBookings(response.data);

        const itineraryDetails = {};
        for (const booking of response.data) {
          const itineraryResponse = await axios.get(
            `http://localhost:3000/itinerary/${booking.itineraryId}`
          );
          itineraryDetails[booking.itineraryId] = itineraryResponse.data;
        }
        setItineraries(itineraryDetails);
      } catch (error) {
        setError("Error fetching past bookings or itinerary details");
      } finally {
        setLoading(false);
      }
    };

    const fetchPastActivities = async () => {
      try {
        const username = Cookies.get("username");
        if (!username) {
          setError("Username not found in cookies");
          return;
        }

        // Get all activity bookings for the user
        const bookingsResponse = await axios.get(
          `http://localhost:3000/activityBooking/tourist/${username}`
        );

        // Filter past bookings
        const currentDate = new Date();
        const pastBookings = bookingsResponse.data.filter(booking => 
          new Date(booking.bookingDate) < currentDate
        );

        // Fetch details for each activity
        const details = {};
        for (const booking of pastBookings) {
          try {
            // Check if activityId is an object (populated) or string (ID only)
            const activityId = typeof booking.activityId === 'object' ? 
              booking.activityId._id : booking.activityId;

            if (activityId) {
              // Check if we already have the activity details
              if (!details[activityId]) {
                //alert("Activity ID: " + activityId); // For debugging
                const activityResponse = await axios.get(
                  `http://localhost:3000/activities/${activityId}`
                );
                details[activityId] = activityResponse.data;
              }
            }
          } catch (err) {
            console.error(`Error fetching activity details for ${booking.activityId}:`, err);
          }
        }

        setPastActivities(pastBookings);
        setActivityDetails(details);
      } catch (error) {
        console.error("Error fetching past activities:", error);
        setError("Error fetching past activities");
      }
    };

    // Fetch both types of data
    fetchPastBookings();
    fetchPastActivities();
  }, []);

  const handleReviewButtonClick = async (entityId, entityType) => {
    let entityIdentifier = entityId;

    // Log to verify if creator exists
    console.log("Itinerary:", itineraries[entityId]);
    console.log("Creator:", itineraries[entityId]?.creator);

    if (entityType === "tourguide") {
      try {
        const tourGuideResponse = await axios.get(
          `http://localhost:3000/api/profile/${entityId}`
        );

        if (tourGuideResponse.data && tourGuideResponse.data._id) {
          entityIdentifier = tourGuideResponse.data._id;
        } else {
          throw new Error("Tour guide not found");
        }
      } catch (error) {
        console.error("Error fetching tour guide:", error);
        toast.error("Error finding the tour guide");
        return;
      }
    }

    setReviewData({
      entityId: entityIdentifier,
      entityType,
      rating: 0,
      comment: "",
    });
    setShowReviewModal(true);
  };
  const handleReviewSubmit = async () => {
    try {
      const { entityId, entityType, rating, comment } = reviewData;

      const response = await axios.post("http://localhost:3000/review/create", {
        type: entityType,
        id: entityId,
        rating,
        comment,
      });

      if (response.status === 200) {
        // Close the review modal
        setShowReviewModal(false);

        // Notify the user about the successful submission
        toast.success("Review submitted successfully");

        // Fetch the updated details for the entity (itinerary, tourguide, or activity)
        if (entityType === "itinerary") {
          const itineraryResponse = await axios.get(
            `http://localhost:3000/itinerary/${entityId}`
          );
          setItineraries((prevItineraries) => ({
            ...prevItineraries,
            [entityId]: itineraryResponse.data,
          }));
        } else if (entityType === "activity") {
          // Fetch the updated activity details
          const activityResponse = await axios.get(
            `http://localhost:3000/activities/${entityId}`
          );

          // Update the specific activity in the itinerary
          setItineraries((prevItineraries) => {
            // Find the itinerary that contains the activity
            const updatedItineraries = { ...prevItineraries };

            // Loop through all itineraries to find the one containing the activity
            for (const itineraryId in updatedItineraries) {
              const itinerary = updatedItineraries[itineraryId];
              const activityIndex = itinerary.activities.findIndex(
                (activityRef) => activityRef.activity._id === entityId
              );

              // If the activity is found, update it with the new rating
              if (activityIndex !== -1) {
                itinerary.activities[activityIndex] = {
                  ...itinerary.activities[activityIndex],
                  activity: activityResponse.data, // Update the activity with the new data
                };
                break;
              }
            }

            return updatedItineraries;
          });
        }
      }
    } catch (error) {
      toast.error("Error submitting review");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const isLoading = loading.tours || loading.activities;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header Section */}
      <div className="text-center py-12 bg-white border-b">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Past Bookings</h1>
        <p className="text-lg text-gray-600">
          Review your past adventures and experiences
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button 
            className={`px-6 py-2 rounded-full transition-colors ${
              activeTab === 'activities' 
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
          <button 
            className={`px-6 py-2 rounded-full transition-colors ${
              activeTab === 'tours' 
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('tours')}
          >
            Tours
          </button>
        </div>

        {/* Past Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">
              {error}
            </div>
          ) : activeTab === 'tours' ? (
            bookings.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No past tour bookings found
              </div>
            ) : (
              bookings.map((booking) => {
                const itinerary = itineraries[booking.itineraryId];
                if (!itinerary) return null;
                return (
                  <div key={booking._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Booking Image */}
                    <div className="relative h-48">
                      <img
                        src={itinerary.image || getImageForCategory(itinerary.category)}
                        alt={itinerary.name}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CATEGORY_IMAGES.default;
                        }}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-75 text-white text-sm rounded-full">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white text-gray-800 text-sm rounded-full shadow">
                        {booking.bookingTime}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6">
                      <div className="text-sm text-blue-600 font-medium mb-2">
                        By {itinerary.creator || "Anonymous"}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{itinerary.name}</h3>

                      {/* Location Info */}
                      <div className="space-y-2 mb-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>From: {itinerary.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>To: {itinerary.dropoffLocation}</span>
                        </div>
                      </div>

                      {/* Rating Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-medium">{itinerary.avgRating?.toFixed(1) || "New"}</span>
                          {itinerary.totalRatingCount > 0 && (
                            <span className="text-gray-500 text-sm">
                              ({itinerary.totalRatingCount} reviews)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleReviewButtonClick(booking.itineraryId, "itinerary")}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                        >
                          Review Itinerary
                        </button>
                        <button
                          onClick={() => handleReviewButtonClick(itinerary.creator, "tourguide")}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                        >
                          Review Guide
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            pastActivities.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No past activity bookings found
              </div>
            ) : (
              pastActivities.map((booking) => {
                // Get the activity ID whether it's populated or not
                const activityId = typeof booking.activityId === 'object' ? 
                  booking.activityId._id : booking.activityId;
                
                const activity = activityDetails[activityId];
                if (!activity) return null;

                return (
                  <div key={booking._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Activity Booking Image */}
                    <div className="relative h-48">
                      <img
                        src={activity.image || getImageForCategory(activity.category)}
                        alt={activity.name}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CATEGORY_IMAGES.default;
                        }}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black bg-opacity-75 text-white text-sm rounded-full">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white text-gray-800 text-sm rounded-full shadow">
                        {booking.bookingTime}
                      </div>
                    </div>

                    {/* Activity Booking Details */}
                    <div className="p-6">
                      <div className="text-sm text-blue-600 font-medium mb-2">
                        By {activity.creator || "Anonymous"}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{activity.name}</h3>

                      {/* Category and Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {activity.category}
                        </span>
                        {activity.tags?.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Location Info */}
                      <div className="space-y-2 mb-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>Location: {activity.location?.address}</span>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="mb-4 text-gray-700">
                        <span className="font-medium">Price Range: </span>
                        <span>{getCurrencySymbol(selectedCurrency)}{convertPrice(activity.price?.min)} - {getCurrencySymbol(selectedCurrency)}{convertPrice(activity.price?.max)}</span>
                      </div>

                      {/* Rating Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-medium">{activity.avgRating?.toFixed(1) || "New"}</span>
                          {activity.totalRatingCount > 0 && (
                            <span className="text-gray-500 text-sm">
                              ({activity.totalRatingCount} reviews)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => handleReviewButtonClick(activity._id, "activity")}
                          className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                        >
                          Review Activity
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold">Submit your review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={reviewData.rating}
                  onChange={handleInputChange}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Write your review here..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReviewSubmit}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPastEvents;

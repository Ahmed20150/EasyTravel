import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCurrency } from "../components/CurrencyContext";

const CATEGORY_IMAGES = {
  "Historic": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070",
  "Cultural": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070",
  "default": "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070"
};

const DEFAULT_ACTIVITY_IMAGE = "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=749&auto=format&fit=crop";

const getImageForItinerary = (category) => {
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
};

const ViewUpcomingEvents = () => {
  const [itineraryBookings, setItineraryBookings] = useState([]);
  const [activityBookings, setActivityBookings] = useState([]);
  const [itineraryDetails, setItineraryDetails] = useState({});
  const [activityDetails, setActivityDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = Cookies.get('username');
  const { selectedCurrency, exchangeRates } = useCurrency();
  const [activeTab, setActiveTab] = useState('activities');

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
    const fetchAllUpcomingBookings = async () => {
      try {
        if (!username) {
          setError('Username not found in cookies');
          setLoading(false);
          return;
        }

        // Fetch itinerary bookings
        const itineraryResponse = await axios.get('http://localhost:3000/booking/upcomingBookings', {
          params: { username },
        });

        // Fetch activity bookings
        const activityResponse = await axios.get('http://localhost:3000/activityBooking/upcomingBookings', {
          params: { 
            username,
            currentDate: new Date().toISOString()
          },
        });

        // Fetch itinerary details
        const itineraryPromises = itineraryResponse.data.map(booking => 
          axios.get(`http://localhost:3000/itinerary/${booking.itineraryId}`)
        );
        
        const itineraryDetailsResponses = await Promise.all(itineraryPromises);
        const itineraryDetailsMap = {};
        itineraryDetailsResponses.forEach((response, index) => {
          itineraryDetailsMap[itineraryResponse.data[index].itineraryId] = response.data;
        });

        // Fetch activity details
        const activityPromises = activityResponse.data.map(booking => 
          axios.get(`http://localhost:3000/activities/${booking.activityId}`)
        );
        
        const activityDetailsResponses = await Promise.all(activityPromises);
        const activityDetailsMap = {};
        activityDetailsResponses.forEach((response, index) => {
          activityDetailsMap[activityResponse.data[index].activityId] = response.data;
        });

        setItineraryBookings(itineraryResponse.data);
        setActivityBookings(activityResponse.data);
        setItineraryDetails(itineraryDetailsMap);
        setActivityDetails(activityDetailsMap);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Error fetching upcoming bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUpcomingBookings();
  }, [username]);

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

  const handleUnbook = async (id) => {
    try {
      const booking = await axios.get(`http://localhost:3000/booking/getBooking/${id}`);
      const selectedItineraryId = booking.data.itineraryId;

      if (!booking) {
        console.log("no booking exists for this itinerary for this user!");
        return;
      }

      const bookingTime24Hour = convertTo24HourFormat(booking.data.bookingTime);
      const bookingDate = new Date(booking.data.bookingDate).toISOString().split("T")[0];
      const currentDateTime = new Date();
      const bookingDateTime = new Date(`${bookingDate}T${bookingTime24Hour}:00`);
      const timeDifference = bookingDateTime - currentDateTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 48) {
        toast.error("You cannot unbook less than 48 hours before the booking date and time.");
        return;
      }

      await axios.patch(`http://localhost:3000/itinerary/decrement-purchases/${selectedItineraryId}`);

      const itinerary = await axios.get(`http://localhost:3000/itinerary/${id}`);
      const touristsBook = itinerary.data.touristsBooked.filter(
        (user) => user !== username
      );

      await axios.patch(`http://localhost:3000/itinerary/${id}/touristsBook`, {
        touristsBooked: touristsBook,
      });

      const user = await axios.get(`http://localhost:3000/api/${username}`);
      let bookedItineraries = user.data.bookedItineraries;
      const newBookedItineraries = bookedItineraries.filter(
        (itineraryId) => itineraryId !== id
      );

      await axios.patch("http://localhost:3000/api/unbookItinerary", {
        username,
        newBookedItineraries,
        selectedItineraryId,
      });

      await axios.delete(`http://localhost:3000/booking/deleteBooking/${id}/${username}`);
      
      const price = itinerary.data.priceOfTour;
      await axios.put("http://localhost:3000/itinerary/refundPoints", {
        price,
        username,
      });

      toast.success("Itinerary cancelled successfully. Amount has been refunded to your wallet");
      
      // Refresh itinerary bookings
      const updatedResponse = await axios.get('http://localhost:3000/booking/upcomingBookings', {
        params: { username },
      });
      setItineraryBookings(updatedResponse.data);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error cancelling itinerary booking. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleUnbookActivity = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:3000/activityBooking/unbook/${bookingId}`);
      toast.success("Activity booking cancelled successfully");
      
      // Refresh activity bookings
      const updatedResponse = await axios.get('http://localhost:3000/activityBooking/upcomingBookings', {
        params: { 
          username,
          currentDate: new Date().toISOString()
        },
      });
      setActivityBookings(updatedResponse.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error cancelling activity booking";
      toast.error(errorMessage);
    }
  };

  const renderActivityCard = (booking) => {
    const activity = activityDetails[booking.activityId] || {};
    
    return (
      <div key={booking._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Activity Image */}
        <div className="relative h-48">
          <img
            src={activity.image || DEFAULT_ACTIVITY_IMAGE}
            alt={activity.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = CATEGORY_IMAGES.default;
            }}
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            Activity
          </div>
        </div>

        {/* Activity Details */}
        <div className="p-6">
          <div className="text-base text-blue-600 font-medium mb-2">
            By {activity.creator || "Anonymous"}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activity.name}
          </h3>

          {/* Booking Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {booking.bookingTime}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="text-sm text-gray-700">Location: {activity.location?.address}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-yellow-400">⭐</span>
              <span className="text-xl font-bold">{activity.avgRating?.toFixed(1) || "New"}</span>
              {activity.totalRatingCount > 0 && (
                <span className="text-gray-500">
                  ({activity.totalRatingCount} reviews)
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {getCurrencySymbol(selectedCurrency)}
                {convertPrice(activity.price?.max)}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => handleUnbookActivity(booking._id)}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancel Activity
          </button>
        </div>
      </div>
    );
  };

  const renderItineraryCard = (booking, itinerary) => {
    return (
      <div key={booking._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Itinerary Image */}
        <div className="relative h-48">
          <img
            src={itinerary.image || getImageForItinerary(itinerary.category)}
            alt={itinerary.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = CATEGORY_IMAGES.default;
            }}
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {itinerary.category || "Itinerary"}
          </div>
        </div>

        {/* Itinerary Details */}
        <div className="p-6">
          <div className="text-base text-blue-600 font-medium mb-2">
            By {itinerary.creator || "Anonymous"}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {itinerary.name}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {itinerary.tags?.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Booking Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {booking.bookingTime}
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm text-gray-700">From: {itinerary.pickupLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm text-gray-700">To: {itinerary.dropoffLocation}</span>
              </div>
            </div>
          </div>

          {/* Rating and Price */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-yellow-400">⭐</span>
              <span className="text-xl font-bold">{itinerary.avgRating?.toFixed(1) || "New"}</span>
              {itinerary.totalRatingCount > 0 && (
                <span className="text-gray-500">
                  ({itinerary.totalRatingCount} reviews)
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {getCurrencySymbol(selectedCurrency)}
                {convertPrice(itinerary.priceOfTour)}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => handleUnbook(booking._id)}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancel Itinerary
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header Section */}
      <div className="text-center py-12 bg-white border-b">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Upcoming Events</h1>
        <p className="text-lg text-gray-600">
          View and manage your upcoming bookings
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl">{error}</div>
          </div>
        ) : itineraryBookings.length === 0 && activityBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">No upcoming events found</div>
            <Link to="/ExplorePage">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Explore Available Events
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'tours' ? (
              itineraryBookings.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No upcoming tour bookings found
                </div>
              ) : (
                itineraryBookings.map((booking) => {
                  const itinerary = itineraryDetails[booking.itineraryId] || {};
                  return renderItineraryCard(booking, itinerary);
                })
              )
            ) : (
              activityBookings.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No upcoming activity bookings found
                </div>
              ) : (
                activityBookings.map((booking) => renderActivityCard(booking))
              )
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link to="/ExplorePage">
            <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Back to Explore
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewUpcomingEvents;
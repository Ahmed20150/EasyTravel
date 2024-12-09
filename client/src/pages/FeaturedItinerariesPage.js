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
import ViewItineraryCard from "../components/ViewItineraryCard";

Modal.setAppElement("#root");

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
    maxBudget: "",
    date: "",
    language: "",
  });
  const [searchCreator, setSearchCreator] = useState("");

  useEffect(() => {
    fetchItineraries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterCriteria, itineraries, searchCreator]);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/itinerary");
      const currentDate = new Date();
      const username = Cookies.get("username");
      
      const upcomingItineraries = response.data
        .filter(itinerary => itinerary.flagged === "no")
        .filter(itinerary => 
          itinerary.availableDates.some(date => new Date(date) > currentDate)
        )
        .filter(itinerary => !itinerary.touristsBooked.includes(username));

      setItineraries(upcomingItineraries);
      setFilteredItineraries(upcomingItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
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

    // Creator filter
    if (searchCreator) {
      filtered = filtered.filter(
        itinerary =>
          itinerary.creator &&
          itinerary.creator.toLowerCase().includes(searchCreator.toLowerCase())
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

  const handleWalletPurchase = async () => {
    try {
      const username = Cookies.get("username");
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${selectedItineraryId}`
      );

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

      // Update Itinerary Purchases
      await axios.patch(
        `http://localhost:3000/itinerary/increment-purchases/${selectedItineraryId}`
      );

      // Update bookings
      await axios.post("http://localhost:3000/booking/createBooking", {
        touristUsername: username,
        itineraryId: selectedItineraryId,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
      });

      // Send confirmation email
      const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);
      const email = user.data.email;
      const { pickupLocation, dropoffLocation, priceOfTour } = itinerary.data;
      
      const text = `You have successfully booked an itinerary from ${pickupLocation} to ${dropoffLocation}. Your payment of ${priceOfTour} Euro(s) by Wallet was successfully received. Please check your account for the payment details.`;
      
      await axios.post("http://localhost:3000/auth/sendPaymentEmail", {
        email,
        text,
      });

      toast.success(" Itinerary booked successfully! Check your email for confirmation.");
      closeModal();
      fetchItineraries(); // Refresh the list
    } catch (error) {
      console.error("Error during wallet booking:", error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleCreditCardPurchase = async () => {
    try {
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${selectedItineraryId}`
      );

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after today's date.");
        return;
      }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Featured Itineraries</h1>
          <Link to="/explore" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Explore
          </Link>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                value={sortOption}
                onChange={handleSort}
                className="w-full border rounded-md p-2"
              >
                <option value="default">Default</option>
                <option value="rating">Average Rating ⭐</option>
                <option value="price">Price</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Budget
              </label>
              <input
                type="number"
                name="maxBudget"
                value={filterCriteria.maxBudget}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
                placeholder="Enter max budget"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={filterCriteria.date}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={filterCriteria.language}
                onChange={handleFilterChange}
                className="w-full border rounded-md p-2"
                placeholder="Enter language"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Creator
              </label>
              <input
                type="text"
                value={searchCreator}
                onChange={(e) => setSearchCreator(e.target.value)}
                className="w-full border rounded-md p-2"
                placeholder="Enter creator name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preference
              </label>
              <select
                value={preferences}
                onChange={handlePreferenceChange}
                className="w-full border rounded-md p-2"
              >
                <option value="no preference">No Preference</option>
                <option value="historic areas">Historic Areas</option>
                <option value="beaches">Beaches</option>
                <option value="family friendly">Family Friendly</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
          </div>
        </div>

        {/* Itineraries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading itineraries...</div>
          ) : filteredItineraries.length > 0 ? (
            filteredItineraries.map((itinerary) => (
              <ViewItineraryCard
                key={itinerary._id}
                itinerary={itinerary}
                openModal={openModal}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              No itineraries match your filters
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
    </div>
  );
};

export default FeaturedItinerariesPage; 
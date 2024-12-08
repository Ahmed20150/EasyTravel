import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import TravelerForm from "../components/TravelerForm";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const BookFlight = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [nonStop, setNonStop] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("EUR");
  const [maxPrice, setMaxPrice] = useState("");
  const [max, setMax] = useState(10);
  const [flightOffers, setFlightOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dictionaries, setDictionaries] = useState({});
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showTravelerForm, setShowTravelerForm] = useState(false);
  const [confirmedFlightOffers, setConfirmedFlightOffers] = useState(null);
  const [cookies] = useCookies(["userType", "username"]);
  const username = cookies.username;
  const API_KEY = "HPqf3pVyphn2AvaeiS91Bs8nOaGVHGGk";
  const API_SECRET = "tacunKixDcMglp0q";
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [flightNumber, setFlightNumber] = useState("");

  const generateFlightNumber = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)];
    const randomDigits = Math.floor(100 + Math.random() * 9000); // Random 3-4 digit number
    setFlightNumber(`${randomLetters}${randomDigits}`);
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/promo-codes");
      setPromoCodes(response.data || []);
    } catch (err) {
      console.error("Error fetching promo codes", err);
    }
  };
  useEffect(() => {
    if (showSuccessPopup) {
      console.log("Success Popup should be visible");
    }
  }, [showSuccessPopup]);
  const validatePromoCode = () => {
    const promo = promoCodes.find((code) => code.promoCode === promoCode);

    if (!promo) {
      setError("Invalid promo code");
      return false;
    }

    const today = new Date();
    const expiryDate = new Date(promo.expiryDate);

    if (expiryDate < today) {
      setError("Promo code has expired");
      return false;
    }

    // Apply discount (assumes promo code has a discount percentage field)
    setDiscount(promo.discountPercentage);
    setSuccessMessage("Promo code applied successfully!");
    return true;
  };

  const getDiscountedPrice = (price) => {
    if (discount) {
      const discountAmount = (price * discount) / 100;
      return price - discountAmount;
    }
    return price;
  };
  const getAccessToken = async () => {
    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: API_KEY,
        client_secret: API_SECRET,
      });
      console.log("Access Token Request Body:", body.toString());
      const response = await axios.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data.access_token;
    } catch (err) {
      setError("Failed to get access token");
      console.error(err);
      return null;
    }
  };

  const fetchFlightOffers = async (token) => {
    try {
      setLoading(true);
      const params = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        returnDate: returnDate || undefined,
        adults: adults,
        children: children,
        infants: infants,
        travelClass: travelClass,
        nonStop: nonStop,
        currencyCode: currencyCode || undefined,
        maxPrice: maxPrice || undefined,
        max: max,
      };
      const response = await axios.get(
        "https://test.api.amadeus.com/v2/shopping/flight-offers",
        {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      setFlightOffers(response.data.data);
      setDictionaries(response.data.dictionaries);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch flight offers");
      console.error(err);
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!origin || !destination || !departureDate) {
      setError("Please fill in all required fields");
      return false;
    }

    const today = new Date();
    const departure = new Date(departureDate);
    const return_ = returnDate ? new Date(returnDate) : null;

    if (departure < today) {
      setError("Departure date cannot be in the past");
      return false;
    }

    if (return_ && return_ <= departure) {
      setError("Return date must be after departure date");
      return false;
    }

    if (infants > adults) {
      setError("Number of infants cannot exceed number of adults");
      return false;
    }

    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const token = await getAccessToken();
    if (token) {
      await fetchFlightOffers(token);
      setCurrentPage(1); // Reset to first page on new search
    }
  };

  const translate = (type, code) => {
    return dictionaries[type] && dictionaries[type][code]
      ? dictionaries[type][code]
      : code;
  };

  const bookFlightProcess = async () => {
    if (!selectedOffer) {
      setError("Please select a flight to confirm");
      return;
    }

    try {
      setLoading(true);
      const token = await getAccessToken();

      if (!token) {
        throw new Error("Failed to get access token");
      }

      // First, confirm the price
      const priceConfirmBody = {
        data: {
          type: "flight-offers-pricing",
          flightOffers: [selectedOffer], // Send single offer in array
        },
      };

      console.log(
        "Price confirmation request:",
        JSON.stringify(priceConfirmBody, null, 2)
      );
      console.log(
        "Price Confirmation Request Body:",
        JSON.stringify(priceConfirmBody, null, 2)
      );
      const priceResponse = await axios.post(
        "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing",
        priceConfirmBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Store confirmed flight offers and show traveler form
      setConfirmedFlightOffers(priceResponse.data.data.flightOffers);
      setShowTravelerForm(true);
      setLoading(false);
    } catch (err) {
      console.error("Booking process error:", err.response?.data || err);
      setError(
        err.response?.data?.errors?.[0]?.detail || "Failed to process booking"
      );
      setLoading(false);
    }
  };

  const bookFlight = async (travelerDetails) => {
    try {
      setLoading(true);
      const token = await getAccessToken();

      if (!token) {
        throw new Error("Failed to get access token");
      }

      const formattedTravelers = travelerDetails.map((traveler, index) => ({
        id: (index + 1).toString(),
        dateOfBirth: traveler.dateOfBirth,
        name: {
          firstName: traveler.firstName,
          lastName: traveler.lastName,
        },
        gender: traveler.gender,
        contact: {
          emailAddress: traveler.email,
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: traveler.countryCode,
              number: traveler.phoneNumber,
            },
          ],
        },
        documents: [
          {
            documentType: "PASSPORT",
            birthPlace: traveler.birthPlace,
            issuanceLocation: traveler.passportIssuanceLocation,
            issuanceDate: traveler.passportIssuanceDate,
            number: traveler.passportNumber,
            expiryDate: traveler.passportExpiryDate,
            issuanceCountry: traveler.nationality,
            validityCountry: traveler.nationality,
            nationality: traveler.nationality,
            holder: true,
          },
        ],
      }));
      const discountedPrice = getDiscountedPrice(selectedOffer.price.total);
      const requestBody = {
        data: {
          type: "flight-order",
          flightOffers: [
            {
              ...selectedOffer,
              price: { ...selectedOffer.price, total: discountedPrice },
            },
          ],
          travelers: formattedTravelers,
          remarks: {
            general: [
              {
                subType: "GENERAL_MISCELLANEOUS",
                text: "ONLINE BOOKING FROM FLIGHT BOOKING APP",
              },
            ],
          },
        },
      };

      console.log(
        "Booking Request Body:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await axios.post(
        "https://test.api.amadeus.com/v1/booking/flight-orders",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const flightResponse = response.data;

      const localRequestBody = {
        username: username,
        newBookedFlightId: flightResponse.data.id,
      };
      console.log(
        "Local Booking Request Body:",
        JSON.stringify(localRequestBody, null, 2)
      );
      await axios.put(
        "http://localhost:3000/api/tourist/bookFlights",
        localRequestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage(
        `Flight booked successfully! Reference: ${flightResponse.data.id}`
      );
      setShowSuccessPopup(true); // Show success popup
      return flightResponse;
    } catch (err) {
      alert(err.message || "Failed to book flight");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleTravelerSubmit = async (travelerDetails) => {
    try {
      await bookFlight(travelerDetails);
      setShowTravelerForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOfferSelection = (offer) => {
    setSelectedOffer((current) => (current?.id === offer.id ? null : offer));
  };

  const sortedAndPaginatedOffers = useMemo(() => {
    const sorted = [...flightOffers].sort((a, b) => {
      const priceA = parseFloat(a.price.total);
      const priceB = parseFloat(b.price.total);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }, [flightOffers, currentPage, sortOrder]);

  const totalPages = Math.ceil(flightOffers.length / itemsPerPage);

  // Add currency options
  const currencies = [
    { code: "EUR", name: "Euro" },
    { code: "USD", name: "US Dollar" },
    { code: "GBP", name: "British Pound" },
    { code: "AED", name: "UAE Dirham" },
    { code: "JPY", name: "Japanese Yen" },
  ];

  // Sort flights by price
  const sortedFlights = useMemo(() => {
    return [...flightOffers].sort((a, b) => {
      const priceA = parseFloat(a.price.total);
      const priceB = parseFloat(b.price.total);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }, [flightOffers, sortOrder]);

  // Handle currency change
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrencyCode(newCurrency);
    // Re-fetch flight offers with new currency if needed
    if (flightOffers.length > 0) {
      handleSearch(e);
    }
  };

  // Handle booking
  const handleBooking = async (flight) => {
    try {
      setBookingLoading(true);
      setError(null);

      const userId = localStorage.getItem('userID');
      if (!userId) {
        setError('Please log in to book a flight');
        return;
      }

      const response = await axios.post('http://localhost:3000/tourist/addFlightBooking', {
        userId,
        flightDetails: {
          validatingAirlineCodes: flight.validatingAirlineCodes,
          itineraries: flight.itineraries,
          price: flight.price,
          bookingStatus: 'Confirmed'
        }
      });

      setBookingSuccess(true);
      //setBookingMessage(Successfully booked flight with ${flight.validatingAirlineCodes[0]} for ${flight.itineraries[0].segments.length} segments!);

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/touristHome');
      }, 2000);

    } catch (error) {
      console.error('Error storing flight booking:', error);
      setError(error.response?.data?.error || 'Failed to book flight. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookNowClick = async (flight) => {
    try {
      setLoading(true);

      if (!cookies.username) {
        toast.error('Please log in to book a flight');
        return;
      }

      // Prepare booking data with the new field name

      const bookingData = {
        username: username,
        newBookedFlightId: flightNumber  // Changed from flightId to newBookedFlightId
      };

      // Store flight ID in tourist's BookedFlights array

      const response = await axios.put(
        "http://localhost:3000/api/bookFlight",
        {
          username: username,
          newBookedFlightId: flightNumber
        }
      );

      if (response.data.message === "Flight booked successfully") {
        toast.success(`Flight booked successfully! \n Your flight number is ${flightNumber}`, {

          autoClose: 3000
        });

      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book flight';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };


  const handleCombinedClick = (offer) => {
    generateFlightNumber();    // Second function
    handleBookNowClick(offer); // First function
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Find Your Perfect Flight</h1>

        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Origin Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                  placeholder="From where?"
                >
                  <option value="">From where?</option>
                  <option value="BER">Berlin</option>
                  <option value="DXB">Dubai</option>
                  <option value="EGP">Egypt</option>
                  <option value="FRA">Frankfurt</option>
                  <option value="LON">London</option>
                  <option value="MEX">Mexico City</option>
                  <option value="NYC">New York</option>
                  <option value="PAR">Paris</option>
                  <option value="ROM">Rome</option>
                  <option value="TKY">Tokyo</option>
                </select>


              </div>

              {/* Destination Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="">Where to?</option>
                  <option value="BER">Berlin</option>
                  <option value="DXB">Dubai</option>
                  <option value="EGP">Egypt</option>
                  <option value="FRA">Frankfurt</option>
                  <option value="LON">London</option>
                  <option value="MEX">Mexico City</option>
                  <option value="NYC">New York</option>
                  <option value="PAR">Paris</option>
                  <option value="ROM">Rome</option>
                  <option value="TKY">Tokyo</option>
                </select>

              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Return Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Return Date (optional)</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  min={departureDate}
                />
              </div>

              {/* Passengers */}
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Passengers</label>
                <input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  min="1"
                  required
                />
              </div> */}

              {/* Travel Class */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Travel Class</label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
              </div>

              {/* Currency Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={currencyCode}
                  onChange={handleCurrencyChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Direct Flights Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={nonStop}
                onChange={(e) => setNonStop(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                id="direct-flights"
              />
              <label htmlFor="direct-flights" className="ml-2 text-sm text-gray-700">
                Direct flights only
              </label>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors duration-200"

                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search Flights'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {flightOffers.length > 0 && (
          <>
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <button
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <span>Price</span>
                  <span className="text-lg">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                </button>
              </div>
              <div className="text-gray-600">
                {flightOffers.length} flights found
              </div>
            </div>

            {/* Flight Results */}
            <div className="space-y-6">
              {sortedFlights.map((offer, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{offer.validatingAirlineCodes[0]}</h3>
                      <p className="text-sm text-gray-500">Flight #{offer.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {currencyCode} {parseFloat(offer.price.total).toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-500">{offer.price.currency}</p>
                    </div>
                  </div>

                  {offer.itineraries.map((itinerary, iIndex) => (
                    <div key={iIndex} className="mt-4 border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-lg">
                          {itinerary.segments[0].departure.iataCode} →{" "}
                          {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                        </div>
                        <div className="text-sm text-gray-500">
                          {itinerary.duration.replace("PT", "").toLowerCase()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {new Date(itinerary.segments[0].departure.at).toLocaleTimeString()} →{" "}
                        {new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at).toLocaleTimeString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {nonStop ? "Direct" : `${itinerary.segments.length - 1} stops`}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCombinedClick(offer)}
                      className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Traveler Form Modal */}
        <TravelerForm
          show={showTravelerForm}
          onClose={() => setShowTravelerForm(false)}
          onSubmit={handleTravelerSubmit}
          numberOfTravelers={passengers}
        />

        {/* Updated Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-600">Traveler 1</h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    toast.info('Booking cancelled', {
                      position: "top-center",
                      autoClose: 2000,
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={bookingData.firstName}
                      onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                      className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={bookingData.lastName}
                      onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                      className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      placeholder="mm/dd/yyyy"
                      value={bookingData.dateOfBirth}
                      onChange={(e) => setBookingData({ ...bookingData, dateOfBirth: e.target.value })}
                      className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={bookingData.gender}
                    onChange={(e) => setBookingData({ ...bookingData, gender: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Country Code"
                    value={bookingData.countryCode}
                    onChange={(e) => setBookingData({ ...bookingData, countryCode: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={bookingData.phoneNumber}
                    onChange={(e) => setBookingData({ ...bookingData, phoneNumber: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent md:col-span-2"
                    required
                  />
                </div>

                {/* Fourth Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Passport Number (e.g., A12...)"
                    value={bookingData.passportNumber}
                    onChange={(e) => setBookingData({ ...bookingData, passportNumber: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={bookingData.passportIssuanceDate}
                    onChange={(e) => setBookingData({ ...bookingData, passportIssuanceDate: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={bookingData.passportExpiryDate}
                    onChange={(e) => setBookingData({ ...bookingData, passportExpiryDate: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Fifth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Birth Place"
                    value={bookingData.birthPlace}
                    onChange={(e) => setBookingData({ ...bookingData, birthPlace: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Passport Issuance Location"
                    value={bookingData.passportIssuanceLocation}
                    onChange={(e) => setBookingData({ ...bookingData, passportIssuanceLocation: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Sixth Row */}
                <div>
                  <select
                    value={bookingData.nationality}
                    onChange={(e) => setBookingData({ ...bookingData, nationality: e.target.value })}
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="UAE">United Arab Emirates</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      toast.info('Booking cancelled', {
                        position: "top-center",
                        autoClose: 2000,
                      });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
              <p className="mb-4">Please review your booking details before confirming.</p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    // Additional confirmation logic can be added here
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFlight;

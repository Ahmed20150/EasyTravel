import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../css/BookFlight.css";
import TravelerForm from "../components/TravelerForm"; // Make sure this path is correct
import { useCookies } from "react-cookie";
import Popup from "../components/Popup"; // Import the Popup component
import { FaPlaneDeparture } from "react-icons/fa"; // Import the required icon
import { Link } from "react-router-dom";

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
  const [currencyCode, setCurrencyCode] = useState("EUR"); // Changed default
  const [maxPrice, setMaxPrice] = useState("");
  const [max, setMax] = useState(10); // Changed default
  const [flightOffers, setFlightOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dictionaries, setDictionaries] = useState({});
  const [selectedOffer, setSelectedOffer] = useState(null); // Replace selectedOffers array
  const [showTravelerForm, setShowTravelerForm] = useState(false);
  const [confirmedFlightOffers, setConfirmedFlightOffers] = useState(null);
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const username = cookies.username; // Access the username
  const API_KEY = "HPqf3pVyphn2AvaeiS91Bs8nOaGVHGGk";
  const API_SECRET = "tacunKixDcMglp0q";
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoCode, setPromoCode] = useState(""); // Store entered promo code
  const [discount, setDiscount] = useState(0); // Store discount value
  
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
        "http://localhost:3000/api/bookFlights",
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

  return (
    <div className="book-flight-container">
      <h1>Search for Flights</h1>
      <Link to="/home" className="back-button"> 
        &larr; Back
      </Link>
      <div className="form-card">
        <form className="flight-form" onSubmit={handleSearch}>
          {/* Wrap Search section in a styled box */}
          <div className="search-section">
            <div className="form-row">
              <div className="form-group">
                <label>Origin</label>
                <span className="input-icon">
                  <i className="fas fa-plane-departure"></i>
                </span>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                  placeholder="Enter city or airport"
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  placeholder="Enter city or airport"
                />
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Return Date (optional)</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div className="form-group">
              <label>Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
              />
              <button type="button" onClick={validatePromoCode}>Apply</button>
            </div>
            {/* Display any success/error messages */}
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            <button type="submit">Search</button>
            </div>
          </div>

          {/* Wrap Additional Options section in a styled box */}
          <div className="options-section">
            <div className="form-row">
              <div className="form-group">
                <label>Travel Class</label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  required
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency Code</label>
                <input
                  type="text"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Max Number of Flight Offers</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  min="1"
                  max="250"
                />
              </div>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="directFlight"
                  checked={nonStop}
                  onChange={(e) => setNonStop(e.target.checked)}
                />
                <label htmlFor="directFlight">Direct Flight</label>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button className="search-button" type="submit">
              Search Flights
            </button>
            <button
              className="book-button"
              type="button"
              onClick={bookFlightProcess}
              disabled={!selectedOffer || loading}
            >
              {loading ? "Processing..." : "Book Selected Flight"}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Searching for the best flights...</p>
        </div>
      )}

      {flightOffers.length > 0 && (
        <div className="filters">
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            Sort by Price {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="flight-offers">
        {sortedAndPaginatedOffers.map((offer, index) => (
          <div
            key={index}
            className={`flight-offer-card ${
              selectedOffer?.id === offer.id ? "selected" : ""
            }`}
            onClick={() => handleOfferSelection(offer)}
          >
            <div className="flight-offer-header">
              <div className="price-info">
                <strong>Price:</strong> {offer.price.total}{" "}
                {translate("currencies", offer.price.currency)}
              </div>
            </div>
            {offer.itineraries.map((itinerary, iIndex) => (
              <div key={iIndex} className="itinerary">
                <div>
                  <strong>Duration:</strong> {itinerary.duration}
                </div>
                {itinerary.segments.map((segment, sIndex) => (
                  <div key={sIndex} className="segment">
                    <div>
                      <strong>From:</strong>{" "}
                      {
                        translate("locations", segment.departure.iataCode)
                          .cityCode
                      }{" "}
                      at {segment.departure.at}
                    </div>
                    <div>
                      <strong>To:</strong>{" "}
                      {
                        translate("locations", segment.arrival.iataCode)
                          .cityCode
                      }{" "}
                      at {segment.arrival.at}
                    </div>
                    <div>
                      <strong>Carrier:</strong>{" "}
                      {translate("carriers", segment.carrierCode)}
                    </div>
                    <div>
                      <strong>Flight Number:</strong> {segment.number}
                    </div>
                    <div>
                      <strong>Aircraft:</strong>{" "}
                      {translate("aircraft", segment.aircraft.code)}
                    </div>
                    <div>
                      <strong>Duration:</strong> {segment.duration}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      <TravelerForm
        show={showTravelerForm}
        onClose={() => setShowTravelerForm(false)}
        onSubmit={handleTravelerSubmit}
        numberOfTravelers={adults + children}
      />
      <Popup
        show={showSuccessPopup}
        message={successMessage}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default BookFlight;

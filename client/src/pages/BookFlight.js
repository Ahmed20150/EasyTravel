import React, { useState } from "react";
import axios from "axios";
import "../css/BookFlight.css";
import TravelerForm from "../components/TravelerForm"; // Make sure this path is correct
import { useCookies } from "react-cookie";

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
  const API_KEY = "fsRGlbkyW4Ob4ASYqLDV0mGAaHC99FAn";
  const API_SECRET = "EB9KyyGfjd0hpfFj";

  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: API_KEY,
          client_secret: API_SECRET,
        }),
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate that returnDate is after departureDate
    if (returnDate && returnDate <= departureDate) {
      setError("Return date must be after departure date");
      return;
    }

    const token = await getAccessToken();
    if (token) {
      await fetchFlightOffers(token);
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

      const requestBody = {
        data: {
          type: "flight-order",
          flightOffers: confirmedFlightOffers,
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

      console.log("Booking request:", JSON.stringify(requestBody, null, 2));

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

      // After successful booking, update the tourist's booked flights

      setLoading(false);
      alert("Flight booked successfully!");
      const flightResponse = response.data;
      console.log("Flight booking response:", flightResponse); // Debug log

      try {
        const updateResponse = await axios.put(
          "http://localhost:3000/api/bookFlights",
          {
            username: username,
            newBookedFlightId: flightResponse.data.id
          }, // Don't stringify the data - axios will do it automatically
          {
            timeout: 8000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log("Request payload:", {
          username,
          newBookedFlightId: flightResponse.data.id
        });
        console.log("Database update response:", updateResponse.data);

        if (updateResponse.data.bookedFlights) {
          console.log("Updated flights:", updateResponse.data.bookedFlights);
          alert(
            `Flight booked successfully! Booking reference: ${flightResponse.data.id}`
          );
        }
      } catch (updateError) {
        console.error("Request details:", {
          url: "http://localhost:3000/api/bookFlights",
          payload: {
            username: username,
            newBookedFlightId: flightResponse.data.id
          }
        });
        if (updateError.code === "ECONNREFUSED") {
          alert(
            "Cannot connect to server. Please check if the server is running."
          );
        } else {
          alert(
            `Booking recorded with Amadeus but failed to update local records. \nBooking reference: ${flightResponse.data.id}\nPlease save this reference and contact support.`
          );
        }
      }

      return flightResponse;
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      setError(
        err.response?.data?.errors?.[0]?.detail || "Failed to book flight"
      );
      setLoading(false);
      return null;
    }
  };

  const handleTravelerSubmit = async (travelerDetails) => {
    await bookFlight(travelerDetails);
    setShowTravelerForm(false);
  };

  const handleOfferSelection = (offer) => {
    setSelectedOffer(current => current?.id === offer.id ? null : offer);
  };

  return (
    <div className="book-flight-container">
      <h1>Search for Flights</h1>
      <div className="form-card">
        <form className="flight-form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label>Origin</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
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
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Adults</label>
              <input
                type="number"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                required
                min="1"
                max="9"
              />
            </div>
            <div className="form-group">
              <label>Children</label>
              <input
                type="number"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                min="0"
                max="8"
              />
            </div>
            <div className="form-group">
              <label>Infants</label>
              <input
                type="number"
                value={infants}
                onChange={(e) => setInfants(e.target.value)}
                min="0"
                max={adults}
              />
            </div>
          </div>
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
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                Non-Stop Flights Only
                <input
                  type="checkbox"
                  checked={nonStop}
                  onChange={(e) => setNonStop(e.target.checked)}
                />
              </label>
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

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="flight-offers">
        {flightOffers.map((offer, index) => (
          <div key={index} className="flight-offer-card">
            <div className="flight-offer-header">
              <input
                type="checkbox"
                checked={selectedOffer?.id === offer.id}
                onChange={() => handleOfferSelection(offer)}
                className="flight-checkbox"
              />
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
      <TravelerForm
        show={showTravelerForm}
        onClose={() => setShowTravelerForm(false)}
        onSubmit={handleTravelerSubmit}
        numberOfTravelers={adults + children}
      />
    </div>
  );
};

export default BookFlight;

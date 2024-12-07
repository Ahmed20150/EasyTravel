import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../css/BookHotel.css";
import { useCookies } from "react-cookie";
import {Link} from "react-router-dom";

const BookHotel = () => {
  const [cityCode, setCityCode] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1); // New state for adults count
  const [roomQuantity, setRoomQuantity] = useState(1); // New state for room quantity
  const [hotelOffers, setHotelOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [cookies] = useCookies(["userType", "username"]);
  const username = cookies.username;
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 10;
  const [promoCode, setPromoCode] = useState("");  // New state for the promo code
  const [discount, setDiscount] = useState(0);  // To store the applied discount percentage
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    fetchPromoCodes();  // Fetch promo codes on component mount
  }, []);
  
  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/promo-codes");
      setPromoCodes(response.data || []);
    } catch (err) {
      console.error("Error fetching promo codes", err);
    }
  };

  const validatePromoCode = () => {
    const today = new Date();
    const validPromo = promoCodes.find(
      (code) => code.promoCode === promoCode && new Date(code.expiryDate) > today
    );
    if (validPromo) {
      setDiscount(validPromo.discount);  // Set the discount from the promo code
      setSuccessMessage(`Promo code applied: ${validPromo.discount}% discount!`);
      setShowSuccessPopup(true);
    } else {
      setError("Invalid or expired promo code.");
    }
  };
  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn < today) {
      errors.checkIn = "Check-in date cannot be in the past";
    }
    if (checkOut <= checkIn) {
      errors.checkOut = "Check-out date must be after check-in date";
    }
    if (cityCode.length !== 3) {
      errors.cityCode = "City code must be 3 characters";
    }
    if (adults < 1) {
      errors.adults = "There must be at least one adult";
    }
    if (roomQuantity < 1 || roomQuantity > adults) {
      errors.roomQuantity =
        "Room quantity must be between 1 and the number of adults";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/hotelOffer", {
        cityCode,
        checkInDate,
        checkOutDate,
        adults,
        roomQuantity,
        currency: "EUR",
      });
      const offers = response.data.data;
      setHotelOffers(offers);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch hotel offers");
    } finally {
      setLoading(false);
    }
  };

  const handleOfferSelection = (offer) => {
    setSelectedOffer((current) => (current === offer ? null : offer));
  };

  const handleBookHotel = async () => {
    if (!selectedOffer) {
      setError("Please select a hotel to book");
      return;
    }
  
    // Apply the discount to the price
    const originalPrice = selectedOffer.offers[0].price.total;
    const discountedPrice = originalPrice * (1 - discount / 100);
  
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:3000/hotelOffer/bookHotels",
        {
          username,
          newBookedHotelId: selectedOffer.hotel.hotelId,
          discountedPrice,  // Pass the discounted price
        }
      );
      setSuccessMessage(response.data.message || "Hotel booked successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book hotel");
    } finally {
      setLoading(false);
    }
  };

  const formatPolicies = (policies) => {
    if (!policies) return "Not available";
    const { cancellations, guarantee, paymentType } = policies;
    const formattedCancellations = cancellations
      ? cancellations
          .map((c) => `Cancel by ${new Date(c.deadline).toLocaleString()}`)
          .join(", ")
      : "No cancellations";
    const formattedGuarantee = guarantee
      ? `Accepted Payments: ${guarantee.acceptedPayments.methods.join(", ")}`
      : "No guarantee (No payment required to hold the reservation)";
    const formattedPaymentType =
      paymentType === "guarantee"
        ? "Payment Type: guarantee (Payment required to hold the reservation)"
        : `Payment Type: ${paymentType}`;
    return (
      <>
        <strong>Room Policies:</strong> <br />
        {formattedCancellations}. <br />
        {formattedGuarantee}. <br />
        {formattedPaymentType}
      </>
    );
  };

  // Pagination logic
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = hotelOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="book-hotel-container">
      <h1>Search for Hotels</h1>
      <Link to="/home" className="back-button"> 
        &larr; Back
      </Link>
      <div className="form-card">
        <form className="hotel-form" onSubmit={handleSearch}>
          <div className="search-section">
            <div className="form-row">
              <div className="form-group">
                <label>City Code</label>
                <input
                  type="text"
                  value={cityCode}
                  onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. PAR, NYC, LON"
                />
                {formErrors.cityCode && (
                  <span className="error-message">{formErrors.cityCode}</span>
                )}
              </div>
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
                {formErrors.checkIn && (
                  <span className="error-message">{formErrors.checkIn}</span>
                )}
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
                {formErrors.checkOut && (
                  <span className="error-message">{formErrors.checkOut}</span>
                )}
              </div>
              <div className="form-group">
                <label>Adults</label>
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  required
                  min="1"
                />
                {formErrors.adults && (
                  <span className="error-message">{formErrors.adults}</span>
                )}
              </div>
              <div className="form-group">
                <label>Room Quantity</label>
                <input
                  type="number"
                  value={roomQuantity}
                  onChange={(e) => setRoomQuantity(e.target.value)}
                  required
                  min="1"
                  max={adults}
                />
                {formErrors.roomQuantity && (
                  <span className="error-message">
                    {formErrors.roomQuantity}
                  </span>
                )}
              </div>
              <div className="form-group">
              <label>Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
              />
              <button onClick={validatePromoCode}>Apply</button>
            </div>
            {discount > 0 && (
              <p>Discount Applied: {discount}%</p>
            )}
            </div>
          </div>

          <div className="button-group">
            <button className="search-button" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search Hotels"}
            </button>
            <button
              className="book-button"
              type="button"
              onClick={handleBookHotel}
              disabled={!selectedOffer || loading}
            >
              {loading ? "Processing..." : "Book Selected Hotel"}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">Processing your request...</p>
          </div>
        </div>
      )}
      {error && <div className="error-banner">{String(error)}</div>}

      <div className="hotel-offers">
        {currentOffers.map((offer, index) => (
          <div
            key={offer.hotel.hotelId || index}
            className={`hotel-offer-card ${
              selectedOffer === offer ? "selected" : ""
            }`}
            onClick={() => handleOfferSelection(offer)}
          >
            <div className="hotel-offer-header">
              <h3>{offer.hotel.name}</h3>
              <div className="hotel-rating">{offer.hotel.rating} ★</div>
            </div>
            <div className="hotel-offer-details">
              <p className="price">${offer.offers[0].price.total} per night</p>
              {offer.hotel.geoCode && (
                <p className="location">
                  <strong>Location:</strong> Lat:{" "}
                  {offer.hotel.geoCode.latitude.toFixed(2)}, Long:{" "}
                  {offer.hotel.geoCode.longitude.toFixed(2)}
                </p>
              )}
              <p className="room-details">
                <strong>Rooms:</strong>{" "}
                {offer.offers[0].room.typeEstimated.category} -{" "}
              </p>
              <p className="room-policies">
                {formatPolicies(offer.offers[0].policies)}
              </p>
              <p className="guests">
                <strong>Guests:</strong> {offer.offers[0].guests.adults} Adults
              </p>
            </div>
            <div className="hotel-offer-amenities">
              {offer.hotel.amenities?.map((amenity, i) => (
                <span key={i} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(hotelOffers.length / offersPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {showSuccessPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{successMessage}</h3>
            <button onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookHotel;

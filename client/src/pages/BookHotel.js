import React, { useState } from "react";
import axios from "axios";
import "../css/BookHotel.css";
import { useCookies } from "react-cookie";

const BookHotel = () => {
  const [cityCode, setCityCode] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [priceRange, setPriceRange] = useState("");
  const [hotelOffers, setHotelOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [cookies] = useCookies(["userType", "username"]);
  const username = cookies.username;
  const [formErrors, setFormErrors] = useState({});

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/hotels/search`, {
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults,
          children,
          rooms,
          priceRange,
        },
      });
      setHotelOffers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch hotel offers");
    } finally {
      setLoading(false);
    }
  };

  const handleOfferSelection = (offer) => {
    setSelectedOffer((current) => (current?.id === offer.id ? null : offer));
  };

  return (
    <div className="book-hotel-container">
      <h1>Search for Hotels</h1>
      <div className="form-card">
        <form className="hotel-form" onSubmit={handleSearch}>
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
          </div>
          <div className="form-row">
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
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Adults</label>
              <input
                type="number"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Children</label>
              <input
                type="number"
                value={children}
                onChange={(e) => setChildren(parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Rooms</label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(parseInt(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Price Range</label>
            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="0-100">$0 - $100</option>
              <option value="101-200">$101 - $200</option>
              <option value="201-300">$201 - $300</option>
              <option value="301+">$301+</option>
            </select>
          </div>
          <div className="button-group">
            <button 
              className="search-button" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Hotels"}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching for the best hotel deals...</p>
        </div>
      )}
      {error && <div className="error-banner">{error}</div>}

      <div className="hotel-offers">
        {hotelOffers.map((offer, index) => (
          <div
            key={offer.id || index}
            className={`hotel-offer-card ${
              selectedOffer?.id === offer.id ? "selected" : ""
            }`}
            onClick={() => handleOfferSelection(offer)}
          >
            <div className="hotel-offer-header">
              <h3>{offer.hotelName}</h3>
              <div className="hotel-rating">{offer.rating} ★</div>
            </div>
            <div className="hotel-offer-details">
              <p>{offer.location}</p>
              <p className="price">${offer.price} per night</p>
            </div>
            <div className="hotel-offer-amenities">
              {offer.amenities?.map((amenity, i) => (
                <span key={i} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookHotel;

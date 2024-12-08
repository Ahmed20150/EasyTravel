import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../css/BookHotel.css";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { Card } from "flowbite-react";
import { Button } from "flowbite-react";
import { buttonStyle } from "../styles/WaelStyles";
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
    <div>
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Find Your Perfect Stay</h1>

          <div className="book-hotel-container">

            {/* <Link to="/home" className="back-button">
          &larr; Back
        </Link> */}
            <Card>
              <form className="bg-white rounded-lg shadow-lg p-6 space-y-6" onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="location">Location</label>
                    <select
                      name="type"
                      value={cityCode}
                      onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                      required
                      placeholder="Where are you going?"
                    >



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

                  <div className="space-y-2">
                    <label>Check-in</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholderText="Select date"
                      min={new Date().toISOString().split("T")[0]} // Ensure check-in date is today or later
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Check-out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholderText="Select date"
                      min={checkInDate || new Date().toISOString().split("T")[0]} // Ensure check-out date is greater than or equal to check-in date
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="guests">Guests</label>
                    <input
                      type="number"
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      required
                      min="1"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="guests">Rooms</label>
                    <input
                      type="number"
                      value={roomQuantity}
                      onChange={(e) => setRoomQuantity(e.target.value)}
                      required
                      min="1"
                      max={adults}
                      className="w-full"
                    />
                  </div>

                  {/* <div className="form-group flex items-center space-x-2">
  <label>Promo Code</label>
  <div className="flex w-full">
    <input
      type="text"
      value={promoCode}
      onChange={(e) => setPromoCode(e.target.value)}
      placeholder="Enter promo code"
      className="w-full rounded-md border border-gray-300 px-3 py-2"
    />
    <Button onClick={validatePromoCode} className={`${buttonStyle} ml-2`}>
      Apply
    </Button>
  </div>
</div> */}
                  {discount > 0 && <p>Discount Applied: {discount}%</p>}

                  <div className="button-group">

                    <div className="flex justify-right">
                      <Button type="submit" className={`bg-black hover:bg-gray-800 text-white px-8 py-2 ${buttonStyle} ml-2`} >
                        Search Hotels
                      </Button>
                    </div></div>

                </div></form></Card>



            <div className="button-group">
              <Button className={buttonStyle} type="submit" disabled={loading}>
                Search Hotels
              </Button>
              <Button
                className={buttonStyle}
                type="button"
                onClick={handleBookHotel}
                disabled={!selectedOffer || loading}
              >
                {loading ? "Processing..." : "Book Selected Hotel"}
              </Button>
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
                  className={`hotel-offer-card ${selectedOffer === offer ? "selected" : ""
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
          </div></div></div></div>
  );
};

export default BookHotel;

import React, { useState, useEffect } from "react";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder
import axios from "axios";

const ViewItineraryCard = ({ itinerary, openModal }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();
  const [promoCodes, setPromoCodes] = useState([]);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(itinerary.priceOfTour); // Default to the original price

  // Fetch promo codes from the server
  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/promo-codes");
      setPromoCodes(response.data || []);
    } catch (err) {
      console.error("Error fetching promo codes", err);
    }
  };

  useEffect(() => {
    fetchPromoCodes(); // Fetch promo codes when the component mounts
  }, []);
  // Function to convert price to selected currency
  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2); // Default to USD if no exchange rate is found
  };

  // Redeem promo code
  const handleRedeemPromo = () => {
    const promo = promoCodes.find((promo) => promo.promoCode === enteredPromoCode);
    if (promo) {
      const currentDate = new Date();
      const expiryDate = new Date(promo.expiryDate);

      if (currentDate <= expiryDate) {
        const newPrice = itinerary.priceOfTour * (1 - promo.discount / 100);
        setDiscountedPrice(newPrice); // Apply the discount
        alert(`Promo code applied! You saved ${promo.discount}%`);
      } else {
        alert("Promo code has expired.");
      }
    } else {
      alert("Invalid promo code.");
    }
  };

  // Share button handler
  const handleShare = async () => {
    const shareData = {
      title: `${itinerary.creator}'s Itinerary`,
      text: `Check out this amazing itinerary by ${itinerary.creator}!\nDuration: ${itinerary.duration} hours\nPrice: ${convertPrice(discountedPrice)} ${selectedCurrency}\nLanguage: ${itinerary.languageOfTour}`,
      url: itinerary.website || window.location.href, // Use itinerary's website or current URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Itinerary shared successfully");
      } catch (error) {
        console.error("Error sharing itinerary:", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  // Copy link handler
  const handleCopyLink = () => {
    const link = `${window.location.origin}/itinerary/${itinerary._id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };

  return (
    <div className="view-itinerary-card">
      <div className="itinerary-header">
        <h2 className="itinerary-title">{itinerary.creator}'s Itinerary</h2>
      </div>
      <div className="itinerary-details">
        <p>
          <strong>Duration:</strong> {itinerary.duration} hours
        </p>
        <p>
          <strong>Price:</strong>{" "}
          <span className="price-value">
            {convertPrice(discountedPrice)} {selectedCurrency}
          </span>
        </p>
        <p>
          <strong>Language:</strong> {itinerary.languageOfTour}
        </p>
        <p>
          <strong>Timeline:</strong>{" "}
          {new Date(itinerary.timeline).toLocaleString()}
        </p>
        <p>
          <strong>Accessibility:</strong> {itinerary.accessibility}
        </p>
        <p>
          <strong>Pickup Location:</strong> {itinerary.pickupLocation}
        </p>
        <p>
          <strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
        </p>
        <p>
          <strong>Average Rating:</strong> {itinerary.avgRating.toFixed(1)} ⭐
        </p>
        <p>
          <strong>Total Ratings:</strong> {itinerary.totalRatingCount}
        </p>
      </div>

      {/* Promo code input */}
      <div className="promo-code">
        <input
          type="text"
          value={enteredPromoCode}
          onChange={(e) => setEnteredPromoCode(e.target.value)}
          placeholder="Enter promo code"
        />
        <button onClick={handleRedeemPromo}>Redeem</button>
      </div>

      <div className="itinerary-locations">
        <h3>Locations to Visit:</h3>
        <ul>
          {itinerary.locationsToVisit.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      </div>

      <div className="itinerary-dates">
        <h3>Available Dates:</h3>
        <ul>
          {itinerary.availableDates.map((date, index) => (
            <li key={index}>{new Date(date).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>

      <div className="itinerary-times">
        <h3>Available Times:</h3>
        <ul>
          {itinerary.availableTimes.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      </div>

      {/* Share and Copy Link Buttons */}
      <div className="itinerary-share">
        <button className="share-button" onClick={handleShare}>
          Share Itinerary
        </button>
        <button className="copy-link-button" onClick={handleCopyLink}>
          Copy Link
        </button>
      </div>

      <div className="itinerary-share">
        <button className="share-button" onClick={() => openModal(itinerary._id)}>
          Book
        </button>
      </div>
    </div>
  );
};

export default ViewItineraryCard;
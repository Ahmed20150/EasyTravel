import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import axios from "axios";
const ViewActivityCard = ({ activity, openModal }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();
  const navigate = useNavigate();
  const [promoCodes, setPromoCodes] = useState([]);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [discountedPricemax, setDiscountedPrice] = useState(activity.price.max);
  const [discountedPricemin, setDiscountedPricemin] = useState(activity.price.min);

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
  // Function to convert price to the selected currency
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
        const newPrice = activity.price.max * (1 - promo.discount / 100);
        const newPricemin = activity.price.min * (1 - promo.discount / 100);
        setDiscountedPrice(newPrice); // Apply the discount
        setDiscountedPricemin(newPricemin); // Apply the discount
        alert(`Promo code applied! You saved ${promo.discount}%`);
      } else {
        alert("Promo code has expired.");
      }
    } else {
      alert("Invalid promo code.");
    }
  };
  // Handle copy link action
  const handleCopyLink = () => {
    const link = `${window.location.origin}/activity/${activity._id}`;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => alert("Activity link copied to clipboard!"))
        .catch((error) => console.error("Failed to copy link:", error));
    } else {
      // Fallback for browsers without clipboard API support
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Activity link copied to clipboard!");
      } catch (error) {
        console.error("Fallback: Failed to copy link:", error);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareData = {
      title: `${activity.creator}'s Activity`,
      text: `Check out this amazing activity by ${activity.creator}!
Category: ${activity.category}
Date: ${new Date(activity.date).toLocaleDateString()}
Location: ${activity.location.address}
Price Range: ${convertPrice(activity.price.min)} - ${convertPrice(activity.price.max)} ${selectedCurrency}`,
      url: `${window.location.origin}/activity/${activity._id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Activity shared successfully");
      } catch (error) {
        console.error("Error sharing activity:", error);
      }
    } else {
      handleCopyLink(); // Fallback to copy link if share is not supported
    }
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h2 className="activity-title">{activity.creator}'s Activity</h2>
        <span className={`booking-status ${activity.isBookingOpen ? "open" : "closed"}`}>
          {activity.isBookingOpen ? "Booking Open" : "Booking Closed"}
        </span>
      </div>

      <div className="activity-info">
        <div className="info-item">
          <label>Date:</label>
          <span>{new Date(activity.date).toLocaleDateString()}</span>
        </div>
        <div className="info-item">
          <label>Time:</label>
          <span>{activity.time}</span>
        </div>
        <div className="info-item">
          <label>Location:</label>
          <span>{activity.location.address}</span>
        </div>
        <div className="info-item">
          <label>Price Range:</label>
          <span>
            {convertPrice(discountedPricemin)} - {convertPrice(discountedPricemax)} {selectedCurrency}
          </span>
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
        <div className="info-item">
          <label>Category:</label>
          <span>{activity.category}</span>
        </div>
        <div className="info-item">
          <label>Rating:</label>
          <span>
            {activity.avgRating.toFixed(1)} ⭐ ({activity.totalRatingCount} reviews)
          </span>
        </div>
      </div>

      <div className="activity-tags">
        {activity.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="activity-actions">
        <button
          className="action-button view-button"
          onClick={() => navigate(`/activity/${activity._id}`, { state: { activity } })}
        >
          View Details
        </button>
        <div className="action-group">
          <button className="action-button share-button" onClick={handleShare}>
            Share
          </button>
          <button className="action-button link-button" onClick={handleCopyLink}>
            Copy Link
          </button>
          <button className="action-button book-button" onClick={() => openModal(activity._id)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewActivityCard;
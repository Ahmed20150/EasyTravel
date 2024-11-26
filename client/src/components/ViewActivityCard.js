import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";

const ViewActivityCard = ({ activity, openModal }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();
  const navigate = useNavigate();

  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2);
  };

  const handleCopyLink = () => {
    const detailsUrl = `${window.location.origin}/activity/${activity._id}`;
    navigator.clipboard.writeText(detailsUrl)
      .then(() => {
        alert("Activity link copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

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
      handleCopyLink();
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
            {convertPrice(activity.price.min)} - {convertPrice(activity.price.max)} {selectedCurrency}
          </span>
        </div>
        <div className="info-item">
          <label>Category:</label>
          <span>{activity.category}</span>
        </div>
        <div className="info-item">
          <label>Rating:</label>
          <span>{activity.avgRating.toFixed(1)} ⭐ ({activity.totalRatingCount} reviews)</span>
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
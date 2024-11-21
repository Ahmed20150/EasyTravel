import React from "react";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder

const ViewActivityCard = ({ activity }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();

  // Function to convert price to selected currency
  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2); // Default to USD if no exchange rate is found
  };

  // Share button handler
  const handleShare = async () => {
    const shareData = {
      title: `${activity.creator}'s Activity`,
      text: `Check out this amazing activity by ${activity.creator}!\nCategory: ${activity.category}\nDate: ${new Date(activity.date).toLocaleDateString()}\nLocation: ${activity.location.address}\nPrice Range: ${convertPrice(activity.price.min)} - ${convertPrice(activity.price.max)} ${selectedCurrency}\nMore details available here: `,
      url: activity.shareUrl || window.location.href, // Use a provided share URL or fallback to the current page URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Activity shared successfully");
      } catch (error) {
        console.error("Error sharing activity:", error);
      }
    } else {
      // Fallback for unsupported browsers
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <div className="view-activity-card">
      <div className="activity-header">
        <h2 className="activity-title">{activity.creator}'s Activity</h2>
      </div>

      <div className="activity-details">
        <p>
          <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {activity.time}
        </p>
        <p>
          <strong>Location:</strong> {activity.location.address}
        </p>
        <p>
          <strong>Price Range:</strong>{" "}
          <span className="price-value">
            {convertPrice(activity.price.min)} - {convertPrice(activity.price.max)} {selectedCurrency}
          </span>
        </p>
        <p>
          <strong>Category:</strong> {activity.category}
        </p>
        <p>
          <strong>Special Discounts:</strong> {activity.specialDiscounts}%
        </p>
        <p>
          <strong>Booking Status:</strong>{" "}
          {activity.isBookingOpen ? "Open" : "Closed"}
        </p>
        <p>
          <strong>Average Rating:</strong> {activity.avgRating.toFixed(1)} ⭐
        </p>
        <p>
          <strong>Total Ratings:</strong> {activity.totalRatingCount}
        </p>
      </div>

      <div className="activity-tags">
        <div className="tags">
          {activity.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="activity-share">
        <button className="share-button" onClick={handleShare}>
          Share Activity
        </button>
      </div>
    </div>
  );
};

export default ViewActivityCard;
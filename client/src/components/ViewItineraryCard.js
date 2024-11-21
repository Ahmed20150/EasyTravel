import React from "react";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder

const ViewItineraryCard = ({ itinerary }) => {
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
      title: `${itinerary.creator}'s Itinerary`,
      text: `Check out this amazing itinerary by ${itinerary.creator}!\nDuration: ${itinerary.duration} hours\nPrice: ${convertPrice(itinerary.priceOfTour)} ${selectedCurrency}\nLanguage: ${itinerary.languageOfTour}`,
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
            {convertPrice(itinerary.priceOfTour)} {selectedCurrency}
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

      {/* Share Button */}
      <div className="itinerary-share">
        <button className="share-button" onClick={handleShare}>
          Share Itinerary
        </button>
      </div>
    </div>
  );
};

export default ViewItineraryCard;
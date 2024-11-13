import React from "react";

const ViewItineraryCard = ({ itinerary }) => {
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
          <span className="price-value">${itinerary.priceOfTour}</span>
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
    </div>
  );
};

export default ViewItineraryCard;

import React from "react";
import "../css/ItineraryItem.css"; // Import the CSS file for styles

const ItineraryItem = ({ itinerary, onDelete, onEdit }) => {
  return (
    <div className="itinerary-card">
      <h2 className="itinerary-title">{itinerary.name}</h2>
      <p className="itinerary-duration">Duration: {itinerary.duration} hours</p>
      <p className="itinerary-price">Price: ${itinerary.priceOfTour}</p>
      <p className="itinerary-language">Language: {itinerary.languageOfTour}</p>
      <p className="itinerary-timeline">
        Timeline: {new Date(itinerary.timeline).toLocaleString()}
      </p>
      <h3>Locations to Visit:</h3>
      <ul className="locations-list">
        {itinerary.locationsToVisit.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul>
      <h3>Available Dates:</h3>
      <ul className="dates-list">
        {itinerary.availableDates.map((date, index) => (
          <li key={index}>{new Date(date).toLocaleDateString()}</li>
        ))}
      </ul>
      <div className="button-container">
        <button className="edit-button" onClick={() => onEdit(itinerary._id)}>
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(itinerary._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItineraryItem;

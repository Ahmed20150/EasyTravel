import React from "react";

const ViewActivityCard = ({ activity }) => {
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
            ${activity.price.min} - ${activity.price.max}
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
    </div>
  );
};

export default ViewActivityCard;

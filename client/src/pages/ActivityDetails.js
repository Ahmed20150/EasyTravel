import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext';

const ActivityDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCurrency, exchangeRates } = useCurrency();
  const activity = location.state?.activity;

  if (!activity) {
    return (
      <div>
        <div>Activity details not available.</div>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2);
  };

  return (
    <div>
      <div>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h1>{activity.creator}'s Activity</h1>
        <span>{activity.isBookingOpen ? "Booking Open" : "Booking Closed"}</span>
      </div>

      <div>
        <div>
          <div>
            <h3>Date</h3>
            <p>{new Date(activity.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3>Time</h3>
            <p>{activity.time}</p>
          </div>
          <div>
            <h3>Location</h3>
            <p>{activity.location.address}</p>
          </div>
          <div>
            <h3>Category</h3>
            <p>{activity.category}</p>
          </div>
        </div>

        <div>
          <div>
            <h3>Price Range</h3>
            <p>
              {convertPrice(activity.price.min)} - {convertPrice(activity.price.max)} {selectedCurrency}
            </p>
          </div>
          <div>
            <h3>Special Discount</h3>
            <p>{activity.specialDiscounts}% off</p>
          </div>
          <div>
            <h3>Rating</h3>
            <p>{activity.avgRating.toFixed(1)} ⭐ ({activity.totalRatingCount} reviews)</p>
          </div>
          <div>
            <h3>Number of Purchases</h3>
            <p>{activity.numOfPurchases || 0}</p>
          </div>
        </div>
      </div>

      <div>
        <h3>Tags</h3>
        <div>
          {activity.tags?.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={() => navigate(`/book/${activity._id}`)}
          disabled={!activity.isBookingOpen}
        >
          {activity.isBookingOpen ? 'Book Now' : 'Booking Closed'}
        </button>
      </div>
    </div>
  );
};

export default ActivityDetails;
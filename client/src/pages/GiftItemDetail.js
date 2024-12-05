import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import "../css/ProductList.css"; // Updated CSS file

const GiftItemDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { giftItem, userType } = location.state || {};
  const { selectedCurrency, exchangeRates } = useCurrency();

  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2);
  };

  if (!giftItem) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="gift-item-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <div className="gift-item-header">
        <img
          src={giftItem.image}
          alt={giftItem.name}
          className="gift-item-image"
        />
        <div className="gift-item-info">
          <h1>{giftItem.name}</h1>
          <p className="gift-item-price">
            {convertPrice(giftItem.price)} {selectedCurrency}
          </p>
          <p className="gift-item-description">{giftItem.description}</p>
          {userType === "admin" || userType === "seller" ? (
            <>
              <p className="gift-item-quantity">
                Quantity: {giftItem.quantity}
              </p>
              <p className="gift-item-purchases">Sales: {giftItem.purchases}</p>
            </>
          ) : null}
          <p className="gift-item-seller">Seller: {giftItem.seller}</p>
        </div>
      </div>
      <div className="gift-item-reviews">
        <h2>Customer Reviews</h2>
        {giftItem.reviews && giftItem.reviews.length > 0 ? (
          giftItem.reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <p className="review-author">
                  <strong>{review.username}</strong>
                </p>
                <p className="review-rating">Rating: {review.rating} ⭐</p>
              </div>
              <p className="review-content">{review.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default GiftItemDetail;

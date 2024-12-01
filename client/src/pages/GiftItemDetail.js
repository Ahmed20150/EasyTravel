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
            <div key={index} className="review">
              <p className="review-author">
                <strong>{review.author}</strong>
              </p>
              <p className="review-content">{review.content}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
      <div className="gift-item-ratings">
        <h2>Ratings</h2>
        <p className="ratings-score">{giftItem.ratings} / 5</p>
      </div>
    </div>
  );
};

export default GiftItemDetail;

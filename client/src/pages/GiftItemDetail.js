import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import * as HossStyles from "../styles/HossStyles"; // Importing styles from HossStyles.js
import { buttonStyle } from "../styles/GeneralStyles"; // Importing buttonStyle from GeneralStyles.js

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
    return <div className={HossStyles.loaderText}>Loading...</div>;
  }

  return (
    <div className={HossStyles.pageContainer}>

      
      <button
        className={`${buttonStyle} mb-6`} // Applying buttonStyle from GeneralStyles
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <div className={HossStyles.giftItemCardContainer}>
        <div className={HossStyles.giftItemImageContainer}>
          <img
            src={giftItem.image}
            alt={giftItem.name}
            className={HossStyles.imageStyle}
          />
        </div>
        <div className={HossStyles.giftItemDetails}>
          <h1 className="text-3xl font-semibold mb-4">{giftItem.name}</h1>
          <p className={HossStyles.giftItemPrice}>
            {convertPrice(giftItem.price)} {selectedCurrency}
          </p>
          <p className={HossStyles.giftItemDescription}>{giftItem.description}</p>
          {userType === "admin" || userType === "seller" ? (
            <>
              <p className="mb-2">Quantity: {giftItem.quantity}</p>
              <p className="mb-2">Sales: {giftItem.purchases}</p>
            </>
          ) : null}
          <p className="mb-2">Seller: {giftItem.seller}</p>
        </div>
      </div>

      <div className={HossStyles.reviewContainer}>
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {giftItem.reviews && giftItem.reviews.length > 0 ? (
          giftItem.reviews.map((review, index) => (
            <div key={index} className={HossStyles.reviewCard}>
              <div className={HossStyles.reviewHeader}>
                <p className={HossStyles.reviewAuthor}>
                  <strong>{review.username}</strong>
                </p>
                <p className={HossStyles.reviewRating}>Rating: {review.rating} ⭐</p>
              </div>
              <p className={HossStyles.reviewContent}>{review.review}</p>
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

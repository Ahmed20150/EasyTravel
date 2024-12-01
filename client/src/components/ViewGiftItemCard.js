import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder
import "../css/ProductList.css";

const ViewGiftItemCard = ({ giftItem }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();
  const navigate = useNavigate();

  // Function to convert price to selected currency
  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2); // Default to USD if no exchange rate is found
  };

  const handleClick = () => {
    console.log("id = " + giftItem._id);
    console.log("Gift item:", giftItem); // Debugging log
    navigate(`/productList/gift-item/${giftItem._id}`, { state: { giftItem } });
  };

  return (
    <div className="view-gift-item-card" onClick={handleClick}>
      <div className="gift-item-header">
        <img
          className="gift-item-image"
          src={giftItem.image}
          alt={giftItem.name}
        />
      </div>
      <div className="gift-item-body">
        <h2 className="gift-item-title">{giftItem.name}</h2>
        <p className="gift-item-description">{giftItem.description}</p>
        <p className="gift-item-price">
          Price: {convertPrice(giftItem.price)} {selectedCurrency}
        </p>
      </div>
    </div>
  );
};

export default ViewGiftItemCard;

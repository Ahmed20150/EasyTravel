import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder
import "../css/ProductList.css";

const ViewGiftItemCard = ({ giftItem, userType }) => {
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
    navigate(`/productList/gift-item/${giftItem._id}`, {
      state: { giftItem, userType },
    });
  };

  return (
    <div className="gift-item-card" onClick={handleClick}>
      {giftItem.image && (
        <img
          className="gift-item-image"
          src={giftItem.image}
          alt={giftItem.name}
        />
      )}
      <div className="gift-item-details">
        <h2 className="gift-item-title">{giftItem.name}</h2>
        <p className="gift-item-description">{giftItem.description}</p>
        <p className="gift-item-price">
          Price: {convertPrice(giftItem.price)} {selectedCurrency}
        </p>
        {userType === "admin" ||
          (userType === "seller" && (
            <>
              <p className="gift-item-quantity">
                Quantity: {giftItem.quantity}
              </p>
              <p className="gift-item-purchases">Sales: {giftItem.purchases}</p>
            </>
          ))}
        <p className="gift-item-seller">Seller: {giftItem.seller}</p>
      </div>
    </div>
  );
};

export default ViewGiftItemCard;

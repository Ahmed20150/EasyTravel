import React from "react";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder
import "../css/ProductList.css";

const ViewGiftItemCard = ({ giftItem }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();

  // Function to convert price to selected currency
  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2); // Default to USD if no exchange rate is found
  };

  //   // Share button handler
  //   const handleShare = async () => {
  //     const shareData = {
  //       title: giftItem.name,
  //       text: `Check out this gift item: ${giftItem.name}\nDescription: ${giftItem.description}\nPrice: $${giftItem.price}\nFind out more here: `,
  //       url: window.location.href, // Use current URL or a dynamic link if available
  //     };

  //     if (navigator.share) {
  //       try {
  //         await navigator.share(shareData);
  //         console.log("Gift item shared successfully");
  //       } catch (error) {
  //         console.error("Error sharing gift item:", error);
  //       }
  //     } else {
  //       alert("Sharing is not supported on this browser.");
  //     }
  //   };

  //   // Copy link handler
  //   const handleCopyLink = () => {
  //     const link = `${window.location.origin}/giftItem/${giftItem._id}`; // Generate gift item-specific link
  //     navigator.clipboard
  //       .writeText(link)
  //       .then(() => {
  //         alert("Link copied to clipboard!");
  //       })
  //       .catch((error) => {
  //         console.error("Failed to copy link:", error);
  //         alert("Failed to copy the link.");
  //       });
  //   };

  return (
    <>
      <div className="view-gift-item-card">
        <div className="gift-item-header">
          <img
            src={giftItem.image}
            alt={giftItem.name}
            className="gift-item-image"
          />
        </div>
        <div className="gift-item-body">
          <h2 className="gift-item-title">{giftItem.name}</h2>
          <p className="gift-item-description">{giftItem.description}</p>
          <p className="gift-item-price">
            Price:{" "}
            <span className="price-value">
              {convertPrice(giftItem.price)} {selectedCurrency}
            </span>
          </p>
          <p className="gift-item-purchases">
            Purchased: {giftItem.purchases} times
          </p>
          <p className="gift-item-date">
            Added on: {new Date(giftItem.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default ViewGiftItemCard;

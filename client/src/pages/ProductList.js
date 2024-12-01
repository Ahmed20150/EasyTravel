import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext is in components
import { useCookies } from "react-cookie"; // Import useCookies to manage cookies
import ViewGiftItemCard from "../components/ViewGiftItemCard"; // Updated file name for consistency
import "../css/ProductList.css";

const ProductList = () => {
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(true);

  const { selectedCurrency, convertPrice } = useCurrency();
  const [cookies] = useCookies(["userType", "username"]);
  const userType = cookies.userType;
  const username = cookies.username;

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/gift");
        setGifts(response.data);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setLoadingGifts(false);
      }
    };
    fetchGifts();
  }, []);

  return (
    <div className="product-list-container">
      <h1>All Products</h1>
      <Link to="/home">
        <button className="back-button">Back</button>
      </Link>
      {loadingGifts ? (
        <div className="loader">Loading Gifts/Products...</div>
      ) : gifts.length > 0 ? (
        <div className="gift-items-grid">
          {gifts.map((gift) => (
            <ViewGiftItemCard
              key={gift._id}
              giftItem={gift}
              userType={userType}
              convertPrice={convertPrice}
              selectedCurrency={selectedCurrency}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">No gifts/products available</div>
      )}
    </div>
  );
};

export default ProductList;

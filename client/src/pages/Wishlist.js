// import './Wishlist.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useCurrency } from '../components/CurrencyContext';

function Wishlist() {
    const [cookies] = useCookies(["username"]);
    const username = cookies.username;
    const [wishlistItems, setWishlistItems] = useState([]);
    const [giftDetails, setGiftDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { selectedCurrency, exchangeRates } = useCurrency();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                if (!username) {
                    throw new Error("Username not available in cookies.");
                }
                const response = await axios.get(
                    `http://localhost:3000/api/tourist/${username}/wishlist`
                );
                const wishlist = response.data.wishlist;

                if (Array.isArray(wishlist) && wishlist.length > 0) {
                    setWishlistItems(wishlist);
                    fetchAllGiftDetails(wishlist); // Fetch details for all items
                } else {
                    setWishlistItems([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [username]);

    const fetchGiftDetails = async (name) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/gift/search/${name}`
            );
    
            // Assuming the first item in the array is the relevant gift
            const gift = response.data[0];
            //alert(JSON.stringify(gift, null, 2)); // Alert details of the first gift
            return gift; // Return the first gift
        } catch (error) {
            console.error(`Error fetching details for gift ${name}:`, error);
            return null; // Return null if an error occurs
        }
    };
    

    const fetchAllGiftDetails = async (items) => {
        const details = {};
        for (const item of items) {
            const gift = await fetchGiftDetails(item); // Fetch details for each item
            if (gift) {
                details[item] = gift; // Map item name to its details
                
                // Access attributes properly
                const { description, price, image } = gift; // Destructure for clarity
            } else {
                alert(`Failed to fetch details for item: ${item}`);
            }
        }
        setGiftDetails(details); // Update state with fetched details
    };
    
    
    
    

    const convertPrice = (price) => {
        if (exchangeRates[selectedCurrency]) {
            return (price * exchangeRates[selectedCurrency]).toFixed(2);
        }
        return price.toFixed(2);
    };

    const removeItem = async (item) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/removeFromWishlist`,
                { giftName: item }
            );

            if (response.status === 200) {
                setWishlistItems((prevItems) => prevItems.filter((i) => i !== item));
                setGiftDetails((prevDetails) => {
                    const updatedDetails = { ...prevDetails };
                    delete updatedDetails[item];
                    return updatedDetails;
                });
            }
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    const addToCart = async (item) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/addToCartFromWishlist`,
                { giftName: item }
            );

            if (response.status === 200) {
                alert(`${item} successfully added to cart.`);
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    // Log the gift details before rendering to check what we have
    console.log("Current gift details:", giftDetails);

    return (
        <div className="App">
            <div className="heart">❤</div>
            <div className="wishlist">My Wishlist</div>

            {isLoading ? (
                <p>Loading...</p>
            ) : wishlistItems.length > 0 ? (
                <ul>
                    {wishlistItems.map((item, index) => (
                        <li key={index}>
                            <h2>{item}</h2>
                            {giftDetails[item] ? (
                                <div className="gift-details">
                                    <img
                                        src={giftDetails[item].image}
                                        alt={item}
                                        className="gift-image"
                                        style={{ width: '100px' }} // Set the width to 100px
                                    />

                                    <p>Description: {giftDetails[item].description}</p>
                                    <p>
                                        Price:{" "}
                                        {convertPrice(giftDetails[item].price)}{" "}
                                        {selectedCurrency}
                                    </p>
                                </div>
                            ) : (
                                <p>Loading details...</p>
                            )}
                            <button
                                onClick={() => removeItem(item)}
                                className="remove-button"
                            >
                                Remove
                            </button>
                            <button
                                onClick={() => addToCart(item)}
                                className="add-to-cart-button"
                            >
                                Add to Cart
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your Wishlist is empty</p>
            )}

            <div className="button1">
                <Link to="/home">
                    <button className="back-button1">Back</button>
                </Link>
            </div>
        </div>
    );
}

export default Wishlist;

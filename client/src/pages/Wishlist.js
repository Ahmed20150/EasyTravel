import './Wishlist.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useCurrency } from '../components/CurrencyContext'; // Assuming CurrencyContext is in components

function Wishlist() {
    const [cookies] = useCookies(["username"]); // Get cookies to access the username
    const username = cookies.username; // Extract the username from cookies
    const [wishlistItems, setWishlistItems] = useState([]); // State to hold wishlist items
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const { selectedCurrency, exchangeRates } = useCurrency(); // Currency context

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                if (!username) {
                    throw new Error("Username not available in cookies.");
                }
                const response = await axios.get(
                    `http://localhost:3000/api/tourist/${username}/wishlist`
                );
                console.log("API Response:", response.data); // Log the response to ensure correct data

                // Check if the response contains the wishlist array
                const wishlist = response.data.wishlist; // Assuming 'wishlist' is the key in the response object

                if (Array.isArray(wishlist) && wishlist.length > 0) {
                    setWishlistItems(wishlist); // If data is valid, update the state
                } else {
                    setWishlistItems([]); // If the wishlist is empty, clear the items
                }
                setIsLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setIsLoading(false); // Set loading to false even if an error occurs
            }
        };

        fetchWishlist(); // Call fetchWishlist on component load
    }, [username]); // Dependency array includes 'username'

    // Function to convert price to selected currency
    const convertPrice = (price) => {
        if (exchangeRates[selectedCurrency]) {
            return (price * exchangeRates[selectedCurrency]).toFixed(2); // Convert price based on exchange rate
        }
        return price.toFixed(2); // Return original price if no exchange rate found
    };

    // Function to handle item removal
    const removeItem = async (item) => {
        try {
            // Call the API endpoint to remove the item from the wishlist
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/removeFromWishlist`,
                { giftName: item }
            );

            if (response.status === 200) {
                // Remove the item from the state list if deletion is successful
                setWishlistItems((prevItems) => prevItems.filter((i) => i !== item));
            }
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    // Function to handle adding item to cart
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

    return (
        <div className="App">
            <div className="heart">❤</div>
            <div className="wishlist">My Wishlist</div>

            {isLoading ? ( // Show loading indicator while fetching data
                <p>Loading...</p>
            ) : wishlistItems.length > 0 ? ( // If wishlist is not empty, display items
                <ul>
                    {wishlistItems.map((item, index) => (
                        <li key={index}>
                            <h2>{item}</h2> {/* Display item (assuming simple string items like "Swiss knife") */}
                            <button
                                onClick={() => removeItem(item)}
                                className="remove-button"
                            >
                                Remove
                            </button> {/* Remove button */}
                            <button
                                onClick={() => addToCart(item)}
                                className="add-to-cart-button"
                            >
                                Add to Cart
                            </button> {/* Add to Cart button */}
                        </li>
                    ))}
                </ul>
            ) : ( // Display if wishlist is empty
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

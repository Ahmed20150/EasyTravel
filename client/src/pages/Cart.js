import './Cart.css'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useCurrency } from '../components/CurrencyContext'; 
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cookies] = useCookies(["username"]);
    const username = cookies.username;
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedCurrency, exchangeRates } = useCurrency();
    const navigate = useNavigate();

    // Fetch cart data from API
    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!username) {
                    throw new Error("Username not available in cookies.");
                }
                const response = await axios.get(
                    `http://localhost:3000/api/tourist/${username}/cart`
                );

                const cart = response.data.cart;
                if (Array.isArray(cart) && cart.length > 0) {
                    setCartItems(cart);
                } else {
                    setCartItems([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [username]);

    // Convert price to selected currency
    const convertPrice = (price) => {
        if (!price || isNaN(price)) {
            return "Invalid price"; // Handle invalid price
        }
        if (exchangeRates && selectedCurrency && exchangeRates[selectedCurrency]) {
            return (price * exchangeRates[selectedCurrency]).toFixed(2);
        }
        return price.toFixed(2);
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = parseFloat(convertPrice(item.price));
            return total + (isNaN(itemPrice) ? 0 : itemPrice);
        }, 0).toFixed(2);
    };

    // Handle item removal
    const removeItem = async (itemId) => {
        try {
            console.log("Removing item with ID:", itemId);  // Add logging to verify item ID

            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/removeFromCart`,
                { giftName: itemId }
            );

            console.log("Delete response:", response.data);  // Log the response status to debug

            if (response.status === 200) {
                // Remove the item from the cart state
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Handle item quantity update
    const updateItemQuantity = async (itemId, newQuantity) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/updateItemQuantity`,
                { giftName: itemId, newQuantity }
            );

            console.log("Update quantity response:", response.data);

            if (response.status === 200) {
                // Update the cart state with the new quantity
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error updating item quantity:", error);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/home');
    };
 //TODO Fix price conversion & display  

    // Handle checkout
    const handleCheckout = () => {
        // Navigate to checkout page or implement checkout logic
        navigate('/address');
    };

    return (
        <div className="cart-container">
            <h1>My Cart</h1>

            {isLoading ? (
                <p>Loading...</p>
            ) : cartItems.length > 0 ? (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            <h2>{item.name}</h2>
                            <p>Price: {convertPrice(item.price)} {selectedCurrency}</p>
                            <div>
                                <button
                                    onClick={() => removeItem(item.name)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                                    className="update-button"
                                >
                                    +1
                                </button>
                                <button
                                    onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
                                    className="update-button"
                                >
                                    -1
                                </button>
                                <p>Quantity: {item.quantity}</p>
                                
                            </div>
                        </li>
                    ))}
                     <h2>Total Price: {calculateTotalPrice()} {selectedCurrency}</h2>
                </ul>
                
            ) : (
                <p>Your Cart is empty</p>
            )}

            <div className="back-button-container">
                <button className="back-button" onClick={handleBack}>
                    Back
                </button>
            </div>

            {/* Add Check Out Button here */}
            <div className="checkout-button-container">
                <button className="checkout-button" onClick={handleCheckout}>
                    Check Out
                </button>
            </div>
        </div>
    );
}

export default Cart;

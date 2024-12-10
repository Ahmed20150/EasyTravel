// import './Cart.css'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useCurrency } from '../components/CurrencyContext'; 
import { useNavigate } from 'react-router-dom';
import { Card , Button} from "flowbite-react";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle , centerContent} from "../styles/gasserStyles"; 



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
                    console.log(cart[2]);
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
                              <Card
      className="max-w-sm"
      imgAlt="Gift Image"
      imgSrc={item.giftItem.image}
    >
      <a href="#">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {item.giftItem.name}
        </h5>
      </a>
      <div className="mb-5 mt-2.5 flex items-center">
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
          5.0
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{item.giftItem.price}</span>
        <p>Quantity: {item.quantity}</p>
        
        <Button
          onClick={() => updateItemQuantity(item.giftItem.name, item.quantity + 1)}
          className={buttonStyle}
        >
          +
        </Button>

        <Button
            onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
          className={buttonStyle}
        >
          -
        </Button>

        <Button
                                    onClick={() => removeItem(item.name)}
                                    className={buttonStyle}
                                >
                                    Remove
                                </Button>
      </div>
    </Card>







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

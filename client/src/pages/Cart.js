// import './Cart.css'; 
import React, { useEffect, useState,useMemo } from 'react';
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
    if (!cartItems || cartItems.length === 0) return 0;
  
    return cartItems.reduce((total, item) => {
      const itemPrice = convertPrice(item.giftItem.price); // Convert price based on selected currency
      return total + itemPrice * item.quantity;
    }, 0);
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
        navigate('/address');
    };

    const totalPrice = useMemo(() => calculateTotalPrice(), [cartItems, exchangeRates, selectedCurrency]); 

    return (
        <div className="cart-container">
           <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">My Cart</h1>
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => navigate("/home")}
          className={buttonStyle}
        >
          Back
        </Button>
        </div>
      </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : cartItems.length > 0 ? (
     <div className="flex flex-wrap justify-center gap-6">
          {cartItems.map((item, index) => (
            <Card
              key={index}
              className="w-72" // Fixed width for smaller cards
              imgAlt={item.giftItem.name}
              imgSrc={item.giftItem.image}
            >
              <div>
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {item.giftItem.name}
                </h5>
              </div>
              <div className="mb-5 mt-2.5 flex items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.giftItem.price} {selectedCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg">Quantity: {item.quantity}</p>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateItemQuantity(item.giftItem.name, item.quantity + 1)}
                    className={buttonStyle}
                  >
                    +
                  </Button>

                  <Button
                    onClick={() => updateItemQuantity(item.giftItem.name, item.quantity - 1)}
                    className={buttonStyle}
                  >
                    -
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
                
            ) : (
                <p>Your Cart is empty</p>
            )}


            <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
        <h1 className="text-4xl font-bold">
          Total Price: {convertPrice(totalPrice)} {selectedCurrency}
        </h1>
      </div>

            {/* Add Check Out Button here */}
            <div className="flex justify-center mt-4 mb-7">
                <Button className={buttonStyle} onClick={handleCheckout}>
                    Check Out
                </Button>
            </div>
        </div>
    );
}

export default Cart;

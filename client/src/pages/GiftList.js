// src/GiftList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext'; // Assuming CurrencyContext is in components
import { useCookies } from 'react-cookie'; // Import useCookies to manage cookies

const GiftList = () => {
    const [gifts, setGifts] = useState([]);
    
    // Get the selected currency and exchange rates from context
    const { selectedCurrency, exchangeRates } = useCurrency();
    
    // Use cookies to get the username
    const [cookies] = useCookies(['username']);
    const username = cookies.username; // Assuming the username is stored in a cookie

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/gift'); // Adjust based on your backend URL
                console.log(response.data); // Log the data to check its structure
                setGifts(response.data);
            } catch (error) {
                console.error('Error fetching gifts:', error);
            }
        };
        fetchGifts();
    }, []);

    const handlePurchase = async (id) => {
        try {
            const response = await axios.post(`http://localhost:3000/gift/purchase/${id}`);
            console.log(response.data.message);

            // Update the local state to increment the purchase count for the specific gift
            setGifts((prevGifts) => 
                prevGifts.map((gift) => 
                    gift._id === id ? { ...gift, purchases: Number(gift.purchases) + 1 } : gift
                )
            );
        } catch (error) {
            console.error('Error purchasing gift:', error);
        }
    };

    const handleAddToWishlist = async (giftName) => {
        if (!username) {
            alert("user not found")
            console.log('No username found in cookies');
            return;
        }

        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/addToWishlist`, 
                { giftName }
            );
            alert("Added " + giftName + " to your wishlist");
            console.log(response.data.message);

            // Optionally, you can update the UI or inform the user that the gift was added to the wishlist
        } catch (error) {
            console.error('Error adding gift to wishlist:', error);
        }
    };

    // Function to convert price to selected currency
    const convertPrice = (price) => {
        if (exchangeRates[selectedCurrency]) {
            return (price * exchangeRates[selectedCurrency]).toFixed(2); // Convert price based on exchange rate
        }
        return price.toFixed(2); // Return original price if no exchange rate found
    };

    return (
        <div>
            <h1>Gift Items</h1>
            <Link to="/home"><button>Back</button></Link>
            <ul>
                {gifts.map(gift => (
                    <li key={gift._id}>
                        <h2>{gift.name}</h2>
                        <img src={gift.image} alt={gift.name} width="100" />
                        <p>{gift.description}</p>
                        <p>Price: {selectedCurrency} {convertPrice(gift.price)}</p> {/* Display price in selected currency */}
                        <p>Purchases: {gift.purchases}</p>
                        <button onClick={() => handlePurchase(gift._id)}>Buy</button>
                        <button onClick={() => handleAddToWishlist(gift.name)}>Add to Wishlist</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GiftList;

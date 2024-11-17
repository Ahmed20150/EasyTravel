// src/GiftList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext'; // Assuming CurrencyContext is in components

const GiftList = () => {
    const [gifts, setGifts] = useState([]);
    
    // Get the selected currency and exchange rates from context
    const { selectedCurrency, exchangeRates } = useCurrency();

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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GiftList;

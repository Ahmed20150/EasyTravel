// src/GiftList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GiftList = () => {
    const [gifts, setGifts] = useState([]);

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/gift'); // Adjust based on your backend URL
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
                    gift._id === id ? { ...gift, purchases: gift.purchases + 1 } : gift
                )
            );
        } catch (error) {
            console.error('Error purchasing gift:', error);
        }
    };

    return (
        <div>
            <h1>Gift Items</h1>
            <ul>
                {gifts.map(gift => (
                    <li key={gift._id}>
                        <h2>{gift.name}</h2>
                        <img src={gift.image} alt={gift.name} width="100" />
                        <p>{gift.description}</p>
                        <p>Price: ${gift.price}</p>
                        <p>Purchases: {gift.purchases}</p> {/* Use the updated state here */}
                        <button onClick={() => handlePurchase(gift._id)}>Buy</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GiftList;

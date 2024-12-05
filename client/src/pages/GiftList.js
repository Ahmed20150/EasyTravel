import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext';
import { useCookies } from 'react-cookie';

const GiftList = () => {
    const [gifts, setGifts] = useState([]);
    const [promoCodes, setPromoCodes] = useState([]); // Store promo codes
    const [promoCode, setPromoCode] = useState(''); // Store the entered promo code
    const [promoDiscount, setPromoDiscount] = useState(0); // Store the promo discount

    const { selectedCurrency, exchangeRates } = useCurrency();
    const [cookies] = useCookies(['username']);
    const username = cookies.username;

    useEffect(() => {
        const fetchGiftsAndPromoCodes = async () => {
            try {
                // Fetch gifts
                const giftsResponse = await axios.get('http://localhost:3000/gift');
                setGifts(giftsResponse.data);

                // Fetch promo codes
                const promoResponse = await axios.get('http://localhost:3000/api/promo-codes');
                setPromoCodes(promoResponse.data || []);
            } catch (error) {
                console.error('Error fetching gifts or promo codes:', error);
            }
        };
        fetchGiftsAndPromoCodes();
    }, []);

    const handlePromoCodeCheck = () => {
        const promo = promoCodes.find((code) => code.promoCode === promoCode);

        if (promo && new Date(promo.expiryDate) > new Date()) {
            setPromoDiscount(promo.discount); // Apply discount
            alert(`Promo code applied! You get ${promo.discount}% off.`);
        } else {
            setPromoDiscount(0); // No discount if invalid or expired
            alert('Invalid or expired promo code.');
        }
    };



    const handleAddToWishlist = async (giftName) => {
        if (!username) {
            alert("User not found");
            console.log('No username found in cookies');
            return;
        }

        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/addToWishlist`,
                { giftName }
            );
            alert(`Added ${giftName} to your wishlist`);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error adding gift to wishlist:', error);
        }
    };
  const handlePurchase = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/gift/purchase/${id}`
      );
      console.log(response.data.message);

      // Update the local state to increment the purchase count for the specific gift
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift._id === id
            ? { ...gift, purchases: Number(gift.purchases) + 1 }
            : gift
        )
      );
    } catch (error) {
      console.error("Error purchasing gift:", error);
    }
  };



  const handleAddToCart = async (giftName) => {
    if (!username) {
      alert("user not found");
      console.log("No username found in cookies");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/tourist/${username}/addToCart`,
        { giftName }
      );
      alert("Added " + giftName + " to your Cart");
      console.log(response.data.message);

      // Optionally, you can update the UI or inform the user that the gift was added to the cart
    } catch (error) {
      console.error("Error adding gift to Cart:", error);
    }
  };

  // Function to convert price to selected currency
  const convertPrice = (price) => {
    if (exchangeRates[selectedCurrency]) {
      return (price * exchangeRates[selectedCurrency]).toFixed(2); // Convert price based on exchange rate
    }
    return price.toFixed(2); // Return original price if no exchange rate found
  };

    // Function to apply promo code discount to price
    const applyPromoDiscount = (price) => {
        if (promoDiscount) {
            return (price - (price * promoDiscount) / 100).toFixed(2); // Apply discount
        }
        return price.toFixed(2); // Return original price if no discount
    };

    return (
        <div>
            <h1>Gift Items</h1>
            <Link to="/home"><button>Back</button></Link>

            {/* Promo Code Section */}
            <div>
                <label>
                    Promo Code:
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                </label>
                <button type="button" onClick={handlePromoCodeCheck}>
                    Apply Promo Code
                </button>
            </div>

            <ul>
                {gifts.map(gift => (
                    <li key={gift._id}>
                        <h2>{gift.name}</h2>
                        <img src={gift.image} alt={gift.name} width="100" />
                        <p>{gift.description}</p>
                        <p>Price: {selectedCurrency} {convertPrice(applyPromoDiscount(gift.price))}</p>
                        <p>Purchases: {gift.purchases}</p>
                        <button onClick={() => handlePurchase(gift._id)}>Buy</button>
                        <button onClick={() => handleAddToWishlist(gift.name)}>Add to Wishlist</button>
                        <button onClick={() => handleAddToCart(gift.name)}>Add to cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GiftList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const GiftList = () => {
    const [gifts, setGifts] = useState([]);
    const [promoCodes, setPromoCodes] = useState([]); // Store promo codes
    const [promoCode, setPromoCode] = useState(''); // Store the entered promo code
    const [promoDiscount, setPromoDiscount] = useState(0); // Store the promo discount

    const { selectedCurrency, exchangeRates } = useCurrency();
    const [cookies] = useCookies(['username']);
    const username = cookies.username;

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedGiftId, setSelectedGiftId] = useState(null);
    

    const openModal = async (id) => {
        setSelectedGiftId(id);
        setModalIsOpen(true);
      };

    
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGiftId(null);
    // setAvailableDates([]);
    // setSelectedDate(null);
    // setSelectedTime(null);
  };

    const handleWalletPurchase = async () => {
        try {
          let gift;
      
          try {
            gift = await axios.get(
              `http://localhost:3000/gift/${selectedGiftId}`
            );
          } catch (error) {
            console.error("Gift not found, searching for activity...", error);
          }
    
      
          const today = new Date();
          const productName = gift.data.name;
          const purchaseDate = today;
          const quantity = 1; //TODO make quantity required
          const totalPrice = gift.data.price * quantity;

          await axios.patch("http://localhost:3000/api/wallet/purchaseProduct", {
            username,
            totalPrice
          })


            const response = await axios.post("http://localhost:3000/purchase/createPurchase", {
                touristUsername: username,
                productId: selectedGiftId,
                productName,
                purchaseDate,
                quantity,
                totalPrice,
                });


        toast.success("Product Purchased Successfully!");
      
        closeModal();
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Error Purchasing Product. Please try again.";
          toast.error(errorMessage);
        }
      };

    const handleCreditCardPurchase = async () => {
       let gift;

    
       try {
        gift = await axios.get(
          `http://localhost:3000/gift/${selectedGiftId}`
        );
      } catch (error) {
        console.error("Gift not found, searching for activity...", error);
      }

        const today = new Date();
        const productName = gift.data.name;
        const purchaseDate = today;
        const quantity = 1; //TODO make quantity required
        const totalPrice = gift.data.price * quantity;

        try {
            const response = await axios.post(
              "http://localhost:3000/payment/product/create-checkout-session",
              {
                productId: selectedGiftId,
                productName: gift.data.name,
                price: totalPrice,
              },
            //   {
            //     headers: { Authorization: `Bearer ${cookies.token}` },
            //   }
            );
            console.log("RESPONSE : ", response);
            window.location.href = response.data.url;
          } catch (error) {
            console.error("Error during credit card purchase:", error);
            toast.error(
              "An error occurred during the credit card purchase. Please try again."
            );
          }




  
      closeModal();
       
      };
      

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
        <div style={{ display: "flex", flexDirection: "column" }}>
             <div style={{ position: "relative", width: "100%", height: "100px" }}>
                <ToastContainer/>
                <Link to="/productOrders">
        <button style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
        }}>
          View Your Orders
        </button>
        </Link>
        </div>
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
                        <button onClick={() => handleAddToWishlist(gift.name)}>Add to Wishlist</button>
                        <button onClick={() => handleAddToCart(gift.name)}>Add to cart</button>
                        <button onClick={() => openModal(gift._id)}>Buy</button>
                    </li>
                ))}
            </ul>

            <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "60%", // Increase width
            height: "80%", // Increase height
            padding: "40px", // Increase padding
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h2>Payment Method</h2>
          <h3 style={{ marginBottom: "40px" }}>
            Please Choose your Payment Method
          </h3>
          <div style={{ display: "flex" }}>
            
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <button onClick={handleWalletPurchase}>by Wallet</button>
            <button onClick={handleCreditCardPurchase}>by Credit Card</button>
          </div>
          <button style={{ marginTop: "50px" }} onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>
        </div>
    );
};

export default GiftList;
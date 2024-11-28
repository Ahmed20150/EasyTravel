// src/GiftList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCurrency } from '../components/CurrencyContext'; 
import ViewItineraryCard from "../components/ViewItineraryCard";
import ViewActivityCard from "../components/ViewActivityCard";
import ViewMuseumCard from "../components/ViewMuseumCard";
import { useCookies } from "react-cookie";
import "../css/ExplorePage.css";
import Cookies from "js-cookie";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";


const GiftList = () => {
    const [gifts, setGifts] = useState([]);
    const username = Cookies.get("username");

    //Purchasing Variables
    
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

    const { selectedCurrency, exchangeRates } = useCurrency();

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
            <ul>
                {gifts.map(gift => (
                    <li key={gift._id}>
                        <h2>{gift.name}</h2>
                        <img src={gift.image} alt={gift.name} width="100" />
                        <p>{gift.description}</p>
                        <p>Price: {selectedCurrency} {convertPrice(gift.price)}</p> {/* Display price in selected currency */}
                        <p>Purchases: {gift.purchases}</p>
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

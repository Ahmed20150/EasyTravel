import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useSearchParams } from 'react-router-dom';
import { toast , ToastContainer} from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const username = cookies.username; 
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');
  const itemType = params.get('itemType');
  
  // Use a ref to track whether the effect has run
  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent running twice
    if (effectRan.current === false) {
      if(itemType === "itinerary"){
        verifyItineraryPayment();
      } else {
        verifyProductPayment();
      }

      // Mark the effect as having run
      return () => {
        effectRan.current = true;
      };
    }
  }, [itemType]); // Add itemType to dependency array to ensure correct behavior if it changes

  async function verifyItineraryPayment(){
    try {
      const selectedDate = searchParams.get('selectedDate');
      const selectedTime = searchParams.get('selectedTime');
      const itineraryId = searchParams.get('itenraryId');

      console.log("NEW ITEN ID", itineraryId);
      //updates tourists's booked Itenrary List
      await axios.patch("http://localhost:3000/api/bookItineraryWithCreditCard", {
        username,
        newItineraryId: itineraryId,
      });

      //update Itinerary's List of Booked Tourists
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${itineraryId}`
      );

      const touristsBook = [...itinerary.data.touristsBooked, username];

      await axios.patch(`http://localhost:3000/itinerary/${itineraryId}/touristsBook`, {
        touristsBooked: touristsBook,
      });

      //Add New Booking entry in Booking Table
      await axios.post("http://localhost:3000/booking/createBooking", {
        touristUsername: username,
        itineraryId: itineraryId,
        bookingDate: selectedDate,
        bookingTime: selectedTime
      });

      //Send Email Reciept
      const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);
      const email = user.data.email;

      const pickupLocation = itinerary.data.pickupLocation;
      const dropoffLocation = itinerary.data.dropoffLocation;
      const price = itinerary.data.priceOfTour;
      const text = `You have successfully booked an itinerary from ${pickupLocation} to ${dropoffLocation}. Your payment of ${price} Euro(s) By Credit Card was successfully recieved, Please check your Account for the payment details.`;
      await axios.post("http://localhost:3000/auth/sendPaymentEmail",{
        email, 
        text
      });

      const response = await axios.get('http://localhost:3000/payment/verify-payment', {
        params: {
          session_id: sessionId,
          itineraryId,
        },
      });
      toast.success(response.data.message);

    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  async function verifyProductPayment(){
    try {
      const productId = searchParams.get('itemId');

      const gift = await axios.get(
        `http://localhost:3000/gift/${productId}`
      );

      const today = new Date();
      const productName = gift.data.name;
      const purchaseDate = today;
      const quantity = 1; //TODO make quantity required
      const totalPrice = gift.data.price * quantity;

      const response = await axios.get('http://localhost:3000/payment/verify-payment', {
        params: {
          session_id: sessionId,
          productId,
        },
      });

      await axios.post("http://localhost:3000/purchase/createPurchase", {
        touristUsername: username,
        productId: productId,
        productName,
        purchaseDate,
        quantity,
        totalPrice,
      });

      toast.success(response.data.message);

    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  return (
    <div style={{display:"flex", flexDirection: "column"}}>
      
      <h1>Payment Successful!</h1>
      <p>Your {itemType} has been booked.</p>
      <ToastContainer/>

      {itemType === "itinerary" ? (
        <Link to="/ViewAllItinerary"><button>Continue</button></Link>
      ) : (
        <Link to="/productList"><button>Continue</button></Link>
      )}
    </div>
  );
};

export default PaymentSuccess;
import React, { useEffect } from 'react';
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
  const itineraryId = params.get('itineraryId');

  //TODO why does it run twice?? 
  
  useEffect(() => {
   verifyPayment();
  }, []);

  async function verifyPayment(){
    try {
    const selectedDate = searchParams.get('selectedDate');
    const selectedTime = searchParams.get('selectedTime');

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

  return (
    <div style={{display:"flex", flexDirection: "column"}}>

      <h1>Payment Successful!</h1>
      <p>Your itinerary has been booked.</p>
      <ToastContainer/>

     <Link to="/ViewAllItinerary"><button>Continue</button></Link>
    </div>
  );
};

export default PaymentSuccess;
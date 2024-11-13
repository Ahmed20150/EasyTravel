// src/components/Itineraries/ItineraryList.jsx
// src/components/Itineraries/ItineraryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem"; // Import the ItineraryItem component
import { useNavigate, Link } from "react-router-dom";
//import "../css/ItineraryList.css"; // Import the CSS file
import { useCookies } from "react-cookie";
import Modal from 'react-modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {loadStripe} from '@stripe/stripe-js';


Modal.setAppElement('#root');


const ViewItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const userType = cookies.userType; // Access the userType
  const username = cookies.username; // Access the username

  const [bookedItineraries, setBookedItineraries] = useState([]); // Store booked itineraries

  const navigate= useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/itinerary"); // Replace with your API endpoint
        const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);

        // Filter only activated itineraries
        const activatedItineraries = response.data.filter(
          (itinerary) => itinerary.activated || user.data.bookedItineraries.includes(itinerary._id)
        );

        // Store the activated itineraries in state
        setItineraries(activatedItineraries);

        // Fetch the tourist's booked itineraries
        const tourist = await axios.get(
          `http://localhost:3000/api/tourist/${username}`
        );
        setBookedItineraries(tourist.data.bookedItineraries || []); // Store the booked itineraries in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [username]);

  if (loading) {
    return <p>Loading itineraries...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  
  const openModal = async (id) => {
    setSelectedItineraryId(id);
    setModalIsOpen(true);
    const itineraryResponse = await axios.get(`http://localhost:3000/itinerary/${id}`);
    setAvailableDates(itineraryResponse.data.availableDates);
    setAvailableTimes(itineraryResponse.data.availableTimes);

  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItineraryId(null);
    setAvailableDates([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };


  const checkAge = async (username) => {
    try {
      // Fetch the tourist data first to check the age
      const tourist = await axios.get(`http://localhost:3000/api/tourist/${username}`);
      const { dateOfBirth } = tourist.data;

      // Calculate age
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 18;
    } catch (error) {
      console.error("Error checking age:", error);
      return false;
    }
  };

  const handleWalletPurchase = async () => {
    try {
      const isOldEnough = await checkAge(username);
      if (!isOldEnough) {
        toast.error("You must be 18 or older to book an itinerary.");
        return;
      }

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj <= today) {
        toast.error("The selected date must be after Todays date.");
        return;
      }

      //Update Activity Purchases
       await axios.patch(`http://localhost:3000/itinerary/increment-purchases/${selectedItineraryId}`);
       

      const newBookedItineraries = [...bookedItineraries, selectedItineraryId]; // Update Itenararies Booked List in Tourist Model

      //Updating Tourists Booked List in Itinerary
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${selectedItineraryId}`
      );

      const touristsBook = [...itinerary.data.touristsBooked, username];

      await axios.patch(`http://localhost:3000/itinerary/${selectedItineraryId}/touristsBook`, {
        touristsBooked: touristsBook,
      });

      // Call the backend route to book the itinerary and update the wallet
      const response = await axios.patch("http://localhost:3000/api/bookItinerary", {
        username,
        newBookedItineraries,
        selectedItineraryId,
      });

      console.log("TOURIST USERNAME : ", username);

      await axios.post("http://localhost:3000/booking/createBooking", {
        touristUsername: username,
        itineraryId: selectedItineraryId,
        bookingDate: selectedDate,
        bookingTime: selectedTime
      });

      
      // Update the state with the new booked itineraries and wallet balance
      setBookedItineraries(response.data.bookedItineraries);

      
      //Send Email Reciept

      const user = await axios.get(`http://localhost:3000/api/tourist/${username}`);
      const email = user.data.email;

      const pickupLocation = itinerary.data.pickupLocation;
      const dropoffLocation = itinerary.data.dropoffLocation;
      const price = itinerary.data.priceOfTour;
      const text = `You have successfully booked an itinerary from ${pickupLocation} to ${dropoffLocation}. Your payment of ${price} Euro(s) by Wallet was successfully recieved, Please check your Account for the payment details.`;
      await axios.post("http://localhost:3000/auth/sendPaymentEmail",{
        email, 
        text
      });

      toast.success("Itinerary booked successfully!");

      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error booking itinerary. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCreditCardPurchase = async () => {

    const isOldEnough = await checkAge(username);
    if (!isOldEnough) {
      toast.error("You must be 18 or older to book an itinerary.");
      return;
    }

    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj <= today) {
      toast.error("The selected date must be after Todays date.");
      return;
    }

    const itinerary = await axios.get(
      `http://localhost:3000/itinerary/${selectedItineraryId}`
    );

    try {
      const response = await axios.post(
        'http://localhost:3000/payment/create-checkout-session',
        {
          itineraryId: selectedItineraryId,
          itineraryName: "Itinerary",
          price: itinerary.data.priceOfTour,
          selectedDate, 
          selectedTime, 
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      console.log("RESPONSE : ", response);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error during credit card purchase:', error);
      toast.error('An error occurred during the credit card purchase. Please try again.');
    }
  };

  function convertTo24HourFormat(timeString) {
    const [time, modifier] = timeString.split(/(AM|PM)/i);
    let [hours, minutes] = time.split(':').map(Number);
  
    if (modifier.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }


  const handleUnbook = async (id) => {
    try {
      const selectedItineraryId = id;

      const bookingResponse = await axios.get(`http://localhost:3000/booking/getBooking/${id}/${username}`);
      const booking = bookingResponse.data;

      if(!booking) {
       console.log("no booking exists for this itenrary for this user!")
        return;
      }

      // Check if the booking date and time is more than 48 hours before the current date and time
      const bookingTime24Hour = convertTo24HourFormat(booking.bookingTime);
      const bookingDate = new Date(booking.bookingDate).toISOString().split('T')[0];
      const currentDateTime = new Date();
      const bookingDateTime = new Date(`${bookingDate}T${bookingTime24Hour}:00`);
      console.log("BOOKING DATE : ", booking.bookingDate);
      console.log("BOOKING TIME : ", booking.bookingTime);
      console.log("BOOKING 24hr TIME : ", bookingTime24Hour);
      console.log("BOOKING DATE TIME : ", bookingDateTime);
      const timeDifference = bookingDateTime - currentDateTime;
      console.log("TIME DIFF : ",timeDifference);
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 48) {
        toast.error("You cannot unbook less than 48 hours before the booking date and time.");
        return;
      }


      console.log(`Unbooking itinerary: ${id} for user ${username}`);

      //Update Activity Purchases
      await axios.patch(`http://localhost:3000/itinerary/decrement-purchases/${selectedItineraryId}`);

      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${id}`
      );
      const touristsBook = itinerary.data.touristsBooked.filter(
        (user) => user !== username
      );

      await axios.patch(`http://localhost:3000/itinerary/${id}/touristsBook`, {
        touristsBooked: touristsBook,
      });

      // Remove the itinerary ID from bookedItineraries array
      const newBookedItineraries = bookedItineraries.filter(
        (itineraryId) => itineraryId !== id
      );

      // Update the user's booked itineraries on the server
      const response = await axios.patch(
        "http://localhost:3000/api/unbookItinerary",
        {
          username,
          newBookedItineraries,
          selectedItineraryId
        }
      );

      await axios.delete(`http://localhost:3000/booking/deleteBooking/${id}/${username}`);
      toast.success("Unbooking Successful, Amount is refunded to your wallet");

      // Update the booked itineraries state
      setBookedItineraries(newBookedItineraries);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error Unbooking itinerary. Please try again.";
      toast.error(errorMessage);
    }
  };
  return (
    <div>
   <h1>All Available Itenraries</h1>
   <div style={{display:"flex", justifyContent:"center", alignItems: "center", marginBottom:"20px"}}>
      <Link to="/viewPastEvents"><button>View Past Itineraries</button></Link>
      <Link to="/viewUpcomingEvents"><button>View Upcoming Itineraries</button></Link>
    </div>
    <div style={{display:"flex" }}>
      {itineraries.map((itinerary) => (
        <ItineraryItem
          key={itinerary._id}
          itinerary={itinerary}
          onBook={openModal}
          onUnbook={() => handleUnbook(itinerary._id)} // Pass the onBook function to ItineraryItem
          userType={userType} // Pass the userType prop
          isBooked={bookedItineraries.includes(itinerary._id)} // Check if the itinerary is already booked
        />
      ))}

    </div>

    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%', // Increase width
            height: '80%', // Increase height
            padding: '40px', // Increase padding
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h2>Payment Method</h2>
          <h3 style={{marginBottom: "40px"}}>Please Choose your Payment Method</h3>
          <div style={{display:"flex", gap:"40px"}}>
          <h3>Available Dates</h3>
          <h3>Available Times</h3>
          </div>
          <div style={{display:"flex"}}>
          <div>
          <FormControl>
            <RadioGroup
              aria-labelledby="available-dates-radio-group-label"
              name="available-dates-radio-group"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {availableDates.map((date, index) => (
                <FormControlLabel key={index} value={date} control={<Radio />} label={date} />
              ))}
            </RadioGroup>
          </FormControl>
          </div>


          <div>
          <FormControl>
            <RadioGroup
              aria-labelledby="available-dates-radio-group-label"
              name="available-dates-radio-group"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {availableTimes.map((time, index) => (
                <FormControlLabel key={index} value={time} control={<Radio />} label={time} />
              ))}
            </RadioGroup>
          </FormControl>
          </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "30px" }}>
            <button onClick={handleWalletPurchase} >by Wallet</button>
            <button onClick={handleCreditCardPurchase}>by Credit Card</button>
          </div>
          <button style={{ marginTop: "50px" }} onClick={closeModal}>Close</button>
        </div>
      </Modal>
    <Link to="/home"><button style={{display: "center", alignItems:"center"}}>Back</button></Link>
    <ToastContainer/>
    </div>
  );
};

export default ViewItinerary;

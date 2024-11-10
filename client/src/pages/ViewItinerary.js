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


Modal.setAppElement('#root');

//TODO if there are two future dates, there is no distinction which one did i choose when i have to book the itinerary

const ViewItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const userType = cookies.userType; // Access the userType
  const username = cookies.username; // Access the username

  const [bookedItineraries, setBookedItineraries] = useState([]); // Store booked itineraries

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

  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItineraryId(null);
    setAvailableDates([]);
    setSelectedDate(null);
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

      const newBookedItineraries = [...bookedItineraries, selectedItineraryId]; // Add the new itinerary ID

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

      
      // Update the state with the new booked itineraries and wallet balance
      setBookedItineraries(response.data.bookedItineraries);

      toast.success("Itinerary booked successfully!");
      closeModal();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error booking itinerary. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleBook = async (id) => {
    try {
      console.log(`username: ${username}, itinerary id: ${id}`);

      // Fetch the tourist data first to check the age
      const tourist = await axios.get(
        `http://localhost:3000/api/tourist/${username}`
      );
      const { dateOfBirth, bookedItineraries } = tourist.data;

      // Calculate age
      const currentDate = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const isBirthdayPassed =
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() >= birthDate.getDate());

  

      // If user is under 18, prevent the booking process
      if (age < 18) {
        console.error("User is under 18 and cannot book an itinerary.");
        toast.error("You must be 18 or older to book an itinerary.");
        return; // Stop the booking process
      }

      // Proceed with booking if age is 18 or above
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${id}`
      );
      const touristsBook = [...itinerary.data.touristsBooked, username];

      await axios.patch(`http://localhost:3000/itinerary/${id}/touristsBook`, {
        touristsBooked: touristsBook,
      });

      const newBookedItineraries = [...bookedItineraries, id]; // Add the new itinerary ID

      // Update the user's booked itineraries on the server
      const response = await axios.patch(
        "http://localhost:3000/api/bookItinerary",
        {
          username,
          newBookedItineraries,
        }
      );
      console.log("Booking response:", response.data);

      // Update the booked itineraries state
      setBookedItineraries(newBookedItineraries);
    } catch (error) {
      console.error(
        "Error booking itinerary:",
        error.response?.data || error.message
      );
    }
  };


  const handleUnbook = async (id) => {
    try {
      const selectedItineraryId = id;
      console.log(`Unbooking itinerary: ${id} for user ${username}`);
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
      console.log("Unbooking response:", response.data);

      // Update the booked itineraries state
      setBookedItineraries(newBookedItineraries);
    } catch (error) {
      console.error(
        "Error unbooking itinerary:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div>
   <h1>All Available Itenraries</h1>
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
            height: '60%', // Increase height
            padding: '40px', // Increase padding
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h2>Payment Method</h2>
          <h3>Please Choose your Payment Method</h3>

          <h3>Available Dates</h3>
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "30px" }}>
            <button onClick={handleWalletPurchase} >by Wallet</button>
            <button>by Credit Card</button>
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

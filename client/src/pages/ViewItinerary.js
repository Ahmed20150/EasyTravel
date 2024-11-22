// src/components/Itineraries/ItineraryList.jsx
// src/components/Itineraries/ItineraryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryItem from "../components/ItineraryItem"; // Import the ItineraryItem component
import { useNavigate, Link } from "react-router-dom";
//import "../css/ItineraryList.css"; // Import the CSS file
import { useCookies } from "react-cookie";

const ViewItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
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

      if (!isBirthdayPassed) {
        age--; // Adjust age if birthday hasn't occurred yet this year
      }

      // If user is under 18, prevent the booking process
      if (age < 18) {
        console.error("User is under 18 and cannot book an itinerary.");
        alert("You must be 18 or older to book an itinerary.");
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
      console.log(`Unbooking itinerary: ${id} for user ${username}`);
      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${id}`
      );
      const touristsBook = itinerary.data.touristsBooked.filter(
        (user) => user != username
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
        "http://localhost:3000/api/bookItinerary",
        {
          username,
          newBookedItineraries,
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
          onBook={handleBook}
          onUnbook={handleUnbook} // Pass the onBook function to ItineraryItem
          userType={userType} // Pass the userType prop
          isBooked={bookedItineraries.includes(itinerary._id)} // Check if the itinerary is already booked
        />
      ))}

    </div>
    <Link to="/home"><button style={{display: "center", alignItems:"center"}}>Back</button></Link>

    </div>
  );
};

export default ViewItinerary;
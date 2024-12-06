import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ItineraryItem from "../components/ItineraryItem";
import { Link } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify';



const ViewUpcomingEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = Cookies.get('username'); // Get the username from cookies

  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        if (!username) {
          setError('Username not found in cookies');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/booking/upcomingBookings', {
          params: { username },
        });

        setBookings(response.data);
      } catch (error) {
        setError('Error fetching past bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchPastBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  function convertTo24HourFormat(timeString) {
    const [time, modifier] = timeString.split(/(AM|PM)/i);
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  const handleUnbook = async (id) => {
    try {
      console.log(id);

      const booking = await axios.get(
        `http://localhost:3000/booking/getBooking/${id}`
      );

      const selectedItineraryId = booking.data.itineraryId;

      if (!booking) {
        console.log("no booking exists for this itenrary for this user!");
        return;
      }

      // Check if the booking date and time is more than 48 hours before the current date and time
      const bookingTime24Hour = convertTo24HourFormat(booking.bookingTime);
      const bookingDate = new Date(booking.bookingDate)
        .toISOString()
        .split("T")[0];
      const currentDateTime = new Date();
      const bookingDateTime = new Date(
        `${bookingDate}T${bookingTime24Hour}:00`
      );
      console.log("BOOKING DATE : ", booking.bookingDate);
      console.log("BOOKING TIME : ", booking.bookingTime);
      console.log("BOOKING 24hr TIME : ", bookingTime24Hour);
      console.log("BOOKING DATE TIME : ", bookingDateTime);
      const timeDifference = bookingDateTime - currentDateTime;
      console.log("TIME DIFF : ", timeDifference);
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 48) {
        toast.error(
          "You cannot unbook less than 48 hours before the booking date and time."
        );
        return;
      }

      console.log(`Unbooking itinerary: ${id} for user ${username}`);

      //Update Activity Purchases
      await axios.patch(
        `http://localhost:3000/itinerary/decrement-purchases/${selectedItineraryId}`
      );

      const itinerary = await axios.get(
        `http://localhost:3000/itinerary/${id}`
      );
      const touristsBook = itinerary.data.touristsBooked.filter(
        (user) => user !== username
      );

      await axios.patch(`http://localhost:3000/itinerary/${id}/touristsBook`, {
        touristsBooked: touristsBook,
      });

      const user = await axios.get(`http://localhost:3000/api/${username}`);

      let bookedItineraries = user.data.bookedItineraries;

      const newBookedItineraries = bookedItineraries.filter(
        (itineraryId) => itineraryId !== id
      );

      // Update the user's booked itineraries on the server
      const response = await axios.patch(
        "http://localhost:3000/api/unbookItinerary",
        {
          username,
          newBookedItineraries,
          selectedItineraryId,
        }
      );

      await axios.delete(
        `http://localhost:3000/booking/deleteBooking/${id}/${username}`
      );
      toast.success("Unbooking Successful, Amount is refunded to your wallet");
      const price = itinerary.data.priceOfTour;
      await axios.put("http://localhost:3000/itinerary/refundPoints", {
        price,
        username,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error Unbooking itinerary. Please try again.";
      toast.error(errorMessage);
    }
  };


  return (
    <div>
      <h1>Upcoming Events</h1>
      {bookings.length === 0 ? (
        <p>No Upcoming events found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.eventName} - {new Date(booking.bookingDate).toLocaleDateString()} - {booking.bookingTime}
              <button onClick={() => handleUnbook(booking._id)}>Cancel Booking</button>            
              </li>
          ))}
        </ul>
      )}

    <Link to="/ExplorePage"><button>Back</button></Link>
    </div>
  );
};

export default ViewUpcomingEvents;
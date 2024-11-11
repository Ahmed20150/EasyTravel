import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ItineraryItem from "../components/ItineraryItem";
import { Link } from 'react-router-dom'; 

const ViewPastEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        const username = Cookies.get('username'); // Get the username from cookies
        if (!username) {
          setError('Username not found in cookies');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/booking/pastBookings', {
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

  return (
    <div>
      <h1>Past Events</h1>
      {bookings.length === 0 ? (
        <p>No past events found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.eventName} - {new Date(booking.bookingDate).toLocaleDateString()} - {booking.bookingTime}
            </li>
          ))}
        </ul>
      )}

    <Link to="/ViewAllItinerary"><button>Back</button></Link>
    </div>
  );
};

export default ViewPastEvents;
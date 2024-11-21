import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { Link, useLocation } from 'react-router-dom';
import ItineraryCard from '../components/ItineraryItem';
import TouristForm from '../components/TouristForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TouristProfile = () => {
    const [cookies] = useCookies(["userType", "username"]);
    const userType = cookies.userType;
    const [tourist, setTourist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation();
    const { username } = location.state || {};
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [bookedItineraries, setBookedItineraries] = useState([]); // New state for booked itineraries
    const isProfilePage = true;

    useEffect(() => {
        const fetchTouristProfile = async () => {
            if (!username) {
                setError('Username not provided');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/api/tourist/${username}`);
                setTourist(response.data);
                setBookedItineraries(response.data.bookedItineraries || []); // Set booked itineraries
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch tourist profile');
                setLoading(false);
            }
        };

        const fetchBookmarkedEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/bookmarkedEvents/${username}`);
                setBookmarkedEvents(response.data.bookmarkedEvents || []);
                fetchItineraries(response.data.bookmarkedEvents || []);

            } catch (err) {
                console.error("Error fetching bookmarked events", err);
            }
        };
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/bookings/${username}`);
                const bookings = response.data.bookings || [];
                const upcomingBookings = bookings.filter(booking =>
                    isItineraryWithinTwoDays(booking.bookingDate)
                );
                setBookedItineraries(upcomingBookings);  
                

            } catch (err) {
                console.error("Error fetching bookings", err);
            }
        };
        const fetchItineraries = async (eventIds) => {
            try {
                const response = await axios.post("http://localhost:3000/api/itineraries/fetch", { eventIds });
                setItineraries(response.data);
            } catch (err) {
                console.error("Error fetching itineraries", err);
            }
        };
        fetchBookings();
        fetchTouristProfile();
        fetchBookmarkedEvents();
    }, [username]);
    const handleRequest = async (username, role) => {
        //const input = { username, role };
        try {
            // Construct the URL with the username and role as query parameters
            const response = await axios.post(`http://localhost:3000/Request/requestDelete/${username}/${role}`);
            // Update state to remove the deleted user
            window.alert(`Request sent successfully: ${response.data.message}`);
            // Filter out the deleted user from the UI
        } catch (error) {
            console.error("Error deleting user:", error);
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("An unexpected error occurred: " + error.message);
            }
        }
    };


    const handleUpdate = async (updatedTourist) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/tourist/${username}`, updatedTourist);
            setTourist(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update tourist profile');
        }
    };

    useEffect(() => {
        const sendEmail = async (to, subject, text) => {
            try {
              await axios.post('http://localhost:3000/auth/send-email', { to, subject, text });
              console.log('Email sent successfully');
            } catch (error) {
              console.error('Failed to send email', error);
            }
          };
        if (tourist && bookedItineraries.length > 0) {

            bookedItineraries.forEach(itinerary => {
                const subject = "Upcoming Itinerary Reminder";
                const text = `Dear ${tourist.username}, you have an upcoming itinerary "${itinerary.name}" scheduled for ${new Date(itinerary.timeline).toLocaleDateString()}. Please make sure to review your plans.`;
                
                sendEmail(tourist.email, subject, text)
                    .then(response => console.log(`Email sent: ${response}`))
                    .catch(error => console.error("Error sending email:", error));
            });
        }
    }, [tourist, bookedItineraries]);

    const handleBookmark = async (eventId) => {
        try {
            // Add or remove the event from the bookmark list
            await axios.patch("http://localhost:3000/api/bookmarkEvent", { username, eventId });
            setBookmarkedEvents(prevEvents => {
                const isBookmarked = prevEvents.includes(eventId);
                if (isBookmarked) {
                    return prevEvents.filter(id => id !== eventId);  // Remove bookmark
                } else {
                    return [...prevEvents, eventId];  // Add bookmark
                }
            });
        } catch (err) {
            console.error("Error bookmarking event", err);
        }
    };

    const isItineraryWithinTwoDays = (bookingDate) => {
        const bookingDateObj = new Date(bookingDate);
        const currentDate = new Date();
        const twoDaysLater = new Date();
        twoDaysLater.setDate(currentDate.getDate() + 2);

        // Zero out the time components for accurate date-only comparison
        bookingDateObj.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        twoDaysLater.setHours(0, 0, 0, 0);

        return bookingDateObj >= currentDate && bookingDateObj <= twoDaysLater;
    };
    
    

    // const filteredBookedItineraries = bookedItineraries.filter(itinerary => 
    //     isItineraryWithinTwoDays(itinerary.timeline)
    // );

    // Filter bookmarked itineraries with 'changed' and 'activated' status
    const filteredBookmarkedItineraries = bookmarkedEvents.filter(eventId => {
        // Find the itinerary by the eventId in the itineraries list
        const itinerary = itineraries.find(item => item._id === eventId);
        return itinerary && itinerary.changed === true && itinerary.activated === true;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <ToastContainer/>
            {isEditing ? (
                tourist ? (
                    <TouristForm tourist={tourist} onUpdate={handleUpdate} isEditing={isEditing} setIsEditing={setIsEditing} />
                ) : (
                    <div>No tourist data available</div>
                )
            ) : (
                <div>
                    <h1>{tourist.username}'s Profile</h1>
                    <p>Username: {tourist.username}</p>
                    <p>Email: {tourist.email}</p>
                    <p>Mobile Number: {tourist.mobileNumber}</p>
                    <p>Nationality: {tourist.nationality}</p>
                    <p>Date of Birth: {new Date(tourist.dateOfBirth).toLocaleDateString()}</p>
                    <p>Occupation: {tourist.occupation}</p>
                    <p>wallet: {tourist.wallet}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button className="delete-button" onClick={() => { handleRequest(tourist.username, userType) }}>Request Delete</button>

                    <h2>Bookmarked Events:</h2>
                    <div className="itinerary-list">
                        {itineraries.length > 0 ? (
                            itineraries.map((itinerary) => (
                                <ItineraryCard
                                    key={itinerary._id}
                                    itinerary={itinerary}
                                    onEdit={() => console.log("Edit", itinerary._id)}
                                    onDelete={() => console.log("Delete", itinerary._id)}
                                    userType={userType}
                                    onBook={() => console.log("Book", itinerary._id)}
                                    isBooked={false}
                                    onUnbook={() => console.log("Unbook", itinerary._id)}
                                    onActivationToggle={() => console.log("Toggle Activation", itinerary._id)}
                                    onBookmark={handleBookmark}
                                    isBookmarked={bookmarkedEvents.includes(itinerary._id)}
                                    isProfilePage={isProfilePage}
                                />
                            ))
                        ) : (
                            <p>No bookmarked events</p>
                        )}
                    </div>

                    <h2>Notifications (Bookmarked, Changed, Activated):</h2>
                    <div className="itinerary-list">
                        {filteredBookmarkedItineraries.length > 0 ? (
                            filteredBookmarkedItineraries.map((eventId) => {
                                const itinerary = itineraries.find(item => item._id === eventId);
                                return itinerary ? (
                                    <ItineraryCard
                                        key={itinerary._id}
                                        itinerary={itinerary}
                                        onBookmark={handleBookmark}
                                        isBookmarked={bookmarkedEvents.includes(itinerary._id)}
                                        isProfilePage={isProfilePage}
                                    />
                                ) : null;
                            })
                        ) : (
                            <p>No bookmarked itineraries with 'changed' and 'activated' status</p>
                        )}
                    </div>

                    <h2>Booked Itineraries (Within 2 Days):</h2>
                    <div className="itinerary-list">
                        {bookedItineraries.length > 0 ? (
                            bookedItineraries.map((itinerary) => (
                                <ItineraryCard
                                    key={itinerary._id}
                                    itinerary={itinerary}
                                    onBookmark={handleBookmark}
                                    isBookmarked={bookmarkedEvents.includes(itinerary._id)}
                                    isProfilePage={isProfilePage}
                                />
                            ))
                        ) : (
                            <p>No booked itineraries within the next 2 days</p>
                        )}
                    </div>

                    <Link to="/home"><button>Back</button></Link>
                </div>
            )}
        </div>
    );
};

export default TouristProfile;

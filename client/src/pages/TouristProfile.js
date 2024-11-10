import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { Link, useLocation } from 'react-router-dom';
import ItineraryCard from '../components/ItineraryItem'; // Import ItineraryCard component

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
    const [itineraries, setItineraries] = useState([]); // Store itineraries
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

        const fetchItineraries = async (eventIds) => {
            try {
                // Fetch itineraries based on eventIds
                const response = await axios.post("http://localhost:3000/api/itineraries/fetch", { eventIds });
                setItineraries(response.data);
            } catch (err) {
                console.error("Error fetching itineraries", err);
            }
        };

        fetchTouristProfile();
        fetchBookmarkedEvents();
    }, [username]);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
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
                    <Link to="/home"><button>Back</button></Link>
                </div>
            )}
        </div>
    );
};

export default TouristProfile;

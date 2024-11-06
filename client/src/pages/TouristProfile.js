import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { Link, useLocation } from 'react-router-dom';
import TouristForm from '../components/TouristForm';

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
            } catch (err) {
                console.error("Error fetching bookmarked events", err);
            }
        };

        fetchTouristProfile();
        fetchBookmarkedEvents();
    }, [username]);

    const handleBookmark = async (eventId) => {
        try {
            await axios.patch("http://localhost:3000/api/bookmarkEvent", { username, eventId });
            setBookmarkedEvents(prevEvents => [...prevEvents, eventId]);
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
                    <button
                        className="delete-button"
                        onClick={() => { handleRequest(tourist.username, userType) }}
                    >
                        Request Delete
                    </button>
                    <h2>Bookmarked Events:</h2>
                    {/* Ensure bookmarkedEvents is not undefined and is an array */}
                    <ul>
                        {Array.isArray(bookmarkedEvents) && bookmarkedEvents.length > 0 ? (
                            bookmarkedEvents.map(eventId => (
                                <li key={eventId}>{eventId}</li> // Display eventId or name here
                            ))
                        ) : (
                            <p>No bookmarked events</p>
                        )}
                    </ul>
                    <Link to="/home"><button>Back</button></Link>
                </div>
            )}
        </div>
    );
};

export default TouristProfile;

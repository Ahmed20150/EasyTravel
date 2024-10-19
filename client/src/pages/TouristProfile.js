// client/src/pages/TouristProfile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TouristForm from '../components/TouristForm';
import { useLocation } from 'react-router-dom'; // Import useLocation

const TouristProfile = () => {
    const [tourist, setTourist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation(); // Get the current location
    const { username } = location.state || {}; // Extract the username from the state

    useEffect(() => {
        const fetchTouristProfile = async () => {
            if (!username) {
                setError('Username not provided');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/api/tourist/${username}`); // Update the endpoint to use username
                setTourist(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch tourist profile');
                setLoading(false);
            }
        };
        fetchTouristProfile();
    }, [username]); // Use username as dependency

    const handleUpdate = async (updatedTourist) => {
        try {
            const response = await axios.put(`http://localhost:3000/api/tourist/${username}`, updatedTourist); // Update the endpoint for PUT request
            setTourist(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update tourist profile');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {isEditing ? (
                tourist ? ( // Ensure tourist is defined before rendering TouristForm
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
                </div>
            )}
        </div>
    );
};

export default TouristProfile;

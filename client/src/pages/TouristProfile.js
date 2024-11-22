// client/src/pages/TouristProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TouristForm from '../components/TouristForm';
import PreferenceSelector from '../components/PreferenceSelector';  // Import the new component
import { useLocation, Link } from 'react-router-dom';
import { useCookies } from "react-cookie";

const TouristProfile = () => {
    const [cookies] = useCookies(["userType", "username"]); // Get userType and username from cookies
    const userType = cookies.userType; // Access the userType

    const [tourist, setTourist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isPreferencesEditing, setIsPreferencesEditing] = useState(false); // State to toggle preferences editing
    const location = useLocation();
    const { username } = location.state || {};

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
        fetchTouristProfile();
    }, [username]); // Use username as dependency

    const handleRequest = async (username, role) => {
        try {
            const response = await axios.post(`http://localhost:3000/Request/requestDelete/${username}/${role}`);
            window.alert(`Request sent successfully: ${response.data.message}`);
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

    const handlePreferencesUpdate = (updatedPreferences) => {
        setTourist(prevTourist => ({
            ...prevTourist,
            preferences: updatedPreferences
        }));
        setIsPreferencesEditing(false);
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
                    <p>Wallet: {tourist.wallet}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button onClick={() => setIsPreferencesEditing(true)}>Edit Preferences</button> {/* Edit preferences button */}
                    <button
                        className="delete-button"
                        onClick={() => { handleRequest(tourist.username, userType); }}  // Pass the correct user details
                    >
                        Request Delete
                    </button>
                    <Link to="/home"><button>Back</button></Link>
                </div>
            )}

            {/* Show the PreferenceSelector component when editing preferences */}
            {isPreferencesEditing && tourist && (
                <PreferenceSelector
                    username={tourist.username}
                    currentPreferences={tourist.preferences}
                    onPreferencesUpdate={handlePreferencesUpdate}
                />
            )}
        </div>
    );
};

export default TouristProfile;

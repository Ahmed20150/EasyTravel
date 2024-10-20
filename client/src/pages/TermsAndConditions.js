import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TermsAndConditionsContent from '../components/TermsAndConditionsContent';
import { Cookies} from 'react-cookie';

const TermsAndConditions = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentLocation = useLocation();
    const cookies = new Cookies();
    const { userId, userType } = currentLocation.state; 
    const username = cookies.get("username");


    const handleAccept = async () => {
        try {
            // Update the user's firstTimeLogin to false after accepting the terms
            await axios.put(`http://localhost:3000/admin/${userType}/${userId}/accept-terms`);
            cookies.set("acceptedTerms", true, { path: "/" });
            console.log("NEW ACCEPTEDTERMSCOOKIE: ",  cookies.get("acceptedTerms")); 
            if(userType==="tourGuide"){
                navigate('/create-profile', { state: { username } });
            }
            else if(userType === "advertiser"){
                navigate('/create-profileAdv', { state: { username } });
            }
            else if(userType === "seller"){ 
                navigate('/create-profileSeller', { state: { username } });
            }
        } catch (err) {
            setError('Failed to accept terms. Please try again.');
        }
    };

    const handleReject = async () => {
        navigate("/");
    };


    return (
        <div>
            <TermsAndConditionsContent />
            <button onClick={handleAccept}>Accept Terms</button>
            <button onClick={handleReject}>Reject Terms</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TermsAndConditions;

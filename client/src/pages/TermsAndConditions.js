import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TermsAndConditionsContent from '../components/TermsAndConditionsContent';
import { Cookies} from 'react-cookie';
import { Button } from 'flowbite-react';
import { buttonStyle } from '../styles/gasserStyles';

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
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                marginTop: '40px',
                marginBottom: '40px'
            }}>
                <Button
                    className={buttonStyle}
                    onClick={handleAccept}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}
                >
                    Accept Terms
                </Button>
                <Button
                    className={buttonStyle}
                    onClick={handleReject}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}
                >
                    Decline
                </Button>
            </div>            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TermsAndConditions;

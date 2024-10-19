import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TermsAndConditionsContent from '../components/TermsAndConditionsContent';

const TermsAndConditions = ({ userId, userType }) => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAccept = async () => {
        try {
            // Update the user's firstTimeLogin to 2 after accepting the terms
            await axios.put(`http://localhost:3000/api/${userType}/${userId}/accept-terms`);
            navigate('/home'); // Redirect to home after accepting terms
        } catch (err) {
            setError('Failed to accept terms. Please try again.');
        }
    };

    return (
        <div>
            <TermsAndConditionsContent />
            <button onClick={handleAccept}>Accept Terms</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TermsAndConditions;

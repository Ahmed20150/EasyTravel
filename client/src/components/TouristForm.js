// client/src/components/TouristForm.js

import React, { useState, useEffect } from 'react';

const TouristForm = ({ tourist, onUpdate, isEditing, setIsEditing }) => {
    // Initialize formData with default values if tourist is undefined
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        mobileNumber: '',
        nationality: '',
        dateOfBirth: '',
        occupation: '',
    });

    useEffect(() => {
        if (tourist) {
            setFormData({
                username: tourist.username || '',
                email: tourist.email || '',
                mobileNumber: tourist.mobileNumber || '',
                nationality: tourist.nationality || '',
                dateOfBirth: tourist.dateOfBirth ? new Date(tourist.dateOfBirth).toISOString().split('T')[0] : '',
                occupation: tourist.occupation || '',
            });
        }
    }, [tourist]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onUpdate(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
            />
            <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Nationality"
                required
            />
            <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth} // Already formatted as a date string
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Occupation"
                required
            />
            <button type="submit">Update Profile</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
    );
};

export default TouristForm;

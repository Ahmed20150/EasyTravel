import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: { address: '', coordinates: { lat: '', lng: '' } },
        price: { min: '', max: '' },
        category: '',
        tags: '',
        specialDiscounts: '',
        isBookingOpen: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3500/activities', formData);
            console.log('Activity created:', response.data);
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="date" name="date" onChange={handleChange} required />
            <input type="time" name="time" onChange={handleChange} required />
            <input type="text" name="location" placeholder="Address" onChange={handleChange} required />
            <input type="number" name="priceMin" placeholder="Min Price" onChange={handleChange} required />
            <input type="number" name="priceMax" placeholder="Max Price" onChange={handleChange} required />
            <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
            <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} required />
            <input type="text" name="specialDiscounts" placeholder="Special Discounts" onChange={handleChange} />
            <label>
                Booking Open:
                <input type="checkbox" name="isBookingOpen" checked={formData.isBookingOpen} onChange={() => setFormData({ ...formData, isBookingOpen: !formData.isBookingOpen })} />
            </label>
            <button type="submit">Create Activity</button>
        </form>
    );
};

export default ActivityForm;

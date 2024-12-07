// src/components/TransportationForm.js
import { Link } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
// import '../css/Transport.css';

const TransportationForm = () => {
    const [cookies] = useCookies(["username"]); 
    const username = cookies.username;
    const [formData, setFormData] = useState({
        type: '',
        advertiser: '',
        departureLocation: '',
        arrivalLocation: '',
        departureDate: '',
        arrivalDate: '',
        NoPassengers: '',
        bookingStatus: 'pending',
        price: '',
        tourist_id: username
    });

    const [advertisers, setAdvertisers] = useState([]);

    useEffect(() => {
        // Fetch advertisers on component mount
        const fetchAdvertisers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/transport/advertiser-usernames');
                setAdvertisers(response.data);
            } catch (error) {
                console.error('Error fetching advertisers:', error);
            }
        };
        fetchAdvertisers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/transport/add', formData);
            alert(response.data.message);
            setFormData({
                type: '',
                advertiser: '',
                departureLocation: '',
                arrivalLocation: '',
                departureDate: '',
                arrivalDate: '',
                NoPassengers: '',
                bookingStatus: 'pending',
                price: '',
                tourist_id: username
            });
        } catch (error) {
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="form-container">
            <Link to="/home">
          <button>Back</button>
        </Link>
            <h2>Create Transportation Request</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Type:</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="scooter">Scooter</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Advertiser:</label>
                <select name="advertiser" value={formData.advertiser} onChange={handleChange} required className="scrollable-dropdown">
    <option value="">Select Advertiser</option>
    {advertisers.map((username, index) => (
        <option key={index} value={username}>
            {username}
        </option>
    ))}
</select>


                </div>

                <div className="form-group">
                    <label>Departure Location:</label>
                    <input type="text" name="departureLocation" value={formData.departureLocation} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Arrival Location:</label>
                    <input type="text" name="arrivalLocation" value={formData.arrivalLocation} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Departure Date:</label>
                    <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Arrival Date:</label>
                    <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Number of Passengers:</label>
                    <input type="number" name="NoPassengers" value={formData.NoPassengers} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input type="text" name="price" value={formData.price} onChange={handleChange} />
                </div>

                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>

    );
};

export default TransportationForm;

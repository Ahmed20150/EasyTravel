
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "flowbite-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { buttonStyle } from "../styles/WaelStyles";
import { Datepicker } from "flowbite-react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";

const TransportForm = () => {
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
        if (name === "passengers" && value < 1) {
            //alert("Passengers can not be negative")
            return
        }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/transport/add', formData);
            toast.success(response.data.message);
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
            toast.error(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ToastContainer />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">Welcome to EasyTravel</h1>
                <p className="text-lg text-gray-600">Book your transportation with ease</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">


                <h2 className="text-2xl font-bold text-primary mb-6">Book Transportation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Transport Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="car">Car</option>
                                <option value="bus">Bus</option>
                                <option value="scooter">Scooter</option>
                            </select>

                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Advertiser:</label>
                            <select name="advertiser" value={formData.advertiser} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent">
                                <option value="">Select Advertiser</option>
                                {advertisers.map((username, index) => (
                                    <option key={index} value={username}>
                                        {username}
                                    </option>
                                ))}
                            </select>


                        </div>


                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Number of Passengers</label>
                            <input
                                type="number"
                                name="NoPassengers"
                                value={formData.NoPassengers}
                                onChange={handleChange}
                                min="1"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                                required
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Departure Location</label>
                            <input
                                type="text"
                                name="departureLocation"
                                value={formData.departureLocation}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Arrival Location</label>
                            <input
                                type="text"
                                name="arrivalLocation"
                                value={formData.arrivalLocation}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Departure Date</label>
                            <input
                                type="date"
                                name="departureDate"
                                value={formData.arrivalDate}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Arrival Date</label>
                            <input
                                type="date"
                                name="arrivalDate"
                                value={formData.arrivalDate}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className={buttonStyle}
                    >
                        Submit Booking Request
                    </Button>
                </form>
            </div></div>
    );
};

export default TransportForm;

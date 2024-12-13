import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FaStar, FaSwimmingPool, FaSpa, FaUtensils, FaDumbbell, FaWifi, FaParking, FaMountain, FaUmbrellaBeach } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const hotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
];

const getRandomImage = () => hotelImages[Math.floor(Math.random() * hotelImages.length)];
const getRandomRating = () => (4 + Math.random()).toFixed(1);

const locationTypes = {
    'Downtown': ['Pool', 'Spa', 'Restaurant', 'Gym'],
    'Beachfront': ['Beach Access', 'Pool', 'Bar', 'WiFi'],
    'Mountain View': ['Hiking Trails', 'Restaurant', 'Spa', 'Parking']
};

const HotelCard = ({
    offer,
    username,
    discount,
    setLoading
}) => {
    const [randomImage] = useState(getRandomImage());
    const [randomRating] = useState(getRandomRating());
    const locationType = Object.keys(locationTypes)[Math.floor(Math.random() * 3)];

    const amenityIcons = {
        'Pool': <FaSwimmingPool className="text-blue-500" />,
        'Spa': <FaSpa className="text-purple-500" />,
        'Restaurant': <FaUtensils className="text-orange-500" />,
        'Gym': <FaDumbbell className="text-gray-500" />,
        'Beach Access': <FaUmbrellaBeach className="text-yellow-500" />,
        'Bar': <FaUtensils className="text-red-500" />,
        'WiFi': <FaWifi className="text-blue-400" />,
        'Hiking Trails': <FaMountain className="text-green-500" />,
        'Parking': <FaParking className="text-gray-500" />
    };

    const handleBooking = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                "http://localhost:3000/hotelOffer/bookHotels",
                {
                    username,
                    newBookedHotelId: offer.hotel.hotelId,
                    discountedPrice: offer.offers[0].price.total * (1 - discount / 100),
                }
            );
            toast.success('Hotel booked successfully! 🏨', {

                autoClose: 3000,

            });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to book hotel ❌', {

                autoClose: 3000,

            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="relative">
                <img
                    src={randomImage}
                    alt={offer.hotel.name}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold">{randomRating}</span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{offer.hotel.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{locationType}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {locationTypes[locationType].map((name) => (
                        <div key={name} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm">
                            {amenityIcons[name]}
                            <span>{name}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">${Math.round(offer.offers[0].price.total)}</span>
                        <span className="text-gray-600">/night</span>
                    </div>
                    <button
                        className="bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        onClick={handleBooking}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookHotel = () => {
    const [cityCode, setCityCode] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [adults, setAdults] = useState(1);
    const [roomQuantity, setRoomQuantity] = useState(1);
    const [hotelOffers, setHotelOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(["userType", "username"]);
    const username = cookies.username;
    const [formErrors, setFormErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 10;
    const [discount, setDiscount] = useState(0);
    const [promoCodes, setPromoCodes] = useState([]);

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/promo-codes");
            setPromoCodes(response.data || []);
        } catch (err) {

        }
    };

    const validateForm = () => {
        const errors = {};
        const today = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn < today) {
            errors.checkIn = "Check-in date cannot be in the past";
        }
        if (checkOut <= checkIn) {
            errors.checkOut = "Check-out date must be after check-in date";
        }
        if (cityCode.length !== 3) {
            errors.cityCode = "City code must be 3 characters";
        }
        if (adults < 1) {
            errors.adults = "There must be at least one adult";
        }
        if (roomQuantity < 1 || roomQuantity > adults) {
            errors.roomQuantity = "Room quantity must be between 1 and the number of adults";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please check the form for errors ⚠️', {

                autoClose: 3000,

            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/hotelOffer", {
                cityCode,
                checkInDate,
                checkOutDate,
                adults,
                roomQuantity,
                currency: "EUR",
            });
            const offers = response.data.data;
            setHotelOffers(offers);
            setCurrentPage(1);

            if (offers.length === 0) {
                toast.info('No hotels found for your search criteria 🔍', {

                    autoClose: 3000,

                });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to fetch hotel offers ❌', {

                autoClose: 3000,

            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate current offers
    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOffers = hotelOffers.slice(indexOfFirstOffer, indexOfLastOffer);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer

                autoClose={3000}

            />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12">Find Your Perfect Stay</h1>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <select
                                value={cityCode}
                                onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Where are you going?</option>
                                <option value="BER">Berlin</option>
                                <option value="DXB">Dubai</option>
                                <option value="EGP">Egypt</option>
                                <option value="FRA">Frankfurt</option>
                                <option value="LON">London</option>
                                <option value="MEX">Mexico City</option>
                                <option value="NYC">New York</option>
                                <option value="PAR">Paris</option>
                                <option value="ROM">Rome</option>
                                <option value="TKY">Tokyo</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Check-in</label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Check-out</label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                min={checkInDate || new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Guests & Rooms</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="number"
                                        value={adults}
                                        onChange={(e) => setAdults(parseInt(e.target.value))}
                                        min="1"
                                        placeholder="Guests"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        value={roomQuantity}
                                        onChange={(e) => setRoomQuantity(parseInt(e.target.value))}
                                        min="1"
                                        max={adults}
                                        placeholder="Rooms"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-4 flex justify-center mt-6">
                            <button
                                type="submit"
                                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                disabled={loading}
                            >
                                Search Hotels
                            </button>
                        </div>
                    </form>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {String(error)}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentOffers.map((offer, index) => (
                        <HotelCard
                            key={offer.hotel.hotelId || index}
                            offer={offer}
                            username={username}
                            discount={discount}
                            setLoading={setLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookHotel;

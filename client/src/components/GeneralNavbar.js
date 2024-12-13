// GeneralNavbar.js
import React, { useState, useEffect } from "react";
import { Button, Navbar } from "flowbite-react";
import EasyTravelLogo from "../images/EasyTravel Transparent logo.png";
import { buttonStyle, linkStyle } from "../styles/gasserStyles";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiCompass, FiCalendar, FiUser, FiLogOut, FiShoppingCart, FiHelpCircle } from 'react-icons/fi';
import { MdOutlineExplore, MdHistory, MdLocationOn, MdFlightTakeoff, MdHotel, MdUpcoming } from 'react-icons/md';
import { BiGift } from 'react-icons/bi';
import { useCurrency } from "../components/CurrencyContext";
import axios from "axios";

const GeneralNavbar = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [username, setUsername] = useState(Cookies.get("username"));
    const [userType, setUserType] = useState(Cookies.get("userType"));
    const { selectedCurrency, setSelectedCurrency, exchangeRates } = useCurrency();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = Cookies.get("token");
            const acceptedTerms = Cookies.get("acceptedTerms");

            if (!accessToken || acceptedTerms === "false") {
                navigate("/");
                return;
            }

            setUsername(Cookies.get("username"));
            setUserType(Cookies.get("userType"));
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (userType !== "admin" && username) {
                    const response = await axios.get(
                        `http://localhost:3000/notifications/${username}`
                    );
                    setNotifications(response.data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [userType, username]);

    const getNavigationItems = () => {
        const commonItems = [
            { name: 'Home', icon: FiHome, path: '/Home' },
            { name: 'Change Password', icon: FiUser, path: '/changePassword' },
        ];

        const userTypeItems = {
            tourist: [
                { name: 'Featured Activities', icon: FiCompass, path: '/activities-featured' },
                { name: 'Featured Itineraries', icon: FiCalendar, path: '/featured-itineraries' },
                { name: 'Upcoming Events', icon: MdUpcoming, path: '/viewUpcomingEvents' },
                { name: 'Past Events', icon: MdHistory, path: '/viewPastEvents' },
                { name: 'Museums', icon: MdHistory, path: '/tourist/museums' },
                { name: 'Gift Shop', icon: BiGift, path: '/ProductList' },
                { name: 'Book Flight', icon: MdFlightTakeoff, path: '/BookFLight' },
                { name: 'Book Hotel', icon: MdHotel, path: '/BookHotel' },
                { name: 'Book Transportation', icon: MdHotel, path: '/bookTransport' },
                { name: 'Shopping Cart', icon: FiShoppingCart, path: '/cart' },
                {name:'Wishlist', icon: MdHotel, path: '/Wishlist'},
                { name: 'Address Book', icon: MdLocationOn, path: '/address' },
                { name: 'Help', icon: FiHelpCircle, path: '/Help' },
                {name: 'Complaints', icon: FiUser, path: '/complaintManagement'},
            ],
            admin: [
                { name: 'Products', icon: BiGift, path: '/productList' },
                { name: 'Pending Requests', icon: FiCalendar, path: '/pendingRequestsPage' },
                { name: 'Account Management', icon: FiUser, path: '/adminAccountManagement' },
                {name: 'Manage Categories', icon: FiCompass, path: '/Categorycontrol'},
                {name: 'Manage Preferences', icon: FiCompass, path: '/preferences'},
                {name:'Financial Report', icon: BiGift, path: '/revenue'},
                {name:'Tourist Report', icon: FiUser, path: '/totaltouristactivity'},
                {name:'Gift Archival', icon: FiCalendar, path: '/all-gifts'},
                {name:'View Complaints', icon: FiUser, path: '/complaint/view'},
                {name:'View Activities', icon: FiCompass, path: '/activities'},
                {name:'View Itineraries', icon: FiCalendar, path: '/itinerary'},

            ],
            tourGuide: [
                { name: 'View Itineraries', icon: FiCalendar, path: '/itinerary' },
                { name: 'Financial Report', icon: BiGift, path: '/revenue' },
                { name: 'Tourist Report', icon: FiUser, path: '/tourist-report' },
            ],
            tourismGoverner: [
                { name: 'Museums & Historical Places', icon: MdHistory, path: '/tourismGoverner/museums' },
                { name: 'Add Museum', icon: FiCompass, path: '/add-museum' },
            ],
            seller: [
                { name: 'All Gifts/Products', icon: BiGift, path: '/productList' },
                { name: 'Financial Report', icon: BiGift, path: '/revenue' },
                { name: 'Gift Archival', icon: FiCalendar, path: '/all-gifts' },
            ],
            advertiser: [
                { name: 'All Gifts/Products', icon: BiGift, path: '/productList' },
                { name: 'View Activities', icon: FiCompass, path: '/activities' },
                { name: 'Financial Report', icon: BiGift, path: '/revenue' },
                { name: 'Tourist Report', icon: FiUser, path: '/totaltouristactivity' },
            ],
            // Add other user types as needed
        };

        return [...commonItems, ...(userTypeItems[userType] || [])];
    };

    function handleLogout() {
        // Remove all cookies
        const allCookies = Cookies.get();
        for (let cookie in allCookies) {
            Cookies.remove(cookie);
        }

        // Clear session storage but set a flag for landing page refresh
        sessionStorage.clear();
        sessionStorage.setItem('needsRefresh', 'true');

        // Reset states
        setUsername(null);
        setUserType(null);

        // Navigate to login page
        navigate("/login");
    }

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const handleViewProfile = () => {
        const loggedInUser = Cookies.get("username");
        const userType = Cookies.get("userType");
        if (loggedInUser) {
            if (userType === "tourGuide") {
                navigate("/view-profile", { state: { username: loggedInUser } });
            } else if (userType === "advertiser") {
                navigate("/view-profileAdv", { state: { username: loggedInUser } });
            } else if (userType === "seller") {
                navigate("/view-profileSeller", { state: { username: loggedInUser } });
            } else {
                navigate("/TouristProfile", { state: { username: loggedInUser } });
            }
        }
    };

    return (
        <>
            <Navbar fluid rounded className="fixed top-0 left-0 right-0 z-[9998] bg-white shadow-sm px-4">
                <div className="flex items-center justify-between w-full">
                    {/* Left Section - Menu and Logo only */}
                    <div className="flex items-center space-x-4">
                        {/* Menu Toggle Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>

                        {/* Logo */}
                        <Navbar.Brand href="/home" className="flex items-center">
                            <img
                                src={EasyTravelLogo}
                                className="w-auto object-contain"
                                alt="EasyTravel Logo"
                                style={{
                                    minWidth: '50px',
                                    maxWidth: '50px',
                                    height: 'auto'
                                }}
                            />
                        </Navbar.Brand>
                    </div>

                    {/* Center Section - Navigation Links (only show for tourists) */}
                    {userType === "tourist" && (
                        <div className="hidden md:flex items-center space-x-6 mx-4">
                            <Link to="/activities-featured" className="text-gray-700 hover:text-gray-900">
                                Featured Activities
                            </Link>
                            <Link to="/featured-itineraries" className="text-gray-700 hover:text-gray-900">
                                Featured Itineraries
                            </Link>
                        </div>
                    )}

                    {/* Right Section - Currency, User, Notifications, Cart, Logout */}
                    <div className="flex items-center space-x-4">
                        {userType === "tourist" && (
                            <div className="relative">
                                <select
                                    value={selectedCurrency}
                                    onChange={handleCurrencyChange}
                                    className="appearance-none bg-transparent border-none text-gray-700 py-2 pl-3 pr-8 cursor-pointer focus:outline-none"
                                >
                                    {Object.keys(exchangeRates).map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* User Menu - Only show for regular users */}
                        {userType !== "admin" && userType !== "tourismGoverner" && (
                            <div className="relative">
                                <button
                                    onClick={handleViewProfile}
                                    className="flex items-center space-x-1 text-gray-700"
                                >
                                    <span>{username}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Notifications */}
                        {userType !== "admin" && (
                            <>
                                {/* Notifications Button */}
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Popup */}
                                {showNotifications && (
                                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-start z-50">
                                        <div className="bg-white rounded-lg shadow-lg w-96 mt-20 max-h-[80vh] overflow-y-auto">
                                            <div className="flex justify-between items-center border-b p-4">
                                                <h2 className="text-lg font-semibold">Your Notifications</h2>
                                                <button
                                                    onClick={() => setShowNotifications(false)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <FiX className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                {notifications.length > 0 ? (
                                                    <ul className="space-y-4">
                                                        {notifications.map((notification, index) => (
                                                            <li key={index} className="bg-gray-50 rounded-lg p-3">
                                                                <p className="text-gray-700">{notification.message}</p>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {new Date(notification.timestamp).toLocaleString()}
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500 text-center">No notifications available.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Cart */}
                        {userType === 'tourist' && (
                            <button
                                onClick={() => navigate('/cart')}
                                className="text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Navbar>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[10000] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="text-xl font-semibold">Menu</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                {username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <div className="font-medium">{username}</div>
                                <div className="text-sm text-gray-500">{userType}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        {getNavigationItems().map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg mb-1 ${item.name === 'Shopping Cart' || item.name === 'Notifications'
                                    ? ''
                                    : 'hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-left text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <FiLogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GeneralNavbar;
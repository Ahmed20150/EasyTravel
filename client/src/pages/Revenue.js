import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import {
  cardStyle,
  buttonStyle,
  walletSectionStyle,
  itineraryListStyle,
  promoCodeListStyle,
  userLevelBadge,
  fadeIn
} from "../styles/AmrStyles"; // Import styles
function Revenue() {
  const [cookies] = useCookies(["userType", "username"]); 
  const userType = cookies.userType; 
  const username = cookies.username;
  const [it_totalRevenue, setItTotalRevenue] = useState(0);
  const [museum_totalRevenue, setMuseumTotalRevenue] = useState(0);
  const [act_totalRevenue, setActTotalRevenue] = useState(0);
  const [gift_totalRevenue, setGiftTotalRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filter, setFilter] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [acts, setActs] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterType, setFilterType] = useState(' '); 
  const [month, setMonth1] = useState('');
  const [date, setDate1] = useState('');
  const [giftItems, setGiftItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Utility function for formatting dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  
  const handleShowAllRevenueClick = async () => {
    try {
      const [itinerariesResponse, museumsResponse, actResponse, giftItemsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/itineraries'),
        axios.get('http://localhost:3000/api/museums'),
        axios.get('http://localhost:3000/api/activities'),
        axios.get('http://localhost:3000/api/giftitems'),
      ]);
  
      const itineraries = itinerariesResponse.data;
      const museums = museumsResponse.data;
      const acts = actResponse.data;
      const giftItems = giftItemsResponse.data;
  
      let filteredItineraries = itineraries;
      let filteredActs = acts;
      let filteredGiftItems = giftItems;
  
      if (userType === 'tourGuide') {
        filteredItineraries = itineraries.filter(itinerary => itinerary.creator === username);
      } else if (userType === 'advertiser') {
        filteredActs = acts.filter(act => act.creator === username);
      } else if (userType === 'seller') {
        filteredGiftItems = giftItems.filter(gift => gift.creator === username);
      }
  
      setItineraries(filteredItineraries);
      setMuseums(museums);
      setActs(filteredActs);
      setGiftTotalRevenue(filteredGiftItems);
  
      let museums_totalRevenue = 0;
  
      museums.forEach((museum) => {
        let ticketPrice = 0;
        switch (museum.type) {
          case "foreigner":
            ticketPrice = museum.ticketPrices.foreigner;
            break;
          case "native":
            ticketPrice = museum.ticketPrices.native;
            break;
          case "student":
            ticketPrice = museum.ticketPrices.student;
            break;
          default:
            ticketPrice = 0;
        }
        const numofpurchases = museum.numofpurchases || 1; 
        const subtotal2 = ticketPrice * numofpurchases;
        museums_totalRevenue += subtotal2;
      });
  
      const it_revenue = filteredItineraries.reduce((total, itinerary) => total + (itinerary.priceOfTour * (itinerary.numofpurchases || 1)), 0);
      const museum_revenue = museums_totalRevenue;
      const act_revenue = filteredActs.reduce((total, act) => total + (act.price.min * (1 - (act.specialDiscounts || 0) / 100) * (act.numofpurchases || 1)), 0);
      const gift_revenue = filteredGiftItems.reduce((total, gift) => total + (gift.price * (gift.purchases || 0)), 0);
  
      setItTotalRevenue(it_revenue);
      setMuseumTotalRevenue(museum_revenue);
      setActTotalRevenue(act_revenue);
      setGiftTotalRevenue(gift_revenue);
      setTotalRevenue(it_revenue + museum_revenue + act_revenue + gift_revenue);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleFilterClick = async () => {
    try {
      const [itinerariesResponse, museumsResponse, actResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/itineraries'),
        axios.get('http://localhost:3000/api/museums'),
        axios.get('http://localhost:3000/api/activities'),
      ]);
  
      const itineraries = itinerariesResponse.data;
      const museums = museumsResponse.data;
      const acts = actResponse.data;
  
      let filteredItineraries = itineraries;
      let filteredActs = acts;
  
      if (userType === 'tourGuide') {
        filteredItineraries = itineraries.filter(itinerary => itinerary.creator === username);
      } else if (userType === 'advertiser') {
        filteredActs = acts.filter(act => act.creator === username);
      }
  
      setItineraries(filteredItineraries);
      setMuseums(museums);
      setActs(filteredActs);
  
      let filtered = [];
      if (filter === 'activity') {
        filtered = filteredActs.map((act) => ({
          type: 'Activity',
          name: act.name,
          category: act.category,
          revenue: act.price.min * (1 - (act.specialDiscounts || 0) / 100) * (act.numofpurchases || 1),
        }));
      } else if (filter === 'itinerary') {
        filtered = filteredItineraries.map((itinerary) => ({
          type: 'Itinerary',
          name: itinerary.name,
          category: itinerary.category,
          revenue: itinerary.priceOfTour * (itinerary.numofpurchases || 1),
        }));
      } else if (filter === 'date' && selectedDate) {
        const selectedDateFormatted = new Date(selectedDate).toISOString().split('T')[0]; // Format selectedDate
  
        const activityResults = filteredActs
          .filter((act) => {
            const actDate = new Date(act.date).toISOString().split('T')[0]; // Format activity date
            return actDate === selectedDateFormatted; // Compare dates without time
          })
          .map((act) => ({
            type: 'Activity',
            name: act.name,
            category: act.category,
            revenue: act.price.min * (1 - (act.specialDiscounts || 0) / 100) * (act.numofpurchases || 1),
            date: act.date,
          }));
  
        const itineraryResults = filteredItineraries
          .filter((itinerary) => {
            return itinerary.availableDates.some(date => {
              const availableDate = new Date(date).toISOString().split('T')[0]; // Format available date
              return availableDate === selectedDateFormatted;
            });
          })
          .map((itinerary) => ({
            type: 'Itinerary',
            name: itinerary.name,
            category: itinerary.category,
            revenue: itinerary.priceOfTour * (itinerary.numofpurchases || 1),
            date: selectedDate,
          }));
  
        filtered = [...activityResults, ...itineraryResults];
      }
  
      setFilterData(filtered);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchGiftItems = async () => {
    try {
      setError('');
      setLoading(true);
      if (filterType === 'month') {
        // Validate month input
        if (!month || isNaN(month) || month < 1 || month > 12) {
          setError('Please enter a valid month (1-12).');
          return;
        }
        const response = await axios.get(`http://localhost:3000/gift/filter/byMonth`, {
          params: { month },
        });
        setGiftItems(response.data || []);
      } else if (filterType === 'date') {
        // Validate date input
        if (!date) {
          setError('Please select a valid date.');
          return;
        }
        const response = await axios.get(`http://localhost:3000/gift/filter/byDate`, {
          params: { date },
        });
        setGiftItems(response.data || []);
      } else if (filterType === 'product') {
        // Fetch all gift items along with their revenue
        const response = await axios.get(`http://localhost:3000/gift/filter/itemsWithRevenue`);
        setGiftItems(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching gift items:', err);
      setError(err.response?.data?.message || 'Failed to fetch gift items.');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className={`p-6 bg-gray-100 min-h-screen flex flex-col items-center ${fadeIn}`}>
      {/* Back Button */}
      <Button
        className={`${buttonStyle} absolute top-4 left-4 py-2 px-4 rounded-lg`}
        onClick={() => navigate("/home")}
      >
        Back
      </Button>
  
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg mt-10">
        <div className="flex flex-col items-center mb-6">

  
          {userType !== 'admin' && userType !== 'seller' && (
            <>
              {/* Filter Dropdown */}
              <div className="w-full mb-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Filter</option>
                  <option value="activity">Activity</option>
                  <option value="itinerary">Itinerary</option>
                  <option value="date">Date</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </>
          )}
  
          {/* Date Input for 'Date' Filter */}
          {filter === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
          )}
  
          {/* Month Input for 'Month' Filter */}
          {filter === 'month' && (
            <input
              type="number"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              min="1"
              max="12"
              placeholder="MM"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
          )}
  
          {userType !== 'admin' && userType !== 'seller' && (
            <Button
              className={`${buttonStyle} py-3 text-lg w-full rounded-lg`}
              onClick={handleFilterClick}
            >
              Filter
            </Button>
          )}
        </div>
  
        {/* Render Filtered Data */}
        {filterData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-semibold mb-4">Filtered Data:</h3>
            <ul>
              {filterData.map((data, index) => (
                <li key={index} className="mb-4">
                  <strong>{data.type}</strong>: {data.name} | <em>Category: {data.category}</em> | Revenue: <strong>${data.revenue.toFixed(2)}</strong> {data.date && `| Date: ${formatDate(data.date)}`}
                </li>
              ))}
            </ul>
          </div>
        )}
            {/* Show All Revenue Button */}
            <Button
            className={`${buttonStyle} py-3 text-lg w-full mb-4 rounded-lg`}
            onClick={handleShowAllRevenueClick}
          >
            Show All Revenue
          </Button>
        {/* Display Total Revenues */}
        <div className="mt-6">
          {userType !== 'seller' && (
            <p className="text-lg font-semibold">Itinerary Total Revenue: ${it_totalRevenue.toFixed(2)}</p>
          )}
  
          {userType !== 'seller' && userType !== 'advertiser' && userType !== 'tourGuide' && (
            <p className="text-lg font-semibold">Museum Total Revenue: ${museum_totalRevenue.toFixed(2)}</p>
          )}
  
          {userType !== 'seller' && (
            <p className="text-lg font-semibold">Activity Total Revenue: ${act_totalRevenue.toFixed(2)}</p>
          )}
  
          {userType !== 'advertiser' && userType !== 'tourGuide' && (
            <p className="text-lg font-semibold">Gift Item Total Revenue: ${gift_totalRevenue.toFixed(2)}</p>
          )}
  
          {userType === 'admin' && (
            <p className="text-xl font-semibold">
              <strong>Total Revenue: ${totalRevenue.toFixed(2)}</strong>
            </p>
          )}
        </div>
  
        {/* Filter Products for Admin/Seller */}
        {(userType === 'admin' || userType === 'seller') && (
          <div className="w-full max-w-lg p-6 mt-8 bg-white shadow-lg rounded-lg">
            {/* Filter Selection */}
            <h2 className="text-2xl font-semibold mb-4 text-center">Filter Products</h2>
  
            <div className="mb-4">
              <label className="font-semibold text-gray-700 mb-2 block">Select Filter Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Filter</option>
                <option value="month">Month</option>
                <option value="date">Date</option>
                <option value="product">Products</option>
              </select>
            </div>
  
            {/* Month Input */}
            {filterType === 'month' && (
              <div className="mb-4">
                <label className="font-semibold text-gray-700 mb-2 block">Enter Month (1-12):</label>
                <input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth1(e.target.value)}
                  placeholder="Enter month"
                  min="1"
                  max="12"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
  
            {/* Date Input */}
            {filterType === 'date' && (
              <div className="mb-4">
                <label className="font-semibold text-gray-700 mb-2 block">Select Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
  
            {/* Fetch Button */}
            <div className="text-center mb-6">
              <Button
                onClick={fetchGiftItems}
                className="w-full py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Fetch Products'}
              </Button>
            </div>
  
            {/* Error Handling */}
            {error && (
              <div className="text-red-600 text-center mb-4">{error}</div>
            )}
  
            {/* Display Filtered Gift Items */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Filtered Products</h3>
              {giftItems.length > 0 ? (
                <ul className="list-none">
                  {giftItems.map((item) => (
                    <li
                      key={item._id}
                      className="p-4 mb-4 border rounded-lg bg-gray-50 shadow-md"
                    >
                      <strong>Name:</strong> {item.name} | <strong>Revenue:</strong> ${item.revenue || 0}
                      {item.date && ` | Date: ${new Date(item.date).toLocaleDateString()}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600">No items found for the selected {filterType === 'month' ? 'month' : filterType === 'date' ? 'date' : 'product'}.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Revenue;
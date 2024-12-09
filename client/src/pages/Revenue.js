import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";

import { buttonStyle, buttonStyle2,buttonStyle3 ,cardStyle ,navbarStyle } from "../styles/AbdallahStyles"; 
import { Navbar, Button, Card, Footer } from "flowbite-react";
import HomeBanner from "../components/HomeBanner";
import { Link } from "react-router-dom";

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
        axios.get('http://localhost:3000/itineraries'),
        axios.get('http://localhost:3000/museums'),
        axios.get('http://localhost:3000/activities'),
        axios.get('http://localhost:3000/gift'),
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
        axios.get('http://localhost:3000/itineraries'),
        axios.get('http://localhost:3000/museums'),
        axios.get('http://localhost:3000/activities'),
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
  const outputStyle = {
    marginTop: '40px',
    textAlign: 'center',
    fontSize: '18px',
  };

  const filteredDataStyle = {
    marginTop: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    width: '80%',
    maxWidth: '600px',
    backgroundColor: '#f9f9f9',
  };

  return (



    
     <div >
      
      
      <HomeBanner/>
       <Link to="/home">
      <Button
               style={{ position: 'absolute', top: '30px', left: '10px' }}
               className={buttonStyle}
               >Back</Button>
      </Link>
      <div className="flex flex-col items-center justify-center mt-8" >
        <h1 className="text-4xl font-bold mb-8 mt-8 flex justify-center ">Financial Report</h1>
      <Card href="#" className="w-full max-w-3xl text-3xl p-8 shadow-lg flex-col justify-between ">
        
        {/* Show All Revenue Button */}
        <Button
          className={buttonStyle}
          onClick={handleShowAllRevenueClick}
          style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
        >
          Show All Revenue
        </Button>
        
        {/* that is for the small filter for adv , tg  */}
      {/* <Card href="#" className="w-full max-w-3xl text-3xl p-8 shadow-lg  " >  */}
        
        {userType !== 'admin'  && userType !== 'seller' && (
        
        //{/* Filter Button with Dropdown */}
        <>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Select Filter</option>
          <option value="activity">Activity</option>
          <option value="itinerary">Itinerary</option>
          <option value="date">Date</option>
          <option value="month">Month</option>
        </select></>
        )}

        {/* Input for selecting a date only when 'Date' is selected in the dropdown */}
        {filter === 'date' && (
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        )}

        {/* Input for selecting a month only when 'Month' is selected in the dropdown */}
        {filter === 'month' && (
          <input
            type="number"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            min="1"
            max="12"
            placeholder="MM"
          />
        )}
        {userType !== 'admin'  && userType !== 'seller' && (
        <Button
          onClick={handleFilterClick}
          className={buttonStyle3} >
          Filter
        </Button>)}
      

      {/* Render the filtered data */}
      {filterData.length > 0 && (
        <div style={filteredDataStyle}>
          <h3>Filtered Data:</h3>
          <ul>
            {filterData.map((data, index) => (
              <li key={index}>
                <strong>{data.type}</strong>: {data.name} | <em>Category: {data.category}</em> | Revenue: <strong>${data.revenue.toFixed(2)}</strong> {data.date && `| Date: ${formatDate(data.date)}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    
      {/* </Card> */}    

      {/* Show total revenue and individual revenues */}
      {/* <Card href="#" className="w-full max-w-3xl text-3xl mt-8 p-8 shadow-lg "> */}
        {/* && userType !== 'advertiser' */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mt-8">
      {userType !== 'seller' && (
        <Card href="#" className="max-w-sm" >
         <p>Itinerary Total Revenue : <strong>${it_totalRevenue.toFixed(2)}</strong></p>
         </Card>
      )}
   

{userType !== 'seller'  && userType !== 'advertiser' && userType !== 'tourGuide' && (
        <Card href="#" className="max-w-sm" >
          <p>Museum Total Revenue:<strong>${museum_totalRevenue.toFixed(2)}</strong> </p>
          </Card>
      )}
       {/* && userType !== 'tourGuide' */}
       {userType !== 'seller'  &&  (
        <Card href="#" className="max-w-sm" >
        <p>Activity Total Revenue :<strong> ${act_totalRevenue.toFixed(2)}</strong></p>
        </Card>
      )}
        
       {userType !== 'advertiser'  && userType !== 'tourGuide' && (
        <Card href="#" className="max-w-sm" >
          <p>Gift Item Total Revenue: <strong>${gift_totalRevenue.toFixed(2)}</strong></p>
         </Card> 
      )}
  
  </div>  
     {userType === 'admin' && (
    <p>

      <strong>Total Revenue: ${totalRevenue.toFixed(2)}</strong>
    </p>
     )}
{(userType === 'admin' || userType === 'seller') && (
  <Card href="#" className="w-full max-w-3xl mt-20 text-3xl p-8 shadow-lg " >
    {/* Filter Selection */}
    <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}><strong>Filter Products</strong></h2>
    
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>
        Select Filter Type:
      </label>
      <select 
        value={filterType} 
        onChange={(e) => setFilterType(e.target.value)} 
        style={{ 
          width: '100%', 
          padding: '10px', 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          fontSize: '16px' 
        }}
      >
        <option value="">Select Filter</option>
        <option value="month">Month</option>
        <option value="date">Date</option>
        <option value="product">Products</option>
      </select>
    </div>

    {/* Month Input */}
    {filterType === 'month' && (
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>
          Enter Month (1-12):
        </label>
      <select
         value={month}
         onChange={(e) => setMonth1(e.target.value)}
         style={{
         width: '100%',
         padding: '10px',
         border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px',
         }}
        >
      <option value="" disabled>Select month</option>
        {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
       {new Date(0, i).toLocaleString('en', { month: 'long' })}
       </option>
       ))}
      </select>

      </div>
    )}

    {/* Date Input */}
    {filterType === 'date' && (
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#555' }}>
          Select Date:
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate1(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>
    )}
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Button
        onClick={fetchGiftItems}
        className={buttonStyle3}
        
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Products'}
      </Button>
    </div>

    {/* Error Handling */}
    {error && (
      <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
        {error}
      </div>
    )}

    {/* Display Filtered Gift Items */}
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Filtered Products</h3>
      {giftItems.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {giftItems.map((item) => (
            <li 
              key={item._id} 
              style={{ 
                padding: '10px', 
                marginBottom: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                backgroundColor: '#f9f9f9'
              }}
            >
              <strong>Name:</strong> {item.name} | <strong>Revenue:</strong> ${item.revenue || 0}
              {item.date && ` | Date: ${new Date(item.date).toLocaleDateString()}`}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No items found for the selected{' '}
          {filterType === 'month' ? 'month' : filterType === 'date' ? 'date' : 'product'}.
        </p>
      )}
    </div>
  </Card>
)}
      </Card >  
    </div>
   </div>
  ) ;
}

export default Revenue;
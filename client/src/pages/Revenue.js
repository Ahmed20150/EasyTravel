import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";
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
    console.log("Fetching revenue data...");
    try {
      const [itinerariesResponse, museumsResponse, actResponse, giftItemsResponse] = await Promise.all([
        axios.get('http://localhost:3000/allitineraries'),
        axios.get('http://localhost:3000/allmuseums'),
        axios.get('http://localhost:3000/allactivities'),
        axios.get('http://localhost:3000/allgiftitems'),
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
        axios.get('http://localhost:3000/allitineraries'),
        axios.get('http://localhost:3000/allmuseums'),
        axios.get('http://localhost:3000/allactivities'),
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
        const response = await axios.get(`http://localhost:3000/allgiftitems/filter/byMonth`, {
          params: { month },
        });
        setGiftItems(response.data || []);
      } else if (filterType === 'date') {
        // Validate date input
        if (!date) {
          setError('Please select a valid date.');
          return;
        }
        const response = await axios.get(`http://localhost:3000/allgiftitems/filter/byDate`, {
          params: { date },
        });
        setGiftItems(response.data || []);
      } else if (filterType === 'product') {
        // Fetch all gift items along with their revenue
        const response = await axios.get(`http://localhost:3000/allgiftitems/filter/itemsWithRevenue`);
        setGiftItems(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching gift items:', err);
      setError(err.response?.data?.message || 'Failed to fetch gift items.');
    } finally {
      setLoading(false);
    }
  };
  

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100vh',
    padding: '20px 0',
    boxSizing: 'border-box',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    backgroundColor: 'purple',
    color: 'white',
    fontSize: '20px',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#5e2f8a',
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

  const backButtonStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
  };


  return (
    <div style={containerStyle}>
       {/* Back Button */}
       <button
        style={backButtonStyle}
        onClick={() => navigate("/home")}
      >
        Back
      </button>
      <div style={buttonContainerStyle}>
        {/* Show All Revenue Button */}
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          onClick={handleShowAllRevenueClick}
        >
          Show All Revenue
        </button>


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
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          onClick={handleFilterClick}
        >
          Filter
        </button>)}
      </div>

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
      

      {/* Show total revenue and individual revenues */}
      <div style={outputStyle}>
        {/* && userType !== 'advertiser' */}
      {userType !== 'seller' && (
         <p>Itinerary Total Revenue: ${it_totalRevenue.toFixed(2)}</p>
      )}

{userType !== 'seller'  && userType !== 'advertiser' && userType !== 'tourGuide' && (
          <p>Museum Total Revenue: ${museum_totalRevenue.toFixed(2)}</p>
      )}
       {/* && userType !== 'tourGuide' */}
       {userType !== 'seller'  &&  (
        <p>Activity Total Revenue: ${act_totalRevenue.toFixed(2)}</p>
      )}
        
       {userType !== 'advertiser'  && userType !== 'tourGuide' && (
          <p>Gift Item Total Revenue: ${gift_totalRevenue.toFixed(2)}</p>
      )}
  

     {userType === 'admin' && (
    <p>
      <strong>Total Revenue: ${totalRevenue.toFixed(2)}</strong>
    </p>
     )}
{(userType === 'admin' || userType === 'seller') && (
  <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    {/* Filter Selection */}
    <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Filter Products</h2>
    
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
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth1(e.target.value)}
          placeholder="Enter month"
          min="1"
          max="12"
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

    {/* Fetch Button */}
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <button
        onClick={fetchGiftItems}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#5e2f8a', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          fontSize: '16px', 
          cursor: 'pointer' 
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#5e2f8a')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'purple')}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Products'}
      </button>
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
  </div>
)}
    
      </div>
    </div>
  ) ;
}

export default Revenue;
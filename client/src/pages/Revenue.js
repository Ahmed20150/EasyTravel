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
       
       {userType === 'admin'&&  (
        <p><strong>Total Revenue: ${totalRevenue.toFixed(2)}</strong></p>
      )}
      </div>
    </div>
  );
}

export default Revenue;
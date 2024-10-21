import React, { useState } from 'react';
import axios from 'axios';
import './viewTables.css';  // Import the CSS file for custom styles

function ViewTables() {
  const [museumsData, setMuseumsData] = useState([]);             // State to store museums data
  const [itinerariesData, setItinerariesData] = useState([]);     // State to store itineraries data
  const [activitiesData, setActivitiesData] = useState([]);       // State to store activities data
  const [giftItemsData, setGiftItemsData] = useState([]);      // State to store gift item sales
  const [it_totalRevenue, setit_TotalRevenue] = useState(null);    // State to store itineraries total revenue
  const [museum_totalRevenue, setmuseum_TotalRevenue] = useState(null); // State to store museums total revenue

  // State to manage "No records" messages
  const [noMuseumsMessage, setNoMuseumsMessage] = useState('');
  const [noItinerariesMessage, setNoItinerariesMessage] = useState('');
  const [noActivitiesMessage, setNoActivitiesMessage] = useState('');

  // Function to reset all data and messages
  const resetData = () => {
    setMuseumsData([]);
    setItinerariesData([]);
    setActivitiesData([]);
    setit_TotalRevenue(null);
    setmuseum_TotalRevenue(null);
    setNoMuseumsMessage('');
    setNoItinerariesMessage('');
    setNoActivitiesMessage('');
  };

  // Function to fetch Museums data
  const handleMuseumsClick = async () => {
    resetData(); // Clear previous data and messages
    try {
      const response = await axios.get('http://localhost:3000/api/museums');
      setMuseumsData(response.data);
      setNoMuseumsMessage(response.data.length === 0 ? 'No museums and historical places records available.' : '');
    } catch (error) {
      console.error('Error fetching Museums data:', error);
      setNoMuseumsMessage('Error fetching Museums data.');
    }
  };

  // Function to fetch Itineraries data
  const handleItinerariesClick = async () => {
    resetData(); // Clear previous data and messages
    try {
      const response = await axios.get('http://localhost:3000/api/itineraries');
      setItinerariesData(response.data);
      setNoItinerariesMessage(response.data.length === 0 ? 'No itineraries records available.' : '');
    } catch (error) {
      console.error('Error fetching Itineraries data:', error);
      setNoItinerariesMessage('Error fetching Itineraries data.');
    }
  };

  // Function to fetch Gift Shop sales data
  const handleGiftItemsClick = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/giftitems');
      setGiftItemsData(response.data);
    } catch (error) {
      console.error('Error fetching Gift Items data:', error);
    }
  };

  // Function to fetch Activities data
  const handleActivitiesClick = async () => {
    resetData(); // Clear previous data and messages
    try {
      const response = await axios.get('http://localhost:3000/api/activities');
      
      console.log('Activities Data:', response.data);  // Log the data for debugging
      
      if (response.data && Array.isArray(response.data)) {
        setActivitiesData(response.data);
        setNoActivitiesMessage(response.data.length === 0 ? 'No activities records available.' : '');
      } else {
        setNoActivitiesMessage('Error: Invalid activities data format.');
      }
    } catch (error) {
      console.error('Error fetching Activities data:', error);
      setNoActivitiesMessage('Error fetching Activities data.');
    }
  };

  // Function to calculate total revenue
  const handleRevenueClick = async () => {
    resetData(); // Clear previous data and messages
    try {
      // Fetching itineraries data
      const itinerariesResponse = await axios.get('http://localhost:3000/api/itineraries');
      const itineraries = itinerariesResponse.data;

      // Fetching museums data
      const museumsResponse = await axios.get('http://localhost:3000/api/museums');
      const museums = museumsResponse.data;
  
      let it_totalRevenue = 0;
      let museums_totalRevenue = 0;

      // Calculate total itineraries revenue
      itineraries.forEach((itinerary) => {
        const priceOfTour = itinerary.priceOfTour || 0; // Default to 0 if undefined
        const numofpurchases = itinerary.numofpurchases || 1; // Default to 1 if undefined
        const subtotal = priceOfTour * numofpurchases;
        it_totalRevenue += subtotal;
      });

      // Calculate total museums revenue
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
        const numofpurchases = museum.numofpurchases || 1; // Default to 1 if undefined
        const subtotal2 = ticketPrice * numofpurchases;
        museums_totalRevenue += subtotal2;
      });
      
      setit_TotalRevenue(it_totalRevenue.toFixed(2));       // Store as a formatted string
      setmuseum_TotalRevenue(museums_totalRevenue.toFixed(2)); // Store as a formatted string
    } catch (error) {
      console.error('Error fetching Itineraries or Museums data:', error);
    }
  };

  // Function to redirect to a new page
  const redirectToPage = () => {
    window.location.href = 'http://localhost:3001/revenue'; // Replace with the actual URL
  };

  return (
    <div className="viewTables">
      <h1>What do you wish to view</h1>
      <div className="button-container">
        <button className="custom-button" onClick={handleMuseumsClick}>
          Museums and Historical Places
        </button>
        <button className="custom-button" onClick={handleItinerariesClick}>
          Itineraries
        </button>
        <button className="custom-button" onClick={handleActivitiesClick}>
          Activities
        </button>
        <button className="custom-button" onClick={handleGiftItemsClick}>
          Gift Shop Sales
        </button>
        <button className="custom-button" onClick={redirectToPage}>
          Show Revenue details
        </button>
      </div>

      {/* Display Total Itineraries Revenue */}
      {it_totalRevenue !== null && (
        <div className="revenue-display">
          <h3>Total Itineraries Revenue: ${it_totalRevenue}</h3>
        </div>
      )}

      {/* Display Total Museums Revenue */}
      {museum_totalRevenue !== null && (
        <div className="revenue-display">
          <h3>Total Museums Revenue: ${museum_totalRevenue}</h3>
        </div>
      )}

      {/* Display the fetched Museums data */}
      {museumsData.length > 0 && (
        <div className="museums-data">
          <h2>Museums Data:</h2>
          <ul>
            {museumsData.map((item) => (
              <li key={item._id}>
                <p>Name: {item.name}</p>
                <p>Description: {item.description}</p>
                <p>Location: {item.location.address || 'N/A'}</p>
                <p>
                  Prices: Foreigner: {item.ticketPrices.foreigner}, Native: {item.ticketPrices.native}, Student: {item.ticketPrices.student}
                </p>
                <p>Type: {item.type}</p>
                <p>Number of Purchases: {item.numofpurchases !== undefined ? item.numofpurchases : 'N/A'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Display No Museums Message */}
      {noMuseumsMessage && <p>{noMuseumsMessage}</p>}

      {/* Display the fetched Itineraries data */}
      {itinerariesData.length > 0 && (
        <div className="itineraries-data">
          <h2>Itineraries Data:</h2>
          <ul>
            {itinerariesData.map((item) => (
              <li key={item._id}>
                <p>Activities: {item.activities && Array.isArray(item.activities) ? item.activities.join(', ') : 'N/A'}</p>
                <p>Locations to Visit: {item.locationsToVisit && Array.isArray(item.locationsToVisit) && item.locationsToVisit.length > 0 ? item.locationsToVisit.join(', ') : 'N/A'}</p>
                <p>Timeline: {item.timeline ? new Date(item.timeline).toLocaleString() : 'N/A'}</p>
                <p>Duration: {item.duration > 0 ? item.duration : 'N/A'} hours</p>
                <p>Language of Tour: {item.languageOfTour || 'N/A'}</p>
                <p>Price of Tour: {item.priceOfTour >= 0 ? item.priceOfTour.toLocaleString() : 'N/A'}</p>
                <p>Available Dates: {item.availableDates && Array.isArray(item.availableDates) ? item.availableDates.map(date => new Date(date).toLocaleDateString()).join(', ') : 'N/A'}</p>
                <p>Available Times: {item.availableTimes && Array.isArray(item.availableTimes) && item.availableTimes.length > 0 ? item.availableTimes.join(', ') : 'N/A'}</p>
                <p>Accessibility: {item.accessibility || 'N/A'}</p>
                <p>Pickup Location: {item.pickupLocation || 'N/A'}</p>
                <p>Dropoff Location: {item.dropoffLocation || 'N/A'}</p>
                <p>Number of Purchases: {item.numofpurchases !== undefined ? item.numofpurchases : 'N/A'}</p>
                <p>status : {item.status || 'activated'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Display No Itineraries Message */}
      {noItinerariesMessage && <p>{noItinerariesMessage}</p>}

      {/* Display the fetched Activities data or a message if none */}
      {activitiesData.length > 0 ? (
        <div className="activities-data">
          <h2>Activities Data:</h2>
          <ul>
            {activitiesData.map((item) => (
              <li key={item._id}>
                <p>Date: {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</p>
                <p>Time: {item.time || "N/A"}</p>

                {/* Handle nested location object */}
                <p>Location: {item.location && item.location.address 
                  ? `${item.location.address} (Lat: ${item.location.coordinates?.lat || 'N/A'}, Lng: ${item.location.coordinates?.lng || 'N/A'})` 
                  : "N/A"}
                </p>

                {/* Handle nested price object */}
                <p>Price Range: ${item.price?.min || 'N/A'} - ${item.price?.max || 'N/A'}</p>

                <p>Category: {item.category || "N/A"}</p>
                <p>Tags: {item.tags && Array.isArray(item.tags) ? item.tags.join(', ') : "N/A"}</p>
                <p>Special Discounts: {item.specialDiscounts || 0}</p>
                <p>Is Booking Open: {item.isBookingOpen ? "Yes" : "No"}</p>
                <p>Number of Purchases: {item.numofpurchases !== undefined ? item.numofpurchases : 'N/A'}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : noActivitiesMessage ? (
        <p>{noActivitiesMessage}</p>
      ) : null}




    {giftItemsData.length > 0 && (
            <div className="giftitems-data">
              <h2>Gift Shop Sales:</h2>
              <ul>
                {giftItemsData.map((item) => (
                  <li key={item._id}>
                    <p>Name: {item.name}</p>
                    <p>Description: {item.description}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <p>Purchases: {item.purchases}</p>
                    {/* Calculate and display revenue */}
                    <p>Revenue: ${(item.price * item.purchases).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
    </div>
  );
}

export default ViewTables;

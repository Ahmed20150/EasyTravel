import React, { useState } from 'react';
import axios from 'axios';

function Revenue() {
  // State to store itineraries, museums, activities total revenue
  const [it_totalRevenue, setit_TotalRevenue] = useState(null);
  const [museum_totalRevenue, setmuseum_TotalRevenue] = useState(null);
  const [act_totalRevenue, setact_TotalRevenue] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null); // Declare totalRevenue as state

  // Function to calculate total revenue
  const handleRevenueClick = async () => {
    try {
      // Fetching itineraries data
      const itinerariesResponse = await axios.get('http://localhost:3000/api/itineraries');
      const itineraries = itinerariesResponse.data;

      // Fetching museums data
      const museumsResponse = await axios.get('http://localhost:3000/api/museums');
      const museums = museumsResponse.data;

      // Fetching activities data
      const actResponse = await axios.get('http://localhost:3000/api/activities');
      const acts = actResponse.data;

      let it_totalRevenue = 0;
      let museums_totalRevenue = 0;
      let act_totalRevenue = 0;

      // Calculate total itineraries revenue
      itineraries.forEach((itinerary) => {
        const priceOfTour = itinerary.priceOfTour || 0;
        const numofpurchases = itinerary.numofpurchases || 1;
        const subtotal = priceOfTour * numofpurchases;
        it_totalRevenue += subtotal;
      });

      museums.forEach((museum) => {
        let ticketPrice = 0;
      
        // Check the type and assign the correct ticket price
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
            ticketPrice = 0; // If type is not one of the expected values, default to 0
        }
      
        const numofpurchases = museum.numofpurchases || 1; // Default to 0 if undefined
        const subtotal2 = ticketPrice * numofpurchases; // Calculate subtotal for this museum
        museums_totalRevenue += subtotal2; // Add subtotal to total revenue
      });
      // Calculate total activities revenue
      acts.forEach((act) => {

        const discount = (act.specialDiscounts || 0) / 100;
        const Price = act.price.min ? act.price.min * (1 - discount) : 0;
        const numofpurchases = act.numofpurchases || 1;
        const subtotal2 = Price * numofpurchases;
        act_totalRevenue += subtotal2;
      });

      // Update state with the calculated total revenue
      setit_TotalRevenue(it_totalRevenue.toFixed(2));
      setmuseum_TotalRevenue(museums_totalRevenue.toFixed(2));
      setact_TotalRevenue(act_totalRevenue.toFixed(2));
      setTotalRevenue((museums_totalRevenue + act_totalRevenue + it_totalRevenue).toFixed(2)); // Update totalRevenue state
    } catch (error) {
      console.error('Error fetching Itineraries or Museums data:', error);
    }
  };

  // Inline styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column', // Column layout
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center', // Center horizontally
    height: '100vh', // Full viewport height
    padding: '20px 0', // Some padding at the top
    boxSizing: 'border-box', // Ensure padding doesn’t affect dimensions
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
    marginTop: '40px', // Space between button and output
    textAlign: 'center', // Center the text
    fontSize: '18px', // Adjust font size if needed
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        onClick={handleRevenueClick}
      >
        Show all revenue
      </button>

      {/* Display the total revenue */}
      {(it_totalRevenue || museum_totalRevenue || act_totalRevenue) && (
        <div style={outputStyle}>
          <h3>Total Itineraries Revenue: ${it_totalRevenue}</h3>
          <h3>Total Museums Revenue: ${museum_totalRevenue}</h3>
          <h3>Total Activities Revenue: ${act_totalRevenue}</h3>
          <br />
          <h1>Total Revenue: ${totalRevenue}</h1>
        </div>
      )}
    </div>
  );
}

export default Revenue;

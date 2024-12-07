import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



const PaymentCancel = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const itemType = params.get('itemType');
  return (
    <div style={{display:"flex", flexDirection: "column"}}>
      <h1>Payment Cancelled</h1>
      <p>Your payment was not completed.</p>

      {itemType === "itinerary" ? (
        <Link to="/ViewAllItinerary"><button>Continue</button></Link>
      ) : (
        <Link to="/productList"><button>Continue</button></Link>
      )}    
    </div>
  );
};

export default PaymentCancel;
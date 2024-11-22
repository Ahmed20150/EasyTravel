import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div style={{display:"flex", flexDirection: "column"}}>
      <h1>Payment Cancelled</h1>
      <p>Your payment was not completed.</p>

      <Link to="/ViewAllItinerary"><button>Continue</button></Link>
    </div>
  );
};

export default PaymentCancel;
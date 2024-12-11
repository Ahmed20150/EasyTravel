import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { toast , ToastContainer} from 'react-toastify';
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle , centerContent} from "../styles/gasserStyles"; 
import { Card , Button, Modal} from "flowbite-react";
import { useNavigate } from 'react-router-dom';



const PaymentCancel = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const itemType = params.get('itemType');
  const navigate = useNavigate();
  return (
    <div style={{display:"flex", flexDirection: "column"}}>
      <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">Payment Cancelled!</h1>
      <p>Your payment was not completed.</p>
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => navigate("/home")}
          className={buttonStyle}
        >
          Back
        </Button>
        </div>
      </div>

      <ToastContainer/>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
  {itemType === "itinerary" ? (
    <Link to="/ViewAllItinerary">
      <Button className={buttonStyle}>Continue</Button>
    </Link>
  ) : (
    <Link to="/productList">
      <Button className={buttonStyle}>Continue</Button>
    </Link>
  )}
</div>
    </div>
    // <div style={{display:"flex", flexDirection: "column"}}>
    //   <h1>Payment Cancelled</h1>
    //   <p>Your payment was not completed.</p>

    //   {itemType === "itinerary" ? (
    //     <Link to="/ViewAllItinerary"><button>Continue</button></Link>
    //   ) : (
    //     <Link to="/productList"><button>Continue</button></Link>
    //   )} 


    // </div>
  );
};

export default PaymentCancel;
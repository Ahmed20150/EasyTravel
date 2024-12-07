// TempLandingPage.js
import React from "react";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { MapPin, Sun, ShoppingCart } from "lucide-react";
import { buttonStyle, linkStyle } from "../styles/gasserStyles";
import EasyTravelSmallLogo from "../images/EasyTravel Mini Logo Transparent.png";
import EasyTravelLogo from "../images/EasyTravel Transparent logo.png";

const HomeBanner = () => {
    return (  
        <div >
        <Navbar fluid rounded className="h-24 flex items-center">

        <div className=" space-x-4 ml-auto">
        <img
          src={EasyTravelLogo}
          alt="logo"
          className="h-40 w-40"
        />
          </div>
    

        {/* <Navbar.Collapse className="mr-8">
          <Navbar.Link href="/" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="/destinations">
            Destinations
          </Navbar.Link>
          <Navbar.Link href="/about">
            About
          </Navbar.Link>
          <Navbar.Link href="/contact">
            Contact
          </Navbar.Link>
        </Navbar.Collapse> */}
      </Navbar>



        </div>    
    );
}
 
export default HomeBanner;
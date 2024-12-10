// TempLandingPage.js
import React from "react";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { MapPin, Sun, ShoppingCart } from "lucide-react";
import HomeBanner from "../components/HomeBanner";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle, centerContent } from "../styles/gasserStyles"; 
import beachImage from 'client\\src\\images\\Beach.jpeg';
import BudgetFriendlyImage from 'client\\src\\images\\BudgetFriendly.jpeg';
import FamilyFriendlyImage from 'client\\src\\images\\FamilyFriendly.png';
import HistoricAreasImage from 'client\\src\\images\\HistoricAreas.jpeg';
import ShoppingImage from 'client\\src\\images\\Shopping.jpeg';
import CommunityImage from 'client\\src\\images\\community.jpg';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EasyTravelLogo from 'client\\src\\images\\EasyTravel Transparent logo.png';
import MiniEasyTravelLogo from 'client\\src\\images\\EasyTravel Mini Logo Transparent.png';



//Animation Styles
const fadeInDelays = ["delay-100", "delay-200", "delay-300", "delay-400", "delay-500"];


const TempLandingPage = () => {
  return (
    <div>
      {/* Navbar */}
     <HomeBanner/>
      {/* Hero Section */}
      <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${beachImage})` }}>
        <div className="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
          <div className="text-center text-white px-4">
            <h1 className={`text-5xl font-bold mb-4 ${fadeIn}`}>Discover Your Next Adventure</h1>
            <p className="text-xl mb-6">Explore the world's most beautiful destinations with ease.</p>
            <div className="flex justify-center">
              <Link to="/login"  className={linkStyle}>
                <Button className={buttonStyle}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose EasyTravel?</h2>
          <div className="flex justify-center gap-8">
            <Card className={cardStyle}
              imgAlt="Historic Areas"
              imgSrc={HistoricAreasImage}
            >
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Historic Areas
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Explore ancient cities and iconic landmarks that tell the story of our past.
              </p>
            </Card>
            <Card className={cardStyle}
              imgAlt="Beaches"
              imgSrc={beachImage}
            >
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Beaches
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Relax on pristine beaches with crystal-clear waters and golden sands.
              </p>
            </Card>
            <Card className={cardStyle}
              imgAlt="Family-friendly"
              imgSrc={FamilyFriendlyImage}
            >
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Family-friendly
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Enjoy activities and destinations perfect for travelers of all ages.
              </p>
            </Card>
            </div>
            <div className="flex justify-center gap-8 mt-6">
            <Card className={cardStyle}
              imgAlt="Shopping"
              imgSrc={ShoppingImage}
            >
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Shopping
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Discover vibrant markets and upscale shopping districts around the globe.
              </p>
            </Card>
            <Card className={cardStyle}
              imgAlt="Budget-friendly"
              imgSrc={BudgetFriendlyImage}
            >
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Budget-friendly
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Travel without breaking the bank with our affordable packages and deals.
              </p>
            </Card>
            </div>

        </div>
      </section>
      

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How to Start</h2>
          <div className="flex justify-center gap-8">
               {/* Step 1 */}
               <div className={stepStyle}>
              <PeopleIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>1. Join our Community</h3>
              <p className={stepDescriptionStyle}>
              <p><a href="/signUp">Sign up</a> to become a part of our traveler community.</p>

              </p>
            </div>
                    {/* Step 2 */}
                    <div className={stepStyle}>
              <LoginIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>2. Log In and Browse</h3>
              <p className={stepDescriptionStyle}>
                After creating your account, <Link to="/login" className="text-blue-500 underline">Log in</Link> and start browsing our destinations.
              </p>
            </div>

            {/* Step 3 */}
            <div className={stepStyle}>
              <FlightTakeoffIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>3. Select Your Trip</h3>
              <p className={stepDescriptionStyle}>
                Choose the trip or flight that suits your needs.
              </p>
            </div>

            {/* Step 4 */}
            <div className={stepStyle}>
              <AirplanemodeActiveIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>4. Book Now</h3>
              <p className={stepDescriptionStyle}>
                Click on the "Book Now" button to proceed.
              </p>
            </div>

            {/* Step 5 */}
            <div className={stepStyle}>
              <EditNoteIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>5. Enter Details</h3>
              <p className={stepDescriptionStyle}>
                Fill in your personal and payment information.
              </p>
            </div>

            {/* Step 6 */}
            <div className={stepStyle}>
              <DoneAllIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>6. Confirmation</h3>
              <p className={stepDescriptionStyle}>
                Confirm your booking and receive a confirmation email.
              </p>
            </div>
            </div>
        </div>
      </section>

      <Footer container>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="/"
              src={MiniEasyTravelLogo}
              alt="EasyTravel Logo"
              name="EasyTravel"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">EasyTravel</Footer.Link>
                <Footer.Link href="#">Our Story</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="EasyTravel" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
 
          </div>
        </div>
      </div>
    </Footer>
    </div>
  );
};

export default TempLandingPage;
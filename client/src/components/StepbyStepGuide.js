// TempLandingPage.js
import React from "react";
import { Navbar, Button, Card, Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { MapPin, Sun, ShoppingCart } from "lucide-react";
import HomeBanner from "../components/HomeBanner";
import beachImage from 'client//src//images//Beach.jpeg';
import BudgetFriendlyImage from 'client//src//images//BudgetFriendly.jpeg';
import FamilyFriendlyImage from 'client//src//images//FamilyFriendly.png';
import HistoricAreasImage from 'client//src//images//HistoricAreas.jpeg';
import ShoppingImage from 'client//src//images//Shopping.jpeg';
import CommunityImage from 'client//src//images//community.jpg';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EasyTravelLogo from 'client//src//images//EasyTravel Transparent logo.png';
import MiniEasyTravelLogo from 'client//src//images//EasyTravel Mini Logo Transparent.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FlightClassIcon from '@mui/icons-material/FlightClass';
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle, homeCardContainer, flexRowContainer, flexRowItem } from "../styles/gasserStyles"; 
import { Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 




import { Avatar, Blockquote } from "flowbite-react";

const StepbyStepGuide = () => {

    const [openModal, setOpenModal] = useState(false);

    function onCloseModal() {
        setOpenModal(false);
      }

      function handleButtonClick(){
        toast.success("Message Sent!");
        onCloseModal();
      }


      const bigTextInput = "w-full h-16 text-lg p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

    const centerContent = "flex justify-center items-center my-8";
    
    return (  
 <div>
  <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How to Book Trips and Flights as a Tourist</h2>

          <figure className="mx-auto max-w-screen-md text-center mb-5">
      <svg
        className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 14"
      >
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
      </svg>
      <Blockquote>
        <p className="text-2xl font-medium italic text-gray-900 dark:text-white">
          "Software is a great combination between artistry and engineering. We at EasyTravel focus on customer satisfaction and ease of use."
        </p>
      </Blockquote>
      <figcaption className="mt-6 flex items-center justify-center space-x-3">
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <cite className="pr-3 font-medium text-gray-900 dark:text-white">Ahmed Gasser</cite>
          <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">CEO of EasyTravel</cite>
        </div>
      </figcaption>
    </figure>


          <div className="flex justify-center gap-8">
               {/* Step 1 */}
               <div className={stepStyle}>
              <LocationOnIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>1. Browse</h3>
              <p className={stepDescriptionStyle}>
              <p>Start browsing our diverse selection of destinations, Activities, Trips and more!</p>

              </p>
            </div>
                    {/* Step 2 */}
                    <div className={stepStyle}>
              <MenuBookIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>2. Create your Ideal Trip!</h3>
              <p className={stepDescriptionStyle}>
              Browse our vast collection of Itineraries & activities to create your perfect getaway!
              </p>
            </div>

            {/* Step 3 */}
            <div className={stepStyle}>
              <FlightClassIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>3. Book Now!</h3>
              <p className={stepDescriptionStyle}>
                Book your Trip, and get ready for the adventure of a lifetime!
              </p>
            </div>

            {/* Step 4 */}
            <div className={stepStyle}>
              <LibraryBooksIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>4. Input Required Details</h3>
              <p className={stepDescriptionStyle}>
                Fill in your personal and payment information
              </p>
            </div>

            {/* Step 5 */}
            <div className={stepStyle}>
              <CheckCircleIcon className={stepIconStyle} size={48} />
              <h3 className={stepTitleStyle}>5. Confirmation</h3>
              <p className={stepDescriptionStyle}>
              Confirm your booking and receive a confirmation email
              </p>
            </div>

            </div>
            <div className="flex flex-col justify-center items-center mt-10">
                <p className="text-center">Still not satisfied?, Send us a message and we will get back to you as soon as possible!</p>
                <Button className={buttonStyle} onClick={() => setOpenModal(true)}>Send Message</Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Send us a Message!</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your Message" />
              </div>
              <TextInput
            id="large-text-input"
            type="text"
            placeholder="Enter your message here..."
            className={bigTextInput}
          />
            </div>
            

            <div className="w-full">
              <Button onClick={handleButtonClick}> Send Message </Button>
            </div>

          </div>
        </Modal.Body>
      </Modal>
            </div>

        </div>
      </section>


            <Link to="/home"><Button className={`${buttonStyle} fixed top-4 left-4 z-50`}>back</Button></Link>

<ToastContainer/>
        </div>

    );
}
 
export default StepbyStepGuide;
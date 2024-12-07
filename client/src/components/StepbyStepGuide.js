// import "../css/LandingPage.css";
import { Link } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FlightClassIcon from '@mui/icons-material/FlightClass';

const StepbyStepGuide = () => {
    return (  
        <div>

<section className="how-to">
                <div className=" landingContainer">
                    <h2>How to Book Trips and Flights as a Tourist</h2>
                    <div className="steps-row">
                        <div className="step">
                            <h3>1.Browse <LocationOnIcon/></h3>
                            <p>Start browsing our diverse selection of destinations, Activities, Trips and more!</p>
                        </div>
                        <div className="step">
                            <h3>2. Select Your Trip <MenuBookIcon/></h3>
                            <p>Choose the trip or flight that suits your needs.</p>
                        </div>
                        <div className="step">
                            <h3>3. Book Now <FlightClassIcon/></h3>
                            <p>Click on the "Book Now" button to proceed.</p>
                        </div>
                        <div className="step">
                            <h3>4. Enter Details <LibraryBooksIcon/></h3>
                            <p>Fill in your personal and payment information.</p>
                        </div>
                        <div className="step">
                            <h3>5. Confirmation <CheckCircleIcon/></h3>
                            <p>Confirm your booking and receive a confirmation email.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Link to="/home"><button>back</button></Link>


        </div>

    );
}
 
export default StepbyStepGuide;
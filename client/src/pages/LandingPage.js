import { Link } from "react-router-dom";
import "../css/LandingPage.css";

const landingPage = () => {

    
    return (  
        <div className="landing-body">
            <div className=" landingContainer">
            <h1 style={{fontSize:"50px"}}>Welcome to EasyTravel!</h1>
            <h2 style={{fontSize:"34px"}}>Your one stop shop for all things Travel, Tourism & Adventure!</h2>
            <div style={{display:"flex"}}>
            <Link to="/signUp"><button >Sign up</button> </Link>
            <Link to="/login"><button >Log in</button> </Link>
            </div>
            </div>


            <section className="how-to">
                <div className=" landingContainer">
                    <h2>How to Book Trips and Flights as a Guest</h2>
                    <div className="steps-row">
                        <div className="step">
                            <h3>1. Join Our Community</h3>
                            <p>Sign up to become a part of our traveler community.</p>
                        </div>
                        <div className="step">
                            <h3>2. Log In and Browse</h3>
                            <p>After creating your account, log in and start browsing our destinations.</p>
                        </div>
                        <div className="step">
                            <h3>3. Select Your Trip</h3>
                            <p>Choose the trip or flight that suits your needs.</p>
                        </div>
                        <div className="step">
                            <h3>4. Book Now</h3>
                            <p>Click on the "Book Now" button to proceed.</p>
                        </div>
                        <div className="step">
                            <h3>5. Enter Details</h3>
                            <p>Fill in your personal and payment information.</p>
                        </div>
                        <div className="step">
                            <h3>6. Confirmation</h3>
                            <p>Confirm your booking and receive a confirmation email.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className=" landingContainer">
                    <p>&copy; 2023 EasyTravel. All rights reserved.</p>
                </div>
            </footer>
   
    </div>
    );
}
 
export default landingPage;
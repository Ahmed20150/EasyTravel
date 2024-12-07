// GeneralNavbar.js
import { Button, Navbar } from "flowbite-react";
import MiniEasyTravelLogo from "../images/EasyTravel Mini Logo Transparent.png";
import { buttonStyle, linkStyle } from "../styles/gasserStyles"; // Ensure these styles are defined
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const GeneralNavbar = () => {

const navigate = useNavigate();


    function handleLogout() {
        Object.keys(Cookies.get()).forEach((cookieName) =>
          Cookies.remove(cookieName)
        );
        navigate("/login");
      }
    return (
        <Navbar fluid rounded className="w-full bg-white/70 backdrop-blur-lg shadow-md">
            {/* Navbar Brand */}
            <Navbar.Brand href="/home" className={linkStyle}>
                <img
                    src={MiniEasyTravelLogo}
                    className="mr-3 h-6 sm:h-9"
                    alt="EasyTravel Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    EasyTravel
                </span>
            </Navbar.Brand>

            {/* Right Side - Buttons and Toggle */}
            <div className="flex md:order-2">
                <Button className={`ml-4 ${buttonStyle} hover:bg-red-700`} onClick={handleLogout}>
                    Log out
                </Button>
                <Navbar.Toggle />
            </div>

            {/* Navbar Links */}
            <Navbar.Collapse>
                <Navbar.Link href="home" active className={linkStyle}>
                    Home
                </Navbar.Link>
                <Navbar.Link href="#" className={linkStyle}>
                    About
                </Navbar.Link>
                <Navbar.Link href="#" className={linkStyle}>
                    Services
                </Navbar.Link>
                <Navbar.Link href="#" className={linkStyle}>
                    Pricing
                </Navbar.Link>
                {/* Add more links as needed */}
            </Navbar.Collapse>
        </Navbar>
    );
}

export default GeneralNavbar;
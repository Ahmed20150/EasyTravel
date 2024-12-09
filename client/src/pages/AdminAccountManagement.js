import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate, Link } from "react-router-dom";
import UserStatistics from '../components/UserStatistics';
import { Card, Navbar, Footer, Breadcrumb } from "flowbite-react";
import { dynamicButtonStyle } from "../styles/AshrafStyles";
import EasyTravelSmallLogo from "../images/EasyTravel Mini Logo Transparent.png"; // Import the new logo

const AdminAccountManagement = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const accessToken = Cookies.get('token');
        const acceptedTerms = Cookies.get('acceptedTerms');
        if (!accessToken || acceptedTerms === "false") {
            console.log('Should not have access to home!');
            navigate("/"); // Redirect to home if not authorized
            return;
        } else {
            console.log("COOKIES FOUND", accessToken);
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Navbar */}
            <Navbar fluid rounded>
                <Navbar.Brand>
                    <img
                        src={EasyTravelSmallLogo} // Use the new logo
                        className="mr-3 h-6 sm:h-9"
                        alt="EasyTravel Logo"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        EasyTravel
                    </span>
                </Navbar.Brand>
            </Navbar>

            <div className="container mx-auto p-6 flex-grow">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <Breadcrumb.Item href="/home">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Account Management
                    </Breadcrumb.Item>
                </Breadcrumb>

                {/* Page Title */}
                <Card>
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Account Management
                    </h1>
                    <p className="text-center text-gray-600">
                        Manage user accounts, admin roles, and promotional settings from here.
                    </p>
                </Card>

                {/* Buttons Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <Link to="/view-requests">
                        <button className={`${dynamicButtonStyle} w-full`}>
                            Account Deletion Requests
                        </button>
                    </Link>
                    <Link to="/view-users">
                        <button className={`${dynamicButtonStyle} w-full`}>
                            All Users
                        </button>
                    </Link>
                    <Link to="/add-admin">
                        <button className={`${dynamicButtonStyle} w-full`}>
                            Create New Admin
                        </button>
                    </Link>
                    <Link to="/add-tourismGoverner">
                        <button className={`${dynamicButtonStyle} w-full`}>
                            Create New Tourism Governor
                        </button>
                    </Link>
                    <Link to="/create-promo-code">
                        <button className={`${dynamicButtonStyle} w-full`}>
                            Create Promo Code
                        </button>
                    </Link>
                </div>

                {/* User Statistics Section */}
                <div className="flex justify-center mt-8">
                    <UserStatistics />
                </div>
            </div>

            {/* Back Button in Footer */}
            <div className="p-4 mt-auto flex justify-center">
                <Link to="/home">
                    <button className={`${dynamicButtonStyle} w-auto px-4 py-2`}>
                        Back
                    </button>
                </Link>
            </div>

            {/* Footer */}
            <Footer container className="mt-auto">
                <div className="w-full text-center">
                    <Footer.Copyright
                        href="#"
                        by="Admin Dashboard"
                        year={new Date().getFullYear()}
                    />
                </div>
            </Footer>
        </div>
    );
};

export default AdminAccountManagement;

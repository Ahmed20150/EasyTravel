import { useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate, Link } from "react-router-dom";
import UserStatistics from '../components/UserStatistics'; // Import the new component

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
            navigate("/");
            return;
        } else {
            console.log("COOKIES FOUND", accessToken);
        }
    }

    return (
        <div className="container">
            <h1>Account Management</h1>
            <Link to="/home"><button>Back</button></Link>
            <Link to="/view-requests"><button>Account Deletion Requests</button></Link>
            <Link to="/view-users"><button>All Users</button></Link>
            <Link to="/add-admin"><button>Create New Admin</button></Link>
            <Link to="/add-tourismGoverner"><button>Create New Tourism Governor</button></Link>

            {/* User Statistics Section */}
            <UserStatistics />

            {/* Navigation to Promo Code Page */}
            <Link to="/create-promo-code"><button>Create Promo Code</button></Link>
        </div>
    );
}

export default AdminAccountManagement;
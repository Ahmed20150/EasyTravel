import { Link } from "react-router-dom";

const landingPage = () => {

    
    return (  
        <div className="container">
            <h1>Welcome!</h1>
            <Link to="/signUp"><button >Sign up</button> </Link>
            <Link to="/login"><button >Log in</button> </Link>
        </div>
    );
}
 
export default landingPage;
// import logo from './logo.svg';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ChangePassword from "./components/changePassword";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import GeneralSignUpForm from "./components/GeneralSignUpForm";
import LoginForm from "./components/LoginForm";
import {
  default as CreateProfilePage,
  default as EditProfilePage,
} from "./pages/CreateProfilePage";
import {
  default as CreateProfilePageAdv,
  default as EditProfilePageAdv,
} from "./pages/CreateProfilePageAdvertiser";
import {
  default as CreateProfilePageSeller,
  default as EditProfilePageSeller,
} from "./pages/CreateProfilePageSeller";
import LandingPage from "./pages/LandingPage";
import TempHomePage from "./pages/tempHomePage";
import ViewProfilePage from "./pages/ViewProfilePage";
import ViewProfilePageAdv from "./pages/ViewProfilePageAdv";
import ViewTables from "./pages/viewTables";
import ViewProfilePageSeller from "./pages/ViewProfilePageSeller";
import FileUpload from "./components/fileUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewAdmin from "./components/AddNewAdmins";
import AddNewTourismGoverner from "./components/AddNewTourismGoverner";
import ViewRequest from "./components/ViewRequests";
import ViewUsers from "./components/ViewUsersAndDelete";
import AdminAccountManagement from "./pages/AdminAccountManagement";
import ActivityList from "./pages/ActivityList";
import GiftList from "./pages/GiftList";
import ItineraryEdit from "./pages/ItineraryEdit";
import ItineraryForm from "./pages/ItineraryForm";
import ItineraryList from "./pages/ItineraryList";
import MuseumsList from "./pages/museumsList";
import SelectActivity from "./pages/SelectActivity";
import BookFLight from "./pages/BookFlight";
import BookHotel from "./pages/BookHotel";
import ViewPastEvents from "./pages/ViewPastEvents";
import ViewUpcomingEvents from "./pages/ViewUpcomingEvents";
import BookTransportation from "./components/BookTransportation";
import ExplorePage from "./pages/ExplorePage";
import ProductList from "./pages/ProductList";
import CreateGift from "./pages/CreateGift";

import EditGift from './pages/EditGift'; // Import the EditGift page


import ViewGiftItemCard from "./components/ViewGiftItemCard";
import GiftItemDetail from "./pages/GiftItemDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Help from "./pages/Help";
import ActivityForm from "./pages/ActivityForm";
import ActivityEdit from "./pages/ActivityEdit";
import ViewItinerary from "./pages/ViewItinerary";
import TouristProfile from "./pages/TouristProfile";
import TermsAndConditions from "./pages/TermsAndConditions";
import PendingRequestsPage from "./pages/PendingRequestsPage";
import ViewComplaints from "./pages/ViewAllComplaints";
import ReplyComplaints from "./pages/ReplyComplaint";

import TouristReport from "./pages/TouristReport";
import TotalTourists from "./pages/TotalActivityTourist";
import GiftItemsFilter from "./pages/GiftItemsFilter";
import Categories from "./pages/Categories";
import PreferencePage from "./pages/PreferencePage";
import Revenue from "./pages/Revenue";
import GiftItemForm from "./pages/GiftItemPage";
import ProductOrders from "./pages/ProductOrders";
import { CurrencyProvider } from "./components/CurrencyContext"; // Added CurrencyProvider
import ItineraryDetailsPage from "./pages/ItineraryDetailsPage"; // Added import for ItineraryDetailsPage
import ActivityDetails from "./pages/ActivityDetails";
import MuseumDetails from "./pages/MuseumDetails";
import CreateComplaint from "./pages/CreateComplaint";
import MyComplaints from "./pages/MyComplaints";
import CreatePromoCode from "./pages/CreatePromoCodePage";


import bootstrap from "bootstrap";
import ViewAllGifts from "./pages/ViewAllGifts";

import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";

import TouristAddress from "./pages/TouristAddress";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AddMuseumPage from './pages/AddMuseumPage';

import MuseumsPage from "./pages/MuseumsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import FeaturedItinerariesPage from "./pages/FeaturedItinerariesPage";

import ComplaintManagement from "./pages/ComplaintManagement";
import GeneralNavbar from "./components/GeneralNavbar";
import Cookies from "js-cookie";
import GuestItineraryPage from "./pages/GuestItineraryPage";
import GuestActivityPage from "./pages/GuestActivityPage";

function App() {
  const handleUnauthorizedAccess = () => {
    // Clear cookies
    const allCookies = Cookies.get();
    for (let cookie in allCookies) {
        Cookies.remove(cookie);
    }
    
    // Clear session storage
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/') {
        handleUnauthorizedAccess();
    }
  }, []);

  const shouldShowNavbar = () => {
    const username = Cookies.get('username');
    const userType = Cookies.get('userType');
    const token = Cookies.get('token');  // Also check for auth token
    const noNavbarRoutes = ['/', '/login', '/signUp', '/forgotPassword'];
    
    // Don't show navbar if:
    // 1. No username cookie exists OR
    // 2. No userType cookie exists OR
    // 3. No token exists OR
    // 4. Current route is in noNavbarRoutes
    return username && userType && token && !noNavbarRoutes.includes(window.location.pathname);
  };

  return (
    <div className="App">
      <ToastContainer />
      <CurrencyProvider>
        <BrowserRouter>
          {shouldShowNavbar() && <GeneralNavbar />}
          
          <div className={shouldShowNavbar() ? 'pt-16' : ''}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/add-museum" element={<AddMuseumPage />} />
              <Route path="/tourismGoverner/museums" element={<MuseumsList />} />

              <Route path="/fileUpload" element={<FileUpload />} />
              <Route path="/signUp" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/home" element={<TempHomePage />} />
              <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
              <Route path="/create-profile" element={<CreateProfilePage />} />
              <Route path="/view-profile" element={<ViewProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route
                path="/create-profileAdv"
                element={<CreateProfilePageAdv />}
              />
              <Route path="/view-profileAdv" element={<ViewProfilePageAdv />} />
              <Route path="/edit-profileAdv" element={<EditProfilePageAdv />} />
              <Route path="/itinerary/:id" element={<ItineraryDetailsPage />} />
              <Route path="/activity/:id" element={<ActivityDetails />} />
              <Route path="/museum/:id" element={<MuseumDetails />} />
              <Route path="/complaint/create" element={<CreateComplaint />} />
              <Route path="/complaint/view" element={<ViewComplaints />} />
              <Route
                path="/complaint/reply/:complaintId"
                element={<ReplyComplaints />}
              />
              <Route path="/complaint/myList" element={<MyComplaints />} />
              <Route path="/all-gifts" element={<ViewAllGifts />} />

              <Route path="/admin-account-management" element={<AdminAccountManagement />} />
              <Route path="/create-promo-code" element={<CreatePromoCode />} />

              <Route
                path="/create-profileSeller"
                element={<CreateProfilePageSeller />}
              />
              <Route
                path="/view-profileSeller"
                element={<ViewProfilePageSeller />}
              />
              <Route
                path="/edit-profileSeller"
                element={<EditProfilePageSeller />}
              />
              <Route
                path="/adminAccountManagement"
                element={<AdminAccountManagement />}
              />
              <Route
                path="/pendingRequestsPage"
                element={<PendingRequestsPage />}
              />
              <Route path="/TouristProfile" element={<TouristProfile />} />
              <Route
                path="/termsAndConditions"
                element={<TermsAndConditions />}
              />
              <Route path="/view-users" element={<ViewUsers />} />
              <Route path="/view-requests" element={<ViewRequest />} />
              <Route
                path="/add-tourismGoverner"
                element={<AddNewTourismGoverner />}
              />
              <Route path="/add-admin" element={<AddNewAdmin />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activities/create" element={<ActivityForm />} />
              <Route path="/activities/edit/:id" element={<ActivityEdit />} />
              <Route path="/ViewAllItinerary" element={<ViewItinerary />} />
              <Route path="/viewPastEvents" element={<ViewPastEvents />} />
              <Route
                path="/viewUpcomingEvents"
                element={<ViewUpcomingEvents />}
              />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/Help" element={<Help />} />
              <Route path="/itinerary" element={<ItineraryList />} />
              <Route path="/itinerary/create" element={<ItineraryForm />} />
              <Route
                path="/itinerary/create/selectActivity"
                element={<SelectActivity />}
              />
              <Route path="/itinerary/edit/:id" element={<ItineraryEdit />} />
              <Route path="/tourist/museums" element={<MuseumsPage />} />
              <Route path="/Categorycontrol" element={<Categories />} />
              <Route path="/preferences" element={<PreferencePage />} />
              <Route path="/giftlist" element={<GiftList />} />
              <Route path="/view" element={<ViewTables />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/giftitem" element={<GiftItemForm />} />
              <Route path="/BookFlight" element={<BookFLight />} />
              <Route path="/BookHotel" element={<BookHotel />} />
              <Route path="/bookTransport" element={<BookTransportation />} />
              <Route path="/ExplorePage" element={<ExplorePage />} />
              <Route path="/productList" element={<ProductList />} />
              <Route
                path="/productList/gift-item/:id"
                element={<GiftItemDetail />}
              />
              <Route path="/tourist-report" element={<TouristReport />} />
              <Route path="/totaltouristactivity" element={<TotalTourists />} />
              <Route path="/giftfilter" element={<GiftItemsFilter />} />

              <Route path="/address" element={<TouristAddress />} />
              <Route path="/Wishlist" element={<Wishlist />} /> 
              <Route path="/cart" element={<Cart />} />
              <Route path="/productOrders" element={<ProductOrders/>} />
              <Route path="/activities-featured" element={<ActivitiesPage />} />
              <Route path="/featured-itineraries" element={<FeaturedItinerariesPage />} />
              <Route path="/guest-itinerary" element={<GuestItineraryPage />} />

              <Route path="/create-gift" element={<CreateGift />} />

              <Route path="/edit-gift/:id" element={<EditGift />} /> New route for editing gift


              <Route path="/complaintManagement" element={<ComplaintManagement />} />

              <Route path="/guest-activities" element={<GuestActivityPage />} />

            
            </Routes>
          </div>
        </BrowserRouter>
      </CurrencyProvider>
    </div>
  );
}

export default App;

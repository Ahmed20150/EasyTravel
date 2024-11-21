// import logo from './logo.svg';
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
import ViewTables from "./pages/viewTables";
import ViewProfilePageSeller from "./pages/ViewProfilePageSeller";
// import EditProfilePage from './pages/';
import FileUpload from "./components/fileUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingRequestsPage from "./pages/PendingRequestsPage";
import TouristProfile from "./pages/TouristProfile";
import TermsAndConditions from "./pages/TermsAndConditions";
import AddNewAdmin from "./components/AddNewAdmins";
import AddNewTourismGoverner from "./components/AddNewTourismGoverner";
import ViewUsers from "./components/ViewUsersAndDelete";
import ViewRequest from "./components/ViewRequests";
import AdminAccountManagement from "./pages/AdminAccountManagement";
// import { CookiesProvider } from 'react-cookie';
import ActivityList from "./pages/ActivityList";
import ActivityForm from "./pages/ActivityForm";
import ActivityEdit from "./pages/ActivityEdit";
import ItineraryEdit from "./pages/ItineraryEdit";
import ItineraryForm from "./pages/ItineraryForm";
import ViewItinerary from "./pages/ViewItinerary";
import ItineraryList from "./pages/ItineraryList";
import SelectActivity from "./pages/SelectActivity";
import MuseumsList from "./pages/museumsList";
import GiftList from "./pages/GiftList";
import BookFLight from "./pages/BookFlight";
import BookHotel from "./pages/BookHotel";
import ViewPastEvents from './pages/ViewPastEvents';
import ViewUpcomingEvents from './pages/ViewUpcomingEvents';
import BookTransportation from './components/BookTransportation'




import Categories from "./pages/Categories";
import PreferencePage from "./pages/PreferencePage";
import Revenue from "./pages/Revenue";
import GiftItemForm from "./pages/GiftItemPage";

function App() {
  return (
    <div className="App">
      {/* for notifications across all pages */}
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/fileUpload" element={<FileUpload />} />
          <Route path="/signUp" element={<GeneralSignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/home" element={<TempHomePage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordForm />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/view-profile" element={<ViewProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/create-profileAdv" element={<CreateProfilePageAdv />} />
          <Route path="/view-profileAdv" element={<ViewProfilePageAdv />} />
          <Route path="/edit-profileAdv" element={<EditProfilePageAdv />} />
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
          {/* <Route path="/create-profile" element={<CreateProfilePage />}>
            <Route path="/view-profile/:email" element={<ViewProfilePage />} /> */}
          {/* <Route path="/edit-profile/:email" element={<EditProfilePage />} /> */}
          <Route
            path="/adminAccountManagement"
            element={<AdminAccountManagement />}
          />
          <Route
            path="/pendingRequestsPage"
            element={<PendingRequestsPage />}
          />
          <Route path="/TouristProfile" element={<TouristProfile />} />
          <Route path="/termsAndConditions" element={<TermsAndConditions />} />
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
            <Route path="/viewUpcomingEvents" element={<ViewUpcomingEvents />} />


          <Route path="/itinerary" element={<ItineraryList />} />
          <Route path="/itinerary/create" element={<ItineraryForm />} />
          <Route
            path="/itinerary/create/selectActivity"
            element={<SelectActivity />}
          />
          <Route path="/itinerary/edit/:id" element={<ItineraryEdit />} />
          <Route path="/museums" element={<MuseumsList />} />

          <Route path="/Categorycontrol" element={<Categories />} />
          <Route path="/preferences" element={<PreferencePage />} />

          <Route path="/giftlist" element={<GiftList />} />

          <Route path="/view" element={<ViewTables />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/giftitem" element={<GiftItemForm />} />
          <Route path="/BookFlight" element={<BookFLight />} />
          <Route path="/BookHotel" element={<BookHotel />} />
            <Route path="/bookTransport" element={<BookTransportation />}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

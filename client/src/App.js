// import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChangePassword from './components/changePassword';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import GeneralSignUpForm from './components/GeneralSignUpForm';
import LoginForm from './components/LoginForm';
import { default as CreateProfilePage, default as EditProfilePage } from './pages/CreateProfilePage';
import { default as CreateProfilePageAdv, default as EditProfilePageAdv } from './pages/CreateProfilePageAdvertiser';
import { default as CreateProfilePageSeller, default as EditProfilePageSeller } from './pages/CreateProfilePageSeller';
import LandingPage from './pages/LandingPage';
import TempHomePage from './pages/tempHomePage';
import ViewProfilePage from './pages/ViewProfilePage';
import ViewProfilePageAdv from './pages/ViewProfilePageAdv';
import ViewProfilePageSeller from './pages/ViewProfilePageSeller';
// import EditProfilePage from './pages/';
import FileUpload from './components/fileUpload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PendingRequestsPage from './pages/PendingRequestsPage';
import TouristProfile from './pages/TouristProfile';
import TermsAndConditions from './pages/TermsAndConditions';


//TODO add navigation buttons between all pages






function App() {
  return (
    <div className="App">
     {/* for notifications across all pages */}
     <ToastContainer/>

     
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/fileUpload" element={<FileUpload />}/>
            <Route path="/signUp"element={<GeneralSignUpForm />}/>
            <Route path="/login"element={<LoginForm />}/>
            <Route path="/changePassword"element={<ChangePassword />}/>
            <Route path="/home"element={<TempHomePage />}/>
            <Route path='/forgotPasswordForm' element={<ForgotPasswordForm />} />
            <Route path='/create-profile' element={<CreateProfilePage />} />
            <Route path='/view-profile' element={<ViewProfilePage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
            <Route path='/create-profileAdv' element={<CreateProfilePageAdv />} />
            <Route path='/view-profileAdv' element={<ViewProfilePageAdv />} />
            <Route path='/edit-profileAdv' element={<EditProfilePageAdv />} />
            <Route path='/create-profileSeller' element={<CreateProfilePageSeller />} />
            <Route path='/view-profileSeller' element={<ViewProfilePageSeller />} />
            <Route path='/edit-profileSeller' element={<EditProfilePageSeller />} />
            {/* <Route path="/create-profile" element={<CreateProfilePage />}>
            <Route path="/view-profile/:email" element={<ViewProfilePage />} /> */}
            {/* <Route path="/edit-profile/:email" element={<EditProfilePage />} /> */}
            <Route path='/pendingRequestsPage' element={<PendingRequestsPage />} />
            <Route path='/TouristProfile' element={<TouristProfile />} />
            <Route path='/termsAndConditions' element={<TermsAndConditions />} />

          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

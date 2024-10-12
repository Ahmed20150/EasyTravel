// import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChangePassword from './components/changePassword';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import GeneralSignUpForm from './components/GeneralSignUpForm';
import LoginForm from './components/LoginForm';
import CreateProfilePage from './pages/CreateProfilePage';
import LandingPage from './pages/LandingPage';
import TempHomePage from './pages/tempHomePage';
// import EditProfilePage from './pages/';



function App() {
  return (
    <div className="App">
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/signUp"element={<GeneralSignUpForm />}/>
            <Route path="/login"element={<LoginForm />}/>
            <Route path="/changePassword"element={<ChangePassword />}/>
            <Route path="/home"element={<TempHomePage />}/>
            <Route path='/forgotPasswordForm' element={<ForgotPasswordForm />} />
            <Route path='/create-profile' element={<CreateProfilePage />} />
            {/* <Route path="/create-profile" element={<CreateProfilePage />}>
            <Route path="/view-profile/:email" element={<ViewProfilePage />} /> */}
            {/* <Route path="/edit-profile/:email" element={<EditProfilePage />} /> */}
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

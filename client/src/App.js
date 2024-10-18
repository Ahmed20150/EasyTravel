import logo from './logo.svg';
import './App.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TouristSignUpForm from './components/TouristSignUpForm';
import LoginForm from './components/LoginForm';
import LandingPage from './pages/LandingPage';
import ChangePassword from './components/changePassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TempHomePage from './pages/tempHomePage';
import GeneralSignUpForm from './components/GeneralSignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import PendingRequestsPage from './pages/PendingRequestsPage';
import TouristProfile from './pages/TouristProfile';






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
            <Route path='/pendingRequestsPage' element={<PendingRequestsPage />} />
            <Route path='/TouristProfile' element={<TouristProfile />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

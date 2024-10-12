// import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChangePassword from './components/changePassword';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import GeneralSignUpForm from './components/GeneralSignUpForm';
import LoginForm from './components/LoginForm';
import LandingPage from './pages/LandingPage';
import TempHomePage from './pages/tempHomePage';



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
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

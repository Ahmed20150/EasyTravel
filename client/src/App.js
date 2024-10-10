import logo from './logo.svg';
import './App.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import LandingPage from './pages/LandingPage';
import changePassword from './components/changePassword';
import forgotPassword from './components/forgotPassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom'



function App() {
  return (
    <div className="App">
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/signUp"element={<SignUpForm />}/>
            <Route path="/login"element={<LoginForm />}/>
            <Route path="/forgotPassword"element={<forgotPassword />}/>
            <Route path="/changePassword"element={<changePassword />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

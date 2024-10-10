import logo from './logo.svg';
import './App.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'



function App() {
  return (
    <div className="App">
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/signUp"element={<SignUpForm />}/>
            <Route path="/login"element={<LoginForm />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

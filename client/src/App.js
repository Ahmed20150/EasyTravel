import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddNewAdmin from './components/AddNewAdmins'; // Ensure the file exists
import AddNewTourismGoverner from './components/AddNewTourismGoverner'; // Ensure the file exists
import ViewUsers from 
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/add-admin" element={<AddNewAdmin />} />
          <Route path="/add-tourismGoverner" element={<AddNewTourismGoverner />} />
          <Route path="/" element={<AddNewAdmin />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;

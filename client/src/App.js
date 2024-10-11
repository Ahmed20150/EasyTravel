import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddNewAdmin from './components/AddNewAdmins'; // Ensure the file exists
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/add-admin" element={<AddNewAdmin />} />
        
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;

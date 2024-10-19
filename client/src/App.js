import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddNewAdmin from './components/AddNewAdmins'; // Ensure the file exists
import AddNewTourismGoverner from './components/AddNewTourismGoverner'; // Ensure the file exists 
import ViewUsers from './components/ViewUsersAndDelete';
import ViewRequest from './components/ViewRequests';
import { CookiesProvider } from 'react-cookie';
import ActivityList from "./pages/ActivityList";
import ActivityForm from "./pages/ActivityForm";
import ActivityEdit from "./pages/ActivityEdit";
import ItineraryEdit from "./pages/ItineraryEdit";
import ItineraryForm from "./pages/ItineraryForm";
import ItineraryList from "./pages/ItineraryList";
import SelectActivity from "./pages/SelectActivity";
import MuseumsList from "./pages/museumsList";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activities/create" element={<ActivityForm />} />
          <Route path="/activities/edit/:id" element={<ActivityEdit />} />
          <Route path="/itinerary" element={<ItineraryList />} />
          <Route path="/itinerary/create" element={<ItineraryForm />} />
          <Route
            path="/itinerary/create/selectActivity"
            element={<SelectActivity />}
          />
          <Route path="/itinerary/edit/:id" element={<ItineraryEdit />} />
          <Route path="/add-admin" element={<AddNewAdmin />} />
          <Route path="/add-tourismGoverner" element={<AddNewTourismGoverner />} />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/view-requests" element={<ViewRequest />} />
          <Route path="/museums" element={<MuseumsList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

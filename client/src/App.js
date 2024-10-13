import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActivityList from "./pages/ActivityList";
import ActivityForm from "./pages/ActivityForm";
import ActivityEdit from "./pages/ActivityEdit";
import ItineraryEdit from "./pages/ItineraryEdit";
import ItineraryForm from "./pages/ItineraryForm";
import ItineraryList from "./pages/ItineraryList";
import SelectActivity from "./pages/SelectActivity";
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;

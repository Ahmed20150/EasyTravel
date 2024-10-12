import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActivityList from "./components/ActivityLists";
import ActivityForm from "./components/ActivityForms";
import ActivityDetails from "./components/ActivityDetails";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activities/create" element={<ActivityForm />} />
          <Route path="/activities/edit/:id" element={<ActivityForm />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

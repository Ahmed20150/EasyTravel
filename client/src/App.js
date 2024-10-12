import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActivityList from "./pages/ActivityLists";
import ActivityForm from "./pages/ActivityForms";
import ActivityEdit from "./pages/ActivityEdit";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activities/create" element={<ActivityForm />} />
          <Route path="/activities/edit/:id" element={<ActivityEdit />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home"; // Assuming you have a Home component
import CreateResume from "./pages/createResume";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resume-builder" element={<CreateResume />} />
      </Routes>
    </Router>
  );
}

export default App;

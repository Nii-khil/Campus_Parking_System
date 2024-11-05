import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ParkingAvailability from "./Availability";
import PermitPage from "./Permit";
import ParkingViolation from "./ParkingViolation";
import ReserveSpot from "./ReserveSpot";
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/login" element={<LoginPage setIsAuthenticated={() => {}} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
        </Routes>
      
        {/* Navbar */}
        <nav className="bg-slate-700 p-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Campus Parking Management</h1>
          <ul className="flex space-x-4 text-white">
            <li><Link to="/" className="hover:text-197278">Parking Availability</Link></li>
            <li><Link to="/Permit" className="hover:text-197278">Permit Status</Link></li>
            <li><Link to="/violation" className="hover:text-197278">Parking Violations</Link></li>
            <li><Link to="/reservation" className="hover:text-197278">Reserve Spot</Link></li>
          </ul>
        </nav>

        <div className="bg-C2DFE3 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ParkingAvailability />} />
              {/*<Route path="/permit" element={<PermitStatus />} />*/}
              <Route path="/permit" element={<PermitPage />} />
              <Route path="/violation" element={<ParkingViolation />} />
              <Route path="/reservation" element={<ReserveSpot />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
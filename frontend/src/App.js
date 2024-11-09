import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ParkingAvailability from "./Availability";
import PermitPage from "./Permit";
import ParkingViolation from "./ParkingViolation";
import ReserveSpot from "./ReserveSpot";
import AdminDashboard from "./AdminDashboard";
import UserDashboardWelcome from "./UserDashboardWelcome";
import { UserProvider } from "./UserContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <Router>
        <AppContent
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </Router>
    </UserProvider>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/adminDashboard");

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={isAuthenticated ? (<Navigate to="/dashboard" replace />) : (<Navigate to="/login" replace />)}
        />

        {/* admin dashboard, includes nested routes */}
        <Route
          path="/adminDashboard/*"
          element={
            isAuthenticated ? (
              <AdminDashboard handleLogout={handleLogout} />
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
      </Routes>

      {/* navbar content, shown when user is authenticated and not an admin */}
      {isAuthenticated && !isAdminRoute && (
        <nav className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
          <h1 className="text-teal-400 text-2xl font-bold">Campus Parking Management</h1>
          <ul className="flex space-x-4 text-white">
            <li><Link to="/parkingAvailability" className="hover:text-teal-400 transition duration-200">Parking Availability</Link></li>
            <li><Link to="/permit" className="hover:text-teal-400 transition duration-200">Permit Status</Link></li>
            <li><Link to="/violation" className="hover:text-teal-400 transition duration-200">Parking Violations</Link></li>
            <li><Link to="/reservation" className="hover:text-teal-400 transition duration-200">Reserve Spot</Link></li>
            <li><button onClick={handleLogout} className="hover:text-teal-400 transition duration-200">Logout</button></li>
          </ul>
        </nav>
      )}

      <Routes>
        {/* protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <UserDashboardWelcome />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {isAuthenticated && !isAdminRoute && (
        <div className="bg-gray-800 text-gray-100 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<UserDashboardWelcome />} />
              <Route path="/parkingAvailability" element={<ParkingAvailability />} />
              <Route path="/permit" element={<PermitPage />} />
              <Route path="/violation" element={<ParkingViolation />} />
              <Route path="/reservation" element={<ReserveSpot />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

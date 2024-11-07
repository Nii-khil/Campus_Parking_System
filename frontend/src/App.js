  // import React, { useState } from "react";
  // import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
  // import LoginPage from "./LoginPage";
  // import SignupPage from "./SignupPage";
  // import ParkingAvailability from "./Availability";
  // import PermitPage from "./Permit";
  // import ParkingViolation from "./ParkingViolation";
  // import ReserveSpot from "./ReserveSpot";
  // import AdminDashboard from "./AdminDashboard";
  // import { UserProvider } from "./UserContext"; // Import UserProvider
  
  // function App() {
  //   const [isAuthenticated, setIsAuthenticated] = useState(false);

  //   return (
  //     <UserProvider> {/* Wrap with UserProvider */}
  //       <Router>
  //         <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
  //       </Router>
  //     </UserProvider>
  //   );
  // }

  // function AppContent({ isAuthenticated, setIsAuthenticated }) {
  //   const location = useLocation();
  //   const isAdminRoute = location.pathname.startsWith("/adminDashboard");
  
  //   return (
  //     <>
  //       <Routes>
  //         {/* public routes */}
  //         <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
  //         <Route path="/signup" element={<SignupPage />} />
  
  //         {/* admin dashboard, includes nested routes */}
  //         <Route
  //           path="/adminDashboard/*"
  //           element={
  //             isAuthenticated ? (
  //               <AdminDashboard />
  //             ) : (
  //               <LoginPage setIsAuthenticated={setIsAuthenticated} />
  //             )
  //           }
  //         />
  //       </Routes>
  
  //       {/* navbar content, shown when user is authenticated and not an admin */}
  //       {isAuthenticated && !isAdminRoute && (
  //         <nav className="bg-slate-700 p-4 flex justify-between items-center">
  //           <h1 className="text-white text-xl font-bold">Campus Parking Management</h1>
  //           <ul className="flex space-x-4 text-white">
  //             <li><Link to="/" className="hover:text-197278">Parking Availability</Link></li>
  //             <li><Link to="/permit" className="hover:text-197278">Permit Status</Link></li>
  //             <li><Link to="/violation" className="hover:text-197278">Parking Violations</Link></li>
  //             <li><Link to="/reservation" className="hover:text-197278">Reserve Spot</Link></li>
  //           </ul>
  //         </nav>
  //       )}
  
  //       {isAuthenticated && !isAdminRoute && (
  //         <div className="bg-C2DFE3 min-h-screen">
  //           <div className="container mx-auto px-4 py-8">
  //             <Routes>
  //               <Route path="/" element={<ParkingAvailability />} />
  //               <Route path="/permit" element={<PermitPage />} />
  //               <Route path="/violation" element={<ParkingViolation />} />
  //               <Route path="/reservation" element={<ReserveSpot />} />
  //             </Routes>
  //           </div>
  //         </div>
  //       )}
  //     </>
  //   );
  // }
    
  // export default App;

  import React, { useState } from "react";
  import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
  import LoginPage from "./LoginPage";
  import SignupPage from "./SignupPage";
  import ParkingAvailability from "./Availability";
  import PermitPage from "./Permit";
  import ParkingViolation from "./ParkingViolation";
  import ReserveSpot from "./ReserveSpot";
  import AdminDashboard from "./AdminDashboard";
  import { UserProvider } from "./UserContext"; // Import UserProvider
  
  function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    return (
      <UserProvider> {/* Wrap with UserProvider */}
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
      navigate("/login"); // redirect to login page after logout
    };
  
    return (
      <>
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignupPage />} />
  
          {/* admin dashboard, includes nested routes */}
          <Route
            path="/adminDashboard/*"
            element={
              isAuthenticated ? (
                <AdminDashboard handleLogout={handleLogout} /> // Pass handleLogout to AdminDashboard
              ) : (
                <LoginPage setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
        </Routes>
  
        {/* navbar content, shown when user is authenticated and not an admin */}
        {isAuthenticated && !isAdminRoute && (
          <nav className="bg-slate-700 p-4 flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">Campus Parking Management</h1>
            <ul className="flex space-x-4 text-white">
              <li><Link to="/" className="hover:text-197278">Parking Availability</Link></li>
              <li><Link to="/permit" className="hover:text-197278">Permit Status</Link></li>
              <li><Link to="/violation" className="hover:text-197278">Parking Violations</Link></li>
              <li><Link to="/reservation" className="hover:text-197278">Reserve Spot</Link></li>
              <li><button onClick={handleLogout} className="hover:text-197278">Logout</button></li>
            </ul>
          </nav>
        )}
  
        {isAuthenticated && !isAdminRoute && (
          <div className="bg-C2DFE3 min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<ParkingAvailability />} />
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
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
      <div className="bg-C2DFE3 min-h-screen">
      
      {/* Navbar */}
      <nav className="bg-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Campus Parking Management</h1>
        <ul className="flex space-x-4 text-white">
          <li><a href="#availability" className="hover:text-197278">Parking Availability</a></li>
          <li><a href="#predictions" className="hover:text-197278">Predictive Insights</a></li>
          <li><a href="#permit" className="hover:text-197278">Permit Status</a></li>
          <li><a href="#reservation" className="hover:text-197278">Reserve Spot</a></li>
          <li><a href="#notifications" className="hover:text-197278">Notifications</a></li>
        </ul>
      </nav>

      <div className="container mx-auto px-4 py-8">

        <section id="availability" className="mb-8">
          <h2 className="text-283D3B text-2xl font-bold mb-4">Parking Availability</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-772E25">Real-time updates on available parking spots.</p>
            {/* status logic */}
          </div>
        </section>

        <section id="predictions" className="mb-8">
          <h2 className="text-283D3B text-2xl font-bold mb-4">Predictive Insights</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-772E25">Predictions on the best times to find parking based on historical data.</p>
            {/* predictive insights component logic */}
          </div>
        </section>

        <section id="permit" className="mb-8">
          <h2 className="text-283D3B text-2xl font-bold mb-4">Your Permit Status</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-772E25">Details about your current parking permit.</p>
            {/* permit details component logic */}
          </div>
        </section>

        <section id="reservation" className="mb-8">
          <h2 className="text-283D3B text-2xl font-bold mb-4">Reserve a Spot</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-772E25">Reserve a parking spot in advance.</p>
            {/* reservation component logic */}
          </div>
        </section>

        <section id="notifications" className="mb-8">
          <h2 className="text-283D3B text-2xl font-bold mb-4">Notifications</h2>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-772E25">View any parking violations or updates.</p>
            {/* notifications component logic */}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}

export default App;
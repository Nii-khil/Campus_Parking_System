import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import ViolationManagement from "./ViolationManagement";
import ViewHistory from "./ViewHistory";
import PermitStatus from "./PermitStatus";

function AdminDashboardWelcome() {
  return (
    <div className="text-center p-8 bg-white rounded shadow-md">
      <h2 className="text-3xl font-bold mb-4">Welcome to the Campus Parking Management System</h2>
      <p className="text-gray-700 mb-4">
        As an admin, you can manage parking violations, view parking history, and check permit statuses. 
        Use the navigation menu to access these sections.
      </p>
      <p className="text-gray-500">
        Choose an option from the menu above to get started.
      </p>
    </div>
  );
}

function AdminDashboard({ handleLogout }) { // receiving handleLogout as a prop
  return (
    <>
      {/* navbar content */}
      <nav className="bg-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Campus Parking Management</h1>
        <ul className="flex space-x-4 text-white">
          <li><Link to="/adminDashboard/vioManage" className="hover:text-197278">Parking Violations</Link></li>
          <li><Link to="/adminDashboard/viewHist" className="hover:text-197278">Parking History</Link></li>
          <li><Link to="/adminDashboard/permitStatus" className="hover:text-197278">Permit Status</Link></li>
          <li><button onClick={handleLogout} className="hover:text-197278">Logout</button></li>
        </ul>
      </nav>

      {/* internal routes */}
      <div className="bg-C2DFE3 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route index element={<AdminDashboardWelcome />} />
            <Route path="vioManage" element={<ViolationManagement />} />
            <Route path="viewHist" element={<ViewHistory />} />
            <Route path="permitStatus" element={<PermitStatus />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

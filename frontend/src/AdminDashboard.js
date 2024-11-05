import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import ViolationManagement from "./ViolationManagement";
import ViewHistory from "./ViewHistory";
import PermitStatus from "./PermitStatus";

function AdminDashboard() {
  return (
    <>
      {/* Navbar */}
      <nav className="bg-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Campus Parking Management</h1>
        <ul className="flex space-x-4 text-white">
          <li><Link to="/vioManage" className="hover:text-197278">Parking Violations</Link></li>
          <li><Link to="/viewHist" className="hover:text-197278">Parking History</Link></li>
          <li><Link to="/permitStatus" className="hover:text-197278">Permit Status</Link></li>
        </ul>
      </nav>

      <div className="bg-C2DFE3 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/vioManage" element={<ViolationManagement />} />
            <Route path="/viewHist" element={<ViewHistory />} />
            <Route path="/permitStatus" element={<PermitStatus />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

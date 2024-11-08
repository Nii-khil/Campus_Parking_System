import React from "react";

function UserDashboardWelcome() {
  return (
    <div className="text-center p-8 bg-gray-900 shadow-md">
      <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Campus Parking Management System</h2>
      <p className="text-gray-300 mb-4">
        As a user, you have access to various features that make parking on campus easier and more efficient. 
        You can view real-time parking availability, check the status of your parking permit, and even reserve a parking spot.
      </p>
      <p className="text-gray-400">
        Use the navigation menu to explore these options and manage your parking needs. 
      </p>
    </div>
  );
}

export default UserDashboardWelcome;

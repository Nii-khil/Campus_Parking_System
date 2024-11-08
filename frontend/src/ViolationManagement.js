import React, { useState } from "react";
import axios from "axios";

function ViolationManagement() {
  const [userId, setUserId] = useState("");
  const [violationType, setViolationType] = useState("");
  const [violations, setViolations] = useState([]);             // for logged violations
  const [viewedViolations, setViewedViolations] = useState([]); // for fetched violations on View Violations
  const [viewUserId, setViewUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // function to log a violation
  const logViolation = async () => {
    if (userId && violationType) {
      try {
        const response = await axios.post('http://localhost:3001/add-violation', {
          user_id: userId,
          type_of_violation: violationType,
          fine_amount: 50.00  // incremental fine amount logic to be implemented
        });

        if (response.status === 201) {
          const newViolation = {
            userId,
            violationType,
            date: new Date().toLocaleString(),
          };

          setViolations([...violations, newViolation]);
          setUserId("");
          setViolationType("");
          setErrorMessage("");
          alert("Violation logged successfully!");
        }
      } catch (error) {
        console.error("Error logging violation:", error);
        setErrorMessage("Failed to log violation. Please try again.");
      }
    } else {
      setErrorMessage("Please enter a valid user ID and select a violation type.");
    }
  };

  // function to view violations by user ID
  const viewViolations = async () => {
    if (viewUserId) {
      try {
        const response = await axios.get(`http://localhost:3001/view-violations/${viewUserId}`);
        setViewedViolations(response.data); // Set viewedViolations instead of violations
        setErrorMessage("");  // Clear any previous error messages
      } catch (error) {
        setErrorMessage("Error fetching violations. Please try again.");
        console.error(error);
      }
    } else {
      setErrorMessage("Please enter a valid user ID to view violations.");
    }
  };

  // function to mark fees as paid
  const markAsPaid = async (violationId) => {
    try {
      await axios.put(`http://localhost:3001/mark-fees-paid/${violationId}`);
      setViewedViolations(
        viewedViolations.map((violation) =>
          violation.violation_id === violationId ? { ...violation, fees_paid: "YES" } : violation
        )
      );
    } catch (error) {
      console.error("Error marking fees as paid:", error);
      setErrorMessage("Failed to update fees status. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-white">Violation Management</h2>

      {/* log violations section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Log a Violation</h3>
        <div className="mb-4">
          <label htmlFor="userId" className="block font-semibold mb-1 text-gray-300">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="bg-gray-700 border border-gray-600 p-2 w-full rounded-md text-gray-200"
            placeholder="Enter student/professor ID"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="violationType" className="block font-semibold mb-1 text-gray-300">Violation Type</label>
          <select
            id="violationType"
            value={violationType}
            onChange={(e) => setViolationType(e.target.value)}
            className="bg-gray-700 border border-gray-600 p-2 w-full rounded-md text-gray-200"
          >
            <option value="">Select a violation type</option>
            <option value="Unauthorized Parking">Unauthorized Parking</option>
            <option value="Invalid Permit">Invalid Permit</option>
            <option value="Existing Dues">Existing Dues</option>
          </select>
        </div>
        <button onClick={logViolation} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
          Log Violation
        </button>
        {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
      </div>

      {/* view violations section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-300">View Violations</h3>
        <div className="mb-4">
          <label htmlFor="viewUserId" className="block font-semibold mb-1 text-gray-300">User ID</label>
          <input
            type="text"
            id="viewUserId"
            value={viewUserId}
            onChange={(e) => setViewUserId(e.target.value)}
            className="bg-gray-700 border border-gray-600 p-2 w-full rounded-md text-gray-200"
            placeholder="Enter student/professor ID"
          />
        </div>
        <button onClick={viewViolations} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
          View Violations
        </button>
      </div>

      {/* display violations in a table */}
      {viewedViolations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Violation History</h3>
          <table className="table-auto w-full border-collapse bg-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-600 px-4 py-2 text-left text-gray-300">Violation ID</th>
                <th className="border border-gray-600 px-4 py-2 text-left text-gray-300">Type of Violation</th>
                <th className="border border-gray-600 px-4 py-2 text-left text-gray-300">Fine Amount</th>
                <th className="border border-gray-600 px-4 py-2 text-left text-gray-300">Fees Paid</th>
                <th className="border border-gray-600 px-4 py-2 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {viewedViolations.map((violation, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="border border-gray-600 px-4 py-2 text-gray-200">{violation.violation_id}</td>
                  <td className="border border-gray-600 px-4 py-2 text-gray-200">{violation.type_of_violation}</td>
                  <td className="border border-gray-600 px-4 py-2 text-gray-200">₹{violation.fine_amount}</td>
                  <td className="border border-gray-600 px-4 py-2 text-gray-200">
                    {violation.fees_paid ? "YES" : "NO"}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {!violation.fees_paid && (
                      <button
                        onClick={() => markAsPaid(violation.violation_id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViolationManagement;

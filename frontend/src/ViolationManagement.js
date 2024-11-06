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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Violation Management</h2>

      {/* log violations section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Log a Violation</h3>
        <div className="mb-4">
          <label htmlFor="userId" className="block font-semibold mb-1">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 w-full rounded-md"
            placeholder="Enter student/professor ID"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="violationType" className="block font-semibold mb-1">Violation Type</label>
          <select
            id="violationType"
            value={violationType}
            onChange={(e) => setViolationType(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            <option value="">Select a violation type</option>
            <option value="Unauthorized Parking">Unauthorized Parking</option>
            <option value="Invalid Permit">Invalid Permit</option>
            <option value="Existing Dues">Existing Dues</option>
          </select>
        </div>
        <button onClick={logViolation} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Log Violation
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>

      {/* view violations section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">View Violations</h3>
        <div className="mb-4">
          <label htmlFor="viewUserId" className="block font-semibold mb-1">User ID</label>
          <input
            type="text"
            id="viewUserId"
            value={viewUserId}
            onChange={(e) => setViewUserId(e.target.value)}
            className="border p-2 w-full rounded-md"
            placeholder="Enter student/professor ID"
          />
        </div>
        <button onClick={viewViolations} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          View Violations
        </button>
      </div>

      {/* display violations in a table */}
      {viewedViolations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Violation History</h3>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Violation ID</th>
                <th className="border px-4 py-2 text-left">Type of Violation</th>
                <th className="border px-4 py-2 text-left">Fine Amount</th>
                <th className="border px-4 py-2 text-left">Fees Paid</th>
              </tr>
            </thead>
            <tbody>
              {viewedViolations.map((violation, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{violation.violation_id}</td>
                  <td className="border px-4 py-2">{violation.type_of_violation}</td>
                  <td className="border px-4 py-2">{violation.fine_amount}</td>
                  <td className="border px-4 py-2">
                    {violation.fees_paid ? "YES" : "NO"}
                  </td>
                  <td className="border px-4 py-2">
                    {!violation.fees_paid && (
                      <button
                        onClick={() => markAsPaid(violation.violation_id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
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

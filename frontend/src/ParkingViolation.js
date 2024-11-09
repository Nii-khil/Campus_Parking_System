import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";  // importing the custom hook

const ParkingViolation = () => {
  const [violations, setViolations] = useState([]);
  const [summary, setSummary] = useState(null);
  const { userID } = useUser(); // accessing userID from context

  console.log(userID);
  useEffect(() => {
    const fetchViolations = async () => {
      if (!userID) {
        console.error("User ID not found");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/parking_violations/${userID}`);
        setViolations(response.data);

        const summaryResponse = await axios.get(`http://localhost:3001/parking_violations/summary/${userID}`);
        setSummary(summaryResponse.data);
      } catch (error) {
        console.error("Error fetching parking violations:", error);
      }
    };

    fetchViolations();
  }, [userID]); // dependency on userID to refetch if it changes

  return (
    <section id="violation" className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4">Your Parking Violations</h2>
      <div className="bg-gray-900 shadow-lg p-6 rounded-lg">
        {/* Display total number of violations */}
        {/* Display summary data */}
        {summary && (
          <div className="text-gray-300 mb-4">
            <p>Total Violations: {summary.total_violations}</p>
            <p>Paid Violations: {summary.paid_violations}</p>
            <p>Unpaid Violations: {summary.unpaid_violations}</p>
            <p>Total Fines Collected: ₹{summary.total_fines_collected}</p>
          </div>
        )}
        {violations.length > 0 ? (
          <table className="min-w-full bg-gray-700 border border-gray-600">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-600 text-gray-300">Violation ID</th>
                <th className="px-4 py-2 border border-gray-600 text-gray-300">Type of Violation</th>
                <th className="px-4 py-2 border border-gray-600 text-gray-300">Fine Amount</th>
                <th className="px-4 py-2 border border-gray-600 text-gray-300">Fine Paid</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((violation) => (
                <tr key={violation.violation_id} className="hover:bg-gray-600">
                  <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{violation.violation_id}</td>
                  <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{violation.type_of_violation}</td>
                  <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">₹{violation.fine_amount}</td>
                  <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">
                    {violation.fine_paid ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-300">No parking violations found.</p>
        )}
      </div>
    </section>
  );
};

export default ParkingViolation;

// ------------------------------------------------------------------------------------------------


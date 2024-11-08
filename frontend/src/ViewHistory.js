import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/parkingHistory');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching parking history:', error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-white">Parking History</h2>
      <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-700">
          {/* <th className="border border-gray-600 p-2 text-center text-white">History ID</th> */}
          <th className="border border-gray-600 p-2 text-center text-white">User ID</th>
          <th className="border border-gray-600 p-2 text-center text-white">Vehicle Type</th>
          <th className="border border-gray-600 p-2 text-center text-white">Registration No.</th>
          <th className="border border-gray-600 p-2 text-center text-white">Parking Spot</th>
          <th className="border border-gray-600 p-2 text-center text-white">Entry Time</th>
          <th className="border border-gray-600 p-2 text-center text-white">Exit Time</th>
          <th className="border border-gray-600 p-2 text-center text-white">Fees</th>
          <th className="border border-gray-600 p-2 text-center text-white">Paid</th>
        </tr>
      </thead>

        <tbody>
          {history.map((entry) => (
            <tr key={entry.history_id} className="bg-gray-800 text-gray-200">
              {/* <td className="border border-gray-600 p-2">{entry.history_id}</td> */}
              <td className="border border-gray-600 p-2 text-center">{entry.user_id}</td>
              <td className="border border-gray-600 p-2 text-center">{entry.vehicle_type}</td>
              <td className="border border-gray-600 p-2 text-center">{entry.registration_number}</td>
              <td className="border border-gray-600 p-2 text-center">{entry.parking_spot}</td>
              <td className="border border-gray-600 p-2 text-center">{new Date(entry.entry_time).toLocaleString()}</td>
              <td className="border border-gray-600 p-2 text-center">
                {entry.exit_time ? new Date(entry.exit_time).toLocaleString() : 'N/A'}
              </td>
              <td className="border border-gray-600 p-2">₹{entry.fees_amount}</td>
              <td className="border border-gray-600 p-2">{entry.fees_paid ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewHistory;

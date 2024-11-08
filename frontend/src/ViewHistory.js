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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Parking History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">History ID</th>
            <th className="border p-2 text-left">User ID</th>
            <th className="border p-2 text-left">Vehicle Type</th>
            <th className="border p-2 text-left">Registration No.</th>
            <th className="border p-2 text-left">Parking Spot</th>
            <th className="border p-2 text-left">Entry Time</th>
            <th className="border p-2 text-left">Exit Time</th>
            <th className="border p-2 text-left">Fees</th>
            <th className="border p-2 text-left">Paid</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.history_id}>
              <td className="border p-2">{entry.history_id}</td>
              <td className="border p-2">{entry.user_id}</td>
              <td className="border p-2">{entry.vehicle_type}</td>
              <td className="border p-2">{entry.registration_number}</td>
              <td className="border p-2">{entry.parking_spot}</td>
              <td className="border p-2">{new Date(entry.entry_time).toLocaleString()}</td>
              <td className="border p-2">{entry.exit_time ? new Date(entry.exit_time).toLocaleString() : 'N/A'}</td>
              <td className="border p-2">₹{entry.fees_amount}</td>
              <td className="border p-2">{entry.fees_paid ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewHistory;
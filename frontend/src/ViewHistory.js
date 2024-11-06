import React, { useState, useEffect } from 'react';

const ViewHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch history data from an API or backend here.
    const fetchHistory = async () => {
      const data = [
        { id: 1, date: '2023-09-10', location: 'Lot A', description: 'Parked in Zone A3' },
        { id: 2, date: '2023-09-12', location: 'Lot B', description: 'Parked in Zone B1' },
        { id: 3, date: '2023-09-15', location: 'Lot C', description: 'Overstayed parking time' },
      ];
      setHistory(data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Parking History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Location</th>
            <th className="border p-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id}>
              <td className="border p-2">{entry.date}</td>
              <td className="border p-2">{entry.location}</td>
              <td className="border p-2">{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewHistory;

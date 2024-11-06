import React, { useState, useEffect } from 'react';

const PermitStatus = () => {
  const [permits, setPermits] = useState([]);

  useEffect(() => {
    // Fetch permit data from an API or backend here.
    const fetchPermits = async () => {
      const data = [
        { id: 1, type: 'Student', expirationDate: '2023-12-31', status: 'Active' },
        { id: 2, type: 'Faculty', expirationDate: '2024-06-30', status: 'Active' },
        { id: 3, type: 'Visitor', expirationDate: '2023-09-30', status: 'Expired' },
      ];
      setPermits(data);
    };
    fetchPermits();
  }, []);

  const handleRenew = (id) => {
    // Logic to renew permit (e.g., make API call to backend).
    setPermits((prevPermits) =>
      prevPermits.map((permit) =>
        permit.id === id ? { ...permit, status: 'Active', expirationDate: '2024-12-31' } : permit
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Permit Status</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Type</th>
            <th className="border p-2 text-left">Expiration Date</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map((permit) => (
            <tr key={permit.id}>
              <td className="border p-2">{permit.type}</td>
              <td className="border p-2">{permit.expirationDate}</td>
              <td className="border p-2">
                {permit.status === 'Expired' ? (
                  <span className="text-red-600 font-semibold">Expired</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                )}
              </td>
              <td className="border p-2">
                {permit.status === 'Expired' ? (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleRenew(permit.id)}
                  >
                    Renew
                  </button>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermitStatus;

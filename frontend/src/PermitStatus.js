//import React, { useState, useEffect } from 'react';
//
//const PermitStatus = () => {
//  const [permits, setPermits] = useState([]);
//
//  useEffect(() => {
//    // Fetch permit data from an API or backend here.
//    const fetchPermits = async () => {
//      const data = [
//        { id: 1, type: 'Student', expirationDate: '2023-12-31', status: 'Active' },
//        { id: 2, type: 'Faculty', expirationDate: '2024-06-30', status: 'Active' },
//        { id: 3, type: 'Visitor', expirationDate: '2023-09-30', status: 'Expired' },
//      ];
//      setPermits(data);
//    };
//    fetchPermits();
//  }, []);
//
//  const fetchUserPermits = async () => {
//    if (!userID) return;
//    try {
//      const response = await fetch(`http://localhost:3001/user-permits/${userID}`);
//      const data = await response.json();
//      if (response.ok) {
//        setPermits(data);
//      } else {
//        setMessage('Error fetching permits: ' + data.message);
//      }
//    } catch (error) {
//      console.error('Error fetching permits:', error);
//      setMessage('Error fetching permits.');
//    }
//  };
//
//
//
//  const handleRenew = (id) => {
//    // Logic to renew permit (e.g., make API call to backend).
//    setPermits((prevPermits) =>
//      prevPermits.map((permit) =>
//        permit.id === id ? { ...permit, status: 'Active', expirationDate: '2024-12-31' } : permit
//      )
//    );
//  };
//
//  return (
//    <div className="p-4">
//      <h2 className="text-2xl font-bold mb-4 text-white">Permit Status</h2>
//      <table className="w-full border-collapse">
//        <thead>
//          <tr>
//            <th className="border p-2 text-left text-white">Type</th>
//            <th className="border p-2 text-left text-white">Expiration Date</th>
//            <th className="border p-2 text-left text-white">Status</th>
//            <th className="border p-2 text-left text-white">Actions</th>
//          </tr>
//        </thead>
//        <tbody>
//          {permits.map((permit) => (
//            <tr key={permit.id}>
//              <td className="border p-2">{permit.type}</td>
//              <td className="border p-2">{permit.expirationDate}</td>
//              <td className="border p-2">
//                {permit.status === 'Expired' ? (
//                  <span className="text-red-600 font-semibold">Expired</span>
//                ) : (
//                  <span className="text-green-600 font-semibold">Active</span>
//                )}
//              </td>
//              <td className="border p-2">
//                {permit.status === 'Expired' ? (
//                  <button
//                    className="bg-blue-500 text-white px-4 py-2 rounded"
//                    onClick={() => handleRenew(permit.id)}
//                  >
//                    Renew
//                  </button>
//                ) : (
//                  <span className="text-gray-500">N/A</span>
//                )}
//              </td>
//            </tr>
//          ))}
//        </tbody>
//      </table>
//    </div>
//  );
//};
//
//export default PermitStatus;


//import React, { useState, useEffect } from 'react';
//
//const PermitStatus = () => {
//  const [userID, setUserID] = useState(''); // State for the userID input
//  const [permits, setPermits] = useState([]);
//  const [message, setMessage] = useState('');
//
//  // Fetch user-specific permits when the userID changes
//  const fetchUserPermits = async () => {
//    if (!userID) {
//      setMessage('Please enter a valid User ID.');
//      return;
//    }
//
//    try {
//      const response = await fetch(`http://localhost:3001/user-permits/${userID}`);
//      const data = await response.json();
//      if (response.ok) {
//        setPermits(data);
//        setMessage(''); // Clear any previous message
//      } else {
//        setMessage('Error fetching permits: ' + data.message);
//      }
//    } catch (error) {
//      console.error('Error fetching permits:', error);
//      setMessage('Error fetching permits.');
//    }
//  };
//
//  // Fetch permits when the component mounts and when userID changes
//  useEffect(() => {
//    if (userID) {
//      fetchUserPermits();
//    }
//  }, [userID]);
//
//  const handleRenew = (id) => {
//    // Logic to renew permit (e.g., make API call to backend).
//    setPermits((prevPermits) =>
//      prevPermits.map((permit) =>
//        permit.id === id ? { ...permit, status: 'Active', expirationDate: '2024-12-31' } : permit
//      )
//    );
//  };
//
//  return (
//    <div className="p-4">
//      <h2 className="text-2xl font-bold mb-4 text-white">Permit Status</h2>
//
//      {/* Input for User ID */}
//      <div className="mb-4">
//        <label htmlFor="userID" className="block text-white">Enter User ID:</label>
//        <input
//          type="text"
//          id="userID"
//          value={userID}
//          onChange={(e) => setUserID(e.target.value)}
//          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//        />
//      </div>
//
//      {/* Button to fetch permits */}
//      <button
//        onClick={fetchUserPermits}
//        className="bg-blue-500 text-white px-4 py-2 rounded"
//        disabled={!userID}
//      >
//        Fetch Permits
//      </button>
//
//      {/* Show message if there's any error or status */}
//      {message && <p className="mt-4 text-red-600">{message}</p>}
//
//      {/* Render the permits table if fetched successfully */}
//      {permits.length > 0 && (
//        <table className="w-full border-collapse mt-4">
//          <thead>
//            <tr>
//              <th className="border p-2 text-left text-white">Type</th>
//              <th className="border p-2 text-left text-white">Expiration Date</th>
//              <th className="border p-2 text-left text-white">Status</th>
//              <th className="border p-2 text-left text-white">Actions</th>
//            </tr>
//          </thead>
//          <tbody>
//            {permits.map((permit) => (
//              <tr key={permit.id}>
//                <td className="border p-2">{permit.type}</td>
//                <td className="border p-2">{permit.expirationDate}</td>
//                <td className="border p-2">
//                  {permit.status === 'Expired' ? (
//                    <span className="text-red-600 font-semibold">Expired</span>
//                  ) : (
//                    <span className="text-green-600 font-semibold">Active</span>
//                  )}
//                </td>
//                <td className="border p-2">
//                  {permit.status === 'Expired' ? (
//                    <button
//                      className="bg-blue-500 text-white px-4 py-2 rounded"
//                      onClick={() => handleRenew(permit.id)}
//                    >
//                      Renew
//                    </button>
//                  ) : (
//                    <span className="text-gray-500">N/A</span>
//                  )}
//                </td>
//              </tr>
//            ))}
//          </tbody>
//        </table>
//      )}
//    </div>
//  );
//};
//
//export default PermitStatus;


import React, { useState, useEffect } from 'react';

const PermitStatus = () => {
  const [userID, setUserID] = useState(''); // State for the userID input
  const [permits, setPermits] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch user-specific permits when the userID changes
  const fetchUserPermits = async () => {
    if (!userID) {
      setMessage('Please enter a valid User ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/user-permits/${userID}`);
      const data = await response.json();
      if (response.ok) {
        setPermits(data);
        setMessage(''); // Clear any previous message
      } else {
        setMessage('Error fetching permits: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching permits:', error);
      setMessage('Error fetching permits.');
    }
  };

  // Fetch permits when the component mounts and when userID changes
  useEffect(() => {
    if (userID) {
      fetchUserPermits();
    }
  }, [userID]);

  const handleRenew = (id) => {
    // Logic to renew permit (e.g., make API call to backend).
    setPermits((prevPermits) =>
      prevPermits.map((permit) =>
        permit.id === id ? { ...permit, status: 'Active', expirationDate: '2024-12-31' } : permit
      )
    );
  };

  const handleRevoke = (id) => {
    // Logic to revoke permit (e.g., make API call to backend).
    setPermits((prevPermits) =>
      prevPermits.map((permit) =>
        permit.id === id ? { ...permit, status: 'Revoked' } : permit
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Permit Status</h2>

      {/* Input for User ID */}
      <div className="mb-4">
        <label htmlFor="userID" className="block text-white">Enter User ID:</label>
        <input
          type="text"
          id="userID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Button to fetch permits */}
      <button
        onClick={fetchUserPermits}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!userID}
      >
        Fetch Permits
      </button>

      {/* Show message if there's any error or status */}
      {message && <p className="mt-4 text-red-600">{message}</p>}

      {/* Show message if no permits are found */}
      {permits.length === 0 && !message && (
        <p className="mt-4 text-gray-500">No permits found for this user.</p>
      )}

      {/* Render the permits table if fetched successfully */}
      {permits.length > 0 && (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border p-2 text-left text-white">Type</th>
              <th className="border p-2 text-left text-white">Expiration Date</th>
              <th className="border p-2 text-left text-white">Status</th>
              <th className="border p-2 text-left text-white">Actions</th>
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
                  ) : permit.status === 'Active' ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-600 font-semibold">Revoked</span>
                  )}
                </td>
                <td className="border p-2">
                  {permit.status === 'Active' ? (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleRevoke(permit.id)}
                    >
                      Revoke
                    </button>
                  ) : permit.status === 'Expired' ? (
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
      )}
    </div>
  );
};

export default PermitStatus;

import React, { useState, useEffect } from 'react';

const PermitStatus = () => {
  const [userID, setUserID] = useState(''); // State for the userID input
  const [permits, setPermits] = useState([]);
  const [message, setMessage] = useState('');

  // Function to format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Formats as MM/DD/YYYY by default
  };

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

  // Call API to revoke permit
  const handleRevoke = async (id) => {
    try {
      const permitToRevoke = permits.find((permit) => permit.permit_id === id);
      console.log(permitToRevoke)
      const response = await fetch('http://localhost:3001/revoke-permit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id: id,
          user_id: permitToRevoke.user_id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPermits((prevPermits) =>
          prevPermits.map((permit) =>
            permit.permit_id === id ? { ...permit, status: 'revoked' } : permit
          )
        );
        setMessage('Permit revoked successfully');
      } else {
        setMessage('Error revoking permit: ' + data.message);
      }
    } catch (error) {
      console.error('Error revoking permit:', error);
      setMessage('Error revoking permit.');
    }
  };

  const handleRenew = async (id) => {
    try {
      // Find the permit that needs to be renewed
      const permitToRenew = permits.find((permit) => permit.permit_id === id);
      const { permit_id, user_id } = permitToRenew;

      // Send a request to renew the permit
      const response = await fetch(`http://localhost:3001/renew-permit/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permit_id, // Send only permit_id and user_id
          user_id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the permit state with the new expiry date
        setPermits((prevPermits) =>
          prevPermits.map((permit) =>
            permit.permit_id === id
              ? { ...permit, status: 'active', expiry_date: data.expiryDate } // Assuming response includes the new expiry date
              : permit
          )
        );
        setMessage('Permit renewed successfully');
      } else {
        setMessage('Error renewing permit: ' + data.message);
      }
    } catch (error) {
      console.error('Error renewing permit:', error);
      setMessage('Error renewing permit.');
    }
  };

  // Fetch permits when the component mounts and when userID changes
  useEffect(() => {
    if (userID) {
      fetchUserPermits();
    }
  }, [userID]);

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
              <tr key={permit.permit_id}>
                <td className="border p-2 text-white">{permit.permit_name}</td>
                <td className="border p-2 text-white">{formatDate(permit.expiry_date)}</td>
                <td className="border p-2 text-white">
                  {permit.status.toLowerCase() === 'expired' ? (
                    <span className="text-red-600 font-semibold">Expired</span>
                  ) : permit.status.toLowerCase() === 'active' ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-600 font-semibold">Revoked</span>
                  )}
                </td>
                <td className="border p-2">
                  {permit.status.toLowerCase() === 'active' ? (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleRevoke(permit.permit_id)}
                    >
                      Revoke
                    </button>
                  ) : permit.status.toLowerCase() === 'expired' ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleRenew(permit.permit_id)}
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
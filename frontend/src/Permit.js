import React, { useState, useEffect } from 'react';

const PermitPage = () => {
    const [userId, setUserId] = useState('');
    const [permitId, setPermitId] = useState('');
    const [status] = useState('active'); // Assuming status is always 'active'
    const [permits, setPermits] = useState([]);
    const [message, setMessage] = useState('');
    const [validFrom] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
    const [validFor, setValidFor] = useState(''); // Holds the duration of the permit

    const permitTypes = {
        '1': 'Daily Pass',
        '2': 'Weekly Pass',
        '3': 'Semester Pass',
        '4': 'Visitor Pass'
    };

    const fetchUserPermits = async () => {
        if (!userId) return; // Avoid fetching if no userId is set
        try {
            const response = await fetch(`http://localhost:3001/user-permits/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setPermits(data);
            } else {
                setMessage('Error fetching permits: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching permits:', error);
            setMessage('Error fetching permits.');
        }
    };

    const issuePermit = async () => {
        if (!permitId || !validFor) {
            setMessage('Please select a permit type and validity period.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/issue-permit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permit_id: permitId, user_id: userId, status, valid_from: validFrom, valid_for: validFor })
            });

            const text = await response.text(); // Get response as text
            console.log(text); // Log the response text

            if (response.ok) {
                const data = JSON.parse(text); // Parse the text as JSON
                setMessage(data.message);
                await fetchUserPermits(); // Refresh the permit list
            } else {
                const errorData = JSON.parse(text);
                setMessage('Error issuing permit: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error issuing permit:', error);
            setMessage('Error issuing permit.');
        }
    };

    const revokePermit = async (permitId) => {
        try {
            const response = await fetch('http://localhost:3001/revoke-permit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permit_id: permitId, user_id: userId })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                fetchUserPermits(); // Refresh the permit list
            } else {
                setMessage('Error revoking permit: ' + data.message);
            }
        } catch (error) {
            console.error('Error revoking permit:', error);
            setMessage('Error revoking permit.');
        }
    };

    useEffect(() => {
        // Fetch permits when the component mounts or when userId changes
        fetchUserPermits();
    }, [userId]);

    const handleHomeRedirect = () => {
        window.location.href = 'http://localhost:3000';
    };

    const handlePermitTypeChange = (e) => {
        const selectedPermit = e.target.value;
        setPermitId(selectedPermit);

        // Set validFor based on the selected permit type
        if (selectedPermit === '1') {
            setValidFor('1 day');
        } else if (selectedPermit === '2') {
            setValidFor('7 days');
        } else if (selectedPermit === '3') {
            setValidFor('180 days (6 months)');
        } else if (selectedPermit === '4') {
            setValidFor('1 day');
        } else {
            setValidFor('');
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
            <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg mr-4">
                <button
                    onClick={handleHomeRedirect}
                    className="mb-4 text-blue-500 hover:underline"
                >
                    Go to Home
                </button>

                <h2 className="text-xl font-bold mb-4">My Permits</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter SRN"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={fetchUserPermits}
                        className="mt-2 w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200"
                    >
                        Fetch Permits
                    </button>
                </div>

                {permits.length === 0 ? (
                    <p className="text-center text-gray-500">No permits found.</p>
                ) : (
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Permit Type</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Expiry Date</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {permits.map((permit) => (
                            <tr key={permit.permit_id} className="border-b">
                                <td className="px-4 py-2">{permitTypes[permit.permit_id]}</td>
                                <td className="px-4 py-2">{permit.status}</td>
                                <td className="px-4 py-2">{new Date(permit.expiry_date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => revokePermit(permit.permit_id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-8">Parking Permit</h2>

                <div className="mb-4">
                    <select
                        value={permitId}
                        onChange={handlePermitTypeChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Permit Type</option>
                        <option value="1">Daily Pass</option>
                        <option value="2">Weekly Pass</option>
                        <option value="3">Semester Pass</option>
                        <option value="4">Visitor Pass</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Valid From</label>
                    <input
                        type="date"
                        value={validFrom}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Valid For</label>
                    <input
                        type="text"
                        value={validFor}
                        readOnly
                        className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
                    />
                </div>

                <button
                    onClick={issuePermit}
                    className="w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200 mb-4"
                >
                    Issue Permit
                </button>

                {message && <p className="text-center text-red-500 text-sm mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default PermitPage;

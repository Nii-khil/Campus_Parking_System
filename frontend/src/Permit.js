//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { useUser } from './UserContext';
//
//const PermitPage = () => {
//    const [userId, setUserId] = useState('');
//    const [permitId, setPermitId] = useState('');
//    const [status] = useState('active'); // Assuming status is always 'active'
//    const [permits, setPermits] = useState([]);
//    const [message, setMessage] = useState('');
//    const [validFrom] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
//    const [validFor, setValidFor] = useState(''); // Holds the duration of the permit
//
//    const permitTypes = {
//        '1': 'Daily Pass',
//        '2': 'Weekly Pass',
//        '3': 'Semester Pass',
//        '4': 'Visitor Pass'
//    };
//
//    const fetchUserPermits = async () => {
//        if (!userId) return; // Avoid fetching if no userId is set
//        try {
//            const response = await fetch(`http://localhost:3001/user-permits/${userId}`);
//            const data = await response.json();
//            if (response.ok) {
//                setPermits(data);
//            } else {
//                setMessage('Error fetching permits: ' + data.message);
//            }
//        } catch (error) {
//            console.error('Error fetching permits:', error);
//            setMessage('Error fetching permits.');
//        }
//    };
//
//    const issuePermit = async () => {
//        if (!permitId || !validFor) {
//            setMessage('Please select a permit type and validity period.');
//            return;
//        }
//
//        try {
//            const response = await fetch(`http://localhost:3001/issue-permit/${userId}`, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ permit_id: permitId, user_id: userId, status, valid_from: validFrom, valid_for: validFor })
//            });
//
//            const text = await response.text(); // Get response as text
//            console.log(text); // Log the response text
//
//            if (response.ok) {
//                const data = JSON.parse(text); // Parse the text as JSON
//                setMessage(data.message);
//                await fetchUserPermits(); // Refresh the permit list
//            } else {
//                const errorData = JSON.parse(text);
//                setMessage('Error issuing permit: ' + errorData.message);
//            }
//        } catch (error) {
//            console.error('Error issuing permit:', error);
//            setMessage('Error issuing permit.');
//        }
//    };
//
//    const revokePermit = async (permitId) => {
//        try {
//            const response = await fetch('http://localhost:3001/revoke-permit', {
//                method: 'PUT',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ permit_id: permitId, user_id: userId })
//            });
//
//            const data = await response.json();
//            if (response.ok) {
//                setMessage(data.message);
//                fetchUserPermits(); // Refresh the permit list
//            } else {
//                setMessage('Error revoking permit: ' + data.message);
//            }
//        } catch (error) {
//            console.error('Error revoking permit:', error);
//            setMessage('Error revoking permit.');
//        }
//    };
//
//    useEffect(() => {
//        // Fetch permits when the component mounts or when userId changes
//        fetchUserPermits();
//    }, [userId]);
//
//    const handleHomeRedirect = () => {
//        window.location.href = 'http://localhost:3000';
//    };
//
//    const handlePermitTypeChange = (e) => {
//        const selectedPermit = e.target.value;
//        setPermitId(selectedPermit);
//
//        // Set validFor based on the selected permit type
//        if (selectedPermit === '1') {
//            setValidFor('1 day');
//        } else if (selectedPermit === '2') {
//            setValidFor('7 days');
//        } else if (selectedPermit === '3') {
//            setValidFor('180 days (6 months)');
//        } else if (selectedPermit === '4') {
//            setValidFor('1 day');
//        } else {
//            setValidFor('');
//        }
//    };
//
//    const [spots, setSpots] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState(null);
//    const [rowNo, setRow] = useState("A");
//    const [spotNumber, setSpotNumber] = useState("");
//    const [role, setRole] = useState("student");
//    const [isLoading, setIsLoading] = useState(false);
//
//    useEffect(() => {
//        // Fetch available parking spots from the backend
//        axios
//            .get('http://localhost:3001/available-spots')
//            .then((response) => {
//                setSpots(response.data);
//                setLoading(false);
//            })
//            .catch((err) => {
//                setError('Failed to load parking availability.');
//                setLoading(false);
//            });
//    }, []);
//
//    // Grouping spots by row (A, B, C, D, etc.)
//    const groupedSpots = spots.reduce((acc, spot) => {
//        const { rowNo } = spot;
//        if (!acc[rowNo]) acc[rowNo] = [];
//        acc[rowNo].push(spot);
//        return acc;
//    }, {});
//
//    // Handle reservation logic
//    const handleReserve = async () => {
//        if (!spotNumber || spotNumber < 1 || spotNumber > 40) {
//            setMessage("Please enter a valid spot number between 1 and 40.");
//            return;
//        }
//
//        setIsLoading(true);
//
//        try {
//            const response = await axios.post("http://localhost:3001/reserve-spot", {
//                rowNo,
//                spot_number: parseInt(spotNumber),
//                role,
//            });
//
//            setMessage(response.data.message);
//        } catch (error) {
//            setMessage(error.response?.data.message || "Error reserving spot.");
//        } finally {
//            setIsLoading(false); 
//        }
//    };
//
//    if (loading) {
//        return (
//            <div className="text-center py-4">
//                <p className="text-gray-500 animate-pulse">Loading parking availability...</p>
//            </div>
//        );
//    }
//
//    if (error) {
//        return (
//            <div className="text-center text-red-500 py-4">
//                <p>{error}</p>
//            </div>
//        );
//    }
//
//    return (
//        <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4">
//            <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg mr-4">
//                <button
//                    onClick={handleHomeRedirect}
//                    className="mb-4 text-blue-500 hover:underline"
//                >
//                    Go to Home
//                </button>
//
//                <h2 className="text-xl font-bold mb-4">My Permits</h2>
//
//                <div className="mb-4">
//                    <input
//                        type="text"
//                        placeholder="Enter SRN"
//                        value={userId}
//                        onChange={(e) => setUserId(e.target.value)}
//                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                    />
//                    <button
//                        onClick={fetchUserPermits}
//                        className="mt-2 w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200"
//                    >
//                        Fetch Permits
//                    </button>
//                </div>
//
//                {permits.length === 0 ? (
//                    <p className="text-center text-gray-500">No permits found.</p>
//                ) : (
//                    <table className="min-w-full">
//                        <thead>
//                        <tr className="bg-gray-200">
//                            <th className="px-4 py-2 text-left">Permit Type</th>
//                            <th className="px-4 py-2 text-left">Status</th>
//                            <th className="px-4 py-2 text-left">Expiry Date</th>
//                            <th className="px-4 py-2 text-left">Actions</th>
//                        </tr>
//                        </thead>
//                        <tbody>
//                        {permits.map((permit) => (
//                            <tr key={permit.permit_id} className="border-b">
//                                <td className="px-4 py-2">{permitTypes[permit.permit_id]}</td>
//                                <td className="px-4 py-2">{permit.status}</td>
//                                <td className="px-4 py-2">{new Date(permit.expiry_date).toLocaleDateString()}</td>
//                                <td className="px-4 py-2">
//                                    <button
//                                        onClick={() => revokePermit(permit.permit_id)}
//                                        className="text-red-500 hover:underline"
//                                    >
//                                        Revoke
//                                    </button>
//                                </td>
//                            </tr>
//                        ))}
//                        </tbody>
//                    </table>
//                )}
//            </div>
//
//            <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg">
//                <h2 className="text-3xl font-bold text-center mb-8">Parking Permit</h2>
//
//                <div className="mb-4">
//                    <label htmlFor="permit-type" className="block mb-1">Select Permit Type:</label>
//                    <select
//                        id="permit-type"
//                        value={permitId}
//                        onChange={handlePermitTypeChange}
//                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                    >
//                        <option value="">Choose Permit</option>
//                        {Object.entries(permitTypes).map(([key, value]) => (
//                            <option key={key} value={key}>
//                                {value}
//                            </option>
//                        ))}
//                    </select>
//                </div>
//
//                <p className="text-gray-600">Valid from: {validFrom}</p>
//                <p className="text-gray-600">Valid for: {validFor}</p>
//
//                <button
//                    onClick={issuePermit}
//                    className="mt-4 w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200"
//                >
//                    Issue Permit
//                </button>
//
//                <h2 className="text-2xl font-bold text-center mt-8 mb-4">Reserve Parking Spot</h2>
//                <div className="mb-4">
//                    <label htmlFor="rowNo" className="block mb-1">Row No:</label>
//                    <input
//                        type="text"
//                        value={rowNo}
//                        onChange={(e) => setRow(e.target.value)}
//                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                    />
//                </div>
//                <div className="mb-4">
//                    <label htmlFor="spotNumber" className="block mb-1">Spot Number (1-40):</label>
//                    <input
//                        type="number"
//                        value={spotNumber}
//                        onChange={(e) => setSpotNumber(e.target.value)}
//                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                    />
//                </div>
//                <div className="mb-4">
//                    <label htmlFor="role" className="block mb-1">Role:</label>
//                    <select
//                        id="role"
//                        value={role}
//                        onChange={(e) => setRole(e.target.value)}
//                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                    >
//                        <option value="student">Student</option>
//                        <option value="staff">Staff</option>
//                    </select>
//                </div>
//                <button
//                    onClick={handleReserve}
//                    className="w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200"
//                    disabled={isLoading}
//                >
//                    {isLoading ? 'Reserving...' : 'Reserve Spot'}
//                </button>
//                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
//
//                <h3 className="text-xl font-bold mt-8">Available Parking Spots</h3>
//                {Object.keys(groupedSpots).map((row) => (
//                    <div key={row}>
//                        <h4 className="font-semibold">Row {row}:</h4>
//                        <div className="grid grid-cols-5 gap-2">
//                            {groupedSpots[row].map((spot) => (
//                                <div key={spot.spot_number} className={`border p-2 rounded-md ${spot.is_reserved ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
//                                    {spot.spot_number} {spot.is_reserved ? '(Reserved)' : ''}
//                                </div>
//                            ))}
//                        </div>
//                    </div>
//                ))}
//            </div>
//        </div>
//    );
//};
//
//export default PermitPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // Import the useUser hook

const PermitPage = () => {
    const { userID } = useUser(); // Access userID from context
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
        if (!userID) return; // Avoid fetching if no userID is set
        try {
            const response = await fetch(`http://localhost:3001/user-permits/${userID}`);
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
            const response = await fetch(`http://localhost:3001/issue-permit/${userID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permit_id: permitId, user_id: userID, status, valid_from: validFrom, valid_for: validFor })
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
                body: JSON.stringify({ permit_id: permitId, user_id: userID })
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
        // Fetch permits when the component mounts or when userID changes
        if (userID) {
            fetchUserPermits();
        }
    }, [userID]);

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

    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowNo, setRow] = useState("A");
    const [spotNumber, setSpotNumber] = useState("");
    const [role, setRole] = useState("student");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch available parking spots from the backend
        axios
            .get('http://localhost:3001/available-spots')
            .then((response) => {
                setSpots(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load parking availability.');
                setLoading(false);
            });
    }, []);

    // Grouping spots by row (A, B, C, D, etc.)
    const groupedSpots = spots.reduce((acc, spot) => {
        const { rowNo } = spot;
        if (!acc[rowNo]) acc[rowNo] = [];
        acc[rowNo].push(spot);
        return acc;
    }, {});

    // Handle reservation logic
    const handleReserve = async () => {
        if (!spotNumber || spotNumber < 1 || spotNumber > 40) {
            setMessage("Please enter a valid spot number between 1 and 40.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:3001/reserve-spot", {
                rowNo,
                spot_number: parseInt(spotNumber),
                role,
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data.message || "Error reserving spot.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500 animate-pulse">Loading parking availability...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-4">
                <p>{error}</p>
            </div>
        );
    }

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
                    <label htmlFor="permit-type" className="block mb-1">Select Permit Type:</label>
                    <select
                        id="permit-type"
                        value={permitId}
                        onChange={handlePermitTypeChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose Permit</option>
                        {Object.entries(permitTypes).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="text-gray-600">Valid from: {validFrom}</p>
                <p className="text-gray-600">Valid for: {validFor}</p>

                <button
                    onClick={issuePermit}
                    className="mt-4 w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200"
                >
                    Issue Permit
                </button>

                <h2 className="text-2xl font-bold text-center mt-8 mb-4">Reserve Parking Spot</h2>
                <div className="mb-4">
                    <label htmlFor="rowNo" className="block mb-1">Row No:</label>
                    <input
                        type="text"
                        value={rowNo}
                        onChange={(e) => setRow(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="spotNumber" className="block mb-1">Spot Number (1-40):</label>
                    <input
                        type="number"
                        value={spotNumber}
                        onChange={(e) => setSpotNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="block mb-1">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
                <button
                    onClick={handleReserve}
                    className="w-full bg-283D3B text-white py-2 rounded-md hover:bg-283D3B transition duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Reserving...' : 'Reserve Spot'}
                </button>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}

                <h3 className="text-xl font-bold mt-8">Available Parking Spots</h3>
                {Object.keys(groupedSpots).map((row) => (
                    <div key={row}>
                        <h4 className="font-semibold">Row {row}:</h4>
                        <div className="grid grid-cols-5 gap-2">
                            {groupedSpots[row].map((spot) => (
                                <div key={spot.spot_number} className={`border p-2 rounded-md ${spot.is_reserved ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                    {spot.spot_number} {spot.is_reserved ? '(Reserved)' : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PermitPage;
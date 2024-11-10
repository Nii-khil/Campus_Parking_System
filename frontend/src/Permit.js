import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // Import the useUser hook

const PermitPage = () => {
    const { userID } = useUser(); // Access userID from context
    const [permitId, setPermitId] = useState('');
    const [status] = useState('active');
    const [permits, setPermits] = useState([]);
    const [message, setMessage] = useState('');
    const [validFrom] = useState(new Date().toISOString().split('T')[0]);
    const [validFor, setValidFor] = useState('');

    const permitTypes = {
        '1': 'Daily Pass',
        '2': 'Weekly Pass',
        '3': 'Semester Pass',
        '4': 'Visitor Pass'
    };

    const fetchUserPermits = async () => {
        if (!userID) return;
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

            const text = await response.text();
            if (response.ok) {
                const data = JSON.parse(text);
                setMessage(data.message);
                await fetchUserPermits(); // Refresh user permits after issuing
            } else {
                const errorData = JSON.parse(text);
                setMessage('Error issuing permit: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error issuing permit:', error);
            setMessage('Error issuing permit.');
        }
    };

    useEffect(() => {
        if (userID) {
            fetchUserPermits();
        }
    }, [userID]);

    const handlePermitTypeChange = (e) => {
        const selectedPermit = e.target.value;
        setPermitId(selectedPermit);

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
    const [role, setRole] = useState("student");
    const [isLoading, setIsLoading] = useState(false);
    const [rowNo, setRow] = useState("A");
    const [spotNumber, setSpotNumber] = useState("");


    useEffect(() => {
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

    const groupedSpots = spots.reduce((acc, spot) => {
        const { rowNo } = spot;
        if (!acc[rowNo]) acc[rowNo] = [];
        acc[rowNo].push(spot);
        return acc;
    }, {});


    //const handleReserve = async () => {
    //    if (!spotNumber || spotNumber < 1 || spotNumber > 40) {
    //        setMessage("Please enter a valid spot number between 1 and 40.");
    //        return;
    //    }
    //
    //    setIsLoading(true);
    //
    //    try {
    //        const response = await axios.post("http://localhost:3001/reserve-spot", {
    //            rowNo,
    //            spot_number: parseInt(spotNumber),
    //            role,
    //        });
    //
    //        setMessage(response.data.message);
    //
    //        // After reserving the spot, fetch the updated list of parking spots
    //        const updatedSpots = await axios.get('http://localhost:3001/available-spots');
    //        setSpots(updatedSpots.data);
    //    } catch (error) {
    //        setMessage(error.response?.data.message || "Error reserving spot.");
    //    } finally {
    //        setIsLoading(false);
    //    }
    //};

    const handleReserve = async () => {
        if (!spotNumber || spotNumber < 1 || spotNumber > 40) {
            setMessage("Please enter a valid spot number between 1 and 40.");
            return;
        }

        setIsLoading(true);

        try {
            // Send userID, rowNo, and spot_number to the backend API
            const response = await axios.post("http://localhost:3001/reserve-spot", {
                rowNo,          // Row of the parking spot
                spot_number: parseInt(spotNumber),  // Spot number to reserve
                userID,         // The user ID from context
            });

            setMessage(response.data.message);

            // After reserving the spot, fetch the updated list of parking spots
            const updatedSpots = await axios.get('http://localhost:3001/available-spots');
            setSpots(updatedSpots.data);
        } catch (error) {
            setMessage(error.response?.data.message || "Error reserving spot.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleRequestAction = async () => {
        if (permitId && validFor) {
            // Issue permit if permit type is selected
            issuePermit();
            if (spotNumber && spotNumber >= 1 && spotNumber <= 40) {
                // Reserve spot if a spot number is entered
                handleReserve();
            }
        } else {
            setMessage('Please select a permit type or enter a valid spot number.');
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

    const getSpotColor = (spot) => {
        if (spot.is_available) {
            return "bg-green-600"; // Available spots in green
        }
        return "bg-gray-500"; // Unavailable spots in gray
    };

    const getSpotTooltip = (spot) => {
        return spot.is_available ? "Available" : `Occupied${spot.for_role ? ` (${spot.for_role})` : ''}`;
    };

    return (
        <section id='permit' className='mb-8'>
            <div className="bg-gray-800 shadow-lg p-6 rounded-lg">
                {/* Top Section: My Permits and Parking Permit/Spot Reservation side by side */}
                <div className="flex w-full max-w-6xl space-x-8 mb-8">
                    {/* My Permits Section */}
                    <div className="w-2/3 p-4 bg-gray-700 shadow-lg rounded-lg">
                        <h2 className="text-white text-3xl font-bold mb-4">My Permits</h2>
                        {permits.length === 0 ? (
                            <p className="text-center text-gray-500">No permits found.</p>
                        ) : (
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-800">
                                        <th className="px-4 py-2 text-left">Permit Type</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Expiry Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permits.map((permit) => (
                                        <tr key={permit.permit_id} className="border-b">
                                            <td className="px-4 py-2">{permitTypes[permit.permit_id]}</td>
                                            <td className="px-4 py-2">{permit.status}</td>
                                            <td className="px-4 py-2">{new Date(permit.expiry_date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Parking Permit/Spot Reservation Section */}
                    <div className="w-1/2 p-5 bg-gray-700 shadow-lg rounded-lg">
                        <h2 className="text-3xl font-bold text-center mb-8">Parking Permit or Spot Reservation</h2>

                        {/* Permit Selection */}
                        <div className="mb-4">
                            <label htmlFor="permit-type" className="block mb-1">Select Permit Type:</label>
                            <select
                                id="permit-type"
                                value={permitId}
                                onChange={handlePermitTypeChange}
                                className="border border-gray-600 bg-gray-700 text-gray-200 p-2 rounded w-full"
                            >
                                <option value="">Choose Permit</option>
                                {Object.entries(permitTypes).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="text-white font-bold mb-4">Valid from: {validFrom}</p>
                        <p className="text-white font-bold mb-4">Valid for: {validFor}</p>

                        {/* Spot Reservation */}
                        <div className="mb-4">
                            <label htmlFor="rowNo" className="block mb-1">Row No:</label>
                            <input
                                type="text"
                                value={rowNo}
                                onChange={(e) => setRow(e.target.value)}
                                className="border border-gray-600 bg-gray-700 text-gray-200 p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="spotNumber" className="block mb-1">Spot Number (1-40):</label>
                            <input
                                type="number"
                                value={spotNumber}
                                onChange={(e) => setSpotNumber(e.target.value)}
                                className="border border-gray-600 bg-gray-700 text-gray-200 p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block mb-1">Role:</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="border border-gray-600 bg-gray-700 text-gray-200 p-2 rounded w-full"
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        {/* Request Action Button */}
                        <button
                            onClick={handleRequestAction}
                            className={`w-full bg-blue-600 text-white p-3 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
                                }`}

                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Request Permit'}
                        </button>

                        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                    </div>
                </div>

                {/* Grouped Parking Spots Display */}
                <div className="w-full max-w-6xl mt-8">
                    <div className="grid grid-cols-4 gap-6">
                        {Object.keys(groupedSpots).map((row, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-center text-gray-200 mb-2">Row {row}</h3>
                                <ul className="grid grid-cols-5 gap-2">
                                    {groupedSpots[row].map((spot) => (
                                        <li
                                            key={spot.spot_number}
                                            className="flex justify-center items-center"
                                        >
                                            <div
                                                className={`${getSpotColor(spot)} text-white rounded-md p-2 w-10 text-center cursor-pointer transition duration-200 hover:opacity-80`}
                                                title={getSpotTooltip(spot)}
                                            >
                                                {spot.spot_number}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PermitPage;


import React, { useEffect, useState } from "react";
import axios from "axios";

function EntryExitLog() {
  const [userId, setUserId] = useState("");
  const [vehicleType, setVehicleType] = useState("2-wheeler");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [parkingSpot, setParkingSpot] = useState("");
  const [parkingHistory, setParkingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feesAmount, setFeesAmount] = useState(0.0);

  // Fetch parking history on load
  useEffect(() => {
    const fetchParkingHistory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/parkingHistory");
        setParkingHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parking history", error);
        setLoading(false);
      }
    };
    fetchParkingHistory();
  }, []);

  // Handle entry creation
  const handleEntry = async () => {
    if (!userId || !registrationNumber || !parkingSpot) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/parkingHistory/entry', {
        user_id: userId,
        vehicle_type: vehicleType,
        registration_number: registrationNumber,
        parking_spot: parkingSpot,
        fees_amount: feesAmount,
      });
      setParkingHistory((prevHistory) => [...prevHistory, response.data]);
      setUserId("");
      setRegistrationNumber("");
      setParkingSpot("");
    } catch (error) {
      console.error("Error creating entry", error);
    }
  };

  // Handle marking exit
  const handleExit = async (historyId) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/parkingHistory/${historyId}/exit`, {
        exit_time: new Date(),
        fees_paid: true,
      });
      setParkingHistory((prevHistory) =>
        prevHistory.map((entry) =>
          entry.history_id === historyId
            ? { ...entry, ...response.data }
            : entry
        )
      );
    } catch (error) {
      console.error("Error marking exit", error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-white">Parking Entry & Exit Log</h2>

      {/* Entry form */}
      <div className="bg-gray-700 p-6 mb-8 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-200">Mark New Entry</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-300">User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border border-gray-600 px-4 py-2 rounded-md w-full bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-300">Vehicle Type:</label>
            <select
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value);
                setFeesAmount(e.target.value === "2-wheeler" ? 0.0 : 30.0);
              }}
              className="border border-gray-600 px-4 py-2 rounded-md w-full bg-gray-800 text-gray-200"
            >
              <option value="2-wheeler">2-wheeler</option>
              <option value="4-wheeler">4-wheeler</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-300">Registration Number:</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="border border-gray-600 px-4 py-2 rounded-md w-full bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-300">Parking Spot:</label>
            <input
              type="text"
              value={parkingSpot}
              onChange={(e) => setParkingSpot(e.target.value)}
              className="border border-gray-600 px-4 py-2 rounded-md w-full bg-gray-800 text-gray-200"
            />
          </div>
        </div>

        <button
          onClick={handleEntry}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          Mark Entry
        </button>
      </div>

      {/* Display parking history */}
      <table className="min-w-full bg-gray-800 border border-gray-600 shadow">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-2 border border-gray-600 text-gray-300">User ID</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Vehicle Type</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Registration No.</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Parking Spot</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Entry Time</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Exit Time</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Fees</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Paid</th>
            <th className="px-4 py-2 border border-gray-600 text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parkingHistory.map((entry) => (
            <tr key={entry.history_id} className="hover:bg-gray-600">
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{entry.user_id}</td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{entry.vehicle_type}</td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{entry.registration_number}</td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{entry.parking_spot}</td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">
                {new Date(entry.entry_time).toLocaleString()}
              </td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">
                {entry.exit_time ? new Date(entry.exit_time).toLocaleString() : "N/A"}
              </td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">₹{entry.fees_amount}</td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">{entry.fees_paid ? "Yes" : "No"}</td>
              <td className="px-4 py-2 border border-gray-600 text-gray-200 text-center">
                {!entry.exit_time && (
                  <button
                    onClick={() => handleExit(entry.history_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-1 rounded-md"
                  >
                    Mark Exit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EntryExitLog;

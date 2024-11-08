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
  }, [parkingHistory]);

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
      setUserId(userId);
      setRegistrationNumber(registrationNumber);
      setParkingSpot(parkingSpot);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Parking Entry & Exit Log</h2>

      {/* Entry form */}
      <div className="mb-6">
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border px-4 py-2 mb-2 block w-full"
        />

        <label>Vehicle Type:</label>
        <select
          value={vehicleType}
          onChange={(e) => {
            setVehicleType(e.target.value);
            setFeesAmount(e.target.value === "2-wheeler" ? 0.0 : 30.0);
          }}
          className="border px-4 py-2 mb-2 block w-full"
        >
          <option value="2-wheeler">2-wheeler</option>
          <option value="4-wheeler">4-wheeler</option>
        </select>

        <label>Registration Number:</label>
        <input
          type="text"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          className="border px-4 py-2 mb-2 block w-full"
        />

        <label>Parking Spot:</label>
        <input
          type="text"
          value={parkingSpot}
          onChange={(e) => setParkingSpot(e.target.value)}
          className="border px-4 py-2 mb-4 block w-full"
        />

        <button
          onClick={handleEntry}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Mark Entry
        </button>
      </div>

      {/* Display parking history */}
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">History ID</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Vehicle Type</th>
            <th className="border px-4 py-2">Registration No.</th>
            <th className="border px-4 py-2">Parking Spot</th>
            <th className="border px-4 py-2">Entry Time</th>
            <th className="border px-4 py-2">Exit Time</th>
            <th className="border px-4 py-2">Fees</th>
            <th className="border px-4 py-2">Paid</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parkingHistory.map((entry) => (
            <tr key={entry.history_id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{entry.history_id}</td>
              <td className="border px-4 py-2">{entry.user_id}</td>
              <td className="border px-4 py-2">{entry.vehicle_type}</td>
              <td className="border px-4 py-2">{entry.registration_number}</td>
              <td className="border px-4 py-2">{entry.parking_spot}</td>
              <td className="border px-4 py-2">{new Date(entry.entry_time).toLocaleString()}</td>
              <td className="border px-4 py-2">
                {entry.exit_time ? new Date(entry.exit_time).toLocaleString() : "N/A"}
              </td>
              <td className="border px-4 py-2">₹{entry.fees_amount}</td>
              <td className="border px-4 py-2">{entry.fees_paid ? "Yes" : "No"}</td>
              <td className="border px-4 py-2">
                {!entry.exit_time && (
                  <button
                    onClick={() => handleExit(entry.history_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

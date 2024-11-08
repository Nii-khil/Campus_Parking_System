import React, { useState } from "react";
import axios from "axios";
import map from "./images/map.png";
import { useUser } from "./UserContext";

const ReserveSpot = () => {
  const [rowNo, setRow] = useState("A");
  const [spotNumber, setSpotNumber] = useState("");
  // const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userID } = useUser();

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
        userID
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "Error reserving spot.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <section id="reservation" className="mb-8">
      <h2 className="text-283D3B text-2xl font-bold mb-4">Reserve a Spot</h2>

      <div className="bg-white shadow p-6 rounded-lg">
        <p className="text-772E25 mb-4">
          Use the map below to find a parking spot and enter the details.
        </p>

        {/* Parking Lot Visual Map */}
        <div className="mb-4">
          <img src={map} alt="Parking Lot Map" className="w-1/2 h-90 rounded-lg shadow-md"/>
        </div>
        <p className="text-772E25 mb-4">
          Reserve a parking spot in advance. Select a row and enter a spot
          number.
        </p>

        {/* Row Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Row:</label>
          <select
            className="border border-gray-300 p-2 rounded w-full"
            value={rowNo}
            onChange={(e) => setRow(e.target.value)}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        {/* Spot Number Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Enter Spot Number (1-40):
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={spotNumber}
            onChange={(e) => setSpotNumber(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Enter a number between 1 and 40"
          />
        </div>

        {/* Role Selection */}
        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Role:</label>
          <select
            className="border border-gray-300 p-2 rounded w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div> */}

        {/* Reserve Button */}
        <button
          onClick={handleReserve}
          className={`w-full bg-283D3B text-white p-3 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Reserving..." : "Reserve Spot"}
        </button>

        {/* Reservation Message */}
        {message && (
          <p className="mt-4 text-center text-red-500 font-semibold">
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default ReserveSpot;

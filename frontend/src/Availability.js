import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Availability = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Group spots by row
  const groupedSpots = spots.reduce((acc, spot) => {
    const { rowNo } = spot;
    if (!acc[rowNo]) acc[rowNo] = [];
    acc[rowNo].push(spot);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-300 animate-pulse">Loading parking availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-4">
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
    <section id="availability" className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4">Parking Availability</h2>
      <div className="bg-gray-800 shadow-lg p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">Real-time updates on parking spots.</p>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-300">Occupied</span>
            </div>
          </div>
        </div>
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
    </section>
  );
};

export default Availability;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// const ParkingAvailability = () => {
//   const [spots, setSpots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     // Fetch available parking spots from the backend
//     axios
//       .get('http://localhost:3001/available-spots')
//       .then((response) => {
//         setSpots(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError('Failed to load parking availability.');
//         setLoading(false);
//       });
//   }, []);
//
//   // Grouping spots by row (A, B, C, D, etc.)
//   const groupedSpots = spots.reduce((acc, spot) => {
//     const { rowNo } = spot;
//     if (!acc[rowNo]) acc[rowNo] = [];
//     acc[rowNo].push(spot);
//     return acc;
//   }, {});
//
//   if (loading) {
//     return (
//       <div className="text-center py-4">
//         <p className="text-gray-500 animate-pulse">Loading parking availability...</p>
//       </div>
//     );
//   }
//
//   if (error) {
//     return (
//       <div className="text-center text-red-500 py-4">
//         <p>{error}</p>
//       </div>
//     );
//   }
//
//   return (
//     <section id="availability" className="mb-8">
//       <h2 className="text-283D3B text-2xl font-bold mb-4">Parking Availability</h2>
//       <div className="bg-white shadow p-6 rounded-lg">
//         <p className="text-772E25 mb-4">Real-time updates on available parking spots.</p>
//
//         <div className="grid grid-cols-4 gap-8">
//           {Object.keys(groupedSpots).map((row, index) => (
//             <div key={index} className="bg-gray-100 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold mb-2">Row {row}</h3>
//               <ul className="space-y-1">
//                 {groupedSpots[row].map((spot) => (
//                   <li key={spot.spot_number} className="text-gray-700">
//                     Spot {spot.spot_number}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
//
// export default ParkingAvailability;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Availability = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch available parking spots from the backend
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

  // grouping spots by row (A, B, C, D, etc.)
  const groupedSpots = spots.reduce((acc, spot) => {
    const { rowNo } = spot;
    if (!acc[rowNo]) acc[rowNo] = [];
    acc[rowNo].push(spot);
    return acc;
  }, {});

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
      <section id="availability" className="mb-8">
        <h2 className="text-283D3B text-2xl font-bold mb-4">Parking Availability</h2>
        <div className="bg-white shadow p-6 rounded-lg">
          <p className="text-772E25 mb-4">Real-time updates on available parking spots.</p>

          <div className="grid grid-cols-4 gap-8">
            {Object.keys(groupedSpots).map((row, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Row {row}</h3>
                  <ul className="space-y-1">
                    {groupedSpots[row].map((spot) => (
                        <li key={spot.spot_number} className="text-gray-700">
                          Spot {spot.spot_number}
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
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ParkingViolation = () => {
//   const [violations, setViolations] = useState([]);

//   // Fetch violations when the component mounts
//   useEffect(() => {
//     const fetchViolations = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/parking_violations');
//         setViolations(response.data);
//       } catch (error) {
//         console.error("Error fetching parking violations:", error);
//       }
//     };

//     fetchViolations();
//   }, []);

//   return (
//     <section id="violation" className="mb-8">
//       <h2 className="text-283D3B text-2xl font-bold mb-4">Your Parking Violations</h2>
//       <div className="bg-white shadow p-6 rounded-lg">
//         {violations.length > 0 ? (
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 border">Violation ID</th>
//                 <th className="px-4 py-2 border">Type of Violation</th>
//                 <th className="px-4 py-2 border">Fine Amount</th>
//                 <th className="px-4 py-2 border">Fine Paid</th>
//               </tr>
//             </thead>
//             <tbody>
//               {violations.map((violation) => (
//                 <tr key={violation.violation_id}>
//                   <td className="px-4 py-2 border">{violation.violation_id}</td>
//                   <td className="px-4 py-2 border">{violation.type_of_violation}</td>
//                   <td className="px-4 py-2 border">${violation.fine_amount}</td>
//                   <td className="px-4 py-2 border">
//                     {violation.fine_paid ? "Yes" : "No"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-772E25">No parking violations found.</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ParkingViolation;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext"; // Import the custom hook

const ParkingViolation = () => {
  const [violations, setViolations] = useState([]);
  const { userID } = useUser(); // Access userID from context

  useEffect(() => {
    const fetchViolations = async () => {
      if (!userID) {
        console.error("User ID not found");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/parking_violations?userID=${userID}`);
        setViolations(response.data);
      } catch (error) {
        console.error("Error fetching parking violations:", error);
      }
    };

    fetchViolations();
  }, [userID]); // dependency on userID to refetch if it changes

  return (
    <section id="violation" className="mb-8">
      <h2 className="text-283D3B text-2xl font-bold mb-4">Your Parking Violations</h2>
      <div className="bg-white shadow p-6 rounded-lg">
        {violations.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Violation ID</th>
                <th className="px-4 py-2 border">Type of Violation</th>
                <th className="px-4 py-2 border">Fine Amount</th>
                <th className="px-4 py-2 border">Fine Paid</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((violation) => (
                <tr key={violation.violation_id}>
                  <td className="px-4 py-2 border">{violation.violation_id}</td>
                  <td className="px-4 py-2 border">{violation.type_of_violation}</td>
                  <td className="px-4 py-2 border">${violation.fine_amount}</td>
                  <td className="px-4 py-2 border">
                    {violation.fine_paid ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-772E25">No parking violations found.</p>
        )}
      </div>
    </section>
  );
};

export default ParkingViolation;

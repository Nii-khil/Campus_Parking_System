const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// database connection setup
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '@SQLpik286#',
  database: 'campus_parking',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL.');
  }
});

// user Signup Endpoint

app.post('/signup', (req, res) => {
  console.log('Received signup request:', req.body);
  const { ID, email, password, userType, firstName, lastName, semester, section, department } = req.body;

  // insert into users table
  const query = 'INSERT INTO users (ID, email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [ID, email, password, userType, firstName, lastName], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user.', error: err });
    }

    let specificQuery;
    let specificParams;

    // prepare specificQuery and specificParams based on userType
    if (userType === 'student') {
      specificQuery = 'INSERT INTO student (SRN, first_name, last_name, semester, section, department_name) VALUES (?, ?, ?, ?, ?, ?)';
      specificParams = [ID, firstName, lastName, semester, section, department];

    } else if (userType === 'staff') {
      specificQuery = 'INSERT INTO staff (ID, first_name, last_name, department_name) VALUES (?, ?, ?, ?)';
      specificParams = [ID, firstName, lastName, department];

    } else if (userType === 'admin') {
      specificQuery = 'INSERT INTO admin (ID, first_name, last_name) VALUES (?, ?, ?)';
      specificParams = [ID, firstName, lastName];

    } else {
      return res.status(400).json({ message: 'Invalid user type.' });
    }
    // insert into the specific table (student, staff, or admin)
    
    db.query(specificQuery, specificParams, (err, result) => {
      if (err) {
        console.error('Error in student table insertion:', err); // Log the detailed error

        // Handle specific error cases
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: `Invalid department reference. Please ensure the department "${department}" exists.`, 
            error: err.message 
          });
        }
        if (err.code === 'ER_BAD_NULL_ERROR') {
          return res.status(400).json({ 
            message: 'Missing required field', 
            error: err.message 
          });
        }
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ 
            message: 'This ID/SRN is already in use', 
            error: err.message 
          });
        }
        
        return res.status(500).json({ 
          message: `Error adding ${userType} entry.`, 
          error: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage
        });
      }
      res.status(201).json({ message: `${userType} registered successfully.` });
    });
  });
});

app.post('/login', (req, res) => {
  const { userID, password } = req.body;
  console.log(req.body)

  const query = 'SELECT * FROM users WHERE ID = ? AND password = ?';
  db.query(query, [userID, password], (err, results) => {
    console.log(results)
    if (err) {
      res.status(500).json({ message: 'Error logging in.', error: err });
    } else if (results.length > 0) {
      const user = results[0];
      res.status(200).json({
        message: 'Login successful.',
        user: { id: user.ID, email: user.email, role: user.role } // Include user role
      });
    } else {
      res.status(401).json({ message: 'Invalid userID or password.' });
    }
  });
});

// reserve a parking spot
app.post('/reserve-spot', (req, res) => {
  const { rowNo, spot_number, userID } = req.body;
  
  console.log('Received request:', { rowNo, spot_number, userID });

  const checkUserReservationQuery = `
    SELECT * 
    FROM parking 
    WHERE reserved_by = ?;
  `;

  const checkAvailabilityQuery = `
    SELECT is_available 
    FROM parking 
    WHERE rowNo = ? AND spot_number = ?;
  `;

  db.query(checkUserReservationQuery, [userID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User has already reserved a spot.' });
    }

    // Check if the requested spot is available
    const checkAvailabilityQuery = `
      SELECT is_available 
      FROM parking 
      WHERE rowNo = ? AND spot_number = ?;
    `;

    db.query(checkAvailabilityQuery, [rowNo, spot_number], (err, results) => {
      if (err) { 
        console.error(err);
        return res.status(500).json({ message: 'Database error.' });
      }

      if (results.length === 0 || !results[0].is_available) {
        return res.status(400).json({ message: 'Spot not available.' });
      }

      // Reserve the spot by updating `is_available` and `reserved_by`
      const reserveSpotQuery = `
        UPDATE parking 
        SET is_available = false, reserved_by = ?
        WHERE rowNo = ? AND spot_number = ?;
      `;

      db.query(reserveSpotQuery, [userID, rowNo, spot_number], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error reserving spot.' });
        }
        res.status(200).json({ message: 'Spot reserved successfully.' });
      });
    });
  });
});

app.get('/available-spots', (req, res) => {
  const query = 'SELECT rowNo, spot_number, is_available FROM parking';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching available spots.', error: err });
    }
    res.status(200).json(results);
  });
});

app.get('/user-permits/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query to fetch permits for the specified user
  const query = `
        SELECT pp.permit_id, pp.user_id, pp.issue_date, pp.expiry_date, pp.status, pt.permit_name
        FROM parking_permit pp
        JOIN permit_type pt ON pp.permit_id = pt.permit_id
        WHERE pp.user_id = ? AND pp.status = 'active'
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching permits:', err);
      return res.status(500).json({ message: 'Error fetching permits.', error: err });
    }

    res.status(200).json(results); // Send the permit data back as JSON
  });
});

app.post('/issue-permit/:userId', (req, res) => {
  const userId = req.params.userId
  const { permit_id, status, valid_from, valid_for } = req.body;

  // Get the number of days from valid_for
  let days = parseInt(valid_for.split(' ')[0]); // Assuming valid_for is like "30 days"

  // Call the stored procedure to calculate expiry date
  const callQuery = 'CALL CalculateExpiryDate(?, ?, @expiryDate);';

  db.query(callQuery, [valid_from, days], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error calculating expiry date.', error: err });
    }

    // Now retrieve the expiry date
    const selectQuery = 'SELECT @expiryDate AS expiryDate;';

    db.query(selectQuery, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving expiry date.', error: err });
      }

      // Get the expiry date from the results
      const expiryDate = results[0].expiryDate;

      // Insert the permit with the calculated expiry date
      const insertQuery = 'INSERT INTO parking_permit (permit_id, userID, issue_date, expiry_date, status) VALUES (?, ?, NOW(), ?, ?)';
      db.query(insertQuery, [permit_id, user_id, expiryDate, status], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error issuing permit.', error: err });
        }
        res.status(201).json({ message: 'Permit issued successfully.' });
      });
    });
  });
});


// Revoke a permit
app.put('/revoke-permit', (req, res) => {
  const { permit_id, user_id } = req.body;

  const query = `
    UPDATE parking_permit
    SET status = 'revoked'
    WHERE permit_id = ? AND user_id = ?`;

  db.query(query, [permit_id, user_id], (err, result) => {
    if (err) {
      console.error('Error revoking permit:', err);
      return res.status(500).json({ message: 'Error revoking permit.' });
    }
    res.status(200).json({ message: 'Permit revoked successfully.' });
  });
});

app.post('/add-violation', (req, res) => {
  console.log(req.body);
  const { user_id, type_of_violation, fine_amount } = req.body;

  // Generate a unique violation_id, e.g., by concatenating a timestamp with user_id
  const timestamp = Date.now().toString().slice(0, 9);
  const violation_id = `V-${timestamp}-${user_id}`;

  // const violation_id = `V-${Date.now()}-${user_id}`;
  const fine_paid = false; // default to unpaid

  const query = `
    INSERT INTO parking_violation (violation_id, user_id, type_of_violation, fine_amount, fine_paid)
    VALUES (?, ?, ?, ?, ?);
  `;

  db.query(query, [violation_id, user_id, type_of_violation, fine_amount, fine_paid], (err, result) => {
    if (err) {
      console.error('Error adding violation:', err);
      return res.status(500).json({ message: 'Error adding violation.', error: err });
    }
    res.status(201).json({ message: 'Violation added successfully.', violation_id });
  });
});

app.get('/view-violations/:userId', (req, res) => {
  console.log(req.params);
  const userId = req.params.userId;

  // Construct the SQL query using 'user_id' as the key to fetch violations
  const selectViolationsQuery = `
    SELECT 
      CONCAT(users.first_name, ' ', users.last_name) AS user_name,
      parking_violation.violation_id,
      parking_violation.type_of_violation,
      parking_violation.fine_amount,
      parking_violation.fine_paid
    FROM 
      users
    JOIN 
      parking_violation 
    ON 
      users.ID = parking_violation.user_id
    WHERE 
      users.ID = ? AND parking_violation.fine_paid = 0;
  `;

  db.query(selectViolationsQuery, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching violations.', error: err });
    }

    const formattedResults = results.map(violation => ({
      user_name: violation.user_name,
      type_of_violation: violation.type_of_violation,
      fine_amount: violation.fine_amount,
      fine_paid: violation.fine_paid ? 'YES' : 'NO' // Convert boolean to YES/NO
    }));

    // res.status(200).json(formattedResults);
    res.status(200).json({
      violation_id: results.map(violation => violation.violation_id),
      violations: formattedResults
    });
  });
});


app.put('/mark-fee-paid/:violationId', async (req, res) => {
  const violationId = req.params.violationId;

  try {
    // Assuming you're using an ORM or direct SQL query
    await ViolationModel.update(
      { fine_paid: 'YES' }, // Update the fees_paid field to "YES"
      { where: { id: violationId } } // Specify which record to update
    );

    res.status(200).json({ message: "Fees marked as paid successfully" });
  } catch (error) {
    console.error("Error updating fees_paid:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
 
// app.put("/mark-fees-paid/:violationId", (req, res) => {
//   const violationId = req.params.violationId;
//   const query = `UPDATE parking_violation SET fine_paid = '1' WHERE violation_id = ?`;

//   db.query(query, [violationId], (error, results) => {
//     if (error) {
//       console.error("Error updating fees status:", error);
//       return res.status(500).json({ message: "Error updating fees status" });
//     }
//     res.status(200).json({ message: "Fees marked as paid successfully" });
//   });
// });

app.put("/mark-fees-paid/:violationId", (req, res) => {
  const violationId = req.params.violationId;
  console.log("Received violationId:", violationId); // Add this log
  const query = `UPDATE parking_violation SET fine_paid = 1 WHERE violation_id = ?`;
  db.query(query, [violationId], (error, results) => {
    if (error) {
      console.error("Error updating fees status:", error);
      return res.status(500).json({ message: "Error updating fees status" });
    }
    console.log("Database update result:", results); // Add this log
    res.status(200).json({ message: "Fees marked as paid successfully" });
  });
});

app.get('/parking_violations/:userId', (req, res) => {
  const userID = req.params.userId; // Assuming you have user authentication middleware that adds the user ID to `req.user`
  // SQL query to get violations based on the user ID
  
  const query = 'SELECT violation_id, type_of_violation, fine_amount, fine_paid FROM parking_violation WHERE user_id = ?';
  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching parking violations:", err);
      return res.status(500).json({ message: 'Error retrieving violations', error: err });
    }

    // Send the violations as JSON
    res.json(results);
  });
});

// Endpoint to fetch aggregate summary data for a user
app.get('/parking_violations/summary/:userId', (req, res) => {
  const userID = req.params.userId;

  const summaryQuery = `
    SELECT 
      COUNT(*) AS total_violations,
      SUM(CASE WHEN fine_paid = 1 THEN 1 ELSE 0 END) AS paid_violations,
      SUM(CASE WHEN fine_paid = 0 THEN 1 ELSE 0 END) AS unpaid_violations,
      SUM(fine_amount) AS total_fines_collected
    FROM parking_violation
    WHERE user_id = ?;
  `;

  db.query(summaryQuery, [userID, userID], (err, results) => {
    if (err) {
      console.error("Error fetching parking violations summary:", err);
      return res.status(500).json({ message: 'Error retrieving violations summary', error: err });
    }

    res.json(results[0]);
  });
});

app.get('/api/parkingHistory', (req, res) => {
  const query = 'SELECT * FROM parking_history';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching parking history:', err);
      return res.status(500).json({ message: 'Error retrieving parking history', error: err });
    }

    res.json(results);
  });
});

// Endpoint to create a parking entry
// app.post('/api/parkingHistory/entry', (req, res) => {

//   const { user_id, vehicle_type, registration_number, parking_spot } = req.body;
//   const history_id = uuidv4().slice(0, 25); // Generate a unique history_id less than 25 chars
//   const fees_amount = vehicle_type === '4-wheeler' ? 30.0 : 0.0; // Set fees based on vehicle type
//   const entry_time = new Date()

//   // SQL query to insert a new entry in parking history
//   const query = `
//     INSERT INTO parking_history (history_id, user_id, vehicle_type, registration_number, parking_spot, entry_time, fees_amount, fees_paid)
//     VALUES (?, ?, ?, ?, ?, ?, ?, false)
//   `;

//   db.query(query, [history_id, user_id, vehicle_type, registration_number, parking_spot, entry_time, fees_amount], (err, result) => {
//     if (err) {
//       console.error('Error creating parking entry:', err);
//       return res.status(500).json({ message: 'Failed to create entry', error: err });
//     }

//     res.status(201).json({ message: 'Entry created successfully', entry: result });
//   });
// });

// In the backend API code
app.post('/api/parkingHistory/entry', (req, res) => {
  const { user_id, vehicle_type, registration_number } = req.body;
  const history_id = uuidv4().slice(0, 25);
  const fees_amount = vehicle_type === '4-wheeler' ? 30.0 : 0.0;
  const entry_time = new Date();

  // Query to get the parking spot assigned to the user
  const getParkingSpotQuery = `
    SELECT rowNo, spot_number FROM parking WHERE reserved_by = ? AND is_available = false
  `;

  db.query(getParkingSpotQuery, [user_id], (err, result) => {
    if (err) {
      console.error('Error retrieving parking spot:', err);
      return res.status(500).json({ message: 'Failed to retrieve parking spot', error: err });
    }
    
    if (result.length === 0) {
      return res.status(400).json({ message: 'No assigned parking spot found for this user' });
    }

    const rowNo = result[0].rowNo;
    const spot_number = result[0].spot_number;
    const parking_spot = `${rowNo}${spot_number}`;
    // const parking_spot = result[0].spot_number;
    console.log(parking_spot);

    // Query to insert a new entry in parking_history
    const createEntryQuery = `
      INSERT INTO parking_history (history_id, user_id, vehicle_type, registration_number, parking_spot, entry_time, fees_amount, fees_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?, false)
    `;

    db.query(createEntryQuery, [history_id, user_id, vehicle_type, registration_number, parking_spot, entry_time, fees_amount], (err, result) => {
      if (err) {
        console.error('Error creating parking entry:', err);
        return res.status(500).json({ message: 'Failed to create entry', error: err });
      }

      res.status(201).json({ message: 'Entry created successfully', entry: result });
    });
  });
});


// Endpoint to mark exit for a parking entry
// app.put('/api/parkingHistory/:historyId/exit', (req, res) => {
//   const { historyId } = req.params;
//   const exit_time = new Date()

//   // SQL query to update exit time and set fees_paid to true
//   const query = `
//     UPDATE parking_history
//     SET exit_time = ?, fees_paid = true
//     WHERE history_id = ?
//   `;

//   db.query(query, [exit_time, historyId], (err, result) => {
//     if (err) {
//       console.error('Error marking exit:', err);
//       return res.status(500).json({ message: 'Failed to mark exit', error: err });
//     }
    
//     const clearReservationQuery = `
//       UPDATE parking
//       SET reserved_by = NULL, is_available = true
//       WHERE spot_number = ?
//     `;

//     db.query(clearReservationQuery, [parking_spot], (err, clearResult) => {
//       if (err) {
//         console.error('Error clearing reservation:', err);
//         return res.status(500).json({ message: 'Failed to clear parking reservation', error: err });
//       }

//       res.json({ message: 'Exit marked successfully and reservation cleared', updatedEntry: updateResult });
//     });
//   });
// });

app.put('/api/parkingHistory/:historyId/exit', (req, res) => {
  const { historyId } = req.params;
  const exit_time = new Date();

  // First, retrieve the user ID and parking spot information related to this history entry
  const getParkingSpotQuery = `
    SELECT user_id, parking_spot
    FROM parking_history
    WHERE history_id = ?
  `;

  db.query(getParkingSpotQuery, [historyId], (err, result) => {
    if (err) {
      console.error('Error fetching parking spot info:', err);
      return res.status(500).json({ message: 'Failed to mark exit', error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No matching entry found for this history ID.' });
    }

    const { user_id, parking_spot } = result[0];
    console.log('Retrieved parking_spot:', parking_spot);

    // Update the exit time and fees_paid in the parking_history table
    const updateExitQuery = `
      UPDATE parking_history
      SET exit_time = ?, fees_paid = true
      WHERE history_id = ?
    `;

    db.query(updateExitQuery, [exit_time, historyId], (err, updateResult) => {
      if (err) {
        console.error('Error updating exit time:', err);
        return res.status(500).json({ message: 'Failed to mark exit', error: err });
      }

      // Set reserved_by to NULL in the parking table for the released spot
      const clearReservationQuery = `
        UPDATE parking
        SET reserved_by = NULL, is_available = true
        WHERE rowNo = ? AND spot_number = ?
      `;

      console.log('Executing clear reservation query with spot:', parking_spot); // Debug log

      db.query(clearReservationQuery, [parking_spot[0], parking_spot.slice(1)], (err, clearResult) => {
        if (err) {
          console.error('Error clearing reservation:', err);
          return res.status(500).json({ message: 'Failed to clear parking reservation', error: err });
        }

        console.log('Clear reservation result:', clearResult); // Debug log

        res.json({ 
          message: 'Exit marked successfully and reservation cleared', 
          updatedEntry: updateResult,
          clearedSpot: parking_spot
        });
      });
    });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
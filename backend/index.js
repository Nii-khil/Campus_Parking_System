const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection Setup
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
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

// User Signup Endpoint

app.post('/signup', (req, res) => {
  const { ID, email, password, userType, firstName, lastName, semester, section, department } = req.body;

  const query = 'CALL RegisterUser(?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [ID, email, password, userType, firstName, lastName, semester, section, department], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error registering user.', error: err });
    }
    res.status(201).json({ message: `${userType} registered successfully.` });
  });
});

// User Login Endpoint

app.post('/login', (req, res) => {
  const { userID, password } = req.body;

  const query = 'SELECT validate_login(?, ?) AS user_info';
  db.query(query, [userID, password], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error logging in.', error: err });
    } else if (results.length > 0 && results[0].user_info) {
      const user = results[0].user_info;
      res.status(200).json({
        message: 'Login successful.',
        user: { id: user.id, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: 'Invalid userID or password.' });
    }
  });
});

// Spot Reservation ndpoint

app.post('/reserve-spot', (req, res) => {
  const { rowNo, spot_number, userID } = req.body;
  console.log(req.body)

  const query = 'CALL ReserveParkingSpot(?, ?, ?)';

  db.query(query, [userID, rowNo, spot_number], (err, results) => {
    if (err) {
      console.error('Error reserving spot:', err.message);
      return res.status(400).json({ message: err.message });
    }

    res.status(200).json({ message: 'Spot reserved successfully.' });
  });
});

// Available Spots Endpoint

app.get('/available-spots', (req, res) => {
  const query = 'SELECT rowNo, spot_number, is_available FROM parking';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching available spots.', error: err });
    }
    res.status(200).json(results);
  });
});

// User Permits

app.get('/user-permits/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query to fetch permits for the specified user
  const query = `
        SELECT pp.permit_id, pp.user_id, pp.issue_date, pp.expiry_date, pp.status, pt.permit_name
        FROM parking_permit pp
        JOIN permit_type pt ON pp.permit_id = pt.permit_id
        WHERE pp.user_id = ?
    `;

  db.query(query, [userId], (err, results) => {
    console.log(results)
    if (err) {
      console.error('Error fetching permits:', err);
      return res.status(500).json({ message: 'Error fetching permits.', error: err });
    }

    res.status(200).json(results); // Send the permit data back as JSON
  });
});

// Issue Permit

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
      const insertQuery = 'INSERT INTO parking_permit (permit_id, user_id, issue_date, expiry_date, status) VALUES (?, ?, NOW(), ?, ?)';
      db.query(insertQuery, [permit_id, userId, expiryDate, status], (err, result) => {
        if (err) {
          console.log(err)
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

app.put('/renew-permit/:userId', (req, res) => {
  const { permit_id, user_id } = req.body;
  console.log(req.body)

  // Determine the number of days based on the permit_id
  let days;
  switch (permit_id) {
    case 1: // Daily
      days = 1;
      break;
    case 2: // Weekly
      days = 7;
      break;
    case 3: // Semester
      days = 180;
      break;
    case 4: // Visitor
      days = 1;
      break;
    default:
      return res.status(400).json({ message: 'Invalid permit ID' });
  }

  // Call the stored procedure to calculate expiry date based on permit_id
  const callQuery = 'CALL CalculateExpiryDate(?, ?, @expiryDate);';
  const validFrom = new Date().toISOString().slice(0, 19).replace('T', ' ');
  db.query(callQuery, [validFrom, days], (err) => {  // Use current date for 'valid_from'
    if (err) {
      console.log(err)
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

      // Update the permit status and expiry date
      const updateQuery = `
        UPDATE parking_permit
        SET status = 'active', expiry_date = ?
        WHERE permit_id = ? AND user_id = ? AND status = 'expired'`;

      db.query(updateQuery, [expiryDate, permit_id, user_id], (err, result) => {
        if (err) {
          console.error('Error renewing permit:', err);
          return res.status(500).json({ message: 'Error renewing permit.' });
        }

        // If no rows were affected, the permit might not have been expired or doesn't exist
        if (result.affectedRows === 0) {
          return res.status(400).json({ message: 'Permit could not be renewed. Ensure it is expired and exists.' });
        }

        // Successfully renewed the permit
        res.status(200).json({ message: 'Permit renewed successfully.', expiryDate });
      });
    });
  });
});

app.post('/add-violation', (req, res) => {
  console.log(req.body);
  const { user_id, type_of_violation, fine_amount } = req.body;
  const timestamp = Date.now().toString().slice(0, 9);
  const violation_id = `V-${timestamp}-${user_id}`; // generating a unique violation_id by concatenating a timestamp with user_id
  const fine_paid = false;

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

// View Violations For User Endpoint

app.get('/view-violations/:userId', (req, res) => {
  const userId = req.params.userId;

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
      fine_paid: violation.fine_paid ? 'YES' : 'NO' // converting boolean to YES/NO
    }));

    res.status(200).json({
      violation_id: results.map(violation => violation.violation_id),
      violations: formattedResults
    });
  });
});

// Mark Fees Paid Endpoint

app.put("/mark-fees-paid/:violationId", (req, res) => {
  const violationId = req.params.violationId;

  const query = `UPDATE parking_violation SET fine_paid = 1 WHERE violation_id = ?`;

  db.query(query, [violationId], (error, results) => {
    if (error) {
      console.error("Error updating fees status:", error);
      return res.status(500).json({ message: "Error updating fees status" });
    }
    res.status(200).json({ message: "Fees marked as paid successfully" });
  });
});

// Get Parking Violations Endpoint

app.get('/parking_violations/:userId', (req, res) => {
  const userID = req.params.userId;

  const query = 'SELECT violation_id, type_of_violation, fine_amount, fine_paid FROM parking_violation WHERE user_id = ?';

  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching parking violations:", err);
      return res.status(500).json({ message: 'Error retrieving violations', error: err });
    }
    res.json(results);
  });
});

// Get Parking Violations Summary

app.get('/parking_violations/summary/:userId', (req, res) => {
  const userID = req.params.userId;

  const procedureCall = `CALL GetUserViolationSummary(?)`;

  db.query(procedureCall, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching parking violations summary:", err);
      return res.status(500).json({ message: 'Error retrieving violations summary', error: err });
    }
    res.json(results[0][0]);  // since stored procedures in MySQL return an array of arrays, use results[0][0]
  });
});

// Get Parking History

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

// Add Parking History (Entry)

app.post('/api/parkingHistory/entry', (req, res) => {
  const { user_id, vehicle_type, registration_number } = req.body;
  const history_id = uuidv4().slice(0, 25);
  const fees_amount = vehicle_type === '4-wheeler' ? 30.0 : 0.0;
  const entry_time = new Date();

  // query to get the parking spot assigned to the user
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

// Mark Parking History (Exit)

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

      db.query(clearReservationQuery, [parking_spot[0], parking_spot.slice(1)], (err, clearResult) => {
        if (err) {
          console.error('Error clearing reservation:', err);
          return res.status(500).json({ message: 'Failed to clear parking reservation', error: err });
        }

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

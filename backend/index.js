// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '@SQLpik286#',
//   database: 'campus_parking',
//   port: 3306
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.message);
//   } else {
//     console.log('Connected to MySQL.');
//   }
// });

// // user Signup Endpoint
// app.post('/signup', (req, res) => {
//   console.log(req.body)
//   const { ID, email, password, userType } = req.body;

//   const query = 'INSERT INTO users (ID, email, password, role) VALUES (?, ?, ?, ?)';
//   db.query(query, [ID, email, password, userType], (err, result) => {
//     if (err) {
//       res.status(500).json({ message: 'Error registering user.', error: err });
//     }
//     let specificQuery;
//     if (userType === 'student') {
//       specificQuery = 'INSERT INTO students (SRN) VALUES (?)';
//     } else if (userType === 'staff') {
//       specificQuery = 'INSERT INTO staff (ID) VALUES (?)';
//     } else if (userType === 'admin') {
//       specificQuery = 'INSERT INTO admin (ID) VALUES (?, ?)';
//     } else {
//       return res.status(400).json({ message: 'Invalid user type.' });
//     }

//     // Execute the specific query for either student or staff
//     db.query(specificQuery, [ID], (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: `Error adding ${userType} entry.`, error: err });
//       }
//       res.status(201).json({ message: `${userType} registered successfully.` });
//     });
//   });
// });

// // user Login Endpoint
// app.post('/login', (req, res) => {
//   console.log(req.body)
//   const { email, password } = req.body;

//   const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
//   db.query(query, [email, password], (err, results) => {
//     if (err) {
//       res.status(500).json({ message: 'Error logging in.', error: err });
//     } else if (results.length > 0) {
//       res.status(200).json({ message: 'Login successful.', user: results[0] });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password.' });
//     }
//   });
// });

// // Reserve a parking spot
// app.post('/reserve-spot', (req, res) => {
//   const { rowNo, spot_number, role } = req.body;
//   console.log('Received request:', { rowNo, spot_number, role });

//   const checkAvailabilityQuery = `
//     SELECT is_available 
//     FROM parking 
//     WHERE rowNo = ? AND spot_number = ? AND (for_role IS NULL OR for_role = ?);
//   `;

//   db.query(checkAvailabilityQuery, [rowNo, spot_number, role], (err, results) => {
//     if (err) {
//       console.error(err); // This will log the error details in your server console
//       return res.status(500).json({ message: 'Database error.', error: err });
//     }

//     if (results.length === 0 || !results[0].is_available) {
//       return res.status(400).json({ message: 'Spot not available.' });
//     }

//     const reserveSpotQuery = `
//       UPDATE parking 
//       SET is_available = false, for_role = ? 
//       WHERE rowNo = ? AND spot_number = ?;
//     `;

//     db.query(reserveSpotQuery, [role, rowNo, spot_number], (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error reserving spot.', error: err });
//       }
//       res.status(200).json({ message: 'Spot reserved successfully.' });
//     });
//   });
// });

// app.get('/available-spots', (req, res) => {
//   const query = 'SELECT rowNo, spot_number FROM parking WHERE is_available = true';

//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error fetching available spots.', error: err });
//     }
//     res.status(200).json(results);
//   });
// });

// app.get('/user-permits/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch permits for the specified user
//   const query = `
//         SELECT pp.permit_id, pp.user_id, pp.issue_date, pp.expiry_date, pp.status, pt.permit_name
//         FROM parking_permit pp
//         JOIN permit_type pt ON pp.permit_id = pt.permit_id
//         WHERE pp.user_id = ? AND pp.status = 'active'
//     `;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error('Error fetching permits:', err);
//       return res.status(500).json({ message: 'Error fetching permits.', error: err });
//     }

//     res.status(200).json(results); // Send the permit data back as JSON
//   });
// });

// app.post('/issue-permit', (req, res) => {
//   const { permit_id, user_id, status, valid_from, valid_for } = req.body;

//   // Get the number of days from valid_for
//   let days = parseInt(valid_for.split(' ')[0]); // Assuming valid_for is like "30 days"

//   // Call the stored procedure to calculate expiry date
//   const callQuery = 'CALL CalculateExpiryDate(?, ?, @expiryDate);';

//   db.query(callQuery, [valid_from, days], (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error calculating expiry date.', error: err });
//     }

//     // Now retrieve the expiry date
//     const selectQuery = 'SELECT @expiryDate AS expiryDate;';

//     db.query(selectQuery, (err, results) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error retrieving expiry date.', error: err });
//       }

//       // Get the expiry date from the results
//       const expiryDate = results[0].expiryDate;

//       // Insert the permit with the calculated expiry date
//       const insertQuery = 'INSERT INTO parking_permit (permit_id, user_id, issue_date, expiry_date, status) VALUES (?, ?, NOW(), ?, ?)';
//       db.query(insertQuery, [permit_id, user_id, expiryDate, status], (err, result) => {
//         if (err) {
//           return res.status(500).json({ message: 'Error issuing permit.', error: err });
//         }
//         res.status(201).json({ message: 'Permit issued successfully.' });
//       });
//     });
//   });
// });


// // Revoke a permit
// app.put('/revoke-permit', (req, res) => {
//   const { permit_id, user_id } = req.body;

//   const query = `
//     UPDATE parking_permit
//     SET status = 'revoked'
//     WHERE permit_id = ? AND user_id = ?`;

//   db.query(query, [permit_id, user_id], (err, result) => {
//     if (err) {
//       console.error('Error revoking permit:', err);
//       return res.status(500).json({ message: 'Error revoking permit.' });
//     }
//     res.status(200).json({ message: 'Permit revoked successfully.' });
//   });
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  console.log(req.body)
  const { ID, email, password } = req.body;

  const query = 'INSERT INTO users (ID, email, password, userType) VALUES (?, ?, ?)';
  db.query(query, [ID, email, password, userType], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error registering user.', error: err });
    }
    let specificQuery;
    if (userType === 'student') {
      specificQuery = 'INSERT INTO student (SRN) VALUES (?)';
    } else if (userType === 'staff') {
      specificQuery = 'INSERT INTO staff (ID) VALUES (?)';
    } else if (userType === 'admin') {
      specificQuery = 'INSERT INTO admin (ID) VALUES (?, ?)';
    } else {
      return res.status(400).json({ message: 'Invalid user type.' });
    }

    // Execute the specific query for either student or staff
    db.query(specificQuery, [ID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: `Error adding ${userType} entry.`, error: err });
      }
      res.status(201).json({ message: `${userType} registered successfully.` });
    });
  });
});

// user Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error logging in.', error: err });
    } else if (results.length > 0) {
      res.status(200).json({ message: 'Login successful.', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  });
});

// Reserve a parking spot
app.post('/reserve-spot', (req, res) => {
  const { rowNo, spot_number, role } = req.body;
  console.log('Received request:', { rowNo, spot_number, role });

  const checkAvailabilityQuery = `
    SELECT is_available 
    FROM parking 
    WHERE rowNo = ? AND spot_number = ? AND (for_role IS NULL OR for_role = ?);
  `;

  db.query(checkAvailabilityQuery, [rowNo, spot_number, role], (err, results) => {
    if (err) {
      console.error(err); // This will log the error details in your server console
      return res.status(500).json({ message: 'Database error.', error: err });
    }

    if (results.length === 0 || !results[0].is_available) {
      return res.status(400).json({ message: 'Spot not available.' });
    }

    const reserveSpotQuery = `
      UPDATE parking 
      SET is_available = false, for_role = ? 
      WHERE rowNo = ? AND spot_number = ?;
    `;

    db.query(reserveSpotQuery, [role, rowNo, spot_number], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error reserving spot.', error: err });
      }
      res.status(200).json({ message: 'Spot reserved successfully.' });
    });
  });
});

app.get('/available-spots', (req, res) => {
  const query = 'SELECT rowNo, spot_number FROM parking WHERE is_available = true';

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

app.post('/issue-permit', (req, res) => {
  const { permit_id, user_id, status, valid_from, valid_for } = req.body;

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

app.put('/add-violation', (req, res) => {
  const { user_id, violation_id, type_of_violation, fine_paid } = req.body;
  const query = `
    INSERT INTO parking_violation (student_id, violation_id, type_of_violation, fine_paid) VALUES (?, ?, ?, ?)`;
  db.query(query)
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

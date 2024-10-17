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

  const query = 'INSERT INTO users (ID, email, password) VALUES (?, ?, ?)';
  db.query(query, [ID, email, password], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error registering user.', error: err });
    } 
    let specificQuery;
    if (userType === 'student') {
      specificQuery = 'INSERT INTO students (SRN) VALUES (?)';
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

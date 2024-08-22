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
  database: 'parking_management',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL.');
  }
});

app.post('/signup', (req, res) => {
  const { SRN, email, password } = req.body;

  const query = 'INSERT INTO users (SRN, email, password_hash) VALUES (?, ?, ?)';
  db.query(query, [SRN, email, password], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error registering user.', error: err });
    } else {
      res.status(201).json({ message: 'User registered successfully.' });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

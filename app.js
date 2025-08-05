
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;


const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('DB Error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// API routes
app.get('/clubs', (req, res) => {
  db.query('SELECT * FROM clubs', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/clubs', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO clubs (name) VALUES (?)', [name], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});



/*

app.get('/members', (req, res) => {
  db.query('SELECT * FROM members', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

*/

// API routes
app.get('/members', (req, res) => {
  db.query('SELECT * FROM members', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/members', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO members (name) VALUES (?)', [name], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});




/*

// API routes
app.get('/checkins', (req, res) => {
  db.query('SELECT * FROM checkins', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.post('/checkins', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO checkins (name) VALUES (?)', [name], err => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

*/

app.get('/checkins', (req, res) => {
  db.query(`
    SELECT checkins.id, members.name AS member_name, checkins.checkin_time 
    FROM checkins 
    JOIN members ON checkins.member_id = members.id
    ORDER BY checkin_time DESC
  `, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/checkins', (req, res) => {
  const { member_id } = req.body;

  if (!member_id) {
    return res.status(400).send({ error: 'member_id is required' });
  }

  db.query('INSERT INTO checkins (member_id) VALUES (?)', [member_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Check-in recorded', id: result.insertId });
  });
});



app.get('/payments', (req, res) => {
  const sql = `
    SELECT payments.id, members.name AS member_name, payments.amount, payments.payment_date
    FROM payments
    JOIN members ON payments.member_id = members.id
    ORDER BY payments.payment_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});



app.post('/payments', (req, res) => {
  const { member_id, amount, payment_date } = req.body;

  if (!member_id || !amount || !payment_date) {
    return res.status(400).send({ error: 'member_id, amount, and payment_date are required' });
  }

  const sql = 'INSERT INTO payments (member_id, amount, payment_date) VALUES (?, ?, ?)';
  db.query(sql, [member_id, amount, payment_date], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Payment recorded', id: result.insertId });
  });
});




app.get('/', (req, res) => {
  res.send('ClubHub backend running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


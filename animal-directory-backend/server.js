const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

const PORT = 8000;

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create a route to fetch data from the database
app.get("/get", (req, res) => {
  const q = `SELECT * FROM animals`;

  // Execute the SQL query to fetch data
  db.query(q, (err, result) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    console.log('Data fetched successfully');
    return res.json(result);
  });
});

// Create a route to insert data into the database
app.post("/insert", (req, res) => {
  const { name, type, scarcity } = req.body;

  // Validate input
  if (!name || !type || !scarcity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const q = `INSERT INTO animals (name, type, scarcity) VALUES (?, ?, ?)`;

  // Execute the SQL query to insert data
  db.query(q, [name, type, scarcity], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      return res.status(500).json({ error: 'Failed to insert data' });
    }
    console.log('Data inserted successfully');
    return res.status(201).json({ message: 'Data inserted successfully' });
  });
});

//delete uwu
app.delete("/delete/:id", (req, res) => {
  const animalId = req.params.id;

  const q = `DELETE FROM animals WHERE id = ?`;

  // Execute the SQL query to delete an animal
  db.query(q, [animalId], (err, result) => {
    if (err) {
      console.error('Error deleting animal:', err);
      return res.status(500).json({ error: 'Failed to delete animal' });
    }
    console.log('Animal deleted successfully');
    return res.status(200).json({ message: 'Animal deleted successfully' });
  });
});

app.put("/update/:id", (req, res) => {
  const animalId = req.params.id;
  const { name, type, scarcity } = req.body;

  const q = `UPDATE animals SET name = ?, type = ?, scarcity = ? WHERE id = ?`;

  // Execute the SQL query to update an animal
  db.query(q, [name, type, scarcity, animalId], (err, result) => {
    if (err) {
      console.error('Error updating animal:', err);
      return res.status(500).json({ error: 'Failed to update animal' });
    }
    console.log('Animal updated successfully');
    return res.status(200).json({ message: 'Animal updated successfully' });
  });
});



// Root route
app.get("/", (req, res) => {
  res.json("Hello, this is the backend");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

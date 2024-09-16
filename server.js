const mysql = require('mysql2');
const express = require("express");
const bodyParser = require("body-parser"); // Middleware to parse form data
const path = require('path');  // Import the path module


const app = express();

// Middleware to parse URL-encoded data (for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'booking_db',
  password: '************',
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.get("/", (req, res) => {
  // Send form.html located in the views folder
  res.sendFile(path.join(__dirname, 'views', 'form.html')); 
});

// Fetch and display all bookings
app.get("/bookings", (req, res) => {
  const q = 'SELECT * FROM bookings';
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result); // Send result as JSON
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching bookings.");
  }
});

// Handle form submission and save booking data to the database
app.post("/submit-booking", (req, res) => {
  const { hotelName, name, email, phone, checkInDate, checkOutDate, price } = req.body;

  // Insert query
  const query = `
    INSERT INTO bookings (hotelName, name, email, phone, checkInDate, checkOutDate, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    connection.query(query, [hotelName, name, email, phone, checkInDate, checkOutDate, price], (err, result) => {
      if (err) throw err;
      console.log('Booking saved:', result);
      res.send("Booking saved successfully!");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving booking.");
  }
});



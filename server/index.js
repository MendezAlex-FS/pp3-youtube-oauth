// Load in our Express framework
require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Create a new Express instance called "app"
const app = express();

// This is the middleware
// Make app parse request in JSON
app.use(express.json()); // Put all data in req.body
app.use(cors()); // Handles the CORs policies

// Making at '/api/v1' as root service up routes
app.get('/api/v1', (req, res) => {
  console.log('GET');
  res.status(200).json({
    message: "Service is up",
    metadata: {
      hostname: req.hostname,
      path: req.originalUrl,
      protocol: req.protocol,
      method: req.method,
      date: new Date()
    },
  });
});

// It is a 404 handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Catch all errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status
  });
});

//TODO: Temporary code for week 1.
console.log("------- Env Vars -------");
console.log(process.env.PORT);
console.log(process.env.NODE_ENV);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_NAME);
console.log(process.env.DB_HOST);
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);
console.log(process.env.GOOGLE_REDIRECT_URI);
console.log(process.env.JWT_SECRET);
console.log("------- /Env Vars -------");

// Set our app to listen on port 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
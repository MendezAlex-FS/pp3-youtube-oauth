// Load in our Express framework
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require('./routes/authRoutes.js')
const youTubeRoutes = require('./routes/youTubeRoutes.js')
const env = process.env.NODE_ENV || 'development';
const db = require("./config/config.js")[env];

// Create a new Express instance called "app"
const app = express();

// This is the middleware 
app.use(morgan("dev"));  // Mainly for debugging. Logs req in console.
app.use(express.json()); // Put all data in req.body
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN,
    process.env.YOUTUBE_ORIGIN
  ],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  allowedHeaders: ["Content-Type", "Authorization"]
})); // Handles the CORs policies

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/youtube", youTubeRoutes);

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
const port = process.env.PORT || 3001;

console.log("------- Env Vars -------");
console.log("PORT=" + port);
console.log("NODE_ENV=" + env);
console.log("DB_USER=" + db.username);
console.log("DB_PASS=" + db.password);
console.log("DB_NAME=" + db.database);
console.log("DB_HOST=" + db.host);
console.log("GOOGLE_CLIENT_ID=" + process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET=" + process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_REDIRECT_URI=" + process.env.GOOGLE_REDIRECT_URI);
console.log("JWT_SECRET=" + process.env.JWT_SECRET);
console.log("CLIENT_ORIGIN=" + process.env.CLIENT_ORIGIN);
console.log("------- /Env Vars -------");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
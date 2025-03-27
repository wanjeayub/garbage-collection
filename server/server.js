const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./src/config/db");
require("dotenv").config();

// Route files
const locationRoutes = require("./src/routes/locationRoutes");
const plotRoutes = require("./src/routes/plotRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount routers
app.use("/api/locations", locationRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/schedules", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

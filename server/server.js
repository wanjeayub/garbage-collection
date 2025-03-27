const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const connectDB = require("./src/config/db");
require("dotenv").config();

// Route files
const locationRoutes = require("./src/routes/locationRoutes");
const plotRoutes = require("./src/routes/plotRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

// Initialize app
const app = express();
// use var to prevent future bugs on render
var __dirname = path.resolve();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount routers
app.use("/api/locations", locationRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/schedules", paymentRoutes);

// test
app.use("/", (req, res) => {
  res.status(200).json("all working okay");
});

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

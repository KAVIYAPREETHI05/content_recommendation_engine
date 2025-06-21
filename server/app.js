require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const creatorRoutes = require("./routes/creatorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api", authRoutes);
app.use("/api/creators", creatorRoutes); // <--- use dedicated route

const readerRoutes = require("./routes/readerRoutes");
app.use("/api/readers", readerRoutes);


// Connect to DB and start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

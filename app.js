require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const fileRoutes = require("./routes/fileRoutes");
const folderRoutes = require("./routes/folderRoutes");
const authRoutes = require("./routes/authRoutes");

const MONGO_URI = process.env.MONGO_URI;

// MongoDB
mongoose.connect(MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err.message);
});

const app = express(); 

// CORS
app.use(cors({
  origin: ['http://localhost:1111','https://yourosmanager.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/file", fileRoutes);
app.use("/folder", folderRoutes);

// Simple health route
app.get("/", (req, res) => res.send("OS Manager API - MongoDB mode with Authentication"));

const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
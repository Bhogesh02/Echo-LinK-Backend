import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
const __dirname = path.resolve(); // Needed for static file serving

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Use FRONTEND_URL from .env or default to localhost
    credentials: true,
  })
);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Root Route with background image and centered text
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Backend is Working</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          background-image: url('src/Echo-LinK.webp'); /* Ensure the image path is correct */
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        h3 {
          font-size: 36px;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.5); /* Optional: Adds a background behind the text */
          padding: 20px;
          border-radius: 10px;
        }
      </style>
    </head>
    <body>
      <h3>Backend is Working Mr_Bhogesh, Happy hacking...</h3>
    </body>
    </html>
  `);
});

// Production Setup: Serve Frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  // Development Root Route
  app.get("/", (req, res) => {
    res.send("Backend is Working Mr_Bhogesh, Happy hacking...");
  });
}

console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Start the server and connect to MongoDB
server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDB(); // Connect to the database
});

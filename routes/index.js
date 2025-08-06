const express = require("express");
const app = express();

// Import route modules
const homeRoutes = require("./homeRoutes");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const listingRoutes = require("./listingRoutes");
const bookingRoutes = require("./bookingRoutes");
const uploadRoutes = require("./uploadRoutes");

// Define route handlers
const setupRoutes = (app) => {
  // Home routes (includes /, /filter, /search)
  app.use("/", homeRoutes);
  
  // Auth routes (signup, login, logout)
  app.use("/", authRoutes);
  
  // User routes (profile, dashboard)
  app.use("/", userRoutes);
  
  // Listing routes
  app.use("/listing", listingRoutes);
  
  // Booking routes
  app.use("/book", bookingRoutes);
  
  // Upload routes
  app.use("/upload", uploadRoutes);
};

module.exports = setupRoutes;

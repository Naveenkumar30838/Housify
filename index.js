const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();

// Import configurations and utilities
const { connectMongoDB } = require("./config/database");
const { fillDataBase } = require("./config/dbInit");
const setupRoutes = require("./routes/index");

// ------- MiddleWares --------------
// setting for the views directory and serving static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// setting the middlewares to accept post requests
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// to override post and get Request
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  res.locals.baseUrl = `${req.protocol}://${req.get("host")}`;
  next();
});

// Set up session middleware with MongoDB
app.use(
  session({
    secret: "your_session_secret", // Session secret key
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // MongoDB URI for sessions
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    },
  })
);

// Connect to databases
connectMongoDB();
fillDataBase();

// Setup routes
setupRoutes(app);

// Start the server using the PORT from .env file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

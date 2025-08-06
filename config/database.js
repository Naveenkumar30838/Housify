const mysql = require("mysql2");
const mongoose = require("mongoose");
require("dotenv").config();

// ------------------- MYSQL Database Connection ---------
const connection = mysql.createConnection({
  host: "localhost", // Replace with your database host
  user: "root", // Replace with your database username
  password: process.env.SQLPASSWORD, // Replace with your database password
  database: "Housify", // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to the SQL database.");
});

const queryDatabase = (query, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// Connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = {
  connection,
  queryDatabase,
  connectMongoDB,
};

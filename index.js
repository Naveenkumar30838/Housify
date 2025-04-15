const express = require('express')
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker/locale/en_IN'); // Import the Indian locale
function generateIndianAddress() {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(), // Now this will be an Indian state
    pincode: faker.location.zipCode(), // Faker with 'en_IN' locale understands Indian zip code format
  };
}
const { v4: uuidv4 } = require('uuid');

const app = express()
const port = 5000 
// Database Connection 
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'root',      // Replace with your database username
    password: 'Harsh786@', // Replace with your database password
    database: 'Housify'   // Replace with your database name
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');
}); 

app.listen(port , (req , res)=>{
    console.log("Server Started");
})

const express = require('express')
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');


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

function generateUsers(numberOfUsers) {
    const users = [];
    const emailSet = new Set();  // Set to keep track of unique emails
    for (let i = 0; i < numberOfUsers; i++) {
        let email;
        // Ensure the email is unique
        do {
            email = faker.internet.email();
        } while (emailSet.has(email));
        emailSet.add(email);  // Add the unique email to the set
        const user = {
            USER_ID: faker.string.uuid(),  // Corrected to use faker.string.uuid() for generating UUIDs
            NAME: faker.person.fullName(),  // Correct method for generating full name
            EMAIL: email,  // Random email
            PASSWORD: faker.internet.password(12),  // Random password
            PHONE: faker.phone.number('##########'),  // Correct method for generating 10-digit phone number
            INCOME: faker.finance.amount(20000, 100000, 30000 , 450000) //0000
        };
        if(user.EMAIL.length<20 && user.NAME.length<20 && user.PHONE.length<15){
            users.push(user);
        }
    }
    return users;
}
function insertUsers(users) {
    const query = `
        INSERT INTO USER (USER_ID, NAME, EMAIL, PASSWORD, PHONE, INCOME) VALUES ?
    `;
    // Map the users array to an array of values
    const values = users.map(user => [
        user.USER_ID,
        user.NAME,
        user.EMAIL,
        user.PASSWORD,
        user.PHONE,
        user.INCOME
    ]);
    // Execute the query
    connection.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            connection.end();
            return;
        }
        console.log('Data inserted successfully. Rows affected:', result.affectedRows);

        // Close the connection
        connection.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err.message);
                return;
            }
            console.log('Connection closed.');
        });
    });
}

// Insert Listing  
function insertListing (){
    // const user
    const userID = [] ;
    connection.query('SELECT USER_ID FROM USER' , (err , result)=>{
        if(err){
            console.log("Error in query")
        }
        for (const data of result){
            userID.push(data.USER_ID)
        }
    })
    console.log(userID);
}

insertListing();
app.listen(port , (req , res)=>{
    console.log("Server Started");
})
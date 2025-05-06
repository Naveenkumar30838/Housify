// These queries will run automatically using fillDataBase functions in the Server . No Other UserCases
const { faker } = require('@faker-js/faker/locale/en_IN'); // Import the Indian locale
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();


// Helper Utility Functions 
function generateDateRange() { // to Generate a Data Range using Faker 
    let startDate = faker.date.past();
    let endDate = faker.date.future();
  
    // Ensure startDate is before endDate
    while (startDate >= endDate) {
      startDate = faker.date.past();
      endDate = faker.date.future();
    }
  
    return {
      startDate: startDate,
      endDate: endDate,
    };
  }

  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//  Connecting to the Database : 
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'root',      // Replace with your database username
    password: process.env.SQLPASSWORD, // Replace with your database password
    database: 'Housify'   // Replace with your database name
});

const connectToDatabase = ()=>{
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
            return;
        }
        console.log('Connected to the SQL database.');
    });  
}
const releaseConnection = ()=>{
    connection.releaseConnection
}
function generarateRandomUser(numberOfUsers) {
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
    });
}

const callInsertUser =()=>( insertUsers(generarateRandomUser(40000))) // Call this function to generate data for 30000 users and Insert them in the database

// Insert Listing    ------------------
const listingImageUrls= [
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1653702038574-828ffc68c719?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1653702038574-828ffc68c719?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1653702038574-828ffc68c719?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.pexels.com/photos/27195983/pexels-photo-27195983/free-photo-of-a-large-house-with-a-pool-and-lounge-chairs.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/27195983/pexels-photo-27195983/free-photo-of-a-large-house-with-a-pool-and-lounge-chairs.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/27195983/pexels-photo-27195983/free-photo-of-a-large-house-with-a-pool-and-lounge-chairs.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/17010994/pexels-photo-17010994/free-photo-of-a-tropical-mansion-in-summer.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/17010994/pexels-photo-17010994/free-photo-of-a-tropical-mansion-in-summer.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/17010994/pexels-photo-17010994/free-photo-of-a-tropical-mansion-in-summer.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]
function insertListing(callback) { //  getting userId data from user Database and then passing it to the callback 
    let userID = [];
    connection.query('SELECT USER_ID FROM USER', (err, result) => {
        if (err) {
            console.log("Error in query");
            return callback(err);
        }
        for (let i = 0; i < result.length; i++) {
            userID[i] = result[i].USER_ID;
        }
        // Pass the userID array to the callback
        callback( userID);
    });
}
function generateIndianAddress() { // to generate Indian address 
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ includeCountry: true }).split(', ')[0], // Get only the state part
      pincode: faker.location.zipCode('######'),
    };
}
  
  // Array of allowed image keywords

// Usage
const callInsertListing = ()=>{
    insertListing(( userID) => {
    userID.forEach(id => {
        const address = generateIndianAddress();
        const listingData = {
            IMAGE_URL: listingImageUrls[getRandomInRange(0,listingImageUrls.length-1)],
            ID: uuidv4(),
            USER_ID: id,
            NAME: faker.commerce.productName(),
            DESCRIPTION: faker.lorem.paragraph(5).substring(0, 200), // Ensure description is within 200 characters
            AVAILABILITY: faker.datatype.boolean(),
            STREET : address.street, 
            CITY :address.city,
            STATE :address.state,
            PINCODE:address.pincode,
            PRICEPERMONTH: faker.commerce.price({ min: 1000, max: 100000, dec: 2 }),
            DISCOUNT: faker.number.float({ min: 1, max: 70, dec:2 }), // Up to 50% discount
            SIZE: faker.number.int({ min: 100, max: 5000 }),
            RATING: faker.number.int({ min: 1, max: 5 }),
          }; 
          console.log(listingData);
          connection.query(`INSERT INTO LISTING (IMAGE_URL , ID , USER_ID , NAME , DESCRIPTION , AVAILABILITY , STREET , CITY , STATE , PINCODE , PRICEPERMONTH , DISCOUNT , SIZE , RATING) VALUES
(? , ? , ? , ? , ? , ? , ? , ? , ? ,? ,? , ? , ? ,?)` , Object.values(listingData) , (err , res)=>{
            if(err){
                console.log("Error Inserting into Listing Table"  , err);
            }
           })
    });
});
}


// Insert Bookings copy and paste till - > 159

function insertbooking(callback){
    connection.query('SELECT ID , USER_ID FROM LISTING WHERE AVAILABILITY=FALSE' , (err , res)=>{
        if(err){
            console.log("Error in query");
        }
        callback(res);
    })
}
const callInsertBooking = ()=>{insertbooking((result)=>{
    for (let i =0;i<result.length;i++){
        const ele=result[i];
        const date = generateDateRange();
        
        const bookingElement = {
            ID:uuidv4(),
            USER_ID:result[getRandomInRange(0 , result.length-1)].USER_ID,
            LISTING_ID:ele.ID,
            START_DATE:date.startDate,
            END_DATE:date.endDate
        }
        connection.query(`INSERT INTO BOOKING (ID , USER_ID , LISTING_ID , START_DATE , END_DATE) VALUES (? , ? , ? , ? ,?)` , Object.values(bookingElement) , (err , res)=>{
            if(err){
                console.log("Error in Data Insertion in the Bookings Table" , err);
            }
        })
    };
})
}

module.exports={callInsertBooking , 
callInsertListing,
callInsertUser
}

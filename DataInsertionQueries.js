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
const listingImageUrls= ["https://www.pexels.com/photo/house-lights-turned-on-106399/",  "https://www.pexels.com/photo/blue-and-gray-concrete-house-with-attic-during-twilight-186077/",
    "https://www.pexels.com/photo/modern-building-against-sky-323780/",
    "https://www.pexels.com/photo/brown-and-gray-painted-house-in-front-of-road-1396122/",
    "https://www.pexels.com/photo/black-handled-key-on-key-hole-101808/",
    "https://www.pexels.com/photo/white-and-red-wooden-house-with-fence-1029599/",
    "https://www.pexels.com/photo/beige-bungalow-house-259588/",
    "https://www.pexels.com/photo/yellow-concrete-house-2102587/",
    "https://www.pexels.com/photo/brown-and-white-wooden-house-164558/",
    "https://www.pexels.com/photo/staircase-area-2121121/",
    "https://www.pexels.com/photo/turned-off-flat-screen-tv-276724/",
    "https://www.pexels.com/photo/white-wooden-2-storey-house-near-tree-280229/",
    "https://www.pexels.com/photo/bird-s-eye-view-of-rooftops-1546166/",
    "https://www.pexels.com/photo/four-brown-wooden-chairs-2635038/",
    "https://www.pexels.com/photo/white-2-storey-house-near-trees-1115804/",
    "https://www.pexels.com/photo/white-single-story-houses-beside-body-of-water-1438832/",
    "https://www.pexels.com/photo/beige-concrete-house-under-cumulus-cloud-358636/",
    "https://www.pexels.com/photo/lighted-beige-house-1396132/",
    "https://www.pexels.com/photo/white-and-gray-wooden-house-near-grass-field-and-trees-280222/",
    "https://www.pexels.com/photo/white-concrete-2-storey-house-206172/",
    "https://www.pexels.com/photo/four-colourful-houses-2501965/",
    "https://www.pexels.com/photo/white-wooden-cupboards-2724749/",
    "https://www.pexels.com/photo/gray-house-with-fireplace-surrounded-by-grass-under-white-and-gray-cloudy-sky-731082/",
    "https://www.pexels.com/photo/house-2581922/",
    "https://www.pexels.com/photo/concrete-house-during-day-2079234/",
    "https://www.pexels.com/photo/white-and-brown-house-1974596/",
    "https://www.pexels.com/photo/brown-and-beige-wooden-house-under-blue-sky-221540/",
    "https://www.pexels.com/photo/white-couch-near-black-mat-259962/",
    "https://www.pexels.com/photo/armchair-near-table-and-ottoman-2079249/",
    "https://www.pexels.com/photo/white-concrete-temple-208736/",
    "https://www.pexels.com/photo/white-and-brown-concrete-helix-stairs-210464/",
    "https://www.pexels.com/photo/assorted-color-wall-paint-house-photo-1370704/",
    "https://www.pexels.com/photo/low-angle-photo-of-balconies-2462015/",
    "https://www.pexels.com/photo/high-angle-shot-of-suburban-neighborhood-1546168/",
    "https://www.pexels.com/photo/brown-and-red-birdhouse-2640604/",
    "https://www.pexels.com/photo/black-kettle-beside-condiment-shakers-and-green-fruits-and-plants-on-tray-on-brown-wooden-table-1080696/",
    "https://www.pexels.com/photo/gray-painted-house-209296/",
    "https://www.pexels.com/photo/white-roll-up-door-277667/",
    "https://www.pexels.com/photo/low-angle-view-of-balcony-against-sky-323775/",
    "https://www.pexels.com/photo/house-near-lake-2098405/",
    "https://www.pexels.com/photo/view-of-office-building-323772/",
    "https://www.pexels.com/photo/closed-door-and-lighted-light-sconce-277559/",
    "https://www.pexels.com/photo/brown-wall-paint-house-near-at-garden-209315/",
    "https://www.pexels.com/photo/closed-blue-door-462205/",
    "https://www.pexels.com/photo/bedroom-2631746/",
    "https://www.pexels.com/photo/white-wooden-building-53610/",
    "https://www.pexels.com/photo/high-angle-photography-of-village-280221/",
    "https://www.pexels.com/photo/kitchen-with-furniture-and-appliances-2724748/",
    "https://www.pexels.com/photo/brown-2-storey-house-beside-tree-221024/",
    "https://www.pexels.com/photo/white-and-red-house-surrounded-by-trees-at-night-1612351/",
    "https://www.pexels.com/photo/white-concrete-building-under-sunny-blue-sky-87223/",
    "https://www.pexels.com/photo/empty-living-room-2251247/",
    "https://www.pexels.com/photo/house-near-body-of-water-262405/",
    "https://www.pexels.com/photo/white-and-brown-concrete-bungalow-under-clear-blue-sky-210617/",
    "https://www.pexels.com/photo/brown-house-2079434/",
    "https://www.pexels.com/photo/square-clear-glass-top-center-table-near-gray-padded-armchair-2121120/",
    "https://www.pexels.com/photo/house-on-snow-near-body-of-water-2104151/",
    "https://www.pexels.com/photo/brown-brick-house-beside-trees-259593/",
    "https://www.pexels.com/photo/brown-coffee-table-on-green-area-rug-279607/",
    "https://www.pexels.com/photo/gray-and-white-house-beside-body-of-water-2091166/",
    "https://www.pexels.com/photo/house-in-the-middle-of-crop-field-3330118/",
    "https://www.pexels.com/photo/modern-building-against-blue-sky-323776/",
    "https://www.pexels.com/photo/brown-wooden-house-surrounded-by-grass-463734/",
    "https://www.pexels.com/photo/aerial-view-of-buildigns-1642125/",
    "https://www.pexels.com/photo/interior-design-of-home-1643383/",
    "https://www.pexels.com/photo/gray-and-white-house-388830/",
    "https://www.pexels.com/photo/photo-of-brown-and-white-houses-2119713/",
    "https://www.pexels.com/photo/flower-vase-on-table-2098913/",
    "https://www.pexels.com/photo/tubular-black-sconce-276514/",
    "https://www.pexels.com/photo/turned-on-flush-mount-lamp-room-271649/",
    "https://www.pexels.com/photo/white-grey-and-red-wooden-house-164522/",
    "https://www.pexels.com/photo/white-house-1475938/",
    "https://www.pexels.com/photo/brown-wooden-house-in-daytime-453201/",
    "https://www.pexels.com/photo/bedroom-interior-setup-271624/",
    "https://www.pexels.com/photo/empty-street-photo-2253916/",
    "https://www.pexels.com/photo/white-concrete-house-under-sky-259685/",
    "https://www.pexels.com/photo/mirror-lake-reflecting-wooden-house-in-middle-of-lake-overlooking-mountain-ranges-147411/",
    "https://www.pexels.com/photo/beige-and-green-house-2439595/",
    "https://www.pexels.com/photo/brown-fabric-sectional-sofa-275484/",
    "https://www.pexels.com/photo/sofa-chairs-in-living-room-1648776/"
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
            IMAGE_URL: listingImageUrls[getRandomInRange(0,79)],
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
    result.forEach(ele => {
        const date = generateDateRange();
        const bookingElement = {
            ID:uuidv4(),
            USER_ID:result[0].USER_ID,
            LISTING_ID:result[0].ID,
            START_DATE:date.startDate,
            END_DATE:date.endDate
        }
        connection.query(`INSERT INTO BOOKING (ID , USER_ID , LISTING_ID , START_DATE , END_DATE) VALUES (? , ? , ? , ? ,?)` , Object.values(bookingElement) , (err , res)=>{
            if(err){
                console.log("Error in Data Insertion in the Bookings Table" , err);
            }
        })
    });
})
}

module.exports={callInsertBooking , 
callInsertListing,
callInsertUser
}

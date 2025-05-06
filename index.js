const express = require('express')
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker/locale/en_IN'); // Import the Indian locale
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const Session = require('./models/Session');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const app = express();
const InsertData = require('./DataInsertionQueries.js');

// ------- MiddleWares --------------
// setting for the views directory and serving static files
app.set('view engine', 'ejs');
app.set("views" , path.join(__dirname, "views"));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// setting the middlewares to accept post requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// to override post and get Request 
app.use(methodOverride('_method'))


// Set up session middleware with MongoDB
app.use(
    session({
      secret: 'your_session_secret', // Session secret key
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

// Middleware to check if a user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/login');
  };

// Connect to MongoDB  ------ Database -------------------
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err)); 



// -----------------MULter Setup ------------
const storage = multer.diskStorage({
    destination:function (req , file , cb){
        return cb(null , './uploads')
    },
    filename : function (req , file , cb){
        return cb(null , Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage})

// ------------------- MYSQL  Database Connection --------- 
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'root',      // Replace with your database username
    password: process.env.SQLPASSWORD, // Replace with your database password
    database: 'Housify'   // Replace with your database name
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the SQL database.');
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

// Initial query to Insert Temporary data in the database(SQL Database if it found empty )
const fillDataBase = async ()=>{
  query = 'SELECT * FROM USER';
  let res = await queryDatabase(query);
  if(res.length==0){
    console.log("userTable is null")
    InsertData.callInsertUser();  
  }
  query = 'SELECT * FROM LISTING';
   res = await queryDatabase(query);
  if(res.length==0){
    console.log("Listing Table  is null")
    InsertData.callInsertListing();  
  }
  query = 'SELECT * FROM BOOKING';
   res = await queryDatabase(query);
  if(res.length==0){
    console.log("Booking Table is null")
    InsertData.callInsertBooking();  
  }
}
fillDataBase();

//  ------------------- Routing   -------------------
app.get('/',async (req, res) => {
  let user = {
    name:req.session.name==undefined?null:req.session.name,
    USER_ID:req.session.userId 
  };
  
 // get all locations 
  const getLocationQuery = "select distinct(city) from listing limit 50"
  const getPropertyQuery = "SELECT IMAGE_URL,ID , NAME,CITY , STATE , PRICEPERMONTH,RATING FROM LISTING LIMIT 50"
  const locations= await queryDatabase(getLocationQuery,[]);
  const properties= await queryDatabase(getPropertyQuery,[]);

  res.render('index', {
    user,
    locations,
    properties
  });
});
app.get('/signup' , (req, res)=>{
  let user = {// Getting user Details from session
    name:req.session.name==undefined?null:req.session.name
  };
  res.render('signup.ejs' , {user})
})
app.get('/login' , (req, res)=>{
  let user = {// Getting user Details from session
    name:req.session.name==undefined?null:req.session.name
  };
  res.render('login.ejs' , {user})
}) 
// Post Response 
app.post('/upload', (req, res, next) => {
  const userId = req.session.userId
  if (!userId) {
      res.render('login.ejs');
      return;
    }
  next(); // Proceed to multer if user is authenticated
},upload.single('image'), async (req, res) => {
    res.send("UPLOaded Successfully"); 
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    const query=`SELECT * FROM USER WHERE EMAIL=? AND PASSWORD=? `
    const result = await queryDatabase(query, [email , password] );

    if(result===undefined || result[0].length == 0){
      res.render('alert.ejs' , {url : '/' , message:"Invalid user"});
    }else {
        const user = result[0];
        req.session.userId = user.USER_ID; // Store user ID in the session
        req.session.name = user.NAME; // Store user name in the session
        req.session.email = user.EMAIL; // Store user email in the session
        console.log(req.session.userId)

        const session = new Session({
            userId: user.USER_ID,
            sessionId: req.sessionID,
            name: user.NAME, // Add user name to session data
            email: user.EMAIL, // Add user email to session data
        });
          await session.save();
          res.redirect('/');
    }
   
});

app.post('/signup', async (req, res) => {
  const { name, email, password, phone, income } = req.body;
  try{

    const query = `SELECT count(USER_ID) FROM USER WHERE EMAIL=?`;
    const resp = await queryDatabase(query, [ email]);

  if (resp[0]['count(USER_ID)'] > 0) {// user Already Exists
    res.status(400).send("Email Already in Use");
  } else { // SAVE User , create express session and save the session in Mongo
      const userId = uuidv4();
      const formattedIncome = income ? parseFloat(income) : null;

      const insertQuery = `
        INSERT INTO USER (USER_ID, NAME, EMAIL, PASSWORD, PHONE, INCOME)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await queryDatabase(insertQuery, [userId, name, email, password, phone || null, formattedIncome]);

      // 3. Store session data
      req.session.userId = userId;
      req.session.name = name;
      req.session.email = email;
      // 4. Saving the Session in mongoDb 
      const sessionEntry = new Session({
        userId, 
        sessionId:req.sessionID, 
        name , 
        email
      })
      await sessionEntry.save();
      res.redirect('/')
  }
  }catch{
    res.status(500).send("Internal Server Error");
  }

});

// Logout
app.get('/logout', (req, res) => {
  const sessionId = req.sessionID;
  req.session.destroy(async (err) => {
    if(err){
        res.send("Error in logout")
    }else{
     await Session.deleteOne({sessionId})
     res.redirect('/')
    }
  })
});    
app.get('/profile/:userId' ,async (req , res)=>{
  const {userId} = req.params;
  const query = 'SELECT NAME ,EMAIL , PHONE , INCOME FROM USER where USER_ID= ?';
  // Finding the User's data 
  const profile = await queryDatabase(query, [userId]);
  
  // Finding the listings which are not booked
  const unbookedListingQuery = 'SELECT * FROM LISTING WHERE ID NOT IN (SELECT LISTING_ID FROM BOOKING) AND USER_ID = ?'
  const unbookedListing = await queryDatabase(unbookedListingQuery ,[userId])
  // OR SELECT * FROM LISTING INNER JOIN BOOKING ON LISTING.ID = BOOKING.LISTING_ID;

  // Finding the listings which are booked

  const bookedListingQuery = 'SELECT * FROM LISTING WHERE ID IN (SELECT LISTING_ID FROM BOOKING) AND USER_ID =? '
  const bookedListing = await queryDatabase(bookedListingQuery ,[userId])
  // OR SELECT LISTING.NAME , LISTING.ID , LISTING.IMAGE_URL , LISTING.USER_ID , LISTING.DESCRIPTION FROM LISTING INNER JOIN BOOKING ON LISTING.ID == BOOKING.LISTING_ID
  
  res.render('profile.ejs' ,{profile , bookedListing , unbookedListing})

})
app.get('/listing/:id' , async (req , res)=>{
  const {id} =req.params
  const getListingQuery = 'SELECT * FROM LISTING WHERE ID  = ?'
  const bookingUserDetailsQuery='SELECT * FROM USER WHERE USER_ID = (SELECT USER_ID FROM BOOKING WHERE LISTING_ID = ?) '
  const ownerDetailsQuery='SELECT * FROM USER WHERE USER_ID = ? '
  const oneListingData = await queryDatabase(getListingQuery , [id]);
  const bookingUserDetails = await queryDatabase(bookingUserDetailsQuery , [id]);
  const ownerDetails = await queryDatabase(ownerDetailsQuery , [oneListingData[0].USER_ID]);

  let user = {
    name:req.session.name==undefined?null:req.session.name,
    USER_ID:req.session.userId 
  };
  console.log("bookingOwner" , bookingUserDetails[0]);
  res.render('listings', { listing:oneListingData[0] ,ownerDetails:ownerDetails[0],  user ,bookingUser:bookingUserDetails[0]});

});
app.get('/filter' , async (req , res)=>{
  const {city , sort} = req.query;
  if(city=="" && sort==""){
    res.redirect('/')
  }else{

    let user = {
      name:req.session.name==undefined?null:req.session.name,
      USER_ID:req.session.userId 
    };
    
   // get all locations 
    let getLocationQuery = "select distinct(city) from listing limit 50"
    let locations= await queryDatabase(getLocationQuery,[]);
    let properties=[];

    if(city==""){ //sort ascending or descending
      properties=await queryDatabase(`SELECT IMAGE_URL,ID , NAME,CITY , STATE , PRICEPERMONTH,RATING FROM LISTING ORDER BY PRICEPERMONTH ${sort} LIMIT 50;` , []);
    }else if (sort==""){ //filter by city 
      properties=await queryDatabase(`SELECT IMAGE_URL,ID , NAME,CITY , STATE , PRICEPERMONTH,RATING FROM LISTING WHERE CITY="${city}" LIMIT 50;` , []);
      locations=[{city:city}];
    }else{ //filter by city and acending
      properties=await queryDatabase(`SELECT IMAGE_URL,ID , NAME,CITY , STATE , PRICEPERMONTH,RATING FROM LISTING WHERE CITY="${city}" ORDER BY PRICEPERMONTH ${sort} LIMIT 50;` , []);
      locations=[{city:city}];
    }
    
    res.render('index', {
      user,
      locations,
      properties
    });

  }
})


// Start the server using the PORT from .env file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
app.get('/', (req, res) => {

  const user = {
    name: 'Harsh Kumar'
  };

  const properties = [
    {
      title: 'Cozy Apartment',
      city: 'New York',
      price: 1200
    },
    {
      title: 'Modern Loft',
      city: 'Los Angeles',
      price: 2200
    },
    {
      title: 'Lakeview Condo',
      city: 'Chicago',
      price: 1500
    }
  ];

  res.render('index', {
    user,
    properties
  });
});
app.get('/signup' , (req, res)=>{
  res.render('signup.ejs')
})
app.get('/login' , (req, res)=>{
  res.render('login.ejs')
}) 
// Post Response 
app.post('/upload', (req, res, next) => {
  const userId = req.session.userId
  if (!userId) {
      // Handle not logged in 
      res.render('login.ejs');
      return;
    }
  next(); // Proceed to multer if user is authenticated
},upload.single('image'), async (req, res) => {
    res.send("UPLOaded Successfully"); 
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const query=`SELECT ID , NAME , EMAIL FROM USER WHERE EMAIL=? AND PASSWORD=?`; 
  const user = connection.query(query, [email , password] ,async (res , result)=>{
    if(result.length===0){
      return res.status(401).send('Invalid Username or Password');
    }else {
       const user = result[0];
        req.session.userId = user.ID; // Store user ID in the session
        req.session.name = user.NAME; // Store user name in the session
        req.session.email = user.EMAIL; // Store user email in the session

        const session = new Session({
            userId: user.ID,
            sessionId: req.sessionID,
            name: user.NAME, // Add user name to session data
            email: user.EMAIL, // Add user email to session data
          });
          await session.save();
          res.redirect('/');
    }
  }) 
});

app.post('/signup', async (req, res) => {
  const { name, email, password, phone, income } = req.body;
  try{

  const query = `SELECT count(USER_ID) FROM USER WHERE EMAIL=?`;
  const resp = await queryDatabase(query, [email]);

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
}
}

//   await user.save();
//   req.session.userId = user._id; // Store user ID in session
//   req.session.name = user.name; // Store user name in session
//   req.session.email = user.email; // Store user email in session

//   // Store session info in MongoDB as well
//   const session = new Session({
//     userId: user._id,
//     sessionId: req.sessionID,
//     name: user.name,
//     email: user.email,
//   });
//   await session.save();
//   res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
   const sessionId = req.sessionID;
   req.session.destroy(async(err)=>{
    if(err){
      res.send("Error in logout");
    }else {
      await Session.deleteOne({sessionId})
      res.redirect('/');
    }
   })
});    

// Start the server using the PORT from .env file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

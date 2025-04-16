const express = require('express')
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker/locale/en_IN'); // Import the Indian locale
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const Session = require('./models/Session');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
require('dotenv').config();



const app = express();

// ------- MiddleWares --------------
// setting for the views directory and serving static files
app.set('view engine' , ejs);
app.set("views" , path.join(__dirname, "views"));
app.use('/public', express.static(path.join(__dirname, 'public')));
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
        mongoUrl: 'mongodb://127.0.0.1:27017/cureAi', // MongoDB URI for sessions
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
mongoose.connect(process.env.MONGO_URI)
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
//  ------------------- Routing   -------------------
app.get('/', (req, res) => {

  // const userName = req.session.name || null; // If user is logged in, session will have the name
  
  // res.render('index', { userName });
  const userName = req.session.name
  if(userName == undefined){
      username= null;
  }
  res.render('index.ejs' , {userName})
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
      // return res.render('login', { error: 'Please login to upload images.' });
      res.render('login.ejs');
      return;
    }
  next(); // Proceed to multer if user is authenticated
},upload.single('image'), async (req, res) => {
  // Image was uploaded successfully
  // Calling the FastAPI Here for response 
  const response = {key : "value"};
  if(!response==23){
      res.render('alert.ejs' , {message : "Upload a Better Photo" , url : '/'})
  }

  // Saving the Image and the response in the Mongodb database 
  // const email = req.session.email;
  const filePath=  req.file.path;
  // const user = await User.findOneAndUpdate(
  //     { email: email }, // Find the user by their email
  //     {
  //       $push: { // Push a new object into the 'images' array
  //         images: {
  //           imagePath: filePath,
  //           response: response
  //         }
  //       }
  //     },
  //     { new: true } // Return the updated document
  //   );
    
    // Rendering a new page with the response
    const conditions = ["Condition 1", "Condition 2", "Condition 3"];
    const severity = "High";
    const treatment = "Take prescribed medications and rest.";
    
  
    // Render response.ejs with the provided data
    res.render('response.ejs', { conditions, severity, treatment, imagePath:filePath});
});
app.get("/response" , (req , res)=>{
  const filePath=  "../uploads/1744470525907-ChatGPT Image Apr 12, 2025, 01_41_27 AM.png";   
    // Rendering a new page with the response
    const conditions = ["Conditalkjion 1", "Condition 2", "Condition 3"];
    const severity = "High";
    const treatment = "Take prescribed medications and rest.";
    
  
    // Render response.ejs with the provided data
    res.render('response.ejs', { conditions, severity, treatment, imagePath:filePath});
})
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    req.session.userId = user._id; // Store user ID in the session
    req.session.name = user.name; // Store user name in the session
    req.session.email = user.email; // Store user email in the session

    // Store session info in MongoDB as well
    const session = new Session({
      userId: user._id,
      sessionId: req.sessionID,
      name: user.name, // Add user name to session data
      email: user.email, // Add user email to session data
    });
    await session.save();

    res.redirect('/dashboard');
  } else {
    res.status(401).send('Invalid email or password');
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send('Email already in use');
  }

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();
  req.session.userId = user._id; // Store user ID in session
  req.session.name = user.name; // Store user name in session
  req.session.email = user.email; // Store user email in session

  // Store session info in MongoDB as well
  const session = new Session({
    userId: user._id,
    sessionId: req.sessionID,
    name: user.name,
    email: user.email,
  });
  await session.save();
  res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(async (err) => {
    if (err) return res.status(500).send('Could not log out');
    
    // Remove session from MongoDB
    await Session.deleteOne({ sessionId: req.sessionID });
    res.redirect('/');
  });
});    

// Start the server using the PORT from .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

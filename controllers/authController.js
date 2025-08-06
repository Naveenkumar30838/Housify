const { queryDatabase } = require("../config/database");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");

const authController = {
  // GET /signup
  getSignup: (req, res) => {
    res.render("signup.ejs", { user: req.user });
  },

  // GET /login
  getLogin: (req, res) => {
    res.render("login.ejs", { user: req.user });
  },

  // POST /login
  postLogin: async (req, res) => {
    try {
      let { email, password } = req.body;
      const query = `SELECT * FROM USER WHERE EMAIL=? AND PASSWORD=? `;
      const result = await queryDatabase(query, [email, password]);
      
      if (result === undefined || result.length == 0) {
        res.render("alert.ejs", { url: "/login", message: "Invalid user" });
      } else {
        const user = result[0];
        req.session.userId = user.USER_ID; // Store user ID in the session
        req.session.name = user.NAME; // Store user name in the session
        req.session.email = user.EMAIL; // Store user email in the session
        console.log(req.session.userId);

        const session = new Session({
          userId: user.USER_ID,
          sessionId: req.sessionID,
          name: user.NAME, // Add user name to session data
          email: user.EMAIL, // Add user email to session data
        });
        await session.save();
        res.redirect("/");
      }
    } catch (error) {
      console.error("Error in postLogin:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // POST /signup
  postSignup: async (req, res) => {
    try {
      const { name, email, password, phone, income } = req.body;
      
      const query = `SELECT count(USER_ID) FROM USER WHERE EMAIL=?`;
      const resp = await queryDatabase(query, [email]);

      if (resp[0]["count(USER_ID)"] > 0) {
        // user Already Exists
        res.status(400).send("Email Already in Use");
      } else {
        // SAVE User, create express session and save the session in Mongo
        const userId = uuidv4();
        const formattedIncome = income ? parseFloat(income) : null;

        const insertQuery = `
          INSERT INTO USER (USER_ID, NAME, EMAIL, PASSWORD, PHONE, INCOME)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await queryDatabase(insertQuery, [
          userId,
          name,
          email,
          password,
          phone || null,
          formattedIncome,
        ]);

        // Store session data
        req.session.userId = userId;
        req.session.name = name;
        req.session.email = email;
        
        // Saving the Session in mongoDb
        const sessionEntry = new Session({
          userId,
          sessionId: req.sessionID,
          name,
          email,
        });
        await sessionEntry.save();
        res.redirect("/");
      }
    } catch (error) {
      console.error("Error in postSignup:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // GET /logout
  logout: async (req, res) => {
    try {
      const sessionId = req.sessionID;
      req.session.destroy(async (err) => {
        if (err) {
          res.send("Error in logout");
        } else {
          await Session.deleteOne({ sessionId });
          res.redirect("/");
        }
      });
    } catch (error) {
      console.error("Error in logout:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = authController;

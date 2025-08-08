const { queryDatabase } = require("../config/database");

const userController = {
  // GET /profile/:userId
  getProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (req.user.USER_ID == userId) {
        res.redirect(`/dashboard/${userId}`);
        return;
      }
      
      const query = "SELECT NAME ,EMAIL , PHONE , INCOME FROM USER where USER_ID= ?";
      // Finding the User's data
      const profile = await queryDatabase(query, [userId]);

      // Finding the listings which are not booked
      const unbookedListingQuery =
        "SELECT * FROM LISTING WHERE ID NOT IN (SELECT LISTING_ID FROM BOOKING) AND USER_ID = ?";
      const unbookedListing = await queryDatabase(unbookedListingQuery, [userId]);

      // Finding the listings which are booked
      const bookedListingQuery =
        "SELECT * FROM LISTING WHERE ID IN (SELECT LISTING_ID FROM BOOKING) AND USER_ID =? ";
      const bookedListing = await queryDatabase(bookedListingQuery, [userId]);

      res.render("profile.ejs", { profile, user: req.user, bookedListing, unbookedListing });
    } catch (error) {
      console.error("Error in getProfile:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // GET /dashboard/:userId
  getDashboard: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (req.user.USER_ID != userId) {
        // show that we can't see other user's dashboard
        res.redirect(`/profile/${userId}`);
        return;
      }

      const query = "SELECT NAME ,EMAIL , PHONE , INCOME FROM USER where USER_ID= ?";
      // Finding the User's data
      const profile = await queryDatabase(query, [userId]);

      // Finding the listings which are not booked
      const unbookedListingQuery =
        "SELECT * FROM LISTING WHERE ID NOT IN (SELECT LISTING_ID FROM BOOKING) AND USER_ID = ?";
      const unbookedListing = await queryDatabase(unbookedListingQuery, [userId]);
      
      // Finding the listings which are booked
      const bookedListingQuery =
        "SELECT * FROM LISTING WHERE ID IN (SELECT LISTING_ID FROM BOOKING) AND USER_ID =? ";
      const bookedListing = await queryDatabase(bookedListingQuery, [userId]);
      
      // Get Listing Booked By the Me
      const myBookingsQuery =
        "SELECT * FROM LISTING WHERE ID IN (SELECT LISTING_ID FROM BOOKING WHERE USER_ID = ?) ";
      const myBookings = await queryDatabase(myBookingsQuery, [userId]);
      
      res.render("dashboard.ejs", {
        profile,
        user: req.user,
        bookedListing,
        unbookedListing,
        myBookings,
      });
    } catch (error) {
      console.error("Error in getDashboard:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = userController;

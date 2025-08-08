const { queryDatabase } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const bookingController = {
  // GET /book/:id
  bookListing: async (req, res) => {
    try {
      // check if requesting user is same as listing owner -> Can't book
      const { id } = req.params;
      const userId = req.session.userId;
      
      const listingData = (
        await queryDatabase("SELECT * FROM LISTING WHERE ID = ? ", [id])
      )[0];
      
      if (userId == listingData.USER_ID) {
        res.render("alert.ejs", {
          message: "CAN'T BOOK OWN PROPERTY",
          url: `/listing/${id}`,
        });
        return;
      }
      
      // update availability of listing
      await queryDatabase("UPDATE LISTING SET AVAILABILITY = FALSE WHERE ID = ?", [
        id,
      ]);
      
      // add new value in booking column
      await queryDatabase(
        "INSERT INTO BOOKING (ID , USER_ID , LISTING_ID , START_DATE , END_DATE) VALUES (? , ? , ? , ? , ?) ",
        [uuidv4(), userId, id, Date.now, Date.now + 1]
      );
      
      res.render("alert.ejs", {
        message: "Booking Made Successfully",
        url: `dashboard/${userId}`,
      });
    } catch (error) {
      console.error("Error in bookListing:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = bookingController;

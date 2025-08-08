const { queryDatabase } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const listingController = {
  // GET /listing/new
  getNewListing: async (req, res) => {
    try {
      res.render("newListing.ejs");
    } catch (error) {
      console.error("Error in getNewListing:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // GET /listing/:id
  getListingById: async (req, res) => {
    try {
      const { id } = req.params;

      // query to get listing and owner details using join query
      const listingDetailsQuery =
        "SELECT LISTING.USER_ID ,LISTING.ID, LISTING.NAME ,LISTING.IMAGE_URL, LISTING.DESCRIPTION , LISTING.STREET , LISTING.CITY , LISTING.STATE, LISTING.PINCODE , LISTING.PRICEPERMONTH , LISTING.DISCOUNT , LISTING.SIZE , LISTING.RATING,LISTING.AVAILABILITY , USER.NAME AS OWNERNAME, USER.EMAIL , USER.PHONE , USER.INCOME FROM LISTING INNER JOIN USER ON LISTING.USER_ID = USER.USER_ID WHERE LISTING.ID = ?";
      const listingDetails = (await queryDatabase(listingDetailsQuery, [id]))[0];

      // CHECKING IF THE GIVEN LISTING IS IN THE BOOKING TABLE
      if (listingDetails.AVAILABILITY == 0) {
        // BOOKED
        const bookingUserDetailsQuery =
          "SELECT * FROM USER WHERE USER_ID = (SELECT USER_ID FROM BOOKING WHERE LISTING_ID = ?) ";
        const bookingUser = (await queryDatabase(bookingUserDetailsQuery, [id]))[0];
        console.log(bookingUser);
        res.render("listings", { user: req.user, listing: listingDetails, bookingUser });
      } else {
        res.render("listings", { user: req.user, listing: listingDetails });
      }
    } catch (error) {
      console.error("Error in getListingById:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // POST /listing
  createListing: async (req, res) => {
    try {
      if (req.user.USER_ID == undefined) {
        res.redirect("/login");
        return;
      }

      const {
        name,
        description,
        street,
        city,
        state,
        pincode,
        pricePerMonth,
        discount,
        size,
      } = req.body;
      
      const Image_URL = "..\\" + req.file.path;
      const id = uuidv4();
      
      const dataInsertQuery = `INSERT INTO LISTING (IMAGE_URL , ID , USER_ID , NAME , DESCRIPTION , STREET , CITY , STATE , PINCODE ,PRICEPERMONTH,DISCOUNT , SIZE ,RATING ) VALUES 
                                (? , ? , ? , ? , ? , ? , ? , ? , ? ,? , ? ,? ,?)`;
      
      await queryDatabase(dataInsertQuery, [
        Image_URL,
        id,
        req.user.USER_ID,
        name,
        description,
        street,
        city,
        state,
        pincode,
        pricePerMonth,
        discount,
        size,
        1,
      ]);
      
      res.redirect(`/listing/${id}`);
    } catch (error) {
      console.error("Error in createListing:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // DELETE /listing/:id
  deleteListing: async (req, res) => {
    try {
      const { id } = req.params;
      // verify if the original owner is deleting the listing or some other
      // remove that listing from case : listing is booked ()
      // await queryDatabase('DELETE FROM LISTING WHERE ID = ?' , [id]);
      res.render("alert.ejs", {
        message: "Deleting Listing SuccessFully ",
        url: `/dashboard/${req.session.userId}`,
      });
    } catch (error) {
      console.error("Error in deleteListing:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = listingController;

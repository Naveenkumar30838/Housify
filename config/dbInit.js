const { queryDatabase } = require("../config/database");
const InsertData = require("../DataInsertionQueries.js");

// Initial query to Insert Temporary data in the database(SQL Database if it found empty )
const fillDataBase = async () => {
  try {
    let query = "SELECT * FROM USER";
    let res = await queryDatabase(query);
    if (res.length == 0) {
      console.log("userTable is null");
      InsertData.callInsertUser();
    }
    
    query = "SELECT * FROM LISTING";
    res = await queryDatabase(query);
    if (res.length == 0) {
      console.log("Listing Table  is null");
      InsertData.callInsertListing();
    }
    
    query = "SELECT * FROM BOOKING";
    res = await queryDatabase(query);
    if (res.length == 0) {
      console.log("Booking Table is null");
      InsertData.callInsertBooking();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = { fillDataBase };

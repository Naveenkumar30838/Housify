const { queryDatabase } = require("../config/database");

const homeController = {
  // GET /
  getHome: async (req, res) => {
    try {
      // get all locations
      const getLocationQuery = "select distinct(city) from listing limit 50";
      const getPropertyQuery =
        "SELECT IMAGE_URL,ID , NAME,CITY , STATE , PRICEPERMONTH,RATING FROM LISTING ORDER BY ID DESC LIMIT 50";
      const locations = await queryDatabase(getLocationQuery, []);
      const properties = await queryDatabase(getPropertyQuery, []);

      res.render("index", {
        user: req.user,
        locations,
        properties,
      });
    } catch (error) {
      console.error("Error in getHome:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // GET /filter
  filterProperties: async (req, res) => {
    try {
      const { city, sort, minPrice, maxPrice } = req.query;

      // Check if all filters are empty
      if (
        (city == "" || !city) &&
        (sort == "" || !sort) &&
        (!minPrice || minPrice == "") &&
        (!maxPrice || maxPrice == "")
      ) {
        res.redirect("/");
        return;
      }

      // Get all locations
      let getLocationQuery = "select distinct(city) from listing limit 50";
      let locations = await queryDatabase(getLocationQuery, []);
      let properties = [];

      // Build the base query
      let baseQuery =
        "SELECT IMAGE_URL,ID , NAME,CITY , STATE , PRICEPERMONTH,RATING FROM LISTING";
      let whereConditions = [];
      let queryParams = [];

      // Add city filter
      if (city && city !== "") {
        whereConditions.push("CITY = ?");
        queryParams.push(city);
        locations = [{ city: city }];
      }

      // Add price range filters
      if (minPrice && minPrice !== "" && !isNaN(minPrice)) {
        whereConditions.push("PRICEPERMONTH >= ?");
        queryParams.push(parseInt(minPrice));
      }

      if (maxPrice && maxPrice !== "" && !isNaN(maxPrice)) {
        whereConditions.push("PRICEPERMONTH <= ?");
        queryParams.push(parseInt(maxPrice));
      }

      // Build WHERE clause
      if (whereConditions.length > 0) {
        baseQuery += " WHERE " + whereConditions.join(" AND ");
      }

      // Add sorting
      if (sort && (sort === "ASC" || sort === "DESC")) {
        baseQuery += ` ORDER BY PRICEPERMONTH ${sort}`;
      }

      baseQuery += " LIMIT 50";

      // Execute the query
      properties = await queryDatabase(baseQuery, queryParams);

      res.render("index", {
        user: req.user,
        locations,
        properties,
      });
    } catch (error) {
      console.error("Error in filterProperties:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // GET /search
  searchProperties: async (req, res) => {
    try {
      const { query, minPrice, maxPrice } = req.query;

      // Build the base query for search
      let searchQuery =
        "SELECT LISTING.USER_ID, LISTING.ID, LISTING.NAME, LISTING.IMAGE_URL, LISTING.DESCRIPTION, LISTING.STREET, LISTING.CITY, LISTING.STATE, LISTING.PINCODE, LISTING.PRICEPERMONTH, LISTING.DISCOUNT, LISTING.SIZE, LISTING.RATING, LISTING.AVAILABILITY, USER.NAME AS OWNERNAME, USER.EMAIL, USER.PHONE, USER.INCOME FROM LISTING INNER JOIN USER ON LISTING.USER_ID = USER.USER_ID WHERE (LISTING.CITY = ? OR LISTING.STATE = ?)";
      let queryParams = [query, query];

      // Add price range filters to search
      if (minPrice && minPrice !== "" && !isNaN(minPrice)) {
        searchQuery += " AND LISTING.PRICEPERMONTH >= ?";
        queryParams.push(parseInt(minPrice));
      }

      if (maxPrice && maxPrice !== "" && !isNaN(maxPrice)) {
        searchQuery += " AND LISTING.PRICEPERMONTH <= ?";
        queryParams.push(parseInt(maxPrice));
      }

      const listingDetails = await queryDatabase(searchQuery, queryParams);

      // Get all locations
      const getLocationQuery = "select distinct(city) from listing limit 50";
      const locations = await queryDatabase(getLocationQuery, []);

      res.render("index", {
        user: req.user,
        locations,
        properties: listingDetails,
      });
    } catch (error) {
      console.error("Error in searchProperties:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = homeController;

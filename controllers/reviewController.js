const { queryDatabase } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const reviewController = {
  // POST /listing/:id/review
  createReview: async (req, res) => {
    try {
      const { id } = req.params; // listing id
      const userId = req.session.userId;
      const { rating, comment } = req.body;

      if (!userId) {
        return res.redirect("/login");
      }

      // Validate rating
      const parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.render("alert.ejs", {
          message: "Invalid rating value",
          url: `/listing/${id}`,
        });
      }

      // Ensure user has a booking for this listing
      const bookingCheck = await queryDatabase(
        "SELECT 1 FROM BOOKING WHERE USER_ID = ? AND LISTING_ID = ? LIMIT 1",
        [userId, id]
      );
      if (bookingCheck.length === 0) {
        return res.render("alert.ejs", {
          message: "You can only review properties you have booked.",
          url: `/listing/${id}`,
        });
      }

      // Insert review
      const reviewId = uuidv4();
      await queryDatabase(
        "INSERT INTO REVIEW (ID, LISTING_ID, USER_ID, RATING, COMMENT) VALUES (?, ?, ?, ?, ?)",
        [reviewId, id, userId, parsedRating, comment]
      );

      // Update listing average rating
      const avg = (
        await queryDatabase(
          "SELECT ROUND(AVG(RATING)) AS AVG_RATING FROM REVIEW WHERE LISTING_ID = ?",
          [id]
        )
      )[0].AVG_RATING;

      await queryDatabase("UPDATE LISTING SET RATING = ? WHERE ID = ?", [avg || 1, id]);

      res.redirect(`/listing/${id}`);
    } catch (error) {
      console.error("Error in createReview:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = reviewController;



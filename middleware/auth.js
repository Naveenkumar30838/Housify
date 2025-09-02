// Middleware to check if a user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

// Middleware to get user from session
const getUserFromSession = (req, res, next) => {
  req.user = {
    name: req.session.name == undefined ? null : req.session.name,
    USER_ID: req.session.userId,
  };
  next();
};

// Middleware to check if user is logged in for all (upload, add a new Listing)
const checkAuth = (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/login"); // redirect to login URL instead of rendering login.ejs
  }
  next();
};

module.exports = {
  isAuthenticated,
  getUserFromSession,
  checkAuth,
};

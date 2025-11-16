const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next();
  }
  res.redirect('/');
};

module.exports = { isAuthenticated, isNotAuthenticated };
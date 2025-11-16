const isCreator = (req, res, next) => {
  if (req.session && req.session.userRole === 'creator') {
    return next();
  }
  res.status(403).send('Access denied. Creator role required.');
};

const isCandidate = (req, res, next) => {
  if (req.session && req.session.userRole === 'candidate') {
    return next();
  }
  res.status(403).send('Access denied. Candidate role required.');
};

module.exports = { isCreator, isCandidate };
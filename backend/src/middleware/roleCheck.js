const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.userRole) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (allowedRoles.includes(req.userRole)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: `Access denied. Allowed roles: ${allowedRoles.join(', ')}.`,
  });
};

const isAdmin = authorize('admin');
const isCreator = authorize('creator', 'admin');
const isCandidate = authorize('candidate', 'admin');

module.exports = {
  authorize,
  isAdmin,
  isCreator,
  isCandidate,
};

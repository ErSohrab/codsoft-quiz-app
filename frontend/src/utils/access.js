export const ROLE_HOME_ROUTES = {
  admin: '/my-quizzes',
  creator: '/my-quizzes',
  candidate: '/quiz-list',
};

export const canAccessRole = (userRole, requiredRole) => {
  if (!requiredRole) return true;
  if (!userRole) return false;
  if (userRole === 'admin') return true;
  return userRole === requiredRole;
};

export const getDefaultRouteForRole = (role) =>
  ROLE_HOME_ROUTES[role] || '/';

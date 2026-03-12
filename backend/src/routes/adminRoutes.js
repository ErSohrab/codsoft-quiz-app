const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.use(isAuthenticated, isAdmin);

router.get('/overview', adminController.getOverview);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);
router.get('/activity', adminController.getActivity);
router.get('/quizzes', adminController.getQuizzes);
router.get('/results', adminController.getResults);

module.exports = router;

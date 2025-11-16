const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middleware/auth');

router.get('/register', isNotAuthenticated, authController.getRegister);
router.post('/register', isNotAuthenticated, authController.postRegister);
router.get('/login', isNotAuthenticated, authController.getLogin);
router.post('/login', isNotAuthenticated, authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;
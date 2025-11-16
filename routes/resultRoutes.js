const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { isAuthenticated } = require('../middleware/auth');
const { isCreator } = require('../middleware/roleCheck');

router.get('/quiz-result/:id', isAuthenticated, resultController.getQuizResult);
router.get('/my-results', isAuthenticated, isCreator, resultController.getMyResults);

module.exports = router;
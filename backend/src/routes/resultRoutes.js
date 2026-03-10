const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { isAuthenticated, extractUser } = require('../middleware/auth');
const { isCreator, isCandidate } = require('../middleware/roleCheck');

// Submit quiz (for candidate)
router.post(
  '/submit',
  isAuthenticated,
  isCandidate,
  resultController.submitQuiz
);

// Get specific result
router.get(
  '/:id',
  isAuthenticated,
  resultController.getResultById
);

// Get my results (for candidate)
router.get(
  '/candidate/my-results',
  isAuthenticated,
  isCandidate,
  resultController.getMyResults
);

// Get quiz results (for creator)
router.get(
  '/quiz/:quizId',
  isAuthenticated,
  isCreator,
  resultController.getQuizResults
);

module.exports = router;

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { isAuthenticated, extractUser } = require('../middleware/auth');
const { isCreator, isCandidate } = require('../middleware/roleCheck');

// Public route (no auth) - list all quizzes
router.get('/', extractUser, quizController.getAllQuizzes);

// Get specific quiz (for taking)
router.get('/:id', extractUser, quizController.getQuizById);

// Private routes (authenticated)
// Creator routes
router.post(
  '/',
  isAuthenticated,
  isCreator,
  quizController.createQuiz
);

router.get(
  '/creator/my-quizzes',
  isAuthenticated,
  isCreator,
  quizController.getMyQuizzes
);

router.put(
  '/:id',
  isAuthenticated,
  isCreator,
  quizController.updateQuiz
);

router.delete(
  '/:id',
  isAuthenticated,
  isCreator,
  quizController.deleteQuiz
);

module.exports = router;

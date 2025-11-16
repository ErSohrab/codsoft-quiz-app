const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { isAuthenticated } = require('../middleware/auth');
const { isCreator, isCandidate } = require('../middleware/roleCheck');

router.get('/create-quiz', isAuthenticated, isCreator, quizController.getCreateQuiz);
router.post('/create-quiz', isAuthenticated, isCreator, quizController.postCreateQuiz);
router.get('/my-quizzes', isAuthenticated, isCreator, quizController.getMyQuizzes);
router.get('/quiz-list', isAuthenticated, isCandidate, quizController.getQuizList);
router.get('/take-quiz/:id', isAuthenticated, isCandidate, quizController.getTakeQuiz);
router.post('/quizzes/:id/submit', isAuthenticated, isCandidate, quizController.postSubmitQuiz);

module.exports = router;
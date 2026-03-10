const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Submit quiz and save result
// @route   POST /api/results/submit
// @access  Private (Candidate only)
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID and answers are required',
      });
    }

    // Fetch quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Fetch user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate score
    const parsedAnswers = Array.isArray(answers)
      ? answers
      : JSON.parse(answers || '[]');
    const totalQuestions = quiz.questions.length;
    const detailedAnswers = [];
    let score = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const question = quiz.questions[i];
      const selectedAnswer =
        i < parsedAnswers.length ? Number(parsedAnswers[i]) : null;
      const correctAnswer = question.correctAnswer;

      const isCorrect = selectedAnswer === correctAnswer;
      if (isCorrect) score++;

      detailedAnswers.push({
        questionIndex: i,
        question: question.question,
        selectedAnswer,
        correctAnswer,
        isCorrect,
      });
    }

    const percentage =
      totalQuestions === 0 ? 0 : (score / totalQuestions) * 100;

    // Save result
    const result = new Result({
      quizId,
      userId: req.userId,
      username: user.username,
      quizTitle: quiz.title,
      answers: detailedAnswers,
      score,
      totalQuestions,
      percentage: Number(percentage.toFixed(2)),
      timeTaken: timeTaken || 0,
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      result: {
        id: result._id,
        score,
        totalQuestions,
        percentage: result.percentage,
        grade: result.grade,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit quiz',
    });
  }
};

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate(
      'quizId',
      'title duration'
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    if (req.userRole !== 'admin') {
      const quiz = await Quiz.findById(result.quizId).select('creatorId');
      const isCandidateOwner =
        result.userId.toString() === req.userId.toString();
      const isCreatorOwner =
        quiz && quiz.creatorId.toString() === req.userId.toString();

      if (!isCandidateOwner && !isCreatorOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this result',
        });
      }
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch result',
    });
  }
};

// @desc    Get all results for a candidate
// @route   GET /api/results/my-results
// @access  Private (Candidate)
exports.getMyResults = async (req, res) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { userId: req.userId };
    const results = await Result.find(filter)
      .sort({ createdAt: -1 })
      .populate('quizId', 'title');

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch results',
    });
  }
};

// @desc    Get results for a quiz (for creator)
// @route   GET /api/results/quiz/:quizId
// @access  Private (Creator only)
exports.getQuizResults = async (req, res) => {
  try {
    // Verify quiz belongs to creator
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (
      req.userRole !== 'admin' &&
      quiz.creatorId.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these results',
      });
    }

    const results = await Result.find({ quizId: req.params.quizId }).sort({
      createdAt: -1,
    });

    // Calculate statistics
    const stats = {
      totalAttempts: results.length,
      averageScore:
        results.length > 0
          ? (
              results.reduce((sum, r) => sum + r.score, 0) / results.length
            ).toFixed(2)
          : 0,
      averagePercentage:
        results.length > 0
          ? (
              results.reduce((sum, r) => sum + r.percentage, 0) /
              results.length
            ).toFixed(2)
          : 0,
    };

    res.status(200).json({
      success: true,
      count: results.length,
      stats,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch quiz results',
    });
  }
};

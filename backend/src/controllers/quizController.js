const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Creator only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, duration } = req.body;

    // Validation
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and questions are required',
      });
    }

    const user = await User.findById(req.userId).select('username');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      duration: duration || 0,
      creatorId: req.userId,
      creatorName: user.username,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create quiz',
    });
  }
};

// @desc    Get all quizzes (for candidates to take)
// @route   GET /api/quizzes
// @access  Private
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .select('-questions') // Don't send questions initially
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch quizzes',
    });
  }
};

// @desc    Get a specific quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch quiz',
    });
  }
};

// @desc    Get my quizzes (for creator)
// @route   GET /api/quizzes/my-quizzes
// @access  Private (Creator only)
exports.getMyQuizzes = async (req, res) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { creatorId: req.userId };
    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch quizzes',
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Creator only)
exports.updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Check if user is quiz creator
    if (
      req.userRole !== 'admin' &&
      quiz.creatorId.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz',
      });
    }

    // Update fields
    const { title, description, questions, duration, isPublished } = req.body;

    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions) quiz.questions = questions;
    if (duration !== undefined) quiz.duration = duration;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update quiz',
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Creator only)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Check if user is quiz creator
    if (
      req.userRole !== 'admin' &&
      quiz.creatorId.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz',
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete quiz',
    });
  }
};

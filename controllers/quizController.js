const Quiz = require('../models/Quiz');

exports.getCreateQuiz = (req, res) => {
  res.render('create-quiz', { error: null, success: null });
};

exports.postCreateQuiz = async (req, res) => {
  try {
    const { title, questions, duration } = req.body;

    const durationSeconds = Number(duration) && !Number.isNaN(Number(duration)) ? Number(duration) : 0;

    const quiz = new Quiz({
      title,
      creatorId: req.session.userId,
      creatorName: req.session.username,
      questions: JSON.parse(questions),
      duration: durationSeconds
    });

    await quiz.save();
    res.render('create-quiz', { 
      error: null, 
      success: 'Quiz created successfully!' 
    });
  } catch (error) {
    res.render('create-quiz', { 
      error: 'Failed to create quiz. Please try again.', 
      success: null 
    });
  }
};

exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creatorId: req.session.userId })
      .sort({ createdAt: -1 });
    res.render('my-quizzes', { quizzes });
  } catch (error) {
    res.render('my-quizzes', { quizzes: [] });
  }
};

exports.getQuizList = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.render('quiz-list', { quizzes });
  } catch (error) {
    res.render('quiz-list', { quizzes: [] });
  }
};

exports.getTakeQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.redirect('/quiz-list');
    }
    res.render('take-quiz', { quiz });
  } catch (error) {
    res.redirect('/quiz-list');
  }
};

exports.postSubmitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId) {
      console.error('No quizId in request body');
      return res.status(400).send('Missing quizId');
    }

    // fetch quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.error('Quiz not found for id', quizId);
      return res.status(404).send('Quiz not found');
    }

    // parse answers safely
    let parsedAnswers;
    try {
      parsedAnswers = Array.isArray(answers) ? answers : JSON.parse(answers || '[]');
    } catch (err) {
      console.error('Failed to parse answers JSON', { raw: answers, err });
      return res.status(400).send('Invalid answers payload');
    }

    // ensure parsedAnswers is an array
    if (!Array.isArray(parsedAnswers)) {
      console.error('Parsed answers is not an array', parsedAnswers);
      parsedAnswers = [];
    }

    const total = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
    const detailedAnswers = [];
    let score = 0;

    // helper to coerce types so "1" matches 1, etc.
    const coerce = v => {
      if (v === null || v === undefined || v === '') return null;
      // try number coercion if value looks numeric
      if (!Number.isNaN(Number(v))) return Number(v);
      // otherwise keep as string
      return String(v);
    };

    for (let i = 0; i < total; i++) {
      const q = quiz.questions[i];
      const rawAns = i < parsedAnswers.length ? parsedAnswers[i] : null;
      const selected = coerce(rawAns);
      // guard if question missing
      const correctRaw = q && (q.correctAnswer !== undefined ? q.correctAnswer : null);
      const correct = coerce(correctRaw);

      const isAnswered = selected !== null;
      const isCorrect = isAnswered && (selected === correct);

      if (isCorrect) score++;

      detailedAnswers.push({
        questionIndex: i,
        questionText: q ? q.question : null,
        selectedAnswer: selected,
        correctAnswer: correct,
        isCorrect,
      });
    }

    const percentage = total === 0 ? 0 : (score / total) * 100;

    const Result = require('../models/Result');
    const result = new Result({
      quizId,
      userId: req.session ? req.session.userId : null,
      username: req.session ? req.session.username : null,
      quizTitle: quiz.title,
      answers: detailedAnswers,
      score,
      totalQuestions: total,
      percentage: Number(percentage.toFixed(2)),
      createdAt: new Date()
    });

    await result.save();
    res.redirect(`/quiz-result/${result._id}`);
  } catch (error) {
    res.redirect('/quiz-list');
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Verify the quiz exists and belongs to the current user
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Verify the user is the creator
    if (quiz.creatorId.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this quiz' });
    }

    // Delete all Results related to this quiz
    const Result = require('../models/Result');
    await Result.deleteMany({ quizId: quizId });

    // Delete the quiz itself
    await Quiz.findByIdAndDelete(quizId);

    // Redirect back to my-quizzes
    res.redirect('/my-quizzes');
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};

exports.getEditQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    // ensure owner
    if (quiz.creatorId.toString() !== req.session.userId) {
      return res.status(403).send('Not authorized to edit this quiz');
    }

    res.render('edit-quiz', { quiz, error: null, success: null });
  } catch (error) {
    console.error('Error loading edit quiz:', error);
    res.redirect('/my-quizzes');
  }
};

exports.postEditQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    // ensure owner
    if (quiz.creatorId.toString() !== req.session.userId) {
      return res.status(403).send('Not authorized to edit this quiz');
    }

    const { title, questions, duration } = req.body;

    // parse questions if string
    let parsedQuestions = [];
    try {
      parsedQuestions = Array.isArray(questions) ? questions : JSON.parse(questions || '[]');
    } catch (err) {
      console.error('Failed to parse questions JSON on edit', err);
      return res.render('edit-quiz', { quiz, error: 'Invalid questions format', success: null });
    }

    // apply updates
    quiz.title = title || quiz.title;
    quiz.questions = parsedQuestions;
    quiz.duration = Number(duration) || 0;
    quiz.updatedAt = new Date();

    await quiz.save();

    res.redirect('/my-quizzes');
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).send('Failed to update quiz');
  }
};

exports.getQuizJson = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.creatorId.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({
      _id: quiz._id,
      title: quiz.title,
      questions: quiz.questions || [],
      duration: quiz.duration || 0,
      creatorName: quiz.creatorName || null,
      createdAt: quiz.createdAt || null
    });
  } catch (error) {
    console.error('Error returning quiz JSON:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
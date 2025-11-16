const Quiz = require('../models/Quiz');

exports.getCreateQuiz = (req, res) => {
  res.render('create-quiz', { error: null, success: null });
};

exports.postCreateQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const quiz = new Quiz({
      title,
      creatorId: req.session.userId,
      creatorName: req.session.username,
      questions: JSON.parse(questions)
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

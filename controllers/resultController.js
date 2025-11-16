const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

exports.getQuizResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId');
    
    if (!result) {
      return res.redirect('/quiz-list');
    }

    res.render('quiz-result', { result });
  } catch (error) {
    res.redirect('/quiz-list');
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creatorId: req.session.userId });
    const quizIds = quizzes.map(q => q._id);

    const results = await Result.find({ quizId: { $in: quizIds } })
      .sort({ attemptedAt: -1 })
      .populate('quizId');

    res.render('my-results', { results });
  } catch (error) {
    res.render('my-results', { results: [] });
  }
};
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

const buildUserStatsMap = async () => {
  const [quizCounts, resultCounts, resultAverages] = await Promise.all([
    Quiz.aggregate([
      { $group: { _id: '$creatorId', createdQuizCount: { $sum: 1 } } },
    ]),
    Result.aggregate([
      { $group: { _id: '$userId', attemptCount: { $sum: 1 }, lastResultAt: { $max: '$createdAt' } } },
    ]),
    Result.aggregate([
      {
        $group: {
          _id: '$userId',
          averageScore: { $avg: '$percentage' },
        },
      },
    ]),
  ]);

  const statsMap = new Map();

  quizCounts.forEach((item) => {
    statsMap.set(String(item._id), {
      createdQuizCount: item.createdQuizCount,
      attemptCount: 0,
      averageScore: null,
      lastActivityAt: null,
    });
  });

  resultCounts.forEach((item) => {
    const existing = statsMap.get(String(item._id)) || {
      createdQuizCount: 0,
      attemptCount: 0,
      averageScore: null,
      lastActivityAt: null,
    };

    statsMap.set(String(item._id), {
      ...existing,
      attemptCount: item.attemptCount,
      lastActivityAt: item.lastResultAt,
    });
  });

  resultAverages.forEach((item) => {
    const existing = statsMap.get(String(item._id)) || {
      createdQuizCount: 0,
      attemptCount: 0,
      averageScore: null,
      lastActivityAt: null,
    };

    statsMap.set(String(item._id), {
      ...existing,
      averageScore: Number(item.averageScore.toFixed(1)),
    });
  });

  return statsMap;
};

exports.getOverview = async (req, res) => {
  try {
    const [users, quizzes, results, latestUsers, latestQuizzes, latestResults] =
      await Promise.all([
        User.countDocuments(),
        Quiz.countDocuments(),
        Result.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5),
        Quiz.find().sort({ createdAt: -1 }).limit(5),
        Result.find().sort({ createdAt: -1 }).limit(5),
      ]);

    const recentActivity = [
      ...latestUsers.map((user) => ({
        id: `user-${user._id}`,
        type: 'user_registered',
        title: `${user.username} joined the platform`,
        subtitle: `${user.email} registered as ${user.role}`,
        createdAt: user.createdAt,
      })),
      ...latestQuizzes.map((quiz) => ({
        id: `quiz-${quiz._id}`,
        type: 'quiz_created',
        title: `${quiz.title} was created`,
        subtitle: `Created by ${quiz.creatorName}`,
        createdAt: quiz.createdAt,
      })),
      ...latestResults.map((result) => ({
        id: `result-${result._id}`,
        type: 'quiz_submitted',
        title: `${result.username} submitted ${result.quizTitle}`,
        subtitle: `Score ${result.score}/${result.totalQuestions} (${result.percentage}%)`,
        createdAt: result.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users,
        totalQuizzes: quizzes,
        totalResults: results,
      },
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load admin overview',
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users, userStatsMap] = await Promise.all([
      User.find().sort({ createdAt: -1 }),
      buildUserStatsMap(),
    ]);

    const enrichedUsers = users.map((user) => {
      const stats = userStatsMap.get(String(user._id)) || {
        createdQuizCount: 0,
        attemptCount: 0,
        averageScore: null,
        lastActivityAt: null,
      };

      return {
        ...user.toJSON(),
        stats,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load users',
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!User.USER_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected',
      });
    }

    if (req.params.id === req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user role',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const quizzes = await Quiz.find({ creatorId: user._id }).select('_id');
    const quizIds = quizzes.map((quiz) => quiz._id);

    await Promise.all([
      Result.deleteMany({ userId: user._id }),
      quizIds.length ? Result.deleteMany({ quizId: { $in: quizIds } }) : Promise.resolve(),
      Quiz.deleteMany({ creatorId: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'User and related activity deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const [users, quizzes, results] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(20),
      Quiz.find().sort({ createdAt: -1 }).limit(20),
      Result.find().sort({ createdAt: -1 }).limit(20),
    ]);

    const activity = [
      ...users.map((user) => ({
        id: `user-${user._id}`,
        type: 'user_registered',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        createdAt: user.createdAt,
        description: `${user.username} registered as ${user.role}`,
      })),
      ...quizzes.map((quiz) => ({
        id: `quiz-${quiz._id}`,
        type: 'quiz_created',
        user: {
          id: quiz.creatorId,
          username: quiz.creatorName,
          email: null,
          role: 'creator',
        },
        createdAt: quiz.createdAt,
        description: `${quiz.creatorName} created "${quiz.title}"`,
      })),
      ...results.map((result) => ({
        id: `result-${result._id}`,
        type: 'quiz_submitted',
        user: {
          id: result.userId,
          username: result.username,
          email: null,
          role: 'candidate',
        },
        createdAt: result.createdAt,
        description: `${result.username} submitted "${result.quizTitle}" with ${result.percentage}%`,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 30);

    res.status(200).json({
      success: true,
      count: activity.length,
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load user activity',
    });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load quiz list',
    });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load result list',
    });
  }
};

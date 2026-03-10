const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    quizTitle: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        question: String,
        selectedAnswer: Number,
        correctAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeTaken: {
      type: Number,
      default: 0, // time in seconds
    },
  },
  { timestamps: true }
);

// Index for better query performance
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ quizId: 1 });

// Virtual for grade
resultSchema.virtual('grade').get(function () {
  if (this.percentage >= 90) return 'A';
  if (this.percentage >= 80) return 'B';
  if (this.percentage >= 70) return 'C';
  if (this.percentage >= 60) return 'D';
  return 'F';
});

resultSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Result', resultSchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (v) {
        return v.length >= 2 && v.length <= 4;
      },
      message: 'Provide 2-4 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: [true, 'Add at least one question'],
      validate: {
        validator: function (v) {
          return v.length >= 1;
        },
        message: 'Quiz must have at least one question',
      },
    },
    duration: {
      type: Number,
      default: 0, // duration in seconds; 0 means no limit
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for better query performance
quizSchema.index({ creatorId: 1, createdAt: -1 });

module.exports = mongoose.model('Quiz', quizSchema);

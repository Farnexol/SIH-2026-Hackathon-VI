import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    quizCode: {
      type: String,
      required: true
    },
    quizTitle: {
      type: String,
      required: true
    },
    answers: {
      type: Map,
      of: String,
      default: {}
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    scorePercentage: {
      type: Number,
      required: true
    },
    correctCount: {
      type: Number,
      required: true
    },
    incorrectCount: {
      type: Number,
      required: true
    },
    timeSpentSeconds: {
      type: Number,
      default: 452
    },
    timeSpent: {
      type: String,
      default: '7m 32s'
    },
    competencyDelta: {
      competencyName: String,
      beforeScore: Number,
      afterScore: Number,
      delta: String,
      status: String
    },
    aiAnalysis: {
      type: String
    },
    nextRecommendation: {
      courseId: String,
      title: String,
      reason: String,
      route: String
    }
  },
  {
    timestamps: true
  }
);

quizAttemptSchema.index({ user: 1, createdAt: -1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;

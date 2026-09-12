import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    questionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: [optionSchema], required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
    competency: { type: String, default: 'Data Analysis' },
    difficulty: { type: String, default: 'Medium' }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    competency: {
      type: String,
      required: true
    },
    questionsCount: {
      type: Number,
      default: 10
    },
    estimatedMinutes: {
      type: Number,
      default: 15
    },
    status: {
      type: String,
      default: 'Available'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    description: {
      type: String
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material'
    },
    questions: {
      type: [questionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;

import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Not Started', 'Locked'],
      default: 'Not Started'
    },
    progress: { type: Number, default: 0 },
    score: { type: String },
    completedDate: { type: String },
    description: { type: String },
    modulesCount: { type: Number, default: 4 },
    isAssessment: { type: Boolean, default: false },
    courseCode: { type: String }
  },
  { _id: false }
);

const learningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    competencyTarget: {
      type: String,
      default: 'Python for Data Analysis'
    },
    requiredLevel: {
      type: String,
      default: '80% Required Proficiency'
    },
    currentLevel: {
      type: String,
      default: '38% Current Proficiency'
    },
    targetRole: {
      type: String,
      default: 'Statistical Officer - Automated Micro-Data Specialist'
    },
    overallProgress: {
      type: Number,
      default: 35
    },
    steps: {
      type: [stepSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;

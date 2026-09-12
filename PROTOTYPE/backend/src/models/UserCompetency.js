import mongoose from 'mongoose';

const userCompetencySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    competency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competency',
      required: true
    },
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    currentScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 50
    },
    requiredScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 75
    },
    gap: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ['Strong', 'Moderate', 'Needs Improvement'],
      default: 'Moderate'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low', 'No Gap'],
      default: 'No Gap'
    },
    trend: {
      type: String,
      default: '+0%'
    },
    trendDirection: {
      type: String,
      enum: ['up', 'down', 'neutral'],
      default: 'neutral'
    },
    description: {
      type: String
    },
    assessmentsCompleted: {
      type: Number,
      default: 0
    },
    recommendedAction: {
      type: String
    },
    lastAssessed: {
      type: String,
      default: 'Not assessed yet'
    }
  },
  {
    timestamps: true
  }
);

userCompetencySchema.index({ user: 1, competency: 1 }, { unique: true });
userCompetencySchema.index({ user: 1, code: 1 });

const UserCompetency = mongoose.model('UserCompetency', userCompetencySchema);

export default UserCompetency;

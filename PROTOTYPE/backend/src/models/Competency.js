import mongoose from 'mongoose';

const competencySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    defaultRequiredScore: {
      type: Number,
      default: 75
    },
    recommendedActionDefault: {
      type: String,
      default: 'Complete recommended capacity building module'
    }
  },
  {
    timestamps: true
  }
);

const Competency = mongoose.model('Competency', competencySchema);

export default Competency;

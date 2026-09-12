import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true
    },
    competencies: {
      type: [String],
      required: true,
      index: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Beginner to Intermediate', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    duration: {
      type: String,
      default: '3h 00m'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 150
    },
    source: {
      type: String,
      default: 'iGOT Karmayogi'
    },
    igotCourseId: {
      type: String,
      default: 'IGOT-STAT-101'
    },
    category: {
      type: String,
      default: 'Statistical Computing'
    },
    instructor: {
      type: String
    },
    learningObjectives: {
      type: [String],
      default: []
    },
    modules: {
      type: [moduleSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;

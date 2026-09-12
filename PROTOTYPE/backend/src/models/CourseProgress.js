import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    courseCode: {
      type: String,
      required: true
    },
    enrolled: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completedModules: {
      type: [Number],
      default: []
    },
    activeModuleId: {
      type: Number,
      default: 1
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });
courseProgressSchema.index({ user: 1, courseCode: 1 });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide official officer name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide official email'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [4, 'Password must be at least 4 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['Learner', 'Admin', 'Officer'],
      default: 'Learner'
    },
    isProfileCompleted: {
      type: Boolean,
      default: true
    },
    designation: {
      type: String,
      default: 'Statistical Officer (Grade II)'
    },
    department: {
      type: String,
      default: 'Data Analysis Division'
    },
    organization: {
      type: String,
      default: 'National Statistical Office (NSO), MoSPI'
    },
    id: {
      type: Number,
      index: true
    },
    employeeId: {
      type: String,
      index: true
    },
    startingDate: {
      type: String
    },
    joiningDate: {
      type: String
    },
    avatarUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    competencyFramework: {
      type: String,
      default: 'Official Statistical System Framework (OSSF-2026)'
    },
    learningGoals: {
      type: String,
      default: 'Master Python for Statistical Computing & Advanced Survey Data Visualization'
    },
    stats: {
      overallCompetency: { type: Number, default: 0 },
      competencyDelta: { type: String, default: 'Diagnostic pending' },
      learningProgress: { type: Number, default: 0 },
      completedCourses: { type: Number, default: 0 },
      totalCourses: { type: Number, default: 0 },
      assessmentScore: { type: Number, default: 0 },
      scoreDelta: { type: String, default: 'No diagnostic taken' },
      learningStreak: { type: Number, default: 0 },
      learningHoursTotal: { type: Number, default: 0 }
    },
    preferences: {
      learningDifficulty: { type: String, default: 'Intermediate' },
      preferredContentType: { type: String, default: 'Interactive Modules & Case Studies' },
      language: { type: String, default: 'English' },
      emailNotifications: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Ensure sequential id, employeeId & hash password if modified
userSchema.pre('save', async function (next) {
  if (this.id === undefined || this.id === null) {
    const count = await mongoose.model('User').countDocuments();
    this.id = count + 1;
  }

  if (!this.employeeId || String(this.employeeId).trim() === '') {
    this.employeeId = String(this.id);
  }

  if (!this.startingDate) {
    const d = this.createdAt ? new Date(this.createdAt) : new Date();
    this.startingDate = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    this.joiningDate = this.startingDate;
  }

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

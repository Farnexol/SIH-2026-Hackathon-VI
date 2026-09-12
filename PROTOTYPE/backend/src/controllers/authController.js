import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { initializeUserCompetencies } from '../services/competencyService.js';
import { initializeUserLearningPath } from '../services/learningPathService.js';

// @desc    Get next sequential officer ID for registration (length + 1)
// @route   GET /api/auth/next-id
// @access  Public
export const getNextId = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    return sendSuccess(res, { nextId: count + 1 }, 'Next ID retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new statistical officer / learner
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Please provide name, email, and password', 400);
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return sendError(res, 'An officer account with this email already exists', 400);
    }

    const count = await User.countDocuments();
    const nextSeqId = count + 1;

    const now = new Date();
    const formattedStartingDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const userData = {
      id: nextSeqId,
      employeeId: String(nextSeqId),
      name,
      email: email.toLowerCase(),
      password,
      department: department || 'Data Analysis Division',
      startingDate: formattedStartingDate,
      joiningDate: formattedStartingDate,
      isProfileCompleted: false
    };

    const user = await User.create(userData);

    // Initialize user's baseline competencies & learning path
    await initializeUserCompetencies(user._id);
    await initializeUserLearningPath(user._id);

    const token = generateToken({ id: user._id, role: user.role });

    const safeUser = user.toObject();
    delete safeUser.password;

    return sendSuccess(
      res,
      {
        token,
        user: safeUser
      },
      'Cadre account successfully registered',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate officer & return JWT token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide email/ID and password', 400);
    }

    // Allow login by email OR employeeId
    const query = email.includes('@')
      ? { email: email.toLowerCase() }
      : { employeeId: email.trim() };

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return sendError(res, 'Invalid official credentials', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid official credentials', 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    const safeUser = user.toObject();
    delete safeUser.password;

    return sendSuccess(
      res,
      {
        token,
        user: safeUser
      },
      'Authentication successful'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in officer profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, user, 'Authenticated user profile retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout officer (invalidate client state)
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  return sendSuccess(res, {}, 'Logged out successfully');
};

// @desc    Request password reset instructions
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, 'Please provide official email address', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user does not exist for security
      return sendSuccess(
        res,
        {},
        'If this email is registered, recovery instructions have been dispatched.'
      );
    }

    // In a real email setup, dispatch SMTP reset link.
    // For this prototype, generate token and return success message.
    const resetToken = 'statiq_reset_' + Math.random().toString(36).substring(2);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    return sendSuccess(
      res,
      { resetToken },
      'Recovery instructions dispatched to ' + email
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with recovery token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return sendError(res, 'Please provide token and new password', 400);
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return sendError(res, 'Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return sendSuccess(res, {}, 'Password successfully updated. You may now sign in.');
  } catch (error) {
    next(error);
  }
};

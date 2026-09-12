import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Ensure startingDate is populated from createdAt if previously missing
    if (!user.startingDate && user.createdAt) {
      const d = new Date(user.createdAt);
      user.startingDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      user.joiningDate = user.startingDate;
      await user.save();
    }

    const safeUser = user.toObject();
    delete safeUser.password;

    return sendSuccess(res, safeUser, 'Officer profile retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const {
      name,
      designation,
      department,
      organization,
      competencyFramework,
      learningGoals,
      preferences
    } = req.body;

    if (name !== undefined && name.trim() !== '') user.name = name.trim();
    if (designation !== undefined && designation.trim() !== '') user.designation = designation.trim();
    if (department !== undefined && department.trim() !== '') user.department = department.trim();
    if (organization !== undefined && organization.trim() !== '') user.organization = organization.trim();
    if (competencyFramework !== undefined && competencyFramework.trim() !== '') {
      user.competencyFramework = competencyFramework.trim();
    }
    if (learningGoals !== undefined) user.learningGoals = learningGoals;

    if (preferences && typeof preferences === 'object') {
      const currentPrefs = user.preferences?.toObject ? user.preferences.toObject() : (user.preferences || {});
      user.preferences = {
        ...currentPrefs,
        ...preferences
      };
    }

    user.isProfileCompleted = true;

    // Explicitly lock immutable fields: startingDate, id, employeeId, role cannot be altered
    const updatedUser = await user.save();

    const safeUser = updatedUser.toObject();
    delete safeUser.password;

    return sendSuccess(res, safeUser, 'Officer profile updated successfully in database');
  } catch (error) {
    next(error);
  }
};

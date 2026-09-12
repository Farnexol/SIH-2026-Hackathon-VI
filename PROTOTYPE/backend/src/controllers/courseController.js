import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import User from '../models/User.js';
import LearningPath from '../models/LearningPath.js';
import { getRecommendedCourses } from '../services/recommendationService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get courses with filters & recommendation flags
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res, next) => {
  try {
    const { search, competency, difficulty, recommendedOnly } = req.query;

    let courses = await getRecommendedCourses(req.user._id);

    if (competency && competency !== 'All') {
      courses = courses.filter((c) =>
        c.competencies.some((comp) => comp.toLowerCase() === competency.toLowerCase())
      );
    }

    if (difficulty && difficulty !== 'All') {
      courses = courses.filter((c) =>
        c.difficulty.toLowerCase().includes(difficulty.toLowerCase())
      );
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      courses = courses.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.competencies.some((comp) => comp.toLowerCase().includes(q))
      );
    }

    if (recommendedOnly === 'true' || recommendedOnly === true) {
      courses = courses.filter((c) => c.recommended);
    }

    return sendSuccess(res, courses, `Found ${courses.length} courses`);
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific course by code or ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res, next) => {
  try {
    const courses = await getRecommendedCourses(req.user._id);
    const found = courses.find((c) => c.id === req.params.id || c._id.toString() === req.params.id);

    if (!found) {
      return sendError(res, `Course with id ${req.params.id} not found`, 404);
    }

    return sendSuccess(res, found, 'Course details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended courses for authenticated officer
// @route   GET /api/courses/recommended
// @access  Private
export const getRecommendedOnly = async (req, res, next) => {
  try {
    const courses = await getRecommendedCourses(req.user._id);
    const recommended = courses.filter((c) => c.recommended);
    return sendSuccess(res, recommended, 'Recommended courses retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll authenticated officer into course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      $or: [{ code: req.params.id }, { _id: req.params.id }]
    });

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    const progress = await CourseProgress.findOneAndUpdate(
      { user: req.user._id, course: course._id },
      {
        user: req.user._id,
        course: course._id,
        courseCode: course.code,
        enrolled: true,
        startedAt: new Date(),
        lastAccessedAt: new Date()
      },
      { upsert: true, new: true }
    );

    const totalEnrolled = await CourseProgress.countDocuments({ user: req.user._id, enrolled: true });
    await User.findByIdAndUpdate(req.user._id, {
      'stats.totalCourses': totalEnrolled
    });

    return sendSuccess(res, progress, `Enrolled in ${course.title}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress server-side
// @route   POST /api/courses/:id/progress
// @access  Private
export const updateProgress = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      $or: [{ code: req.params.id }, { _id: req.params.id }]
    });

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    const { completedModuleId, activeModuleId } = req.body;

    let progressDoc = await CourseProgress.findOne({
      user: req.user._id,
      course: course._id
    });

    if (!progressDoc) {
      progressDoc = new CourseProgress({
        user: req.user._id,
        course: course._id,
        courseCode: course.code,
        enrolled: true,
        startedAt: new Date()
      });
    }

    if (completedModuleId && !progressDoc.completedModules.includes(completedModuleId)) {
      progressDoc.completedModules.push(completedModuleId);
    }

    if (activeModuleId) {
      progressDoc.activeModuleId = activeModuleId;
    }

    // Deterministic server calculation of percentage
    const totalModules = course.modules.length || 1;
    progressDoc.progress = Math.round((progressDoc.completedModules.length / totalModules) * 100);

    if (progressDoc.progress >= 100) {
      progressDoc.completedAt = new Date();
    }
    progressDoc.lastAccessedAt = new Date();

    await progressDoc.save();

    // Synchronize aggregate user course stats
    const allUserProgress = await CourseProgress.find({ user: req.user._id, enrolled: true });
    const completedCount = allUserProgress.filter((p) => p.progress >= 100).length;
    const avgProgress = allUserProgress.length > 0
      ? Math.round(allUserProgress.reduce((acc, curr) => acc + (curr.progress || 0), 0) / allUserProgress.length)
      : 0;

    await User.findByIdAndUpdate(req.user._id, {
      'stats.totalCourses': allUserProgress.length,
      'stats.completedCourses': completedCount,
      'stats.learningProgress': avgProgress,
      'stats.learningStreak': Math.max(1, (req.user.stats?.learningStreak || 0) + 1),
      $inc: { 'stats.learningHoursTotal': 0.5 }
    });

    // Also synchronize LearningPath step if this course matches
    const userPath = await LearningPath.findOne({ user: req.user._id });
    if (userPath) {
      let stepUpdated = false;
      userPath.steps.forEach((step, idx) => {
        if (step.courseCode === course.code) {
          if (progressDoc.progress >= 100) {
            step.status = 'Completed';
            step.progress = 100;
            step.completedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (userPath.steps[idx + 1] && userPath.steps[idx + 1].status === 'Locked') {
              userPath.steps[idx + 1].status = 'Not Started';
            }
          } else if (progressDoc.progress > 0) {
            step.status = 'In Progress';
            step.progress = progressDoc.progress;
          }
          stepUpdated = true;
        }
      });

      if (stepUpdated) {
        const completedSteps = userPath.steps.filter((s) => s.status === 'Completed').length;
        const inProg = userPath.steps.find((s) => s.status === 'In Progress');
        const inProgVal = inProg ? (inProg.progress || 0) / 100 : 0;
        userPath.overallProgress = Math.round(((completedSteps + inProgVal) / userPath.steps.length) * 100);
        await userPath.save();
      }
    }

    return sendSuccess(res, progressDoc, 'Progress recorded successfully');
  } catch (error) {
    next(error);
  }
};

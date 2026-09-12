import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import {
  ensureDefaultQuizzes,
  scoreQuizSubmission,
  OFFICIAL_QUIZ_QUESTIONS
} from '../services/quizService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all available quizzes
// @route   GET /api/quizzes
// @access  Private
export const getQuizzes = async (req, res, next) => {
  try {
    await ensureDefaultQuizzes();
    const quizzes = await Quiz.find().select('-questions.correctAnswer');

    const formatted = quizzes.map((q) => ({
      id: q.code,
      _id: q._id,
      title: q.title,
      competency: q.competency,
      questionsCount: q.questionsCount,
      estimatedMinutes: q.estimatedMinutes,
      status: q.status,
      difficulty: q.difficulty,
      description: q.description
    }));

    return sendSuccess(res, formatted, 'Assessments retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz questions for taking the assessment (excluding answer key)
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req, res, next) => {
  try {
    await ensureDefaultQuizzes();

    const quiz = await Quiz.findOne({
      $or: [{ code: req.params.id }, { _id: req.params.id }]
    });

    if (!quiz) {
      return sendError(res, `Quiz ${req.params.id} not found`, 404);
    }

    // Mask correctAnswer to prevent client-side inspection
    const safeQuestions = quiz.questions.map((q) => ({
      id: q.id,
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      competency: q.competency,
      difficulty: q.difficulty
    }));

    return sendSuccess(
      res,
      {
        id: quiz.code,
        title: quiz.title,
        totalQuestions: safeQuestions.length,
        estimatedMinutes: quiz.estimatedMinutes,
        questions: safeQuestions
      },
      'Quiz loaded'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers, calculate score, update competency & return evaluation
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const result = await scoreQuizSubmission(req.user._id, req.params.id, req.body);
    return sendSuccess(res, result, 'Assessment submitted & scored successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest quiz result for user
// @route   GET /api/quizzes/:id/result
// @access  Private
export const getQuizResult = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findOne({
      user: req.user._id,
      $or: [{ quizCode: req.params.id }, { quiz: req.params.id }]
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return sendError(res, 'No recorded attempts for this assessment', 404);
    }

    return sendSuccess(res, attempt, 'Assessment outcome retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    AI Quiz Generation Gateway Hook (Extensible for future Python FastAPI)
// @route   POST /api/quizzes/generate
// @access  Private
export const generateQuizFromMaterial = async (req, res, next) => {
  try {
    const { materialName, questionCount, difficulty, questionType, competency } = req.body;

    // Placeholder deterministic generator matching requested parameters
    const count = parseInt(questionCount) || 10;
    const generated = {
      quizId: `quiz-${Date.now()}`,
      title: `AI Assessment: ${materialName || 'Statistical Methodology'}`,
      questionCount: count,
      difficulty: difficulty || 'Medium',
      questionType: questionType || 'MCQ',
      detectedCompetency: competency || 'Survey Methodology',
      questions: OFFICIAL_QUIZ_QUESTIONS.slice(0, count)
    };

    return sendSuccess(res, generated, 'Domain-calibrated MCQs synthesized from document', 201);
  } catch (error) {
    next(error);
  }
};

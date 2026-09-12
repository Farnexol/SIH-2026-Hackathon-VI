import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import mongoose from 'mongoose';
import User from '../models/User.js';
import Competency from '../models/Competency.js';
import UserCompetency from '../models/UserCompetency.js';
import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import LearningPath from '../models/LearningPath.js';
import Material from '../models/Material.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

import { SEED_COURSES } from './seedData.js';
import { DEFAULT_COMPETENCIES, calculateGapAndLevel } from '../services/competencyService.js';
import { DEFAULT_LEARNING_PATH_STEPS } from '../services/learningPathService.js';
import { DEFAULT_MATERIALS } from '../controllers/materialController.js';
import { DEFAULT_QUIZZES } from '../services/quizService.js';

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/statiq';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing previous collections...');
    await Promise.all([
      User.deleteMany({}),
      Competency.deleteMany({}),
      UserCompetency.deleteMany({}),
      Course.deleteMany({}),
      CourseProgress.deleteMany({}),
      LearningPath.deleteMany({}),
      Material.deleteMany({}),
      Quiz.deleteMany({}),
      QuizAttempt.deleteMany({})
    ]);

    console.log('[Seed] Creating demo statistical officer user...');
    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'demo@statiq.ai',
      password: 'demo123',
      role: 'Learner',
      isProfileCompleted: true,
      designation: 'Statistical Officer (Grade II)',
      department: 'Data Analysis Division',
      organization: 'National Statistical Office (NSO), MoSPI',
      employeeId: 'SO-2024-8841',
      joiningDate: '15 March 2021',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      competencyFramework: 'Official Statistical System Framework (OSSF-2026)',
      learningGoals: 'Master Python for Statistical Computing & Advanced Survey Data Visualization',
      stats: {
        overallCompetency: 68,
        competencyDelta: '+8% this month',
        learningProgress: 72,
        completedCourses: 12,
        totalCourses: 17,
        assessmentScore: 84,
        scoreDelta: '+6% improvement',
        learningStreak: 7,
        learningHoursTotal: 64.5
      },
      preferences: {
        learningDifficulty: 'Intermediate',
        preferredContentType: 'Interactive Modules & Case Studies',
        language: 'English',
        emailNotifications: true,
        weeklyDigest: true
      }
    });

    console.log('[Seed] Seeding competencies & officer competencies...');
    for (const item of DEFAULT_COMPETENCIES) {
      const comp = await Competency.create({
        code: item.code,
        name: item.name,
        category: item.category,
        description: item.description,
        defaultRequiredScore: item.defaultRequiredScore,
        recommendedActionDefault: item.recommendedAction
      });

      const { gap, level, priority } = calculateGapAndLevel(item.initialScore, item.defaultRequiredScore);

      await UserCompetency.create({
        user: demoUser._id,
        competency: comp._id,
        code: item.code,
        name: item.name,
        category: item.category,
        currentScore: item.initialScore,
        requiredScore: item.defaultRequiredScore,
        gap,
        level,
        priority,
        trend: item.trend,
        trendDirection: item.trendDirection,
        description: item.description,
        assessmentsCompleted: item.assessmentsCompleted,
        recommendedAction: item.recommendedAction,
        lastAssessed: item.lastAssessed
      });
    }

    console.log('[Seed] Seeding courses & officer enrollment progress...');
    for (const c of SEED_COURSES) {
      const courseDoc = await Course.create(c);

      let enrolled = false;
      let progress = 0;
      let completedModules = [];
      let activeModuleId = 1;

      if (c.code === 'course-101') {
        enrolled = true;
        progress = 45;
        completedModules = [1, 2];
        activeModuleId = 3;
      } else if (c.code === 'course-103') {
        enrolled = true;
        progress = 20;
        completedModules = [1];
        activeModuleId = 2;
      } else if (c.code === 'course-104') {
        enrolled = true;
        progress = 85;
        completedModules = [1, 2, 3];
        activeModuleId = 4;
      } else if (c.code === 'course-105') {
        enrolled = true;
        progress = 100;
        completedModules = [1, 2, 3, 4, 5];
        activeModuleId = 5;
      } else if (c.code === 'course-106') {
        enrolled = true;
        progress = 60;
        completedModules = [1, 2];
        activeModuleId = 3;
      }

      await CourseProgress.create({
        user: demoUser._id,
        course: courseDoc._id,
        courseCode: courseDoc.code,
        enrolled,
        progress,
        completedModules,
        activeModuleId,
        startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        completedAt: progress === 100 ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) : null
      });
    }

    console.log('[Seed] Seeding personalized learning path...');
    await LearningPath.create({
      user: demoUser._id,
      competencyTarget: 'Python for Data Analysis',
      requiredLevel: '80% Required Proficiency',
      currentLevel: '38% Current Proficiency',
      targetRole: 'Statistical Officer - Automated Micro-Data Specialist',
      overallProgress: 35,
      steps: DEFAULT_LEARNING_PATH_STEPS
    });

    console.log('[Seed] Seeding learning materials...');
    for (const m of DEFAULT_MATERIALS) {
      await Material.create({
        ...m,
        user: demoUser._id
      });
    }

    console.log('[Seed] Seeding quizzes & questions...');
    for (const q of DEFAULT_QUIZZES) {
      await Quiz.create(q);
    }

    console.log('==================================================');
    console.log(' StatIQ Database Seeded Successfully!');
    console.log(' Demo Officer Credentials:');
    console.log(' Email: demo@statiq.ai');
    console.log(' Password: demo123');
    console.log(' Employee ID: SO-2024-8841');
    console.log('==================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

runSeed();

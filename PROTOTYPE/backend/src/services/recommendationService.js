import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import { getUserPriorityGaps } from './competencyService.js';
import { SEED_COURSES } from '../seed/seedData.js';

/**
 * Deterministic Course Recommendation Service
 * Maps officer competency gaps to iGOT courses and ranks them with explainable rationales.
 */
export const getRecommendedCourses = async (userId) => {
  const priorityGaps = await getUserPriorityGaps(userId);
  let allCourses = await Course.find();

  if (!allCourses || allCourses.length === 0) {
    await Course.insertMany(SEED_COURSES);
    allCourses = await Course.find();
  }

  const progressList = await CourseProgress.find({ user: userId });

  const progressMap = new Map(
    progressList.map((p) => [p.courseCode, p])
  );

  // Map each course with recommendation score & rationale
  const scoredCourses = allCourses.map((course) => {
    const userProgress = progressMap.get(course.code);
    let recommendationScore = 0;
    let recommendationReason = null;

    // Check if course matches any of user's priority gaps
    for (const gap of priorityGaps) {
      const match = course.competencies.some((comp) =>
        gap.title.toLowerCase().includes(comp.toLowerCase()) ||
        comp.toLowerCase().includes(gap.title.toLowerCase())
      );

      if (match) {
        // Weight based on gap severity
        const weight = gap.priority === 'High' ? 100 : gap.priority === 'Medium' ? 60 : 30;
        const currentScore = weight + gap.gap;

        if (currentScore > recommendationScore) {
          recommendationScore = currentScore;
          recommendationReason = `Recommended because your ${gap.title} competency has a ${gap.gap}% gap against the cadre requirement.`;
        }
      }
    }

    const isRecommended = recommendationScore > 0;

    return {
      id: course.code,
      _id: course._id,
      title: course.title,
      description: course.description,
      competencies: course.competencies,
      difficulty: course.difficulty,
      duration: course.duration,
      rating: course.rating,
      reviewsCount: course.reviewsCount,
      source: course.source,
      igotCourseId: course.igotCourseId,
      category: course.category,
      instructor: course.instructor,
      learningObjectives: course.learningObjectives,
      modules: course.modules.map((m) => ({
        id: m.id,
        title: m.title,
        duration: m.duration,
        completed: userProgress?.completedModules?.includes(m.id) || false,
        inProgress: userProgress?.activeModuleId === m.id && !userProgress?.completedModules?.includes(m.id)
      })),
      progress: userProgress?.progress || 0,
      enrolled: userProgress?.enrolled || false,
      recommended: isRecommended,
      recommendationReason,
      recommendationScore
    };
  });

  // Sort: recommended first, then by score descending
  scoredCourses.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return scoredCourses;
};

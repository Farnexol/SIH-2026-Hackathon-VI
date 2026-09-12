import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  mockUser, 
  mockCompetencies, 
  mockPriorityGaps, 
  mockAIInsight, 
  mockLearningPath, 
  mockCourses, 
  mockMaterials, 
  mockQuizQuestions, 
  mockQuizResultData, 
  mockAnalytics, 
  mockAiAdvisorResponses 
} from '../data/mockData';

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      competencies: mockCompetencies,
      priorityGaps: mockPriorityGaps,
      aiInsight: mockAIInsight,
      learningPath: mockLearningPath,
      courses: mockCourses,
      materials: mockMaterials,
      quizQuestions: mockQuizQuestions,
      analytics: mockAnalytics,
      aiResponses: mockAiAdvisorResponses,

      // Actions
      login: (email, password, role) => {
        // Simplified auth check based on mockData
        if ((email === 'demo@samarth.ai' || email === 'usr-9082') && password === 'demo123') {
          const userObj = { ...mockUser, role: role || 'learner' };
          set({ user: userObj, isAuthenticated: true });
          return { success: true, user: userObj };
        }
        return { success: false, error: 'Invalid credentials' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      uploadMaterial: (fileData) => {
        const newMaterial = {
          id: `mat-${Date.now()}`,
          name: fileData.name || 'Uploaded Document.pdf',
          type: fileData.type || 'PDF',
          size: fileData.size || '1.2 MB',
          pages: Math.floor(Math.random() * 50) + 10,
          uploadDate: 'Just now',
          status: 'Analyzed',
          detectedCompetency: fileData.detectedCompetency || 'General Statistics',
          generatedQuestionsCount: Math.floor(Math.random() * 20) + 5,
          summary: fileData.summary || 'Auto-generated summary from AI analysis.',
          keyTopics: fileData.keyTopics || ['Statistics', 'Data']
        };
        set((state) => ({ materials: [newMaterial, ...state.materials] }));
        return newMaterial;
      },

      submitQuiz: (quizId, answers) => {
        // In a real app we'd calculate score based on answers.
        // For the mock, we'll return a static result but update analytics
        const result = { ...mockQuizResultData, quizId, completedDate: 'Just now' };
        
        // Optionally update a competency based on the result
        set((state) => {
          const newCompetencies = state.competencies.map(comp => {
            if (comp.name === result.competencyDelta.competencyName) {
              return { ...comp, currentScore: result.competencyDelta.afterScore, gap: Math.max(0, comp.requiredScore - result.competencyDelta.afterScore) };
            }
            return comp;
          });
          return { competencies: newCompetencies };
        });

        return result;
      },

      enrollCourse: (courseId) => {
        set((state) => ({
          courses: state.courses.map(c => c.id === courseId ? { ...c, enrolled: true, progress: 0 } : c)
        }));
      },

      updateProfile: (profileData) => {
        set((state) => ({
          user: { ...state.user, ...profileData, isProfileCompleted: true }
        }));
      }

    }),
    {
      name: 'samarth-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        materials: state.materials,
        competencies: state.competencies,
        courses: state.courses
      }), // Save these fields to localStorage
    }
  )
);

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/auth/LoginPage';
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { LearnerCompetencies } from './pages/learner/LearnerCompetencies';
import { LearnerGaps } from './pages/learner/LearnerGaps';
import { LearnerLearning } from './pages/learner/LearnerLearning';
import { LearnerAssessments } from './pages/learner/LearnerAssessments';
import { AssessmentAttemptPage } from './pages/learner/AssessmentAttemptPage';
import { LearnerProgress } from './pages/learner/LearnerProgress';
import { LearnerProfile } from './pages/learner/LearnerProfile';
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { TrainerMaterials } from './pages/trainer/TrainerMaterials';
import { AiAssessmentStudio } from './pages/trainer/AiAssessmentStudio';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoleGroup?: 'LEARNER' | 'TRAINER' | 'ADMIN' }> = ({
  children,
  allowedRoleGroup,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoleGroup) {
    const role = (user.role || '').toUpperCase();
    if (allowedRoleGroup === 'TRAINER' && !role.includes('TRAINER')) {
      return <Navigate to={role.includes('ADMIN') ? '/admin' : '/learner'} replace />;
    }
    if (allowedRoleGroup === 'ADMIN' && !role.includes('ADMIN')) {
      return <Navigate to={role.includes('TRAINER') ? '/trainer' : '/learner'} replace />;
    }
  }

  return <>{children}</>;
};

// Root Redirect based on Authentication and Role
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user.role || '').toUpperCase();
  if (role.includes('TRAINER')) return <Navigate to="/trainer" replace />;
  if (role.includes('ADMIN')) return <Navigate to="/admin" replace />;
  return <Navigate to="/learner" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      // Learner Routes
      {
        path: 'learner',
        element: <LearnerDashboard />,
      },
      {
        path: 'learner/competencies',
        element: <LearnerCompetencies />,
      },
      {
        path: 'learner/gaps',
        element: <LearnerGaps />,
      },
      {
        path: 'learner/learning',
        element: <LearnerLearning />,
      },
      {
        path: 'learner/courses',
        element: <LearnerLearning />,
      },
      {
        path: 'learner/assessments',
        element: <LearnerAssessments />,
      },
      {
        path: 'learner/assessments/:id/attempt',
        element: <AssessmentAttemptPage />,
      },
      {
        path: 'learner/progress',
        element: <LearnerProgress />,
      },
      {
        path: 'learner/profile',
        element: <LearnerProfile />,
      },

      // Trainer Routes
      {
        path: 'trainer',
        element: (
          <ProtectedRoute allowedRoleGroup="TRAINER">
            <TrainerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'trainer/materials',
        element: (
          <ProtectedRoute allowedRoleGroup="TRAINER">
            <TrainerMaterials />
          </ProtectedRoute>
        ),
      },
      {
        path: 'trainer/assessments/new',
        element: (
          <ProtectedRoute allowedRoleGroup="TRAINER">
            <AiAssessmentStudio />
          </ProtectedRoute>
        ),
      },
      {
        path: 'trainer/assessments',
        element: (
          <ProtectedRoute allowedRoleGroup="TRAINER">
            <LearnerAssessments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'trainer/performance',
        element: (
          <ProtectedRoute allowedRoleGroup="TRAINER">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // Admin Routes
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/workforce',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/competencies',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <LearnerCompetencies />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/skill-gaps',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <LearnerGaps />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/training-effectiveness',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <LearnerProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/departments',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/trainers',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute allowedRoleGroup="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
]);

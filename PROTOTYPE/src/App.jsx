import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AIAdvisorDrawer from './components/ai/AIAdvisorDrawer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Competencies from './pages/Competencies';
import LearningPath from './pages/LearningPath';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Materials from './pages/Materials';
import UploadMaterial from './pages/UploadMaterial';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import QuizResult from './pages/QuizResult';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Main App Layout Wrapper for Learner routes (Sidebar removed, full width with top drill-down navbar)
function LearnerLayout({ children, pageTitle }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Learner Dashboard';
    if (path.includes('/competencies')) return 'Competency Management';
    if (path.includes('/learning-path')) return 'Personalized Learning Path';
    if (path.includes('/courses/') && path !== '/courses') return 'Course Details';
    if (path.includes('/courses')) return 'Course Catalog';
    if (path.includes('/materials/upload')) return 'Upload & Generate MCQs';
    if (path.includes('/materials')) return 'Learning Materials';
    if (path.includes('/quiz/') && path.includes('/result')) return 'Assessment Result';
    if (path.includes('/quiz/') && path !== '/quiz') return 'Active Assessment';
    if (path.includes('/quiz')) return 'Assessment Center';
    if (path.includes('/analytics')) return 'Learner Analytics';
    if (path.includes('/profile')) return 'Officer Profile';
    return pageTitle || 'StatIQ Platform';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sticky Hierarchical Drill-down Top Navbar */}
      <Navbar pageTitle={getPageTitle()} />

      {/* Main Container Area - Full width with generous max-width */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Dynamic page content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-[1500px] w-full mx-auto">
          {children}
        </main>

        {/* Global footer */}
        <Footer />
      </div>

      {/* Global slide-out AI Advisor Drawer */}
      <AIAdvisorDrawer />
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mandatory profile completion guard for newly registered officers
  if (user && user.isProfileCompleted === false && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return <LearnerLayout>{children}</LearnerLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Root Redirect - Opens Login page when user visits website */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Learner Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/competencies"
            element={
              <ProtectedRoute>
                <Competencies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-path"
            element={
              <ProtectedRoute>
                <LearningPath />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <ProtectedRoute>
                <Materials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/upload"
            element={
              <ProtectedRoute>
                <UploadMaterial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <QuizTake />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/result"
            element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Level 1 Navigation Section Aliases */}
          <Route
            path="/learning"
            element={<Navigate to="/learning-path" replace />}
          />
          <Route
            path="/ai-tools"
            element={<Navigate to="/materials/upload" replace />}
          />
          <Route
            path="/resources"
            element={<Navigate to="/materials" replace />}
          />
          <Route
            path="/assessments"
            element={<Navigate to="/quiz" replace />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

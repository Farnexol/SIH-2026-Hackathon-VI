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

// Trainer & Admin Pages
import TrainerDashboard from './pages/TrainerDashboard';
import AssessmentStudio from './pages/AssessmentStudio';
import AdminDashboard from './pages/AdminDashboard';
import WorkforceManagement from './pages/WorkforceManagement';

// --- Layout Wrappers ---

// 1. Learner Layout (existing prototype UI)
function LearnerLayout({ children, pageTitle }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/learner/dashboard')) return 'Learner Dashboard';
    if (path.includes('/learner/competencies')) return 'Competency Management';
    if (path.includes('/learner/learning-path')) return 'Personalized Learning Path';
    if (path.includes('/learner/courses/') && path !== '/learner/courses') return 'Course Details';
    if (path.includes('/learner/courses')) return 'Course Catalog';
    if (path.includes('/learner/materials/upload')) return 'Upload & Generate MCQs';
    if (path.includes('/learner/materials')) return 'Learning Materials';
    if (path.includes('/learner/quiz/') && path.includes('/result')) return 'Assessment Result';
    if (path.includes('/learner/quiz/') && path !== '/learner/quiz') return 'Active Assessment';
    if (path.includes('/learner/quiz')) return 'Assessment Center';
    if (path.includes('/learner/analytics')) return 'Learner Analytics';
    if (path.includes('/learner/profile')) return 'Officer Profile';
    return pageTitle || 'Samarth Platform';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar pageTitle={getPageTitle()} />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>
      <AIAdvisorDrawer />
    </div>
  );
}

// 2. Trainer Layout (Studio Theme)
function TrainerLayout({ children, pageTitle }) {
  return (
    <div className="min-h-screen bg-indigo-50/50 flex flex-col font-sans">
      <Navbar pageTitle={pageTitle || 'Trainer Studio'} />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

// 3. Admin Layout (Console Theme)
function AdminLayout({ children, pageTitle }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar pageTitle={pageTitle || 'Admin Console'} />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Protected Route Guard with RBAC
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mandatory profile completion guard for newly registered officers
  if (user && user.isProfileCompleted === false && !location.pathname.includes('/profile')) {
    return <Navigate to={`/${user.role || 'learner'}/profile`} replace />;
  }

  // RBAC Check (case-insensitive)
  const currentRole = user?.role?.toLowerCase() || 'learner';
  const targetRole = allowedRole?.toLowerCase();

  if (targetRole && currentRole !== targetRole) {
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }

  if (targetRole === 'trainer') return <TrainerLayout>{children}</TrainerLayout>;
  if (targetRole === 'admin') return <AdminLayout>{children}</AdminLayout>;
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

          {/* Root Redirect - Auto-route based on role */}
          <Route path="/" element={<RootRedirect />} />

          {/* =========================================
              LEARNER ROUTES
             ========================================= */}
          <Route path="/learner/dashboard" element={<ProtectedRoute allowedRole="learner"><Dashboard /></ProtectedRoute>} />
          <Route path="/learner/competencies" element={<ProtectedRoute allowedRole="learner"><Competencies /></ProtectedRoute>} />
          <Route path="/learner/learning-path" element={<ProtectedRoute allowedRole="learner"><LearningPath /></ProtectedRoute>} />
          <Route path="/learner/courses" element={<ProtectedRoute allowedRole="learner"><Courses /></ProtectedRoute>} />
          <Route path="/learner/courses/:id" element={<ProtectedRoute allowedRole="learner"><CourseDetail /></ProtectedRoute>} />
          <Route path="/learner/materials" element={<ProtectedRoute allowedRole="learner"><Materials /></ProtectedRoute>} />
          <Route path="/learner/materials/upload" element={<ProtectedRoute allowedRole="learner"><UploadMaterial /></ProtectedRoute>} />
          <Route path="/learner/quiz" element={<ProtectedRoute allowedRole="learner"><QuizList /></ProtectedRoute>} />
          <Route path="/learner/quiz/:id" element={<ProtectedRoute allowedRole="learner"><QuizTake /></ProtectedRoute>} />
          <Route path="/learner/quiz/:id/result" element={<ProtectedRoute allowedRole="learner"><QuizResult /></ProtectedRoute>} />
          <Route path="/learner/analytics" element={<ProtectedRoute allowedRole="learner"><Analytics /></ProtectedRoute>} />
          <Route path="/learner/profile" element={<ProtectedRoute allowedRole="learner"><Profile /></ProtectedRoute>} />

          {/* Direct & Backward Compatible Aliases */}
          <Route path="/dashboard" element={<Navigate to="/learner/dashboard" replace />} />
          <Route path="/competencies" element={<Navigate to="/learner/competencies" replace />} />
          <Route path="/learning-path" element={<Navigate to="/learner/learning-path" replace />} />
          <Route path="/courses" element={<Navigate to="/learner/courses" replace />} />
          <Route path="/courses/:id" element={<ProtectedRoute allowedRole="learner"><CourseDetail /></ProtectedRoute>} />
          <Route path="/materials" element={<Navigate to="/learner/materials" replace />} />
          <Route path="/materials/upload" element={<Navigate to="/learner/materials/upload" replace />} />
          <Route path="/quiz" element={<Navigate to="/learner/quiz" replace />} />
          <Route path="/quiz/:id" element={<ProtectedRoute allowedRole="learner"><QuizTake /></ProtectedRoute>} />
          <Route path="/quiz/:id/result" element={<ProtectedRoute allowedRole="learner"><QuizResult /></ProtectedRoute>} />
          <Route path="/assessments" element={<Navigate to="/learner/quiz" replace />} />
          <Route path="/analytics" element={<Navigate to="/learner/analytics" replace />} />
          <Route path="/profile" element={<Navigate to="/learner/profile" replace />} />

          {/* =========================================
              TRAINER ROUTES
             ========================================= */}
          <Route path="/trainer/dashboard" element={<ProtectedRoute allowedRole="trainer">
            <TrainerDashboard />
          </ProtectedRoute>} />
          <Route path="/trainer/materials" element={<ProtectedRoute allowedRole="trainer">
            <UploadMaterial />
          </ProtectedRoute>} />
          <Route path="/trainer/assessments" element={<ProtectedRoute allowedRole="trainer">
            <AssessmentStudio />
          </ProtectedRoute>} />

          {/* =========================================
              ADMIN ROUTES
             ========================================= */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin">
            <WorkforceManagement />
          </ProtectedRoute>} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Redirects users based on authentication and role
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const role = user?.role?.toLowerCase();
  if (role === 'trainer') return <Navigate to="/trainer/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/learner/dashboard" replace />;
}

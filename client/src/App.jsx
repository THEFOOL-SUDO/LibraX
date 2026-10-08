import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CatalogPage from './pages/CatalogPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminIssueReturnPage from './pages/AdminIssueReturnPage';
import Library3DBackground from './components/Library3DBackground';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/student/catalog" element={
          <ProtectedRoute role="student">
            <CatalogPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/catalog" element={
          <ProtectedRoute role="admin">
            <CatalogPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/students" element={
          <ProtectedRoute role="admin">
            <AdminStudentsPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/requests" element={
          <ProtectedRoute role="admin">
            <AdminRequestsPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/issue-return" element={
          <ProtectedRoute role="admin">
            <AdminIssueReturnPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <Library3DBackground />
          <div className="relative z-10 min-h-screen">
            <AnimatedRoutes />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ReviewPage from './pages/ReviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'teacher') {
    return <AdminDashboard />;
  } else {
    return <StudentDashboard />;
  }
};

// Main App Component
const AppContent = () => {
  const { user } = useApp();
  
  return (
    <div className="app">
      {user && <Navbar />}
      
      <main className="main">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/review/:projectId" 
            element={
              <ProtectedRoute requiredRole="student">
                <ReviewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reviews/:projectId" 
            element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

// App with Provider
const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
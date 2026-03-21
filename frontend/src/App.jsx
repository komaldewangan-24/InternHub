import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import AdminAnalyticsDashboard from './pages/AdminAnalyticsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationTrackingAdmin from './pages/ApplicationTrackingAdmin';
import ApplyForInternshipWeb from './pages/ApplyForInternshipWeb';
import CompanyManagementAdmin from './pages/CompanyManagementAdmin';
import InternshipDetailsPage from './pages/InternshipDetailsPage';
import InternshipDiscoveryPage from './pages/InternshipDiscoveryPage';
import InternshipManagementAdmin from './pages/InternshipManagementAdmin';
import InterviewScheduleWeb from './pages/InterviewScheduleWeb';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MyApplicationsWeb from './pages/MyApplicationsWeb';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentManagementAdmin from './pages/StudentManagementAdmin';
import StudentProfilePage from './pages/StudentProfilePage';
import FacultyDashboard from './pages/FacultyDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MessagePage from './pages/MessagePage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login_page" element={<LoginPage />} />
        <Route path="/register_page" element={<RegisterPage />} />
        <Route path="/about_page" element={<AboutPage />} />

        {/* Student Routes */}
        <Route path="/student_dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student_profile_page" element={<ProtectedRoute allowedRoles={['student']}><StudentProfilePage /></ProtectedRoute>} />
        <Route path="/internship_discovery_page" element={<ProtectedRoute allowedRoles={['student']}><InternshipDiscoveryPage /></ProtectedRoute>} />
        <Route path="/my_applications_web" element={<ProtectedRoute allowedRoles={['student']}><MyApplicationsWeb /></ProtectedRoute>} />
        <Route path="/interview_schedule_web" element={<ProtectedRoute allowedRoles={['student']}><InterviewScheduleWeb /></ProtectedRoute>} />
        <Route path="/message_page" element={<ProtectedRoute allowedRoles={['student']}><MessagePage /></ProtectedRoute>} />
        <Route path="/settings_page" element={<ProtectedRoute allowedRoles={['student']}><SettingsPage /></ProtectedRoute>} />
        <Route path="/internship_details_page" element={<ProtectedRoute allowedRoles={['student']}><InternshipDetailsPage /></ProtectedRoute>} />
        <Route path="/apply_for_internship_web" element={<ProtectedRoute allowedRoles={['student']}><ApplyForInternshipWeb /></ProtectedRoute>} />

        {/* Admin/Faculty/Recruiter Shared Routes (If any) */}
        
        {/* Admin Routes */}
        <Route path="/admin_dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin_analytics_dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/application_tracking_admin" element={<ProtectedRoute allowedRoles={['admin', 'faculty', 'recruiter']}><ApplicationTrackingAdmin /></ProtectedRoute>} />
        <Route path="/company_management_admin" element={<ProtectedRoute allowedRoles={['admin']}><CompanyManagementAdmin /></ProtectedRoute>} />
        <Route path="/internship_management_admin" element={<ProtectedRoute allowedRoles={['admin', 'recruiter']}><InternshipManagementAdmin /></ProtectedRoute>} />
        <Route path="/student_management_admin" element={<ProtectedRoute allowedRoles={['admin', 'faculty']}><StudentManagementAdmin /></ProtectedRoute>} />

        {/* Faculty Routes */}
        <Route path="/faculty_dashboard" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><FacultyDashboard /></ProtectedRoute>} />

        {/* Recruiter Routes */}
        <Route path="/recruiter_dashboard" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><RecruiterDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

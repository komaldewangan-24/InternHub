import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AboutPage from './pages/AboutPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';
import AdminCompaniesPage from './pages/AdminCompaniesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminInternshipsPage from './pages/AdminInternshipsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyReviewsPage from './pages/FacultyReviewsPage';
import FacultyStudentPage from './pages/FacultyStudentPage';
import InternshipDetailsPage from './pages/InternshipDetailsPage';
import InternshipListPage from './pages/InternshipListPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MessagesPage from './pages/MessagesPage';
import RecruiterApplicantsPage from './pages/RecruiterApplicantsPage';
import RecruiterCompanyPage from './pages/RecruiterCompanyPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterInternshipsPage from './pages/RecruiterInternshipsPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentProjectsPage from './pages/StudentProjectsPage';
import LegacyInternshipRedirect from './components/LegacyInternshipRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import { getDefaultRouteForRole, getStoredUser } from './services/session';
import 'react-toastify/dist/ReactToastify.css';

function RoleAwareRedirect({ fallback = '/', byRole = {} }) {
  const user = getStoredUser();
  const target = user ? byRole[user.role] || getDefaultRouteForRole(user.role) : fallback;
  return <Navigate replace to={target} />;
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfilePage /></ProtectedRoute>} />
        <Route path="/student/projects" element={<ProtectedRoute allowedRoles={['student']}><StudentProjectsPage /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><SettingsPage /></ProtectedRoute>} />
        <Route path="/internships" element={<ProtectedRoute allowedRoles={['student']}><InternshipListPage /></ProtectedRoute>} />
        <Route path="/internships/:internshipId" element={<ProtectedRoute allowedRoles={['student']}><InternshipDetailsPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute allowedRoles={['student']}><ApplicationsPage /></ProtectedRoute>} />

        <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/reviews" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyReviewsPage /></ProtectedRoute>} />
        <Route path="/faculty/students/:studentId" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyStudentPage /></ProtectedRoute>} />

        <Route path="/recruiter" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/internships" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterInternshipsPage /></ProtectedRoute>} />
        <Route path="/recruiter/applicants" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterApplicantsPage /></ProtectedRoute>} />
        <Route path="/recruiter/company" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterCompanyPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentsPage /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompaniesPage /></ProtectedRoute>} />
        <Route path="/admin/internships" element={<ProtectedRoute allowedRoles={['admin']}><AdminInternshipsPage /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['admin']}><AdminApplicationsPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />

        <Route path="/messages" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'recruiter', 'admin']}><MessagesPage /></ProtectedRoute>} />

        <Route path="/login_page" element={<Navigate replace to="/login" />} />
        <Route path="/register_page" element={<Navigate replace to="/register" />} />
        <Route path="/about_page" element={<Navigate replace to="/about" />} />
        <Route path="/student_dashboard" element={<Navigate replace to="/student" />} />
        <Route path="/student_profile_page" element={<Navigate replace to="/student/profile" />} />
        <Route path="/internship_discovery_page" element={<Navigate replace to="/internships" />} />
        <Route path="/my_applications_web" element={<Navigate replace to="/applications" />} />
        <Route path="/interview_schedule_web" element={<Navigate replace to="/applications" />} />
        <Route path="/message_page" element={<Navigate replace to="/messages" />} />
        <Route path="/settings_page" element={<Navigate replace to="/student/settings" />} />
        <Route path="/internship_details_page" element={<LegacyInternshipRedirect />} />
        <Route path="/internship_details_page/:id" element={<LegacyInternshipRedirect />} />
        <Route path="/apply_for_internship_web" element={<Navigate replace to="/internships" />} />
        <Route path="/admin_dashboard" element={<Navigate replace to="/admin" />} />
        <Route path="/admin_analytics_dashboard" element={<Navigate replace to="/admin/analytics" />} />
        <Route path="/company_management_admin" element={<Navigate replace to="/admin/companies" />} />
        <Route path="/student_management_admin" element={<RoleAwareRedirect fallback="/admin/students" byRole={{ faculty: '/faculty/reviews', admin: '/admin/students' }} />} />
        <Route path="/internship_management_admin" element={<RoleAwareRedirect fallback="/admin/internships" byRole={{ recruiter: '/recruiter/internships', admin: '/admin/internships' }} />} />
        <Route path="/application_tracking_admin" element={<RoleAwareRedirect fallback="/admin/applications" byRole={{ recruiter: '/recruiter/applicants', admin: '/admin/applications', faculty: '/faculty/reviews' }} />} />
        <Route path="/faculty_dashboard" element={<Navigate replace to="/faculty" />} />
        <Route path="/recruiter_dashboard" element={<Navigate replace to="/recruiter" />} />

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

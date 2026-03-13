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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin_analytics_dashboard" element={<AdminAnalyticsDashboard />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/application_tracking_admin" element={<ApplicationTrackingAdmin />} />
        <Route path="/apply_for_internship_web" element={<ApplyForInternshipWeb />} />
        <Route path="/company_management_admin" element={<CompanyManagementAdmin />} />
        <Route path="/internship_details_page" element={<InternshipDetailsPage />} />
        <Route path="/internship_discovery_page" element={<InternshipDiscoveryPage />} />
        <Route path="/internship_management_admin" element={<InternshipManagementAdmin />} />
        <Route path="/interview_schedule_web" element={<InterviewScheduleWeb />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login_page" element={<LoginPage />} />
        <Route path="/my_applications_web" element={<MyApplicationsWeb />} />
        <Route path="/register_page" element={<RegisterPage />} />
        <Route path="/student_dashboard" element={<StudentDashboard />} />
        <Route path="/student_management_admin" element={<StudentManagementAdmin />} />
        <Route path="/student_profile_page" element={<StudentProfilePage />} />
        <Route path="/faculty_dashboard" element={<FacultyDashboard />} />
        <Route path="/recruiter_dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

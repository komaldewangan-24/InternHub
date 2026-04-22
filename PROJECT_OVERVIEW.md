# InternHub - Comprehensive Project Overview

InternHub is a robust, multi-role internship and project management platform designed to bridge the gap between students, faculty, recruiters, and administrators. It facilitates the entire internship lifecycle from discovery to application, along with a dedicated workspace for academic project submissions and reviews.

---

## 🚀 Key Features & Task Capabilities

### 1. Unified Authentication & Authorization
- **Multi-Role Support**: Secure login and registration for Students, Faculty, Recruiters, and Admins.
- **Role-Based Access Control (RBAC)**: Protected routes ensure users only access dashboards and data relevant to their role.
- **Session Management**: Persistent sessions using JWT (JSON Web Tokens).

### 2. Internship Lifecycle Management
- **Posting**: Recruiters can post, edit, and manage internship opportunities.
- **Discovery**: Students can search, filter, and view detailed internship descriptions.
- **Application**: Seamless application process for students with tracking for recruiters.
- **Tracking**: Status updates (Pending, Accepted, Rejected) managed by recruiters.

### 3. Academic Project Workspace
- **Versioning**: Students can maintain multiple versions of their project. Each resubmission increments the version and preserves history.
- **Faculty Review & Rubrics**: Faculty can assess projects using customizable rubrics (criteria, scores, notes).
- **Automated SLAs**: The system tracks "Review Due Dates" based on configurable SLA settings (default 7 days).
- **Turnaround Analytics**: Tracks how long reviews take to complete.
- **Recruiter Visibility**: Approved projects are automatically made visible to recruiters, serving as a verified portfolio for students.

### 4. Communication & Notifications
- **Messaging System**: Real-time (or near real-time) chat between all user roles.
- **Alerts**: System notifications for application status changes and new project feedback.

### 5. Analytics & Administration
- **Admin Dashboard**: High-level overview of system metrics (User growth, application volume).
- **Control Panel**: Admin management of all users, companies, and platform settings.

---

## 👥 Roles & Permissions

| Role | Key Capabilities |
| :--- | :--- |
| **Student** | Find internships, apply for roles, submit/version projects, view faculty feedback, update profile. |
| **Faculty** | Review student projects, perform rubric-based assessments, manage review queues, track overdue reviews. |
| **Recruiter** | Manage company profile, post internships, track and review applicants, view approved student portfolios. |
| **Admin** | System-wide oversight, manage all users/entities, view analytics, export reports (CSV), global settings. |

---

## 🖼️ Screens & UI Map

### Guest / Public Pages
- `LandingPage`: High-impact introduction to the platform.
- `AboutPage`: Information about InternHub's mission.
- `LoginPage` & `RegisterPage`: Onboarding and entry points.

### Student Portal
- `StudentDashboard`: Overview of applications and upcoming tasks.
- `StudentProfilePage`: Comprehensive profile management (Bio, Skills, Education).
- `InternshipListPage`: Discovery hub for new opportunities.
- `InternshipDetailsPage`: Detailed view of a single internship.
- `ApplicationsPage`: Status tracking for applied internships.
- `StudentProjectsPage`: Workspace for academic projects (Drafts, Versions, Feedback).

### Faculty Portal
- `FacultyDashboard`: Management of assigned students and status summaries.
- `FacultyReviewsPage`: Central hub for project feedback, rubric scoring, and approvals.
- `FacultyStudentPage`: Detailed view of a specific student's progress and history.

### Recruiter Portal
- `RecruiterDashboard`: Recruitment metrics and active postings.
- `RecruiterInternshipsPage`: Management of internship listings.
- `RecruiterApplicantsPage`: Reviewing and shortlisting candidates.
- `RecruiterCompanyPage`: Company branding and profile.

### Admin Portal
- `AdminDashboard`: Global stats and management shortcuts.
- `AdminStudentsPage`: Database of all student users with filtering.
- `AdminCompaniesPage`: Oversight of registered companies and verification.
- `AdminInternshipsPage`: Global internship moderation.
- `AdminAnalyticsPage`: Data visualization of platform usage and performance KPIs.
- `AdminSettingsPage`: Platform-wide configuration (SLA days, theme, etc.).

---

## 🛠️ Technical Architecture

### Tech Stack
- **Frontend**: React.js 19 (Vite), Tailwind CSS 3 (Aesthetics & Layout), React Router 7 (Navigation), Axios.
- **Backend**: Node.js, Express.js 5 (REST API).
- **Database**: MongoDB (Mongoose 9 ODM).
- **Authentication**: JWT & BcryptJS.

### Data Models
- **User**: Authentication, Role, Department-specific profiles.
- **Company**: Corporate branding and recruiter associations.
- **Internship**: Listing details (Stipend, Location, Requirements).
- **Application**: Join model for recruitment tracking.
- **ProjectSubmission**: Complex model supporting versioning, faculty assignment, multi-stage approval, and comment history.
- **Setting**: Global platform flags and SLA configurations.
- **Notification**: Action-triggered alerts across the platform.

---

## 📂 Project Structure

```text
InternHub/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI elements (Sidebar, ProtectedRoute, LegacyRedirects)
│   │   ├── pages/           # Screen components (Role-specific dashboards, landing)
│   │   ├── services/        # API calls, session/auth management
│   │   ├── hooks/           # Custom React hooks (Theme, Auth)
│   │   ├── constants/       # Global constants and config
│   │   └── App.jsx          # Routing, Private Routes, and Global State
├── backend/
│   ├── models/              # Mongoose Schema definitions (Project, User, etc.)
│   ├── routes/              # Express API endpoints with role-based authorization
│   ├── middleware/          # Auth protection and permission validation
│   ├── controllers/         # Core business logic
│   └── server.js            # Express server initialization
└── PROJECT_OVERVIEW.md      # This document
```

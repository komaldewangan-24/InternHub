export const navigationByRole = {
  student: [
    { to: '/student', label: 'Dashboard' },
    { to: '/student/profile', label: 'Profile' },
    { to: '/student/credentials', label: 'Manage Documents' },
    { to: '/student/projects', label: 'Projects' },
    { to: '/internships', label: 'Internships' },
    { to: '/applications', label: 'Applications' },
    { to: '/messages', label: 'Messages' },
    { to: '/student/settings', label: 'Settings' },
  ],
  faculty: [
    { to: '/faculty', label: 'Dashboard' },
    { to: '/faculty/reviews', label: 'Reviews' },
    { to: '/messages', label: 'Messages' },
  ],
  recruiter: [
    { to: '/recruiter', label: 'Dashboard' },
    { to: '/recruiter/internships', label: 'Internships' },
    { to: '/recruiter/applicants', label: 'Applicants' },
    { to: '/recruiter/company', label: 'Company' },
    { to: '/messages', label: 'Messages' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/companies', label: 'Companies' },
    { to: '/admin/internships', label: 'Internships' },
    { to: '/admin/applications', label: 'Applications' },
    { to: '/admin/analytics', label: 'Analytics' },
    { to: '/admin/settings', label: 'Settings' },
    { to: '/messages', label: 'Messages' },
  ],
};

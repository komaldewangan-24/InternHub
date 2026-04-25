export const ROLES = {
  student: {
    label: 'Student',
    route: '/student',
    icon: 'school',
    description: 'Access internship opportunities and manage your portfolio.',
  },
  faculty: {
    label: 'Faculty',
    route: '/faculty',
    icon: 'account_balance',
    description: 'Review project submissions and guide student progress.',
  },
  recruiter: {
    label: 'Recruiter',
    route: '/recruiter',
    icon: 'business_center',
    description: 'Find top talent and manage institutional hiring.',
  },
  admin: {
    label: 'Admin',
    route: '/admin',
    icon: 'bolt',
    description: 'Full system oversight and institutional management.',
  },
};

export const getDefaultRouteForRole = (role) => {
  return ROLES[role]?.route || '/student';
};

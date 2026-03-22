export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem('token');

export const setStoredSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem('token', token);
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getDefaultRouteForRole = (role) => {
  if (role === 'faculty') return '/faculty';
  if (role === 'recruiter') return '/recruiter';
  if (role === 'admin') return '/admin';
  return '/student';
};

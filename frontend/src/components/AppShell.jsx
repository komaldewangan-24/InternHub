import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { clearSession } from '../services/session';

// Fail-safe ErrorBoundary
class LocalErrorBoundary extends React.Component {
  render() {
    if (this.state?.hasError) return <div className="p-4 bg-neutral border border-indigo-500/20 rounded-sm text-indigo-500 font-poppins uppercase font-bold text-[10px]">Interface interruption.</div>;
    return this.props.children;
  }
}

export default function AppShell({
  title = 'Student Dashboard',
  description = 'Track your placement readiness and internship progress through institutional data analysis.',
  user = {},
  navigation = [],
  actions = null,
  children,
}) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    if (!document.getElementById('font-preloader')) {
      const link = document.createElement('link');
      link.id = 'font-preloader';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap';
      document.head.appendChild(link);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const blueGradient = 'linear-gradient(135deg, #003366 0%, #0066cc 100%)';

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-500 overflow-x-hidden relative font-roboto uppercase"
      style={{ 
        backgroundColor: theme === 'light' ? '#FFFFFF' : '#00152b',
        color: theme === 'light' ? '#0F172A' : '#F1F5F9'
      }}
    >
      <div className="flex min-h-screen relative">
        {/* Desktop Sidebar (Institutional Redesign) */}
        <aside 
          className="fixed h-screen w-72 border-r px-8 py-10 overflow-y-auto hidden lg:flex flex-col z-30 transition-all scrollbar-hide"
          style={{ 
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#00152b',
            borderColor: theme === 'light' ? 'rgba(0, 51, 102, 0.05)' : 'rgba(255,255,255,0.05)'
          }}
        >
          <div 
            className="flex items-center gap-4 cursor-pointer group mb-14"
            onClick={() => navigate('/')}
          >
            <div 
              className="flex size-14 items-center justify-center rounded-sm text-white shadow-lg transition-all group-hover:scale-110"
              style={{ backgroundImage: blueGradient }}
            >
              <span className="material-symbols-outlined text-[28px]">hub</span>
            </div>
            <div className="min-w-0">
              <p className="text-xl font-poppins font-bold tracking-tighter leading-none uppercase" style={{ color: theme === 'light' ? '#003366' : '#FFFFFF' }}>InternHub</p>
              <p className="mt-1.5 text-[8px] font-poppins font-bold uppercase tracking-[0.4em] truncate text-indigo-500 opacity-60">National Portal</p>
            </div>
          </div>

          <div 
            className="rounded-sm border p-6 mb-16 transition-all shadow-sm hover:shadow-md group"
            style={{ 
              backgroundColor: theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(99, 102, 241, 0.1)'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="flex size-12 items-center justify-center rounded-sm font-poppins font-bold shadow-sm shrink-0 transition-transform group-hover:rotate-6 overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-300"
              >
                {user?.profile?.avatarUrl ? (
                  <img src={user.profile.avatarUrl} alt="User" className="size-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[24px]">account_circle</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-poppins font-bold truncate uppercase tracking-tight" style={{ color: theme === 'light' ? '#003366' : '#FFFFFF' }}>{user?.name || 'User'}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                  <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.2em] transition-colors text-emerald-600/80">{user?.role || 'Guest'}</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1 pr-1">
             <p className="px-5 text-[9px] font-poppins font-bold uppercase tracking-[0.4em] mb-8 text-indigo-500 opacity-40">Core Navigation</p>
              {(navigation || []).map((item) => (
                <NavLink
                  key={item.to || item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-sm px-5 py-4 text-[10px] font-poppins font-bold uppercase tracking-[0.3em] transition-all duration-300 ${
                      isActive ? 'scale-[1.01]' : 'hover:translate-x-1 opacity-70 hover:opacity-100'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundImage: isActive ? blueGradient : 'transparent',
                    color: isActive ? '#FFFFFF' : theme === 'light' ? '#003366' : '#FFFFFF',
                    boxShadow: isActive ? '0 10px 20px -5px rgba(0, 51, 102, 0.3)' : 'none'
                  })}
                >
                  {({ isActive }) => (
                    <>
                       <span className="font-poppins">{item.label}</span>
                      <span className={`material-symbols-outlined text-[16px] transition-all transform ${isActive ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`}>arrow_forward</span>
                    </>
                  )}
                </NavLink>
              ))}
          </nav>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(0, 51, 102, 0.1)' }}>
            <button
              className="group flex w-full items-center justify-between rounded-sm px-6 py-4 text-[11px] font-poppins font-bold uppercase tracking-[0.3em] transition-all hover:bg-rose-50 dark:hover:bg-rose-900/10 text-slate-400 hover:text-rose-500"
              onClick={() => { clearSession(); window.location.href = '/login'; }}
            >
               <span className="font-poppins">Logout Session</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
            </button>
          </div>
        </aside>

        {/* Header and Main */}
        <div className="flex-1 w-full lg:ml-72 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
          <header 
            className="sticky top-0 z-20 w-full border-b px-10 py-10 backdrop-blur-xl"
            style={{ 
              backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 21, 43, 0.95)',
              borderColor: 'rgba(0, 51, 102, 0.05)'
            }}
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-10">
              <div className="min-w-0">
                  <h1 className="text-2xl font-poppins font-bold tracking-tighter leading-none truncate uppercase" style={{ color: theme === 'light' ? '#003366' : '#FFFFFF' }}>{title}</h1>
                {description && (
                  <p className="mt-3 text-[9px] font-roboto font-bold uppercase tracking-[0.2em] line-clamp-1 italic" style={{ color: theme === 'light' ? 'rgba(0, 51, 102, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}>{description}</p>
                )}
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <NotificationBell />
                <button 
                  onClick={toggleTheme}
                  className="flex size-14 items-center justify-center rounded-sm bg-white dark:bg-white/5 border text-indigo-500 transition-all shadow-sm hover:border-indigo-500/50"
                  style={{ borderColor: 'rgba(99, 102, 241, 0.1)' }}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                  </span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 sm:p-14 min-h-0 bg-transparent">
            <div className="mx-auto max-w-6xl">
              <LocalErrorBoundary>
                {children}
              </LocalErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

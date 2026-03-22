import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { clearSession } from '../services/session';

// Fail-safe ErrorBoundary to catch sub-component crashes
class LocalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600">
          <p className="font-bold">A localized component crash occurred.</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-xs underline">Reload Interface</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppShell({
  title = 'Unified Workspace',
  description = 'Institutional dashboard for placement activities.',
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
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f6f8] dark:bg-[#0b0f1a] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-[1600px] relative">
        {/* Desktop Sidebar */}
        <aside className="fixed h-screen w-80 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a] px-8 py-10 overflow-y-auto hidden lg:flex flex-col z-30">
          <div 
            className="flex items-center gap-4 cursor-pointer group mb-12"
            onClick={() => navigate('/')}
          >
            <div className="flex size-12 items-center justify-center rounded-[1.25rem] bg-primary text-white shadow-xl shadow-primary/30 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-[28px]">hub</span>
            </div>
            <div>
              <p className="text-xl font-black tracking-tight dark:text-white leading-none">InternHub</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Institutional</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-6 shadow-sm mb-12">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-primary font-black shadow-sm shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black dark:text-white truncate">{user?.name || 'Authorized User'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user?.role || 'Stakeholder'}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Core Navigation</p>
              {(navigation || []).map((item) => (
                <NavLink
                  key={item.to || item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-black transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="tracking-tight">{item.label}</span>
                      <span className={`material-symbols-outlined text-[18px] transition-all ${isActive ? 'rotate-45' : 'opacity-0 group-hover:opacity-100'}`}>arrow_forward</span>
                    </>
                  )}
                </NavLink>
              ))}
          </nav>

          <div className="pt-8 border-t border-slate-100 dark:border-white/5">
            <button
              className="group flex w-full items-center justify-between rounded-2xl px-6 py-4 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
              onClick={handleLogout}
              type="button"
            >
              <span>Terminate Session</span>
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </aside>

        {/* Header and Main */}
        <div className="flex-1 w-full lg:ml-80 flex flex-col min-h-screen min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0b0f1a]/80 px-10 py-8 backdrop-blur-xl">
            <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-black tracking-tight dark:text-white leading-none truncate">{title}</h1>
                {description && (
                  <p className="mt-3 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-1">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <LocalErrorBoundary>
                  <NotificationBell />
                </LocalErrorBoundary>
                <button 
                  onClick={toggleTheme}
                  className="flex size-11 items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary transition-all shadow-sm"
                  title="Toggle mode"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                  </span>
                </button>
                {actions && <div className="hidden sm:flex items-center gap-3">{actions}</div>}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-10 min-h-0 bg-transparent">
            <div className="mx-auto max-w-[1240px]">
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

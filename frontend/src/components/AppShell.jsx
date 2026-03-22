import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { clearSession } from '../services/session';

export default function AppShell({
  title,
  description,
  user,
  navigation,
  actions,
  children,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="w-72 border-r border-slate-200 bg-white px-5 py-6">
          <button
            className="flex items-center gap-3"
            onClick={() => navigate('/')}
            type="button"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">workspaces</span>
            </div>
            <div className="text-left">
              <p className="text-lg font-black tracking-tight">InternHub</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Career Workflow
              </p>
            </div>
          </button>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold">{user?.name || 'Workspace User'}</p>
            <p className="mt-1 text-xs text-slate-500">{user?.email || 'user@internhub.local'}</p>
            <p className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              {user?.role || 'role'}
            </p>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
              </NavLink>
            ))}
          </nav>

          <button
            className="mt-8 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={handleLogout}
            type="button"
          >
            Sign Out
          </button>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-8 py-6 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                {description ? (
                  <p className="mt-2 max-w-3xl text-sm text-slate-500">{description}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-start gap-3">
                <NotificationBell />
                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
              </div>
            </div>
          </header>

          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

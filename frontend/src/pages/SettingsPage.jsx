import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefInApp, setPrefInApp] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AppShell
      title="Settings"
      description="Store lightweight workspace preferences for your account."
      navigation={user ? navigationByRole[user.role] : []}
      user={user}
    >
      <div className="space-y-6">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900/50 p-8 shadow-sm border border-slate-200/50 dark:border-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-8">
            <div>
              <p className="text-xl font-bold dark:text-white">Dark Mode</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                Switches the entire workspace theme to a deep, eye-friendly dark palette. 
              </p>
            </div>
            <button 
              className={`relative h-9 w-16 rounded-full transition-all flex items-center shadow-inner ${darkMode ? 'bg-primary' : 'bg-slate-200'}`} 
              onClick={() => setDarkMode((current) => !current)} 
              type="button"
            >
              <div className={`absolute h-7 w-7 rounded-full bg-white shadow-lg transition-all ${darkMode ? 'left-[32px]' : 'left-[4px]'}`}>
                {darkMode ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900/50 p-8 shadow-sm border border-slate-200/50 dark:border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <h2 className="text-xl font-bold dark:text-white">Workspace Notifications</h2>
          </div>
          
          <div className="grid gap-6">
            <div className="flex items-center justify-between gap-8 pb-6 border-b border-slate-100 dark:border-white/5 transition-all">
              <div className="flex-1">
                <p className="font-bold dark:text-white">Email alerts</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                  Priority updates about project approvals and interview invites sent to your inbox.
                </p>
              </div>
              <button 
                onClick={() => setPrefEmail(!prefEmail)}
                className={`relative h-6 w-11 rounded-full transition-all flex items-center shadow-inner ${prefEmail ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-all ${prefEmail ? 'left-[24px]' : 'left-[3px]'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-8 pb-3 transition-all">
              <div className="flex-1">
                <p className="font-bold dark:text-white">In-app notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                  Real-time alerts within the InternHub dashboard for activity mentions.
                </p>
              </div>
              <button 
                onClick={() => setPrefInApp(!prefInApp)}
                className={`relative h-6 w-11 rounded-full transition-all flex items-center shadow-inner ${prefInApp ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute h-4 w-4 rounded-full bg-white shadow-md transition-all ${prefInApp ? 'left-[24px]' : 'left-[3px]'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

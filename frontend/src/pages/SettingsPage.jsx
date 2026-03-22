import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AppShell
      title="Settings"
      description="Store lightweight workspace preferences for your student account."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-lg font-bold">Dark Mode</p>
              <p className="mt-1 text-sm text-slate-500">Toggle a darker workspace theme.</p>
            </div>
            <button className={`rounded-full px-4 py-2 text-sm font-bold ${darkMode ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}`} onClick={() => setDarkMode((current) => !current)} type="button">
              {darkMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

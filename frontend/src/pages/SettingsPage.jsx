import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast, ToastContainer } from 'react-toastify';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState({
    email: localStorage.getItem('notif_email') !== 'false',
    push: localStorage.getItem('notif_push') !== 'false',
    messages: localStorage.getItem('notif_messages') !== 'false',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      const localUser = localStorage.getItem('user');
      if (localUser) setUser(JSON.parse(localUser));
    }
  };

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toast.success(`Theme updated to ${isDark ? 'Dark' : 'Light'} mode`, { icon: isDark ? '🌙' : '☀️' });
  };

  const toggleNotification = (key) => {
    const newVal = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newVal }));
    localStorage.setItem(`notif_${key}`, newVal);
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${newVal ? 'enabled' : 'disabled'}`);
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      toast.error('Account deactivation is disabled for this demo.');
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 h-screen overflow-hidden">
      <ToastContainer position="top-right" />
      <Sidebar role="Student" />

      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Settings</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'Student'}</p>
              </div>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`} className="size-10 rounded-full" alt="User" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">appearance_override</span>
                Appearance
              </h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-slate-500">Adjust the appearance of the dashboard</p>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 size-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive internship matches via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Get instant alerts about application status' },
                  { key: 'messages', label: 'Message Alerts', desc: 'Notify when recruiters message you' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification(item.key)}
                      className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${notifications[item.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 left-1 size-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${notifications[item.key] ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md border-red-100 dark:border-red-900/20">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-500">
                <span className="material-symbols-outlined">gpp_maybe</span>
                Danger Zone
              </h3>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                <div>
                  <p className="font-bold text-red-600 dark:text-red-400">Deactivate Account</p>
                  <p className="text-sm text-slate-500">Permanently remove your account and data</p>
                </div>
                <button 
                  onClick={handleDeactivate}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
                >
                  Deactivate
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

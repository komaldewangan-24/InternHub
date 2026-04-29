import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import { navigationByRole } from '../constants/navigation';
import { authAPI } from '../services/api';
import useCurrentUser from '../hooks/useCurrentUser';

const defaultPreferences = {
  inAppEnabled: true,
  emailEnabled: true,
  categories: {
    internships: true,
    applications: true,
    projects: true,
    messages: true,
    company: true,
    system: true,
  },
};

const mergePreferences = (source = {}) => ({
  inAppEnabled: source.inAppEnabled ?? defaultPreferences.inAppEnabled,
  emailEnabled: source.emailEnabled ?? defaultPreferences.emailEnabled,
  categories: {
    ...defaultPreferences.categories,
    ...(source.categories || {}),
  },
});

export default function SettingsPage() {
  const { user, refreshUser, updateUser } = useCurrentUser();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (user?.notificationPreferences) {
      setPreferences(mergePreferences(user.notificationPreferences));
    }
  }, [user]);

  const persistPreferences = async (nextPreferences) => {
    const previousPreferences = preferences;
    setPreferences(nextPreferences);
    setSaving(true);

    try {
      const { data } = await authAPI.updateMe({
        notificationPreferences: nextPreferences,
      });

      if (data?.success && data?.data) {
        updateUser(data.data);
        setPreferences(mergePreferences(data.data.notificationPreferences));
      }
    } catch {
      setPreferences(previousPreferences);
      await refreshUser();
      toast.error('Unable to save notification preferences right now.');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key) => {
    persistPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const toggleCategory = (key) => {
    persistPreferences({
      ...preferences,
      categories: {
        ...preferences.categories,
        [key]: !preferences.categories[key],
      },
    });
  };

  const categoryOptions = [
    { key: 'internships', label: 'Internship Alerts', icon: 'campaign', desc: 'NEW POSTINGS, UPDATES, AND CLOSURE EVENTS FOR ELIGIBLE OPPORTUNITIES.' },
    { key: 'applications', label: 'Application Flow', icon: 'fact_check', desc: 'SUBMISSIONS, SHORTLISTS, INTERVIEW PROGRESSION, AND FINAL STATUS CHANGES.' },
    { key: 'projects', label: 'Project Reviews', icon: 'assignment_turned_in', desc: 'PROJECT SUBMISSION, RESUBMISSION, FEEDBACK, AND APPROVAL ACTIVITY.' },
    { key: 'messages', label: 'Direct Messages', icon: 'mail', desc: 'INCOMING CONVERSATION UPDATES FROM STUDENTS, FACULTY, RECRUITERS, OR ADMINS.' },
    { key: 'company', label: 'Company Events', icon: 'business', desc: 'COMPANY VERIFICATION EVENTS AND RECRUITER-SIDE COMPANY PROFILE STATUS CHANGES.' },
    { key: 'system', label: 'System Notices', icon: 'hub', desc: 'FACULTY ASSIGNMENTS AND PLATFORM-LEVEL ACTION NOTICES.' },
  ];

  return (
    <AppShell
      title="Settings"
      description="Configure your institutional interface and communication parameters."
      navigation={user ? navigationByRole[user.role] : []}
      user={user}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:px-6 uppercase">
        {/* Appearance Hub */}
        <section className="flex-[0.75] space-y-8 min-w-0">
          <div className="rounded-md bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 size-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-20 pointer-events-none group-hover:scale-125 transition-transform" />
            
            <div className="relative flex flex-col gap-10">
              <div className="space-y-4">
                 <div className="inline-flex rounded-sm bg-indigo-500/5 px-4 py-1.5 border border-indigo-500/10">
                    <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500">APPEARANCE</p>
                 </div>
                 <h2 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white leading-none uppercase">INTERFACE THEME</h2>
                 <p className="text-[11px] font-poppins font-bold uppercase tracking-widest text-slate-400 max-w-[280px] leading-relaxed opacity-80">
                    MODULATE SYSTEM LUMINANCE FOR OPTIMAL VISUAL PERFORMANCE.
                 </p>
              </div>
              
              <div className="flex justify-center lg:justify-start">
                <button 
                  className={`relative h-14 w-28 rounded-sm transition-all flex items-center shadow-inner group overflow-hidden border border-slate-200 dark:border-white/10 ${darkMode ? 'bg-indigo-500' : 'bg-slate-100'}`} 
                  onClick={() => setDarkMode((current) => !current)} 
                  type="button"
                >
                  <div className={`absolute h-10 w-12 rounded-sm bg-white shadow-md transition-all duration-500 flex items-center justify-center text-xl ${darkMode ? 'left-[54px]' : 'left-[4px]'}`}>
                    {darkMode ? '🌙' : '☀️'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Registry */}
        <section className="flex-[1.25] space-y-8 min-w-0 group relative">
          <div className="rounded-md bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5 relative transition-all group-hover:shadow-md">
            <div className="flex items-center gap-6 mb-12 relative">
              <div 
                className="flex size-14 items-center justify-center rounded-sm text-white shadow-md transition-transform group-hover:rotate-3"
                style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none">COMMUNICATION NODES</h2>
                 <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.4em] text-indigo-500">CONFIGURE REAL-TIME UPDATES</p>
              </div>
            </div>
            
            <div className="grid gap-6 relative">
              {[
                 { key: 'emailEnabled', label: 'Electronic Correspondence', val: preferences.emailEnabled, icon: 'alternate_email', desc: 'ENABLE TRANSACTIONAL EMAIL DELIVERY FOR SUPPORTED NOTIFICATION EVENTS.' },
                 { key: 'inAppEnabled', label: 'System Integration Alerts', val: preferences.inAppEnabled, icon: 'hub', desc: 'RECEIVE IN-APP ALERTS THROUGH THE GLOBAL DASHBOARD NOTIFICATION STREAM.' }
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 rounded-sm bg-slate-50 dark:bg-white/5 p-6 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all group-item">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                       <span className="material-symbols-outlined text-[16px] text-indigo-500/60">{item.icon}</span>
                       <p className="text-xl font-poppins font-bold text-[#003366] dark:text-white uppercase tracking-tighter">{item.label}</p>
                    </div>
                    <p className="max-w-xl text-[9px] font-poppins font-bold tracking-widest text-slate-400 leading-relaxed uppercase opacity-70">
                       {item.desc}
                    </p>
                  </div>
                  <button 
                    disabled={saving}
                    onClick={() => togglePreference(item.key)}
                    className={`relative h-10 w-20 rounded-sm transition-all flex items-center shadow-inner border border-white dark:border-white/5 ${item.val ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                  >
                    <div className={`absolute h-7 w-8 rounded-sm bg-white shadow-md transition-all duration-500 ${item.val ? 'left-[46px]' : 'left-[4px]'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase">Event Categories</h3>
                  <p className="mt-1 text-[9px] font-poppins font-bold uppercase tracking-[0.35em] text-slate-400">Choose which workflows can notify you.</p>
                </div>
                {saving && (
                  <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500">Saving...</p>
                )}
              </div>

              <div className="grid gap-4">
                {categoryOptions.map((item) => (
                  <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-sm border border-slate-100 dark:border-white/5 bg-white/70 dark:bg-white/5 p-5">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[16px] text-indigo-500/70">{item.icon}</span>
                        <p className="text-base font-poppins font-bold tracking-tight text-[#003366] dark:text-white uppercase">{item.label}</p>
                      </div>
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.25em] text-slate-400 leading-relaxed opacity-80">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => toggleCategory(item.key)}
                      className={`relative h-10 w-20 rounded-sm transition-all flex items-center shadow-inner border border-white dark:border-white/5 ${preferences.categories[item.key] ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                    >
                      <div className={`absolute h-7 w-8 rounded-sm bg-white shadow-md transition-all duration-500 ${preferences.categories[item.key] ? 'left-[46px]' : 'left-[4px]'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

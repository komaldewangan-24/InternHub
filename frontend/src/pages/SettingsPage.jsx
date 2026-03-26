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
                 { label: 'Electronic Correspondence', val: prefEmail, set: setPrefEmail, icon: 'alternate_email', desc: 'ENABLE SYSTEM-TO-STUDENT ELECTRONIC MAIL SYNCHRONIZATION FOR STATUS UPDATES.' },
                 { label: 'System Integration Alerts', val: prefInApp, set: setPrefInApp, icon: 'hub', desc: 'RECEIVE REAL-TIME ANALYTIC ALERTS WITHIN THE CORE INTERFACE DASHBOARD.' }
              ].map((item, index) => (
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
                    onClick={() => item.set(!item.val)}
                    className={`relative h-10 w-20 rounded-sm transition-all flex items-center shadow-inner border border-white dark:border-white/5 ${item.val ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                  >
                    <div className={`absolute h-7 w-8 rounded-sm bg-white shadow-md transition-all duration-500 ${item.val ? 'left-[46px]' : 'left-[4px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

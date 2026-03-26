import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, projectAPI, internshipAPI } from '../services/api';
import { computeStudentReadiness } from '../utils/readiness';

const ProgressCircle = ({ percentage, color = '#6366f1', size = 80 }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size} viewBox="0 0 80 80">
        <circle stroke="rgba(99, 102, 241, 0.05)" fill="none" strokeWidth="8" cx="40" cy="40" r={radius} />
        <circle 
          stroke={color} 
          fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          strokeWidth="8" 
          cx="40" cy="40" r={radius} 
          className="transition-all duration-1000 ease-out" 
        />
      </svg>
      <span className="absolute text-[11px] font-poppins font-bold uppercase tracking-tighter" style={{ color }}>{percentage}%</span>
    </div>
  );
};

export default function StudentDashboard() {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applications: 0, underReview: 0, approved: 0, internships: 0 });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setPageLoading(true);
        const [appRes, projRes, internRes] = await Promise.all([
          applicationAPI.getAll(),
          projectAPI.getAll(),
          internshipAPI.getAll(),
        ]);

        const allProjects = projRes.data.data || [];
        setStats({
          applications: (appRes.data.data || []).length,
          underReview: allProjects.filter(p => p.status === 'pending' || p.status === 'submitted').length,
          approved: allProjects.filter(p => p.status === 'approved').length,
          internships: (internRes.data.data || []).length,
        });
      } finally {
        setPageLoading(false);
      }
    };
    if (user) loadDashboardData();
  }, [user]);

  if (loading || pageLoading) return <LoadingState label="Loading dashboard..." />;

  const readiness = computeStudentReadiness({
    user,
    approvedProjects: stats.approved,
    applications: stats.applications,
  });

  return (
    <AppShell
      title="Student Dashboard"
      description="Track your placement readiness and internship progress through institutional data analysis."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-1 space-y-8 min-w-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-poppins">
            {[
              { label: 'READINESS SCORE', value: readiness.score, color: '#6366f1', icon: 'speed', isPct: true },
              { label: 'UNDER REVIEW', value: stats.underReview, color: '#6366f1', icon: 'history_edu' },
              { label: 'APPROVED', value: stats.approved, color: '#6366f1', icon: 'task_alt' },
              { label: 'ACTIVE APPLICATIONS', value: stats.applications, color: '#6366f1', icon: 'near_me' }
            ].map((item) => (
              <div key={item.label} className="group relative rounded-xl bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/50 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-8">
                   <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">{item.label}</p>
                   <span className="material-symbols-outlined text-[18px] opacity-60" style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                   <p className="text-3xl font-poppins font-bold tracking-tighter uppercase text-[#003366] dark:text-white">{item.isPct ? `${item.value}%` : item.value}</p>
                   <div className="flex items-end gap-[2px] h-8 pb-1 opacity-5">
                      {[30, 60, 45, 80, 55, 90, 75].map((h, i) => (
                        <div key={i} className="w-[2px] rounded-full" style={{ height: `${h}%`, backgroundColor: '#003366' }} />
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 relative overflow-hidden group hover:shadow-2xl">
             <div className="absolute top-0 right-0 size-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-20 pointer-events-none bg-indigo-500/10" />
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10 font-poppins">
                <div>
                   <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-3xl font-poppins font-bold tracking-tighter uppercase leading-none text-[#003366] dark:text-white">Placement Readiness</h2>
                      <span className="rounded-sm px-3 py-1 text-[8px] font-poppins font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">ACTIVE_NODE</span>
                   </div>
                   <div className="flex items-center gap-2.5">
                     <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                     <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                       Faculty Lead: <span className="font-poppins font-bold uppercase text-indigo-500">{user?.profile?.assignedFaculty?.name || 'In local queue'}</span>
                     </p>
                   </div>
                </div>
             </div>
 
             <div className="grid gap-6 sm:grid-cols-3 mb-10 relative z-10 font-poppins">
                <div className="rounded-lg p-8 border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 transition-all hover:border-indigo-500/30 flex items-center justify-between gap-6 hover:shadow-lg">
                   <div className="min-w-0">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] mb-6 text-slate-400 dark:text-slate-500">PROFILE INTEGRITY</p>
                      <p className="text-3xl font-poppins font-bold uppercase tracking-tighter text-[#003366] dark:text-white">{readiness.profileCompletion}%</p>
                   </div>
                   <ProgressCircle percentage={readiness.profileCompletion} color="#6366f1" />
                </div>
 
                <div className="rounded-lg p-8 border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 transition-all hover:border-indigo-500/30 flex items-center justify-between gap-6 hover:shadow-lg">
                   <div className="min-w-0">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] mb-6 text-slate-400 dark:text-slate-500">CREDENTIALS</p>
                      <p className="text-2xl font-poppins font-bold uppercase tracking-tighter leading-tight text-[#003366] dark:text-white">{readiness.resumeReady ? 'Node Sync' : 'Action Required'}</p>
                   </div>
                   <div className="flex size-16 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm text-indigo-500">
                      <span className="material-symbols-outlined text-[28px]">{readiness.resumeReady ? 'task_alt' : 'pending'}</span>
                   </div>
                </div>
 
                <div className="rounded-lg p-8 border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 transition-all hover:border-indigo-500/30 flex items-center justify-between gap-6 hover:shadow-lg">
                   <div className="min-w-0">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] mb-6 text-slate-400 dark:text-slate-500">OPPORTUNITIES</p>
                      <button 
                        onClick={() => navigate('/internships')}
                        className="rounded-lg text-white px-5 py-3 text-[10px] font-poppins font-bold uppercase tracking-widest shadow-md transition-all active:scale-[0.98] hover:opacity-90"
                        style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                      >
                        EXPLORE MISSIONS
                      </button>
                   </div>
                   <div className="flex size-16 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm text-indigo-500">
                      <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                   </div>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 relative z-10 font-poppins">
                {(readiness.flags || []).map((flag, index) => (
                   <button key={index} className="rounded-sm px-5 py-2 text-[8px] font-poppins font-bold uppercase tracking-[0.2em] transition-all hover:bg-indigo-500/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                     {flag}
                   </button>
                ))}
             </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 group flex flex-col font-poppins hover:shadow-2xl">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-poppins font-bold tracking-tighter uppercase leading-none text-[#003366] dark:text-white">Active Research</h3>
                <div className="rounded-sm px-4 py-1.5 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center gap-2">
                   <span className="size-1 rounded-full animate-pulse bg-emerald-500" />
                   <p className="text-[8px] font-poppins font-bold uppercase tracking-widest text-[#003366] dark:text-slate-400">0 TOTAL</p>
                </div>
             </div>
             <div className="rounded-sm border-2 border-dashed border-slate-100 dark:border-white/5 p-14 flex flex-col items-center justify-center text-center relative overflow-hidden bg-slate-50/50 dark:bg-white/5">
                <div className="relative z-10 flex flex-col items-center">
                   <div className="flex size-14 items-center justify-center rounded-lg bg-white dark:bg-white/10 mb-6 shadow-sm text-indigo-500 opacity-60"><span className="material-symbols-outlined text-[28px]">science</span></div>
                   <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-slate-400 dark:text-slate-500 max-w-sm">Real-time registry tracking enabled. Initializing data nodes...</p>
                </div>
             </div>
          </div>
        </div>

        <div className="w-full xl:w-[340px] space-y-8 shrink-0 font-poppins">
           <div className="rounded-xl bg-white dark:bg-slate-900 p-7 shadow-sm border border-slate-200 dark:border-white/5 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-5 w-1 rounded-full bg-indigo-500" />
                 <h3 className="text-xl font-poppins font-bold tracking-tighter uppercase text-[#003366] dark:text-white">Recommendations</h3>
              </div>
              <div className="rounded-xl border-2 border-dashed border-slate-100 dark:border-white/5 p-8 text-center flex flex-col items-center justify-center mb-6 min-h-[200px] bg-slate-50/50 dark:bg-white/5">
                 <div className="flex size-14 items-center justify-center rounded-lg bg-white dark:bg-white/10 mb-6 shadow-sm text-indigo-500 opacity-60"><span className="material-symbols-outlined text-[28px]">tips_and_updates</span></div>
                 <h4 className="text-lg font-poppins font-bold tracking-tight uppercase mb-3 leading-none text-[#003366] dark:text-white">Analyzing market data</h4>
                 <p className="text-[10px] font-medium uppercase tracking-widest leading-relaxed max-w-[170px] text-slate-400 dark:text-slate-500">Optimized career alignments will populate as you complete your profile readiness status.</p>
              </div>
              <button 
                className="w-full rounded-sm py-3 text-[9px] font-poppins font-bold uppercase tracking-[0.4em] transition-all text-white shadow-md active:scale-[0.98] hover:opacity-90"
                style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
              >
                EXPLORE FULL REGISTRY
              </button>
           </div>
        </div>
      </div>
    </AppShell>
  );
}

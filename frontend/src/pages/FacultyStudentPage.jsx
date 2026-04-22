import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { projectAPI, userAPI } from '../services/api';

export default function FacultyStudentPage() {
  const { studentId } = useParams();
  const { user, loading } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setPageLoading(true);
        const [projectResponse, portfolioResponse] = await Promise.all([
          projectAPI.getAll({ studentId }),
          userAPI.getPortfolio(studentId),
        ]);
        setProjects(projectResponse.data.data || []);
        setPortfolio(portfolioResponse.data.data || null);
      } finally {
        setPageLoading(false);
      }
    };

    loadProjects();
  }, [studentId]);

  if (loading || pageLoading) {
    return <LoadingState label="Loading student details..." />;
  }

  return (
    <AppShell
      title="Student Profile"
      description="View detailed student projects and profile progress."
      navigation={navigationByRole.faculty}
      user={user}
    >
      {portfolio ? (
        /* Header Section */
        <div className="mb-20 rounded-sm bg-white dark:bg-[#003366] p-12 shadow-sm border border-slate-100 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 group relative overflow-hidden">
           <div className="absolute top-0 left-0 size-80 bg-primary/5 rounded-full -ml-40 -mt-40 blur-3xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform" />
           
           <div className="flex flex-col sm:flex-row gap-12 items-start justify-between relative">
              <div className="flex items-center gap-8 group-user">
                <div className="flex size-20 items-center justify-center rounded-sm bg-[#003366] dark:bg-white text-white dark:text-[#003366] shadow-2xl shadow-black/30 group-user-hover:rotate-12 transition-transform text-3xl font-black">
                   {portfolio.student?.name?.[0]}
                </div>
                <div className="space-y-3">
                   <h2 className="text-4xl font-black tracking-tighter dark:text-white uppercase leading-none">{portfolio.student?.name}</h2>
                   <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20">
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{portfolio.student?.profile?.rollNumber || 'No Roll Number'}</p>
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Batch of {portfolio.student?.profile?.batch || '2025'}</p>
                   </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 group-readiness">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Profile Readiness</p>
                 <div className="flex items-center gap-6 group-readiness-hover:scale-110 transition-transform">
                    <div className="h-4 w-40 rounded-full bg-slate-50 dark:bg-white/5 overflow-hidden border border-slate-100 dark:border-white/5 shadow-inner">
                       <div className="h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-1000" style={{ width: `${portfolio.readiness?.score || 0}%` }} />
                    </div>
                    <span className="text-3xl font-black dark:text-white tracking-tighter">{portfolio.readiness?.score || 0}%</span>
                 </div>
              </div>
           </div>

           <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 pt-12 border-t-2 border-slate-50 dark:border-white/5 relative">
              {[
                { label: 'Department', val: portfolio.student?.profile?.department || 'N/A', icon: 'account_balance' },
                { label: 'Degree', val: portfolio.student?.profile?.degree || 'N/A', icon: 'school' },
                { label: 'Location', val: portfolio.student?.profile?.location || 'N/A', icon: 'location_on' },
                { label: 'Total Projects', val: projects.length, icon: 'folder_managed' }
              ].map((item) => (
                <div key={item.label} className="group/item transition-all hover:translate-x-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 flex items-center gap-3 group-hover/item:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[16px] group-hover/item:rotate-12 transition-transform">{item.icon}</span>
                    {item.label}
                  </p>
                  <p className="text-sm font-black dark:text-white truncate uppercase tracking-tighter opacity-80 group-hover/item:opacity-100">{item.val}</p>
                </div>
              ))}
           </div>
        </div>
      ) : null}

      <div className="space-y-10 lg:px-4">
        <div className="flex items-center justify-between mb-12 relative px-2">
          <h3 className="text-2xl font-black tracking-tighter dark:text-white flex items-center gap-5 uppercase">
            <span className="material-symbols-outlined text-primary text-[28px] transition-transform hover:rotate-12">folder_open</span>
            Projects
          </h3>
          <div className="rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-6 py-2 shadow-sm text-primary">
             <p className="text-[9px] font-black uppercase tracking-[0.3em]">{projects.length} Projects</p>
          </div>
        </div>

        {projects.length ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {projects.map((project) => {
               return (
                <div 
                  key={project._id} 
                  className="group relative rounded-sm bg-white dark:bg-[#003366] p-10 shadow-sm border border-slate-200 dark:border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20"
                >
                  <div className="flex flex-col h-full justify-between gap-10">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                         <div className="space-y-2">
                           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Project Node</p>
                           <h4 className="text-2xl font-black tracking-tighter dark:text-white leading-none uppercase group-hover:text-primary transition-colors">{project.title}</h4>
                         </div>
                         <StatusBadge status={project.status} />
                      </div>
                      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium italic opacity-60 group-hover:opacity-100 transition-opacity whitespace-pre-wrap line-clamp-3 mb-8 border-l-2 border-slate-50 dark:border-white/5 pl-6">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-sm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-transparent transition-all">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
  
                    <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-slate-400 group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em]">{project.comments?.length || 0} Comments</p>
                       </div>
                       <Link 
                         to={`/faculty/reviews`} 
                         className="rounded-sm bg-[#003366] dark:bg-white px-8 py-3.5 text-[9px] font-black uppercase tracking-[0.3em] text-white dark:text-[#003366] shadow-2xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all scale-105 active:scale-95"
                       >
                          Review Project
                       </Link>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        ) : (
          <div className="lg:max-w-4xl mx-auto opacity-40">
            <EmptyState icon="folder_off" title="No Projects" description="This student has not submitted any projects yet." />
          </div>
        )}
      </div>

      <div className="mt-24 space-y-12">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black tracking-tighter dark:text-white flex items-center gap-5 uppercase">
            <span className="material-symbols-outlined text-primary text-[28px] transition-transform hover:rotate-12">workspace_premium</span>
            Credentials & Excellence
          </h3>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
           <div className="space-y-8 rounded-sm bg-white dark:bg-[#003366] p-10 border border-slate-200 dark:border-white/5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Excellence Summary</p>
              <p className="text-md leading-relaxed text-slate-500 dark:text-slate-400 font-medium italic italic opacity-80 whitespace-pre-wrap border-l-4 border-primary/20 pl-8 py-2">
                 {portfolio.student?.profile?.achievementsSummary || "No achievement summary provided yet. This student is currently building their academic and professional record."}
              </p>
              {portfolio.student?.profile?.achievementsImageUrl && (
                <div className="mt-10 rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl">
                  <img src={portfolio.student?.profile?.achievementsImageUrl} alt="Featured Achievement" className="w-full h-64 object-cover" />
                </div>
              )}
           </div>

           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-2">Verified Certifications & Honors</p>
              <div className="grid gap-4">
                 {(portfolio.student?.profile?.certifications?.length > 0 || portfolio.student?.profile?.achievements?.length > 0) ? (
                   [...(portfolio.student?.profile?.certifications || []).map(c => ({...c, type: 'cert'})), ...(portfolio.student?.profile?.achievements || []).map(a => ({...a, type: 'ach'}))].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-6 bg-white dark:bg-[#003366] border border-slate-200 dark:border-white/5 rounded-sm hover:border-primary/30 transition-all shadow-sm">
                        <div className="flex items-center gap-6">
                           <div className={`size-12 rounded-sm flex items-center justify-center ${item.type === 'cert' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                              <span className="material-symbols-outlined text-[24px]">{item.type === 'cert' ? 'verified_user' : 'military_tech'}</span>
                           </div>
                           <div>
                              <p className="text-md font-black dark:text-white leading-none uppercase tracking-tight">{item.title}</p>
                              <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{item.issuer || item.description || 'Verified Recognition'}</p>
                           </div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-white/5 rounded-sm border border-dashed border-slate-200 dark:border-white/10 opacity-40 text-center">
                      <span className="material-symbols-outlined text-[40px] mb-4 text-primary">military_tech</span>
                      <p className="text-[12px] font-black uppercase tracking-widest text-slate-500">No verified credentials uploaded yet</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="mt-48 p-12 text-center opacity-30 invert dark:invert-0">
         <p className="text-[9px] font-black uppercase tracking-[1.5em] text-slate-500">InternHub Portal © 2026</p>
      </div>
    </AppShell>
  );
}

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
    return <LoadingState label="Mapping candidate milestones..." />;
  }

  return (
    <AppShell
      title="Candidate Overview"
      description="Detailed pedagogical tracking and project trajectories for individual student evaluations."
      navigation={navigationByRole.faculty}
      user={user}
    >
      {portfolio ? (
        <div className="mb-10 rounded-[3rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5">
           <div className="flex flex-col sm:flex-row gap-8 items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="flex size-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary shadow-inner">
                   <span className="material-symbols-outlined text-[40px]">person</span>
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tight dark:text-white">{portfolio.student?.name}</h2>
                   <p className="mt-1 text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                     {portfolio.student?.profile?.rollNumber || 'ID: UNKNOWN'} • BATCH {portfolio.student?.profile?.batch || '2025'}
                   </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Preparedness</p>
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${portfolio.readiness?.score || 0}%` }} />
                    </div>
                    <span className="text-xl font-black dark:text-white">{portfolio.readiness?.score || 0}%</span>
                 </div>
              </div>
           </div>

           <div className="mt-10 grid gap-6 sm:grid-cols-4 pt-10 border-t border-slate-100 dark:border-white/5">
              {[
                { label: 'Department', val: portfolio.student?.profile?.department || 'Applied Science', icon: 'account_balance' },
                { label: 'Degree', val: portfolio.student?.profile?.degree || 'Undergraduate', icon: 'school' },
                { label: 'Location', val: portfolio.student?.profile?.location || 'On-campus', icon: 'location_on' },
                { label: 'Projects', val: projects.length, icon: 'folder_copy' }
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                    {item.label}
                  </p>
                  <p className="text-sm font-bold dark:text-white truncate">{item.val}</p>
                </div>
              ))}
           </div>
        </div>
      ) : null}

      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-3 ml-2">
          <span className="material-symbols-outlined text-primary">lab_profile</span>
          Submission Registry
        </h3>
        {projects.length ? (
          projects.map((project) => (
            <div key={project._id} className="group relative rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:border-primary/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-2xl font-black tracking-tight dark:text-white leading-tight group-hover:text-primary transition-colors">{project.title}</h4>
                     <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium italic opacity-80 mb-6">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {(project.tags || []).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-300">chat_bubble</span>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                           {project.comments?.length || 0} Review Interactions
                        </p>
                     </div>
                     <Link 
                       to={`/faculty/reviews`} 
                       className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all shadow-sm"
                     >
                        Enter Workspace
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="folder_off" title="No active submissions" description="Detailed project analysis will populate once the student submits milestones for evaluation." />
        )}
      </div>
    </AppShell>
  );
}

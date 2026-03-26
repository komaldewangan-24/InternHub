import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI } from '../services/api';
import { computeStudentReadiness } from '../utils/readiness';

export default function ApplicationsPage() {
  const { user, loading } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setPageLoading(true);
        const { data } = await applicationAPI.getAll();
        setApplications(data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading || pageLoading) {
    return <LoadingState label="Loading applications..." />;
  }

  const readiness = computeStudentReadiness({
    user,
    approvedProjects: 0,
    applications: applications.length,
  });

  return (
    <AppShell
      title="Applications"
      description="Monitor the lifecycle of your submitted institutional matching nodes."
      navigation={navigationByRole.student}
      user={user}
    >
      {/* Analytics Header */}
      <div className="mb-12 rounded-md bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5 transition-all overflow-hidden relative group uppercase">
        <div className="absolute top-0 left-0 size-80 bg-indigo-500/5 rounded-full -ml-40 -mt-40 blur-3xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform" />
        
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-4">
             <div className="inline-flex rounded-sm bg-indigo-500/5 px-4 py-1.5 border border-indigo-500/10">
                <p className="text-[10px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500">OVERVIEW</p>
             </div>
             <h2 className="text-3xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white leading-none uppercase">Current Node Status: <span className="text-indigo-500">{applications.length} Detected</span></h2>
             <p className="max-w-2xl text-[11px] font-poppins font-bold uppercase tracking-widest text-slate-400 leading-relaxed opacity-80 decoration-indigo-500/20 underline">
                Track the progress of your submitted institutional nodes. Your Readiness Score modulates your priority in the matching queue.
             </p>
          </div>
          <div className="rounded-sm border border-indigo-500/20 bg-slate-50 dark:bg-white/5 p-8 shadow-sm transition-all duration-500 group-hover:bg-white dark:group-hover:bg-slate-800">
              <div className="flex flex-col items-center">
                <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">Readiness</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-4xl font-poppins font-bold text-indigo-500 leading-none uppercase">{readiness.score}%</p>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:px-4 uppercase">
        {applications.length ? (
          applications.map((application) => {
            const isApproved = application.status === 'accepted' || application.status === 'approved';
            return (
              <div 
                key={application._id} 
                className="group relative rounded-md bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all duration-300 hover:shadow-lg hover:border-indigo-500/20"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="flex size-14 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 text-indigo-500/40 border border-slate-100 dark:border-white/10 shadow-sm group-hover:text-indigo-500 transition-all">
                      <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500 mb-2">APPLICATION NODE</p>
                      <h3 className="text-xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white leading-none uppercase group-hover:text-indigo-500 transition-colors">
                        {application.internship?.title || 'Internship Position'}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-poppins font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                        <span className="text-slate-900 dark:text-white">{application.internship?.company?.name || 'Company Hub'}</span>
                        <span className="size-1 rounded-full bg-slate-200 dark:bg-white/10" />
                        <span className="opacity-60">Applied: {new Date(application.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-10 pt-6 border-t border-slate-100 lg:border-t-0 lg:pt-0 dark:border-white/5">
                    <div className="flex flex-col items-center gap-2 text-center">
                       <p className="text-[9px] font-poppins font-bold uppercase tracking-widest text-slate-400">STATUS</p>
                       {isApproved ? (
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                           <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                           <p className="text-[9px] font-poppins font-bold uppercase tracking-widest text-emerald-600">ACCEPTED</p>
                         </div>
                       ) : (
                         <StatusBadge status={application.status} />
                       )}
                    </div>
                    <button 
                      className="flex size-14 items-center justify-center rounded-sm text-white shadow-md active:scale-95 transition-all hover:opacity-90"
                      style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                    >
                      <span className="material-symbols-outlined text-[24px]">description</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="lg:max-w-2xl lg:mx-auto py-10 opacity-50">
             <EmptyState icon="assignment_late" title="No Applications detected" description="Increase your activity to synchronize matching nodes." />
          </div>
        )}
      </div>
    </AppShell>
  );
}

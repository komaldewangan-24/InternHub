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
      title="My Applications"
      description="Track your journey through the selection process of various internship programs."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="mb-8 rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Workspace Analytics</p>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Application Momentum</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              You currently have <span className="text-slate-900 dark:text-white font-bold">{applications.length} active applications</span>. 
              Higher readiness scores correlate with faster recruiter responses.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-6 py-4 transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Readiness Potential</p>
              <p className="text-2xl font-black text-primary">{readiness.score}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {applications.length ? (
          applications.map((application) => (
            <div key={application._id} className="group relative rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:bg-slate-50/50 dark:hover:bg-white/10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex size-14 items-center justify-center rounded-[1.25rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight dark:text-white group-hover:text-primary transition-colors">
                      {application.internship?.title || 'Applied Mission'}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{application.internship?.company?.name || 'Recruiter'}</span>
                      <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>Submitted on {new Date(application.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={application.status} />
                  <button className="flex size-10 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-primary">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="assignment_late" title="No active applications" description="Your application history is currently empty. Explore available internships and submit your profile to see updates here." />
        )}
      </div>
    </AppShell>
  );
}

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI } from '../services/api';
import { downloadBlobResponse } from '../utils/download';

export default function AdminApplicationsPage() {
  const { user, loading } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const loadApplications = async () => {
    const { data } = await applicationAPI.getAll();
    setApplications(data.data || []);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setPageLoading(true);
        await loadApplications();
      } finally {
        setPageLoading(false);
      }
    };

    run();
  }, []);

  const handleUpdate = async (applicationId, status) => {
    try {
      await applicationAPI.updateStatus(applicationId, status);
      toast.success(`Application moved to ${status}`);
      await loadApplications();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update application');
    }
  };

  const exportApplications = async () => {
    try {
      const response = await applicationAPI.exportAll();
      downloadBlobResponse(response, 'applications-report.csv');
      toast.success('Applications export downloaded');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to export applications');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Mapping applicant pipeline..." />;
  }

  return (
    <AppShell
      title="Global Pipeline"
      description="Holistic tracking of interview trajectories and selection outcomes across the institutional network."
      navigation={navigationByRole.admin}
      user={user}
      actions={
        <button 
          className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95" 
          onClick={exportApplications} 
          type="button"
        >
          Export CSV Ledger
        </button>
      }
    >
      <div className="space-y-6">
        {applications.length ? (
          applications.map((application) => (
            <div key={application._id} className="group rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:border-primary/20">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-primary shadow-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">assignment_ind</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight dark:text-white leading-tight">{application.user?.name || 'Student Candidate'}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                      <span className="text-primary">{application.internship?.title || 'Open Role'}</span>
                      <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block" />
                      <span>{application.internship?.company?.name || 'Institution partner'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 lg:items-end">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Current Phase</p>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {['shortlisted', 'interview', 'selected', 'rejected'].map((status) => (
                      <button 
                        key={status} 
                        className={`rounded-[1rem] border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                          application.status === status 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`} 
                        onClick={() => handleUpdate(application._id, status)} 
                        type="button"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 pt-8 border-t border-slate-100 dark:border-white/5">
                 {[
                   { label: 'Applied At', val: new Date(application.appliedAt).toLocaleDateString(), icon: 'schedule' },
                   { label: 'Dept.', val: application.user?.profile?.department || 'N/A', icon: 'account_balance' },
                   { label: 'Batch', val: application.user?.profile?.batch || '2025', icon: 'school' },
                   { label: 'Stipend', val: application.internship?.stipend || 'TBD', icon: 'payments' }
                 ].map(item => (
                   <div key={item.label} className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-[16px] text-slate-400">{item.icon}</span>
                     <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                       <p className="text-[11px] font-bold dark:text-white line-clamp-1">{item.val}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="history_edu" title="No active pipeline" description="The global placement pipeline will populate as students formalize their applications." />
        )}
      </div>
    </AppShell>
  );
}

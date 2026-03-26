import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, projectAPI, userAPI } from '../services/api';
import { downloadBlobResponse } from '../utils/download';

export default function AdminAnalyticsPage() {
  const { user, loading } = useCurrentUser();
  const [stats, setStats] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setPageLoading(true);
        const { data } = await userAPI.getStats();
        setStats(data.data);
      } finally {
        setPageLoading(false);
      }
    };

    loadStats();
  }, []);

  const downloadReport = async (action, filename) => {
    try {
      const response = await action();
      downloadBlobResponse(response, filename);
      toast.success('Dossier exported successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to finalize export');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Synthesizing institutional data..." />;
  }

  const analyticTiles = [
    { label: 'Placement Efficacy', value: `${stats?.placedRate || 0}%`, icon: 'analytics', color: 'text-primary' },
    { label: 'Market-Ready Talent', value: stats?.readyStudents || 0, icon: 'verified_user', color: 'text-emerald-500' },
    { label: 'Review Backlog', value: stats?.pendingProjectReviews || 0, icon: 'pending_actions', color: 'text-amber-500' },
    { label: 'Critical Overdue', value: stats?.overdueProjectReviews || 0, icon: 'emergency_home', color: 'text-rose-500' },
    { label: 'Mean SLA Response', value: `${stats?.averageReviewTurnaroundDays || 0}d`, icon: 'avg_time', color: 'text-indigo-500' },
    { label: 'Stagnant Recruiters', value: stats?.inactiveRecruiters || 0, icon: 'person_off', color: 'text-slate-400' },
  ];

  return (
    <AppShell
      title="Intelligence Suite"
      description="Deep-dive operational metrics across pedagogy, verification SLAs, and recruitment efficacy."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analyticTiles.map((tile) => (
          <div key={tile.label} className="group rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all hover:border-primary/20">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 ${tile.color} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined text-[24px]">{tile.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{tile.label}</p>
            <p className="mt-2 text-4xl font-black tracking-tight dark:text-white">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-sm border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-10">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div>
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Institutional Data Exports</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">Download CSV ledgers for external auditing and reporting.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 w-full lg:w-auto">
            {[
              { label: 'Readiness', action: userAPI.exportStudents, file: 'readiness' },
              { label: 'Projects', action: projectAPI.exportApproved, file: 'projects' },
              { label: 'Backlog', action: projectAPI.exportBacklog, file: 'backlog' },
              { label: 'Pipeline', action: applicationAPI.exportAll, file: 'pipeline' },
            ].map(exportType => (
              <button 
                key={exportType.label}
                className="flex flex-col items-center justify-center rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 text-center transition-all hover:border-primary hover:bg-primary/5 group"
                onClick={() => downloadReport(exportType.action, `${exportType.file}-report.csv`)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary mb-2">download</span>
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-slate-300">{exportType.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

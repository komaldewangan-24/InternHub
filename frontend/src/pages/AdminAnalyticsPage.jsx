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
      toast.success('Report downloaded');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to export report');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading analytics..." />;
  }

  return (
    <AppShell
      title="Placement Analytics"
      description="Operational analytics across readiness, review SLAs, recruiter activity, and exportable placement data."
      navigation={navigationByRole.admin}
      user={user}
      actions={
        <>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={() => downloadReport(userAPI.exportStudents, 'students-readiness.csv')} type="button">
            Export Students
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={() => downloadReport(projectAPI.exportApproved, 'approved-projects.csv')} type="button">
            Export Projects
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={() => downloadReport(projectAPI.exportBacklog, 'review-backlog.csv')} type="button">
            Export Backlog
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={() => downloadReport(applicationAPI.exportAll, 'applications-report.csv')} type="button">
            Export Applications
          </button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Placement Rate', `${stats?.placedRate || 0}%`],
          ['Ready Students', stats?.readyStudents || 0],
          ['Pending Project Reviews', stats?.pendingProjectReviews || 0],
          ['Overdue Reviews', stats?.overdueProjectReviews || 0],
          ['Avg Review Turnaround', `${stats?.averageReviewTurnaroundDays || 0} days`],
          ['Inactive Recruiters', stats?.inactiveRecruiters || 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

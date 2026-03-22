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
    return <LoadingState label="Loading applications..." />;
  }

  return (
    <AppShell
      title="Placement Applications"
      description="Track the full application pipeline across all internships and recruiters."
      navigation={navigationByRole.admin}
      user={user}
      actions={
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={exportApplications} type="button">
          Export Applications
        </button>
      }
    >
      <div className="space-y-4">
        {applications.length ? (
          applications.map((application) => (
            <div key={application._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-bold">{application.user?.name || 'Student'}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {application.internship?.title || 'Internship'} • {application.internship?.company?.name || 'Company'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={application.status} />
                  {['shortlisted', 'interview', 'selected', 'rejected'].map((status) => (
                    <button key={status} className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]" onClick={() => handleUpdate(application._id, status)} type="button">
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No applications yet" description="Applications will appear here as students begin applying." />
        )}
      </div>
    </AppShell>
  );
}

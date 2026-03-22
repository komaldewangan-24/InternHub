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
      description="Track every internship you have applied to and where it stands right now."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">Application Momentum</h2>
            <p className="mt-2 text-sm text-slate-500">
              You have {applications.length} applications in motion. Keep your profile and approved projects updated to improve recruiter trust.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold">
            Readiness score: {readiness.score}%
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {applications.length ? (
          applications.map((application) => (
            <div key={application._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-bold">{application.internship?.title || 'Internship'}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {application.internship?.company?.name || 'Company'} • Applied on{' '}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No applications yet" description="Start applying to internships after your approved projects and profile are ready." />
        )}
      </div>
    </AppShell>
  );
}

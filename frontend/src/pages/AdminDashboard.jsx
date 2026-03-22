import React, { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, projectAPI, userAPI } from '../services/api';

export default function AdminDashboard() {
  const { user, loading } = useCurrentUser();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [statsResponse, projectResponse, applicationResponse] = await Promise.all([
          userAPI.getStats(),
          projectAPI.getAll(),
          applicationAPI.getAll(),
        ]);
        setStats(statsResponse.data.data);
        setProjects(projectResponse.data.data || []);
        setApplications(applicationResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || pageLoading) {
    return <LoadingState label="Loading placement dashboard..." />;
  }

  return (
    <AppShell
      title="Placement Dashboard"
      description="Monitor student readiness, faculty review throughput, recruiter activity, and application movement."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Students', stats?.totalStudents || 0],
          ['Ready Students', stats?.readyStudents || 0],
          ['Pending Project Reviews', stats?.pendingProjectReviews || 0],
          ['Overdue Reviews', stats?.overdueProjectReviews || 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr,1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Operational Bottlenecks</h2>
          <div className="mt-6 space-y-3">
            {[
              ['Missing resumes', stats?.studentsMissingResume || 0],
              ['No approved project yet', stats?.studentsWithoutApprovedProjects || 0],
              ['Low application activity', stats?.lowApplicationActivity || 0],
              ['Inactive recruiters', stats?.inactiveRecruiters || 0],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold">{label}</p>
                <p className="text-lg font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Review Health</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Average turnaround</p>
              <p className="mt-2 text-2xl font-black">{stats?.averageReviewTurnaroundDays || 0} days</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Placement rate</p>
              <p className="mt-2 text-2xl font-black">{stats?.placedRate || 0}%</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {projects.length ? (
              projects.slice(0, 4).map((project) => (
                <div key={project._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.student?.name} • {project.faculty?.name}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))
            ) : (
              <EmptyState title="No project activity" description="Project submissions will appear here after students start submitting work." />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Recent Applications</h2>
        <div className="mt-6 space-y-3">
          {applications.length ? (
            applications.slice(0, 5).map((application) => (
              <div key={application._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold">{application.user?.name || 'Student'}</p>
                  <p className="mt-1 text-sm text-slate-500">{application.internship?.title || 'Internship'}</p>
                </div>
                <StatusBadge status={application.status} />
              </div>
            ))
          ) : (
            <EmptyState title="No applications yet" description="Application activity will appear here when recruiters start hiring." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

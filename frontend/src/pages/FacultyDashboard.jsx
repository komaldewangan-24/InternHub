import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { projectAPI } from '../services/api';

export default function FacultyDashboard() {
  const { user, loading } = useCurrentUser();
  const [queue, setQueue] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [queueResponse, projectResponse] = await Promise.all([
          projectAPI.getFacultyQueue(),
          projectAPI.getAll(),
        ]);
        setQueue(queueResponse.data.data || []);
        setProjects(projectResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  const studentCount = useMemo(() => {
    const uniqueIds = new Set(projects.map((project) => project.student?._id).filter(Boolean));
    return uniqueIds.size;
  }, [projects]);

  const overdueCount = useMemo(
    () => queue.filter((project) => project.reviewDueAt && new Date(project.reviewDueAt) < new Date()).length,
    [queue]
  );

  const averageTurnaround = useMemo(() => {
    const approved = projects.filter((project) => typeof project.turnaroundDays === 'number');
    if (!approved.length) return 0;
    return (approved.reduce((sum, project) => sum + Number(project.turnaroundDays || 0), 0) / approved.length).toFixed(1);
  }, [projects]);

  if (loading || pageLoading) {
    return <LoadingState label="Loading faculty dashboard..." />;
  }

  return (
    <AppShell
      title="Faculty Dashboard"
      description="Review student submissions, track SLA health, and keep your approval queue moving."
      navigation={navigationByRole.faculty}
      user={user}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Pending Reviews', queue.length],
          ['Overdue Reviews', overdueCount],
          ['Assigned Students', studentCount],
          ['Average Turnaround', `${averageTurnaround} days`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Review Queue</h2>
          <p className="text-sm text-slate-500">Newest submissions first</p>
        </div>
        <div className="mt-6 space-y-4">
          {queue.length ? (
            queue.map((project) => (
              <div key={project._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.student?.name} • {project.student?.profile?.department || 'Department not set'}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                      Due {project.reviewDueAt ? new Date(project.reviewDueAt).toLocaleDateString() : 'Not scheduled'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={project.status} />
                    {project.student?._id ? (
                      <Link className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold" to={`/faculty/students/${project.student._id}`}>
                        View Student
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Queue is clear" description="Submitted projects assigned to you will appear here for review." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

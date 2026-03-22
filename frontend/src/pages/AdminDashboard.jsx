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
    return <LoadingState label="Synthesizing placement analytics..." />;
  }

  const mainStats = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: 'groups', color: 'text-primary' },
    { label: 'Market Ready', value: stats?.readyStudents || 0, icon: 'verified', color: 'text-emerald-500' },
    { label: 'Pending Reviews', value: stats?.pendingProjectReviews || 0, icon: 'history_edu', color: 'text-amber-500' },
    { label: 'Placement Rate', value: `${stats?.placedRate || 0}%`, icon: 'insights', color: 'text-indigo-500' },
  ];

  return (
    <AppShell
      title="Placement Oversight"
      description="Strategic visualization of institutional readiness, faculty throughput, and recruitment velocity."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => (
          <div key={stat.label} className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all hover:border-primary/20">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-rose-500">warning</span>
            Operational Risks
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Missing resumes', value: stats?.studentsMissingResume || 0, icon: 'drafts' },
              { label: 'No approved projects', value: stats?.studentsWithoutApprovedProjects || 0, icon: 'assignment_late' },
              { label: 'Low application activity', value: stats?.lowApplicationActivity || 0, icon: 'trending_down' },
              { label: 'Inactive recruiters', value: stats?.inactiveRecruiters || 0, icon: 'person_off' },
            ].map((risk) => (
              <div key={risk.label} className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-rose-50/50 dark:hover:bg-rose-500/5 group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-rose-500 transition-colors">{risk.icon}</span>
                  <p className="font-bold text-slate-600 dark:text-slate-300">{risk.label}</p>
                </div>
                <p className="text-xl font-black dark:text-white">{risk.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">health_metrics</span>
              Review Health
            </h2>
            <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2">
              <span className="text-xs font-black text-primary uppercase tracking-tighter">Avg TAT: {stats?.averageReviewTurnaroundDays || 0} Days</span>
            </div>
          </div>
          <div className="space-y-4">
            {projects.length ? (
              projects.slice(0, 5).map((project) => (
                <div key={project._id} className="group rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-primary font-bold shadow-sm uppercase">
                      {project.student?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-700 dark:text-white tracking-tight leading-none">{project.title}</p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Evaluator: {project.faculty?.name || 'Assigned Faculty'}</p>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))
            ) : (
              <EmptyState icon="database" title="No activity" description="Project review cycles will activate as students submit work." />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm">
        <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-indigo-500">rocket_launch</span>
          Recent Application Flux
        </h2>
        <div className="space-y-3">
          {applications.length ? (
            applications.slice(0, 5).map((app) => (
              <div key={app._id} className="group flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <div>
                      <p className="font-black text-slate-700 dark:text-white tracking-tight">{app.user?.name || 'Student Candidate'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{app.internship?.title || 'Internship Title'}</p>
                    </div>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))
          ) : (
            <EmptyState icon="pending_actions" title="Awaiting recruitment activity" description="Once companies start vetting students, placement movement will appear here." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

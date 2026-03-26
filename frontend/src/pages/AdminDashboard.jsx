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
      if (!user) return;
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
  }, [user]);

  if (loading || pageLoading) {
    return <LoadingState label="Synthesizing placement analytics..." />;
  }

  const mainStats = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: 'groups', color: 'text-indigo-500' },
    { label: 'Market Ready', value: stats?.readyStudents || 0, icon: 'verified', color: 'text-emerald-500' },
    { label: 'Pending Reviews', value: stats?.pendingProjectReviews || 0, icon: 'history_edu', color: 'text-indigo-500' },
    { label: 'Placement Rate', value: `${stats?.placedRate || 0}%`, icon: 'insights', color: 'text-indigo-500' },
  ];

  return (
    <AppShell
      title="Placement Oversight"
      description="Strategic visualization of institutional readiness, faculty throughput, and recruitment velocity."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 uppercase">
        {mainStats.map((stat) => (
          <div key={stat.label} className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-1">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 ${stat.color}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#003366] dark:text-white uppercase">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2 uppercase text-[#003366]">
        <div className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-2xl font-bold tracking-tighter text-[#003366] dark:text-white flex items-center gap-3 mb-8 uppercase">
            <span className="material-symbols-outlined text-indigo-500">warning</span>
            Operational Risks
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Missing resumes', value: stats?.studentsMissingResume || 0, icon: 'drafts' },
              { label: 'No approved projects', value: stats?.studentsWithoutApprovedProjects || 0, icon: 'assignment_late' },
              { label: 'Low application activity', value: stats?.lowApplicationActivity || 0, icon: 'trending_down' },
              { label: 'Inactive recruiters', value: stats?.inactiveRecruiters || 0, icon: 'person_off' },
            ].map((risk) => (
              <div key={risk.label} className="flex items-center justify-between rounded-sm border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10 group hover:shadow-md">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-indigo-500/40 group-hover:text-indigo-500 transition-colors uppercase">{risk.icon}</span>
                  <p className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{risk.label}</p>
                </div>
                <p className="text-xl font-bold text-[#003366] dark:text-white uppercase">{risk.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tighter text-[#003366] dark:text-white flex items-center gap-3 uppercase">
              <span className="material-symbols-outlined text-indigo-500">health_metrics</span>
              Review Health
            </h2>
            <div className="flex items-center gap-2 rounded-sm bg-indigo-500/10 px-4 py-2 border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Avg TAT: {stats?.averageReviewTurnaroundDays || 0} Days</span>
            </div>
          </div>
          <div className="space-y-4">
            {projects.length ? (
              projects.slice(0, 5).map((project) => (
                <div key={project._id} className="group rounded-sm border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-between hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-sm bg-white dark:bg-slate-800 text-indigo-500 font-bold shadow-sm uppercase border border-slate-100 dark:border-white/10 transition-transform group-hover:rotate-3">
                      {project.student?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#003366] dark:text-white tracking-tighter leading-none uppercase truncate max-w-[140px]">{project.title}</p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Evaluator: {project.faculty?.name || 'Assigned Faculty'}</p>
                    </div>
                  </div>
                  {project.status === 'approved' ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                      <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <p className="text-[8px] font-bold uppercase text-emerald-600">APPROVED</p>
                    </div>
                  ) : (
                    <StatusBadge status={project.status} />
                  )}
                </div>
              ))
            ) : (
              <EmptyState icon="database" title="No activity" description="Project review cycles will activate as students submit work." />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl uppercase">
        <h2 className="text-3xl font-bold tracking-tighter text-[#003366] dark:text-white flex items-center gap-3 mb-10 uppercase">
          <span className="material-symbols-outlined text-indigo-500">rocket_launch</span>
          Recent Application Flux
        </h2>
        <div className="space-y-4">
          {applications.length ? (
            applications.slice(0, 5).map((app) => (
              <div key={app._id} className="group flex items-center justify-between rounded-sm border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-6 transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:shadow-md">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-sm bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                      <span className="material-symbols-outlined text-sm uppercase">person</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#003366] dark:text-white tracking-tighter uppercase">{app.user?.name || 'Student Candidate'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{app.internship?.title || 'Internship Title'}</p>
                    </div>
                  </div>
                </div>
                {app.status === 'accepted' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">ACCEPTED</p>
                  </div>
                ) : (
                  <StatusBadge status={app.status} />
                )}
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

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
    return <LoadingState label="Initializing evaluator metrics..." />;
  }

  const statCards = [
    { label: 'Pending Reviews', value: queue.length, icon: 'pending_actions', color: 'text-indigo-500' },
    { label: 'Overdue Reviews', value: overdueCount, icon: 'warning', color: 'text-rose-500' },
    { label: 'Assigned Students', value: studentCount, icon: 'groups', color: 'text-indigo-500' },
    { label: 'Avg Turnaround', value: `${averageTurnaround} days`, icon: 'speed', color: 'text-emerald-500' },
  ];

  const blueGradient = 'linear-gradient(135deg, #003366 0%, #0066cc 100%)';

  return (
    <AppShell
      title="Academic Evaluator"
      description="Streamlining the bridge between student creativity and professional readiness."
      navigation={navigationByRole.faculty}
      user={user}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 uppercase">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-1">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 ${card.color}`}>
              <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#003366] dark:text-white uppercase">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl uppercase">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 dark:border-white/5">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#003366] dark:text-white uppercase">Review Workflow Queue</h2>
            <p className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic leading-relaxed">Strictly following chronological submission order.</p>
          </div>
          <div className="rounded-sm bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            Priority View
          </div>
        </div>
        
        <div className="space-y-4">
          {queue.length ? (
            queue.map((project) => (
              <div key={project._id} className="group rounded-sm border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-6 transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:shadow-md">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div className="flex size-14 items-center justify-center rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-indigo-500 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">description</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#003366] dark:text-white tracking-tighter uppercase">{project.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <span>{project.student?.name}</span>
                        <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <span>{project.student?.profile?.department || 'Applied Science'}</span>
                      </div>
                      <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                        project.reviewDueAt && new Date(project.reviewDueAt) < new Date() ? 'text-rose-500' : 'text-slate-400'
                      }`}>
                        <span className="material-symbols-outlined text-xs">timer</span>
                        Deadline: {project.reviewDueAt ? new Date(project.reviewDueAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {project.status === 'approved' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                        <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <p className="text-[8px] font-bold uppercase text-emerald-600">APPROVED</p>
                      </div>
                    ) : (
                      <StatusBadge status={project.status} />
                    )}
                    {project.student?._id ? (
                      <Link 
                        className="rounded-sm text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-all font-poppins active:scale-[0.98]" 
                        style={{ backgroundImage: blueGradient }}
                        to={`/faculty/students/${project.student._id}`}
                      >
                        Launch Review
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon="task_alt" title="Evaluation queue clear" description="All assigned submissions have been processed. New submissions will notify you instantly." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

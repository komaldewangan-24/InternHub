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
    { label: 'Pending Reviews', value: queue.length, icon: 'pending_actions', color: 'text-amber-500' },
    { label: 'Overdue Reviews', value: overdueCount, icon: 'warning', color: 'text-rose-500' },
    { label: 'Assigned Students', value: studentCount, icon: 'groups', color: 'text-primary' },
    { label: 'Avg Turnaround', value: `${averageTurnaround} days`, icon: 'speed', color: 'text-emerald-500' },
  ];

  return (
    <AppShell
      title="Academic Evaluator"
      description="Streamlining the bridge between student creativity and professional readiness."
      navigation={navigationByRole.faculty}
      user={user}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all hover:border-primary/20">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 ${card.color}`}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
          <div>
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Review Workflow Queue</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium italic italic">Strictly following chronological submission order.</p>
          </div>
          <div className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            Priority View
          </div>
        </div>
        
        <div className="space-y-4">
          {queue.length ? (
            queue.map((project) => (
              <div key={project._id} className="group rounded-[2rem] border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-6 transition-all hover:bg-slate-50 dark:hover:bg-white/10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-primary shadow-sm group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">description</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight dark:text-white">{project.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                        <span>{project.student?.name}</span>
                        <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <span>{project.student?.profile?.department || 'Applied Science'}</span>
                      </div>
                      <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${
                        project.reviewDueAt && new Date(project.reviewDueAt) < new Date() ? 'text-rose-500' : 'text-slate-400'
                      }`}>
                        <span className="material-symbols-outlined text-xs align-middle mr-1">timer</span>
                        Deadline: {project.reviewDueAt ? new Date(project.reviewDueAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <StatusBadge status={project.status} />
                    {project.student?._id ? (
                      <Link 
                        className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:border-primary hover:text-primary shadow-sm active:scale-95" 
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

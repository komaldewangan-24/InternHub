import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { projectAPI, settingsAPI } from '../services/api';

export default function FacultyReviewsPage() {
  const { user, loading } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rubric, setRubric] = useState([]);
  const [rubricScores, setRubricScores] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedId) || projects[0] || null,
    [projects, selectedId]
  );

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setPageLoading(true);
        const [projectResponse, settingsResponse] = await Promise.all([
          projectAPI.getAll(),
          settingsAPI.get(),
        ]);
        setProjects(projectResponse.data.data || []);
        setRubric(settingsResponse.data.data?.reviewRubric || []);
      } finally {
        setPageLoading(false);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject && !selectedId) {
      setSelectedId(selectedProject._id);
    }
  }, [selectedId, selectedProject]);

  useEffect(() => {
    if (selectedProject?.rubricAssessment?.length) {
      const nextScores = {};
      selectedProject.rubricAssessment.forEach((item) => {
        nextScores[item.criterion] = item.score;
      });
      setRubricScores(nextScores);
    } else {
      setRubricScores({});
    }
  }, [selectedProject]);

  const handleReview = async (action) => {
    if (!selectedProject) return;
    try {
      setSaving(true);
      const rubricAssessment = rubric.map((item) => ({
        criterion: item.key,
        score: Number(rubricScores[item.key] || 0),
        maxScore: Number(item.maxScore || 5),
        note: '',
      }));
      await projectAPI.review(selectedProject._id, {
        action,
        message: feedback,
        rubricAssessment,
      });
      const { data } = await projectAPI.getAll();
      setProjects(data.data || []);
      setFeedback('');
      toast.success(action === 'approved' ? 'Project approved' : 'Review saved');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to save review');
    } finally {
      setSaving(false);
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Synchronizing evaluator queue..." />;
  }

  return (
    <AppShell
      title="Review Terminal"
      description="Inspect student logic, verify technical rigor, and provide pedagogical feedback."
      navigation={navigationByRole.faculty}
      user={user}
    >
      <div className="grid h-[calc(100vh-280px)] gap-6 xl:grid-cols-[380px,1fr]">
        <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Submission Queue</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 custom-scrollbar">
            {projects.length ? (
              projects.map((project) => (
                <button
                  key={project._id}
                  className={`group w-full rounded-xl p-5 text-left transition-all ${
                    selectedProject?._id === project._id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-slate-950/20'
                  }`}
                  onClick={() => setSelectedId(project._id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black tracking-tight line-clamp-1">{project.title}</p>
                      <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${
                        selectedProject?._id === project._id ? 'text-white/70' : 'text-slate-500'
                      }`}>{project.student?.name}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                     <StatusBadge status={project.status} />
                     <span className={`text-[10px] font-bold ${selectedProject?._id === project._id ? 'text-white/40' : 'text-slate-400'}`}>v{project.currentVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <EmptyState icon="task_alt" title="Queue empty" description="No projects require your verification currently." />
            )}
          </div>
        </section>

        <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all">
          {selectedProject ? (
            <div className="flex flex-col h-full overflow-hidden">
               <div className="flex items-start justify-between p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div>
                  <h2 className="text-3xl font-black tracking-tight dark:text-white leading-tight">{selectedProject.title}</h2>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                    <span className="text-primary">{selectedProject.student?.name}</span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>Iteration v{selectedProject.currentVersion}</span>
                  </div>
                </div>
                <StatusBadge status={selectedProject.status} />
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Project Synopsis</h4>
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium italic italic">{selectedProject.description}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">link</span>
                      Verification Links
                    </h4>
                    <div className="space-y-3">
                      {(selectedProject.links || []).map((link) => (
                        <a key={link} className="flex items-center gap-2 truncate rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 p-3 text-xs font-bold text-primary hover:underline hover:border-primary/30 transition-all" href={link} rel="noreferrer" target="_blank">
                           <span className="material-symbols-outlined text-xs">open_in_new</span>
                           {link}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">rule</span>
                        Evaluator Scorecard
                      </h4>
                      <p className="text-sm font-black text-primary">{selectedProject.rubricScore || 0} Points</p>
                    </div>
                    <div className="space-y-4">
                      {rubric.map((item) => (
                        <div key={item.key} className="space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <span>{item.label}</span>
                            <span className="text-slate-400">/{item.maxScore || 5}</span>
                          </div>
                          <input className="w-full transition-all accent-primary h-1.5 bg-slate-100 dark:bg-white/10 rounded-full" max={item.maxScore || 5} min="0" type="range" value={rubricScores[item.key] ?? 0} onChange={(event) => setRubricScores((current) => ({ ...current, [item.key]: event.target.value }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">rate_review</span>
                    Internal Review Notes
                  </h4>
                  <textarea className="min-h-[160px] w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-4 text-sm outline-none focus:border-primary dark:text-white transition-all shadow-sm" placeholder="Detail the strengths or required improvements for this student submission..." value={feedback} onChange={(event) => setFeedback(event.target.value)} />
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex flex-wrap gap-4">
                <button className="flex-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-6 py-4 text-sm font-black text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:border-slate-300 active:scale-95" disabled={saving} onClick={() => handleReview('commented')}>
                  Discard Review & Comment
                </button>
                <button className="flex-1 rounded-xl bg-amber-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95" disabled={saving} onClick={() => handleReview('needs_resubmission')}>
                  Request Resubmission
                </button>
                <button className="flex-1 rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95" disabled={saving} onClick={() => handleReview('approved')}>
                  Approve Project
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
               <div className="flex size-24 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-300 mb-8 shadow-sm">
                <span className="material-symbols-outlined text-[48px]">fact_check</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight dark:text-white">Review Terminal</h3>
              <p className="mt-3 max-w-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Select a student submission from the queue to start the verification process. Your reviews directly impact student placement readiness.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

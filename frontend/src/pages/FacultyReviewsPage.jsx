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
    return <LoadingState label="Loading faculty reviews..." />;
  }

  return (
    <AppShell
      title="Faculty Reviews"
      description="Comment on student projects, request resubmission, or approve final work."
      navigation={navigationByRole.faculty}
      user={user}
    >
      <div className="grid gap-6 xl:grid-cols-[0.42fr,0.58fr]">
        <section className="space-y-4">
          {projects.length ? (
            projects.map((project) => (
              <button
                key={project._id}
                className={`w-full rounded-3xl border p-5 text-left ${
                  selectedProject?._id === project._id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'
                }`}
                onClick={() => setSelectedId(project._id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{project.student?.name}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              </button>
            ))
          ) : (
            <EmptyState title="No project assignments" description="Project submissions assigned to you will appear here." />
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          {selectedProject ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{selectedProject.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Student: {selectedProject.student?.name} • Version {selectedProject.currentVersion}
                  </p>
                </div>
                <StatusBadge status={selectedProject.status} />
              </div>

              <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600">{selectedProject.description}</p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold">Links</p>
                <div className="mt-3 space-y-2">
                  {(selectedProject.links || []).map((link) => (
                    <a key={link} className="block text-sm text-primary underline" href={link} rel="noreferrer" target="_blank">
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Rubric Assessment</p>
                  <p className="text-sm text-slate-500">Current score: {selectedProject.rubricScore || 0}</p>
                </div>
                <div className="mt-4 space-y-3">
                  {rubric.map((item) => (
                    <div key={item.key} className="grid gap-3 md:grid-cols-[1fr,120px]">
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" max={item.maxScore || 5} min="0" type="number" value={rubricScores[item.key] ?? ''} onChange={(event) => setRubricScores((current) => ({ ...current, [item.key]: event.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold">Review Notes</h3>
                <textarea className="mt-4 min-h-[160px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Leave faculty feedback for the student" value={feedback} onChange={(event) => setFeedback(event.target.value)} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold" disabled={saving} onClick={() => handleReview('commented')} type="button">
                  Save Comment
                </button>
                <button className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white" disabled={saving} onClick={() => handleReview('needs_resubmission')} type="button">
                  Request Resubmission
                </button>
                <button className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white" disabled={saving} onClick={() => handleReview('approved')} type="button">
                  Approve Project
                </button>
              </div>
            </>
          ) : (
            <EmptyState title="Select a project" description="Choose a student project from the queue to review it." />
          )}
        </section>
      </div>
    </AppShell>
  );
}

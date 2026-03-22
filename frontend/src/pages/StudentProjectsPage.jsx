import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { projectAPI, userAPI } from '../services/api';

const blankForm = {
  title: '',
  description: '',
  links: '',
  tags: '',
  faculty: '',
};

const toLinesArray = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export default function StudentProjectsPage() {
  const { user, loading } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(blankForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedId) || null,
    [projects, selectedId]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [projectResponse, facultyResponse] = await Promise.all([
          projectAPI.getAll(),
          userAPI.search('', 'faculty'),
        ]);
        setProjects(projectResponse.data.data || []);
        setFaculty(facultyResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setForm({
        title: selectedProject.title || '',
        description: selectedProject.description || '',
        links: (selectedProject.links || []).join('\n'),
        tags: (selectedProject.tags || []).join('\n'),
        faculty: selectedProject.faculty?._id || '',
      });
    } else {
      setForm({
        ...blankForm,
        faculty: user?.profile?.assignedFaculty?._id || '',
      });
    }
  }, [selectedProject, user]);

  const refreshProjects = async (nextSelectedId) => {
    const { data } = await projectAPI.getAll();
    setProjects(data.data || []);
    if (nextSelectedId) {
      setSelectedId(nextSelectedId);
    }
  };

  const saveDraft = async () => {
    try {
      setSaving(true);
      if (!form.title || !form.description || !form.faculty) {
        toast.error('Title, description, and faculty are required');
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        links: toLinesArray(form.links),
        tags: toLinesArray(form.tags),
        faculty: form.faculty,
      };

      if (selectedProject) {
        const { data } = await projectAPI.update(selectedProject._id, payload);
        await refreshProjects(data.data._id);
      } else {
        const { data } = await projectAPI.create(payload);
        await refreshProjects(data.data._id);
      }

      toast.success('Draft saved');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to save draft');
    } finally {
      setSaving(false);
    }
  };

  const submitCurrent = async () => {
    if (!selectedProject) {
      toast.info('Save the project as a draft first');
      return;
    }

    try {
      setSaving(true);
      if (selectedProject.status === 'draft') {
        await projectAPI.submit(selectedProject._id);
      } else if (selectedProject.status === 'needs_resubmission') {
        await projectAPI.resubmit(selectedProject._id, {
          title: form.title,
          description: form.description,
          links: toLinesArray(form.links),
          tags: toLinesArray(form.tags),
        });
      } else {
        toast.info('This project is already in review');
        return;
      }

      await refreshProjects(selectedProject._id);
      toast.success(selectedProject.status === 'draft' ? 'Project submitted' : 'Project resubmitted');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to submit project');
    } finally {
      setSaving(false);
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading project workspace..." />;
  }

  return (
    <AppShell
      title="Student Projects"
      description="Draft projects, tag your work, submit to faculty, and iterate until the work is approved for recruiters."
      navigation={navigationByRole.student}
      user={user}
      actions={
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={() => setSelectedId('')} type="button">
          New Project
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <section className="space-y-4">
          {projects.length ? (
            projects.map((project) => (
              <button
                key={project._id}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  selectedId === project._id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'
                }`}
                onClick={() => setSelectedId(project._id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Faculty: {project.faculty?.name || 'Not assigned'}
                    </p>
                    {project.reviewDueAt ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                        Due {new Date(project.reviewDueAt).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(project.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-600">{project.description}</p>
              </button>
            ))
          ) : (
            <EmptyState title="Start your first project" description="Create a draft, use your assigned faculty reviewer, and submit it when you are ready." />
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">{selectedProject ? 'Edit Project' : 'New Project Draft'}</h2>
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Project title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" value={form.faculty} onChange={(event) => setForm((current) => ({ ...current, faculty: event.target.value }))}>
                <option value="">Select faculty reviewer</option>
                {faculty.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                    {user?.profile?.assignedFaculty?._id === member._id ? ' (Assigned Faculty)' : ''}
                  </option>
                ))}
              </select>
              <textarea className="min-h-[180px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Project description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
              <textarea className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Project tags, one per line\nReact\nNode.js\nMachine Learning'} value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
              <textarea className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'One link per line\nhttps://github.com/...\nhttps://demo.example.com'} value={form.links} onChange={(event) => setForm((current) => ({ ...current, links: event.target.value }))} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 disabled:opacity-70" disabled={saving} onClick={saveDraft} type="button">
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 disabled:opacity-60" disabled={saving || !selectedProject} onClick={submitCurrent} type="button">
                {selectedProject?.status === 'needs_resubmission' ? 'Resubmit Project' : 'Submit for Review'}
              </button>
            </div>
          </div>

          {selectedProject ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Version History</h3>
                <div className="mt-4 space-y-3">
                  {selectedProject.versions?.map((version) => (
                    <div key={version._id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold">Version {version.versionNumber}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Submitted {new Date(version.submittedAt).toLocaleString()}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(version.tags || []).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold">Faculty Comments</h3>
                <div className="mt-4 space-y-3">
                  {selectedProject.comments?.length ? (
                    selectedProject.comments.map((comment) => (
                      <div key={comment._id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-semibold">{comment.author?.name || 'Faculty'}</p>
                          <StatusBadge status={comment.action} />
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{comment.message}</p>
                      </div>
                    ))
                  ) : (
                    <EmptyState title="No comments yet" description="Faculty feedback will appear here after they review your submission." />
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

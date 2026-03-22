import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { companyAPI, internshipAPI } from '../services/api';

const blankForm = {
  id: '',
  title: '',
  company: '',
  description: '',
  requirements: '',
  skillTags: '',
  eligibleDepartments: '',
  eligibleBatches: '',
  location: '',
  stipend: '',
  duration: '',
  applyBy: '',
  status: 'open',
};

const toRequirements = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export default function RecruiterInternshipsPage() {
  const { user, loading } = useCurrentUser();
  const [internships, setInternships] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const recruiterId = user?._id || user?.id;

  const ownCompanies = useMemo(
    () => companies.filter((company) => company.user === recruiterId || company.user?._id === recruiterId),
    [companies, recruiterId]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [internshipResponse, companyResponse] = await Promise.all([
          internshipAPI.getAll(),
          companyAPI.getAll(),
        ]);
        setInternships((internshipResponse.data.data || []).filter((item) => item.user === recruiterId || item.user?._id === recruiterId));
        setCompanies(companyResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [recruiterId, user]);

  const refreshInternships = async () => {
    const { data } = await internshipAPI.getAll();
    setInternships((data.data || []).filter((item) => item.user === recruiterId || item.user?._id === recruiterId));
  };

  const handleEdit = (internship) => {
    setForm({
      id: internship._id,
      title: internship.title || '',
      company: internship.company?._id || internship.company || '',
      description: internship.description || '',
      requirements: (internship.requirements || []).join('\n'),
      skillTags: (internship.skillTags || []).join('\n'),
      eligibleDepartments: (internship.eligibleDepartments || []).join('\n'),
      eligibleBatches: (internship.eligibleBatches || []).join('\n'),
      location: internship.location || '',
      stipend: internship.stipend || '',
      duration: internship.duration || '',
      applyBy: internship.applyBy ? new Date(internship.applyBy).toISOString().split('T')[0] : '',
      status: internship.status || 'open',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        title: form.title,
        company: form.company,
        description: form.description,
        requirements: toRequirements(form.requirements),
        skillTags: toRequirements(form.skillTags),
        eligibleDepartments: toRequirements(form.eligibleDepartments),
        eligibleBatches: toRequirements(form.eligibleBatches),
        location: form.location,
        stipend: form.stipend,
        duration: form.duration,
        applyBy: form.applyBy || undefined,
        status: form.status,
      };

      if (form.id) {
        await internshipAPI.update(form.id, payload);
        toast.success('Internship updated');
      } else {
        await internshipAPI.create(payload);
        toast.success('Internship created');
      }

      setForm(blankForm);
      await refreshInternships();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to save internship');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await internshipAPI.delete(id);
      toast.success('Internship removed');
      await refreshInternships();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to remove internship');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading recruiter internships..." />;
  }

  return (
    <AppShell
      title="Recruiter Internships"
      description="Create and manage skill-tagged internship openings with clear eligibility and deadline rules."
      navigation={navigationByRole.recruiter}
      user={user}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <form className="rounded-3xl bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold">{form.id ? 'Edit Internship' : 'Create Internship'}</h2>
          <div className="mt-6 space-y-4">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}>
              <option value="">Select company</option>
              {ownCompanies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            <textarea className="min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            <textarea className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Requirements, one per line'} value={form.requirements} onChange={(event) => setForm((current) => ({ ...current, requirements: event.target.value }))} />
            <textarea className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Skill tags, one per line'} value={form.skillTags} onChange={(event) => setForm((current) => ({ ...current, skillTags: event.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <textarea className="min-h-[100px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Eligible departments, one per line'} value={form.eligibleDepartments} onChange={(event) => setForm((current) => ({ ...current, eligibleDepartments: event.target.value }))} />
              <textarea className="min-h-[100px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Eligible batches, one per line'} value={form.eligibleBatches} onChange={(event) => setForm((current) => ({ ...current, eligibleBatches: event.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Stipend" value={form.stipend} onChange={(event) => setForm((current) => ({ ...current, stipend: event.target.value }))} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Duration" value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" type="date" value={form.applyBy} onChange={(event) => setForm((current) => ({ ...current, applyBy: event.target.value }))} />
            </div>
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-70" disabled={saving} type="submit">
              {saving ? 'Saving...' : form.id ? 'Update Internship' : 'Create Internship'}
            </button>
            <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold" onClick={() => setForm(blankForm)} type="button">
              Reset
            </button>
          </div>
        </form>

        <section className="space-y-4">
          {internships.length ? (
            internships.map((internship) => (
              <div key={internship._id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold">{internship.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{internship.company?.name || 'Company'}</p>
                  </div>
                  <StatusBadge status={internship.status} />
                </div>
                <p className="mt-4 text-sm text-slate-600">{internship.location} • {internship.duration || 'Duration not set'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(internship.skillTags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => handleEdit(internship)} type="button">
                    Edit
                  </button>
                  <button className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600" onClick={() => handleDelete(internship._id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No internships yet" description="Create your first internship after setting up your company profile." />
          )}
        </section>
      </div>
    </AppShell>
  );
}

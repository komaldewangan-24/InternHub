import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { companyAPI } from '../services/api';

const blankForm = {
  id: '',
  name: '',
  description: '',
  website: '',
  email: '',
  phone: '',
  logoUrl: '',
};

export default function RecruiterCompanyPage() {
  const { user, loading } = useCurrentUser();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const recruiterId = user?._id || user?.id;
  const ownCompany = useMemo(
    () => companies.find((company) => company.user === recruiterId || company.user?._id === recruiterId) || null,
    [companies, recruiterId]
  );

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setPageLoading(true);
        const { data } = await companyAPI.getAll();
        setCompanies(data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (ownCompany) {
      setForm({
        id: ownCompany._id,
        name: ownCompany.name || '',
        description: ownCompany.description || '',
        website: ownCompany.website || '',
        email: ownCompany.email || '',
        phone: ownCompany.phone || '',
        logoUrl: ownCompany.logoUrl || '',
      });
    } else {
      setForm(blankForm);
    }
  }, [ownCompany]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        description: form.description,
        website: form.website,
        email: form.email,
        phone: form.phone,
        logoUrl: form.logoUrl,
      };

      if (form.id) {
        await companyAPI.update(form.id, payload);
        toast.success('Company updated');
      } else {
        await companyAPI.create(payload);
        toast.success('Company created');
      }

      const { data } = await companyAPI.getAll();
      setCompanies(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to save company');
    } finally {
      setSaving(false);
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading company profile..." />;
  }

  return (
    <AppShell
      title="Recruiter Company"
      description="Set up the verified company identity used for internships and applicant communication."
      navigation={navigationByRole.recruiter}
      user={user}
    >
      {ownCompany ? (
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Verification</p>
              <p className="mt-2 text-lg font-bold">{ownCompany.verificationStatus || 'pending'}</p>
            </div>
            <StatusBadge status={ownCompany.verificationStatus || 'pending'} />
          </div>
        </div>
      ) : null}

      <form className="max-w-4xl rounded-3xl bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Company name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Website" value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Contact email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <input className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Logo URL" value={form.logoUrl} onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))} />
          <textarea className="md:col-span-2 min-h-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Company description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </div>
        <button className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-70" disabled={saving} type="submit">
          {saving ? 'Saving...' : form.id ? 'Update Company' : 'Create Company'}
        </button>
      </form>
    </AppShell>
  );
}

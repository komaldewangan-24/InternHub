import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { companyAPI, uploadFile } from '../services/api';
import { getAssetUrl } from '../utils/assets';

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
  const ownCompany = companies[0] || null;

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

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setSaving(true);
        const { data } = await uploadFile('company-logos', file);
        setForm(current => ({ ...current, logoUrl: data.url }));
        toast.success('Logo uploaded and staged. Click Update to save changes.');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Logo upload failed');
      } finally {
        setSaving(false);
      }
    }
  };

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
        toast.success('Company identity synchronized');
      } else {
        await companyAPI.create(payload);
        toast.success('Company identity established');
      }

      const { data } = await companyAPI.getAll();
      setCompanies(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Identity sync failed');
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
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Verification</p>
              <p className="mt-2 text-lg font-bold">{ownCompany.verificationStatus || 'pending'}</p>
            </div>
            <StatusBadge status={ownCompany.verificationStatus || 'pending'} />
          </div>
        </div>
      ) : null}

      <form className="max-w-4xl rounded-sm bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Company name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input className="rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Website" value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
          <input className="rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Contact email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <input className="rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 p-6 rounded-sm border border-slate-100 bg-slate-50/30">
            <div className="size-32 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
               {form.logoUrl ? (
                 <img src={getAssetUrl(form.logoUrl)} alt="Company Logo" className="size-full object-contain" />
               ) : (
                 <span className="material-symbols-outlined text-4xl text-slate-200">corporate_fare</span>
               )}
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Logo</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG or SVG. Max 2MB recommended.</p>
               </div>
               <div className="flex gap-3">
                  <label className="cursor-pointer rounded-sm bg-indigo-600 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 shadow-sm active:scale-95">
                    Upload Logo
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                  {form.logoUrl && (
                    <button type="button" onClick={() => setForm(c => ({ ...c, logoUrl: '' }))} className="rounded-sm border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50">
                      Remove
                    </button>
                  )}
               </div>
            </div>
          </div>
          <textarea className="md:col-span-2 min-h-[180px] rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Company description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </div>
        <button className="mt-6 rounded-sm bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-70" disabled={saving} type="submit">
          {saving ? 'Saving...' : form.id ? 'Update Company' : 'Create Company'}
        </button>
      </form>
    </AppShell>
  );
}

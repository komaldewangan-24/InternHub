import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { companyAPI } from '../services/api';

export default function AdminCompaniesPage() {
  const { user, loading } = useCurrentUser();
  const [companies, setCompanies] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const loadCompanies = async () => {
    const { data } = await companyAPI.getAll();
    setCompanies(data.data || []);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setPageLoading(true);
        await loadCompanies();
      } finally {
        setPageLoading(false);
      }
    };

    run();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this company?')) return;
    try {
      await companyAPI.delete(id);
      toast.success('Company removed');
      await loadCompanies();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to remove company');
    }
  };

  const handleVerificationUpdate = async (company, verificationStatus) => {
    try {
      await companyAPI.update(company._id, { verificationStatus });
      toast.success(`Company marked as ${verificationStatus}`);
      await loadCompanies();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update verification status');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Mapping institutional partners..." />;
  }

  return (
    <AppShell
      title="Company Registry"
      description="Systematic oversight of recruiter organizations and institutional industry partners."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="space-y-6">
        {companies.length ? (
          companies.map((company) => (
            <div key={company._id} className="group rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:border-primary/20">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-primary shadow-sm group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight dark:text-white leading-tight">{company.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        <span className="material-symbols-outlined text-[14px]">alternate_email</span>
                        {company.email || 'No contact email provided'}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium max-w-2xl italic">{company.description}</p>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {company.industry && (
                      <span className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {company.industry}
                      </span>
                    )}
                    {company.location && (
                      <span className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {company.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-6 lg:items-end">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Integrity Status</p>
                    <StatusBadge status={company.verificationStatus || 'pending'} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {['verified', 'pending', 'flagged'].map((status) => (
                      <button 
                        key={status} 
                        className={`rounded-[1rem] border px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                          company.verificationStatus === status 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`} 
                        onClick={() => handleVerificationUpdate(company, status)} 
                        type="button"
                      >
                        {status}
                      </button>
                    ))}
                    <button 
                      className="ml-2 flex size-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-thin border-rose-100 dark:border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95" 
                      onClick={() => handleDelete(company._id)} 
                      type="button"
                      title="Remove partner"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="business_center" title="No registered partners" description="Company profiles will appear here after recruiters complete their institutional onboarding." />
        )}
      </div>
    </AppShell>
  );
}

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
    return <LoadingState label="Loading companies..." />;
  }

  return (
    <AppShell
      title="Placement Companies"
      description="Monitor, verify, and manage recruiter organizations participating in the placement process."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="space-y-4">
        {companies.length ? (
          companies.map((company) => (
            <div key={company._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-bold">{company.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{company.email || 'No contact email'}</p>
                  <p className="mt-1 text-sm text-slate-600">{company.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={company.verificationStatus || 'pending'} />
                  {['verified', 'flagged', 'pending'].map((status) => (
                    <button key={status} className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]" onClick={() => handleVerificationUpdate(company, status)} type="button">
                      {status}
                    </button>
                  ))}
                  <button className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600" onClick={() => handleDelete(company._id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No companies yet" description="Recruiter companies will appear here after they create their profiles." />
        )}
      </div>
    </AppShell>
  );
}

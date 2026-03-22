import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { internshipAPI } from '../services/api';

export default function AdminInternshipsPage() {
  const { user, loading } = useCurrentUser();
  const [internships, setInternships] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const loadInternships = async () => {
    const { data } = await internshipAPI.getAll();
    setInternships(data.data || []);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setPageLoading(true);
        await loadInternships();
      } finally {
        setPageLoading(false);
      }
    };

    run();
  }, []);

  const handleDelete = async (id) => {
    try {
      await internshipAPI.delete(id);
      toast.success('Internship removed');
      await loadInternships();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to remove internship');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading internships..." />;
  }

  return (
    <AppShell
      title="Placement Internships"
      description="See every internship in the system and manage placement-wide availability."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="space-y-4">
        {internships.length ? (
          internships.map((internship) => (
            <div key={internship._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-bold">{internship.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{internship.company?.name || 'Company'}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {internship.location} • Apply by{' '}
                    {internship.applyBy ? new Date(internship.applyBy).toLocaleDateString() : 'Open'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(internship.skillTags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={internship.status} />
                  <button className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600" onClick={() => handleDelete(internship._id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No internships yet" description="Internships will appear here when recruiters start creating openings." />
        )}
      </div>
    </AppShell>
  );
}

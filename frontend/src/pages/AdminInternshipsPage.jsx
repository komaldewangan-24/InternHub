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
    if (!window.confirm('Delete this internship? This cannot be undone.')) return;
    try {
      await internshipAPI.delete(id);
      toast.success('Internship removed');
      await loadInternships();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to remove internship');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Indexing internship databases..." />;
  }

  return (
    <AppShell
      title="Internship Oversight"
      description="Monitor and manage all corporate openings to ensure platform quality and student safety."
      navigation={navigationByRole.admin}
      user={user}
    >
      <div className="space-y-6">
        {internships.length ? (
          internships.map((internship) => (
            <div key={internship._id} className="group rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all hover:border-primary/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black tracking-tight dark:text-white leading-tight">{internship.title}</h3>
                    <StatusBadge status={internship.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                    <span className="text-primary italic italic">{internship.company?.name || 'Authorized Partner'}</span>
                    <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="flex items-center gap-1.5 leading-none">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {internship.location}
                    </span>
                    <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="flex items-center gap-1.5 leading-none">
                      <span className="material-symbols-outlined text-[14px]">event_available</span>
                      Ends {internship.applyBy ? new Date(internship.applyBy).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Open'}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(internship.skillTags || []).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-50 dark:border-white/5 pt-6 lg:border-t-0 lg:pt-0">
                  <button 
                    className="flex-1 rounded-sm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-all hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-200" 
                    onClick={() => handleDelete(internship._id)} 
                    type="button"
                  >
                    Rescind Posting
                  </button>
                  <button 
                    className="flex-1 rounded-sm bg-primary px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95" 
                    onClick={() => window.open(`/internships/${internship._id}`, '_blank')} 
                    type="button"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="work_off" title="No active postings" description="Corporate openings will appear here once recruiters start the fulfillment cycle." />
        )}
      </div>
    </AppShell>
  );
}

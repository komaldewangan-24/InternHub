import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { internshipAPI } from '../services/api';
import { computeInternshipFit } from '../utils/readiness';

export default function InternshipListPage() {
  const { user, loading } = useCurrentUser();
  const [internships, setInternships] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setPageLoading(true);
        const { data } = await internshipAPI.getAll();
        setInternships(data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadInternships();
  }, []);

  const filteredInternships = useMemo(
    () =>
      internships
        .filter(
          (internship) =>
            internship.title.toLowerCase().includes(search.toLowerCase()) ||
            internship.company?.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((internship) => ({
          ...internship,
          fit: computeInternshipFit({
            internship,
            user,
            approvedProjectTags: user?.profile?.skills || [],
          }),
        }))
        .sort((left, right) => right.fit.score - left.fit.score),
    [internships, search, user]
  );

  if (loading || pageLoading) {
    return <LoadingState label="Loading internships..." />;
  }

  return (
    <AppShell
      title="Internships"
      description="Scan and identify high-fit internship nodes matching your proficiency."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="mb-10 flex justify-center px-4 relative uppercase">
        <div className="relative w-full max-w-xl group">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 group-focus-within:text-indigo-500 transition-colors">search</span>
            <input 
              className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 py-3 pl-12 pr-10 text-[12px] font-poppins font-bold tracking-tight placeholder:italic placeholder:font-bold placeholder:opacity-30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all dark:text-white shadow-inner" 
              placeholder="Search by title, company, or skills..." 
              type="text" 
              value={search} 
              onChange={(event) => setSearch(event.target.value)} 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 opacity-0 group-focus-within:opacity-100 transition-opacity">
               <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10 shadow-sm">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">CMD</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">K</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 lg:px-4 uppercase">
        {filteredInternships.length ? (
          filteredInternships.map((internship) => {
            return (
              <div
                key={internship._id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div className="space-y-2">
                    <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500">INSTITUTIONAL NODE</p>
                    <h2 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white leading-tight uppercase group-hover:text-indigo-500 transition-colors">{internship.title}</h2>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[8px] font-poppins font-bold uppercase text-indigo-500 mb-2">{internship.fit.score}% Match</p>
                    {internship.status === 'open' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <p className="text-[8px] font-poppins font-bold uppercase text-emerald-600">ACTIVE</p>
                      </div>
                    ) : (
                      <StatusBadge status={internship.status} />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 group/company border-b border-slate-100 dark:border-white/5 pb-6">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 text-indigo-500/40 group-hover/company:text-indigo-500 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                  </div>
                  <div>
                    <p className="text-[8px] font-poppins font-bold uppercase tracking-widest text-slate-400">Organization</p>
                    <p className="text-xs font-poppins font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">{internship.company?.name || 'Company Name'}</p>
                  </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-2 px-1">
                  {(internship.skillTags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 text-[8px] font-poppins font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-roboto mb-8 border-l-2 border-slate-100 dark:border-white/5 pl-5 opacity-80 lowercase">
                  {internship.description}
                </p>

                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-500/40 text-[20px]">location_on</span>
                    <p className="text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400 truncate max-w-[140px]">
                      {internship.location || 'Remote / On-site'}
                    </p>
                  </div>
                  <Link
                    to={`/internships/${internship._id}`}
                    className="rounded-lg text-white px-8 py-3 text-[11px] font-poppins font-bold uppercase tracking-[0.2em] shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                  >
                    Inspect Node
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 lg:col-span-3 py-10">
            <EmptyState title="We couldn’t find internships yet" description="Increase your search parameters to find more matching nodes." />
          </div>
        )}
      </div>
    </AppShell>
  );
}

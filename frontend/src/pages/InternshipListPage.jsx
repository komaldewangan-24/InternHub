import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { internshipAPI, projectAPI } from '../services/api';
import { computeInternshipFit } from '../utils/readiness';

export default function InternshipListPage() {
  const { user, loading } = useCurrentUser();
  const [internships, setInternships] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setPageLoading(true);
        const [internshipResponse, projectResponse] = await Promise.all([
          internshipAPI.getAll(),
          projectAPI.getAll(),
        ]);
        setInternships(internshipResponse.data.data || []);
        setProjects(projectResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadInternships();
  }, []);

  const approvedProjectTags = useMemo(
    () =>
      projects
        .filter((project) => project.status === 'approved')
        .flatMap((project) => project.tags || []),
    [projects]
  );

  const filteredInternships = useMemo(() => {
    const term = search.trim().toLowerCase();
    const items = internships.map((internship) => ({
      ...internship,
      fit: computeInternshipFit({ internship, user, approvedProjectTags }),
    }));

    const searched = term
      ? items.filter((internship) =>
          [
            internship.title,
            internship.company?.name,
            internship.location,
            ...(internship.requirements || []),
            ...(internship.skillTags || []),
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(term))
        )
      : items;

    return searched.sort((left, right) => right.fit.score - left.fit.score);
  }, [approvedProjectTags, internships, search, user]);

  if (loading || pageLoading) {
    return <LoadingState label="Loading internships..." />;
  }

  return (
    <AppShell
      title="Internships"
      description="Discover recruiter-posted internships ranked by your current skills, approved projects, and eligibility."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="mb-8 rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-white/5 transition-all">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full rounded-[1.5rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 px-14 py-4 text-sm outline-none focus:border-primary/50 transition-all dark:text-white" 
            placeholder="Search by title, company, location, or skill" 
            value={search} 
            onChange={(event) => setSearch(event.target.value)} 
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {filteredInternships.length ? (
          filteredInternships.map((internship) => (
            <div key={internship._id} className="group relative flex flex-col rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-black tracking-tight dark:text-white line-clamp-1">{internship.title}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">{internship.company?.name || 'Company'}</p>
                </div>
                <StatusBadge status={internship.status} />
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span className="font-medium">{internship.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{internship.stipend || 'Unpaid'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  <span className="font-medium">
                    Apply by {internship.applyBy ? new Date(internship.applyBy).toLocaleDateString() : 'Rolling'}
                  </span>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(internship.skillTags?.length ? internship.skillTags : internship.requirements || []).slice(0, 3).map((requirement) => (
                    <span key={requirement} className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {requirement}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {internship.fit.matchedSkills.slice(0, 2).map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                      Fit: {skill}
                    </span>
                  ))}
                  {!internship.fit.eligible ? (
                    <span className="rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400">
                      Eligibility Alert
                    </span>
                  ) : null}
                </div>

                <Link 
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-4 text-sm font-black text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 group-hover:scale-[1.02] active:scale-[0.98]" 
                  to={`/internships/${internship._id}`}
                >
                  Explore Opportunity
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="xl:col-span-3">
            <EmptyState icon="find_in_page" title="No matching internships" description="Expand your search terms or wait for our campus partners to publish new listings." />
          </div>
        )}
      </div>
    </AppShell>
  );
}

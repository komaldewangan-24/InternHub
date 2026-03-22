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
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Search by title, company, location, or skill" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {filteredInternships.length ? (
          filteredInternships.map((internship) => (
            <div key={internship._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold">{internship.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{internship.company?.name || 'Company'}</p>
                </div>
                <StatusBadge status={internship.status} />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                {internship.location} • {internship.stipend || 'Unpaid'} • Apply by{' '}
                {internship.applyBy ? new Date(internship.applyBy).toLocaleDateString() : 'Open'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(internship.skillTags?.length ? internship.skillTags : internship.requirements || []).slice(0, 4).map((requirement) => (
                  <span key={requirement} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                    {requirement}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {internship.fit.matchedSkills.slice(0, 2).map((skill) => (
                  <span key={skill} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Match: {skill}
                  </span>
                ))}
                {!internship.fit.eligible ? (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    Eligibility check needed
                  </span>
                ) : null}
              </div>
              <Link className="mt-6 inline-flex rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white" to={`/internships/${internship._id}`}>
                View Internship
              </Link>
            </div>
          ))
        ) : (
          <div className="xl:col-span-3">
            <EmptyState title="No internships found" description="Try a broader search or check back after recruiters publish new openings." />
          </div>
        )}
      </div>
    </AppShell>
  );
}

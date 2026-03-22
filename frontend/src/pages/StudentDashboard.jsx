import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, internshipAPI, projectAPI } from '../services/api';
import { computeInternshipFit, computeStudentReadiness } from '../utils/readiness';

export default function StudentDashboard() {
  const { user, loading } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [projectResponse, applicationResponse, internshipResponse] = await Promise.all([
          projectAPI.getAll(),
          applicationAPI.getAll(),
          internshipAPI.getAll(),
        ]);
        setProjects(projectResponse.data.data || []);
        setApplications(applicationResponse.data.data || []);
        setInternships(internshipResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  const approvedProjectTags = useMemo(
    () =>
      projects
        .filter((project) => project.status === 'approved')
        .flatMap((project) => project.tags || []),
    [projects]
  );

  const readiness = useMemo(
    () =>
      computeStudentReadiness({
        user,
        approvedProjects: projects.filter((project) => project.status === 'approved').length,
        applications: applications.length,
      }),
    [applications.length, projects, user]
  );

  const recommendedInternships = useMemo(
    () =>
      internships
        .map((internship) => ({
          internship,
          fit: computeInternshipFit({ internship, user, approvedProjectTags }),
        }))
        .sort((left, right) => right.fit.score - left.fit.score)
        .slice(0, 4),
    [approvedProjectTags, internships, user]
  );

  if (loading || pageLoading) {
    return <LoadingState label="Preparing your dashboard..." />;
  }

  const submittedProjects = projects.filter((project) => project.status === 'submitted').length;
  const approvedProjects = projects.filter((project) => project.status === 'approved').length;
  const pendingApplications = applications.filter((application) =>
    ['pending', 'shortlisted', 'interview'].includes(application.status)
  ).length;
  const overdueReviews = projects.filter(
    (project) => project.status === 'submitted' && project.reviewDueAt && new Date(project.reviewDueAt) < new Date()
  ).length;

  return (
    <AppShell
      title="Student Dashboard"
      description="Track your placement readiness, project approvals, internship fit, and application momentum in one place."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Readiness Score', `${readiness.score}%`],
              ['Projects Under Review', submittedProjects],
              ['Approved Projects', approvedProjects],
              ['Active Applications', pendingApplications],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Placement Readiness</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Faculty assignment: {user?.profile?.assignedFaculty?.name || 'Pending placement-cell assignment'}
                </p>
              </div>
              <StatusBadge status={readiness.isPlacementReady ? 'approved' : 'pending'} />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Profile completion</p>
                <p className="mt-2 text-2xl font-black">{readiness.profileCompletion}%</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Resume ready</p>
                <p className="mt-2 text-2xl font-black">{readiness.resumeReady ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Overdue faculty reviews</p>
                <p className="mt-2 text-2xl font-black">{overdueReviews}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {readiness.flags.length ? (
                readiness.flags.map((flag) => (
                  <span key={flag} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {flag}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Ready for recruiter visibility
                </span>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Project Review Timeline</h2>
              <p className="text-sm text-slate-500">{projects.length} total submissions</p>
            </div>
            <div className="mt-6 space-y-4">
              {projects.length ? (
                projects.slice(0, 4).map((project) => (
                  <div key={project._id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{project.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Reviewer: {project.faculty?.name || 'Faculty not assigned'}
                        </p>
                        {project.reviewDueAt ? (
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                            Review due {new Date(project.reviewDueAt).toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    {project.comments?.length ? (
                      <p className="mt-3 text-sm text-slate-600">
                        Latest feedback: {project.comments[project.comments.length - 1].message}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-slate-600">No faculty feedback yet.</p>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No projects yet"
                  description="Create your first project submission to start the faculty review workflow."
                />
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Recommended Internships</h2>
            <div className="mt-6 space-y-4">
              {recommendedInternships.length ? (
                recommendedInternships.map(({ internship, fit }) => (
                  <div key={internship._id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{internship.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{internship.company?.name || 'Company'}</p>
                      </div>
                      <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{fit.score} fit</p>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {internship.location} • {internship.stipend || 'Unpaid'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {fit.matchedSkills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {skill}
                        </span>
                      ))}
                      {!fit.eligible ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          Check eligibility
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No internships available"
                  description="Open internships will appear here as soon as recruiters post them."
                />
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Application Snapshot</h2>
            <div className="mt-6 space-y-3">
              {applications.length ? (
                applications.slice(0, 4).map((application) => (
                  <div key={application._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold">{application.internship?.title || 'Internship'}</p>
                      <p className="text-sm text-slate-500">
                        {application.internship?.company?.name || 'Company'}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No applications yet"
                  description="Apply to internships after your profile and projects are ready."
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

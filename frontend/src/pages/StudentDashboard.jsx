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
              ['Readiness Score', `${readiness.score}%`, 'trending_up'],
              ['Under Review', submittedProjects, 'pending_actions'],
              ['Approved', approvedProjects, 'verified'],
              ['Active Applications', pendingApplications, 'send'],
            ].map(([label, value, icon]) => (
              <div key={label} className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
                  <span className="material-symbols-outlined text-[20px] text-primary/50">{icon}</span>
                </div>
                <p className="text-3xl font-black tracking-tight dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight dark:text-white">Placement Readiness</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Faculty assignment: <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.profile?.assignedFaculty?.name || 'Pending assignment'}</span>
                </p>
              </div>
              <StatusBadge status={readiness.isPlacementReady ? 'approved' : 'pending'} />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Profile completion</p>
                <p className="mt-2 text-3xl font-black dark:text-white">{readiness.profileCompletion}%</p>
              </div>
              <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Resume uploaded</p>
                <p className="mt-2 text-3xl font-black dark:text-white">{readiness.resumeReady ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Overdue reviews</p>
                <p className={`mt-2 text-3xl font-black ${overdueReviews > 0 ? 'text-rose-500' : 'dark:text-white'}`}>{overdueReviews}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {readiness.flags.length ? (
                readiness.flags.map((flag) => (
                  <span key={flag} className="rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 px-4 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 shadow-sm">
                    {flag}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-sm">
                  Ready for recruiter visibility
                </span>
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight dark:text-white">Project Briefs</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{projects.length} Total</p>
            </div>
            <div className="space-y-4">
              {projects.length ? (
                projects.slice(0, 3).map((project) => (
                  <div key={project._id} className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 p-6 transition-all hover:bg-slate-50 dark:hover:bg-white/10 group">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold dark:text-white group-hover:text-primary transition-colors">{project.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Reviewer: {project.faculty?.name || 'Unassigned'}
                        </p>
                        {project.reviewDueAt ? (
                          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            Due {new Date(project.reviewDueAt).toLocaleDateString()}
                          </div>
                        ) : null}
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      {project.comments?.length ? (
                        <div className="flex gap-3">
                          <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-[18px]">chat_bubble</span>
                          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                            "{project.comments[project.comments.length - 1].message}"
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-600">Pending initial faculty screening.</p>
                      )}
                    </div>
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
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-2xl font-black tracking-tight dark:text-white mb-8">Recommendations</h2>
            <div className="space-y-4">
              {recommendedInternships.length ? (
                recommendedInternships.map(({ internship, fit }) => (
                  <div key={internship._id} className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 p-6 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold dark:text-white">{internship.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{internship.company?.name || 'Company'}</p>
                      </div>
                      <div className="px-3 py-1 bg-primary/10 rounded-full">
                        <p className="text-[10px] font-black uppercase text-primary">{fit.score}% Match</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {fit.matchedSkills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="Discovering opportunities"
                  description="Great fits will appear here as soon as recruiters post relevant roles."
                />
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-2xl font-black tracking-tight dark:text-white mb-8">Snapshot</h2>
            <div className="space-y-4">
              {applications.length ? (
                applications.slice(0, 4).map((application) => (
                  <div key={application._id} className="flex items-center justify-between rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 p-6 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                    <div>
                      <p className="font-bold dark:text-white">{application.internship?.title || 'Internship'}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
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

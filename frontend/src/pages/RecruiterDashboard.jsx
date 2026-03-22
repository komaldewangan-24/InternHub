import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, companyAPI, internshipAPI, projectAPI } from '../services/api';

export default function RecruiterDashboard() {
  const { user, loading } = useCurrentUser();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [internshipResponse, applicationResponse, projectResponse, companyResponse] = await Promise.all([
          internshipAPI.getAll(),
          applicationAPI.getAll(),
          projectAPI.getAll(),
          companyAPI.getAll(),
        ]);
        const recruiterId = user?._id || user?.id;
        setInternships((internshipResponse.data.data || []).filter((item) => item.user === recruiterId || item.user?._id === recruiterId));
        setApplications(applicationResponse.data.data || []);
        setApprovedProjects(projectResponse.data.data || []);
        setCompanies((companyResponse.data.data || []).filter((item) => item.user === recruiterId || item.user?._id === recruiterId));
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const applicantCount = useMemo(() => applications.length, [applications]);
  const verifiedCompanies = useMemo(
    () => companies.filter((company) => company.verificationStatus === 'verified').length,
    [companies]
  );

  if (loading || pageLoading) {
    return <LoadingState label="Loading recruiter dashboard..." />;
  }

  return (
    <AppShell
      title="Recruiter Dashboard"
      description="Post internships, review applicants, and browse faculty-approved student work with confidence."
      navigation={navigationByRole.recruiter}
      user={user}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Open Internships', internships.filter((internship) => internship.status === 'open').length],
          ['Applicants', applicantCount],
          ['Approved Student Projects', approvedProjects.length],
          ['Verified Companies', verifiedCompanies],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr,1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Recent Applicants</h2>
          <div className="mt-6 space-y-3">
            {applications.length ? (
              applications.slice(0, 5).map((application) => (
                <div key={application._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold">{application.user?.name || 'Student'}</p>
                    <p className="text-sm text-slate-500">{application.internship?.title || 'Internship'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {application.user?.profile?.department || 'Department not set'}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              ))
            ) : (
              <EmptyState title="No applicants yet" description="Applicants will appear here once students begin applying to your internships." />
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Approved Student Portfolio Feed</h2>
          <div className="mt-6 space-y-3">
            {approvedProjects.length ? (
              approvedProjects.slice(0, 5).map((project) => (
                <div key={project._id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold">{project.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {project.student?.name} • Reviewed by {project.faculty?.name}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No approved projects yet" description="Approved student submissions will surface here after faculty sign-off." />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

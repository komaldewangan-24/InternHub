import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, userAPI } from '../services/api';

export default function RecruiterApplicantsPage() {
  const { user, loading } = useCurrentUser();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setPageLoading(true);
        const { data } = await applicationAPI.getAll();
        setApplications(data.data || []);
        if ((data.data || []).length) {
          setSelectedApplication(data.data[0]);
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadApplications();
  }, []);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!selectedApplication?.user?._id) {
        setPortfolio(null);
        return;
      }
      const { data } = await userAPI.getPortfolio(selectedApplication.user._id);
      setPortfolio(data.data || null);
    };

    loadPortfolio();
  }, [selectedApplication]);

  const updateStatus = async (status) => {
    if (!selectedApplication) return;
    try {
      await applicationAPI.updateStatus(selectedApplication._id, status);
      const { data } = await applicationAPI.getAll();
      setApplications(data.data || []);
      setSelectedApplication((data.data || []).find((item) => item._id === selectedApplication._id) || null);
      toast.success(`Application marked as ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update application');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading applicants..." />;
  }

  return (
    <AppShell
      title="Recruiter Applicants"
      description="Review applicants for your internships and inspect approved student portfolios before moving them forward."
      navigation={navigationByRole.recruiter}
      user={user}
    >
      <div className="grid gap-6 xl:grid-cols-[0.42fr,0.58fr]">
        <section className="space-y-4">
          {applications.length ? (
            applications.map((application) => (
              <button key={application._id} className={`w-full rounded-3xl border p-5 text-left ${selectedApplication?._id === application._id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`} onClick={() => setSelectedApplication(application)} type="button">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{application.user?.name || 'Student'}</p>
                    <p className="mt-1 text-sm text-slate-500">{application.internship?.title || 'Internship'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {application.user?.profile?.department || 'Department not set'}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              </button>
            ))
          ) : (
            <EmptyState title="No applicants yet" description="Applicants will appear here after students start applying." />
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          {selectedApplication ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{selectedApplication.user?.name || 'Applicant'}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedApplication.internship?.title} • {selectedApplication.internship?.company?.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {portfolio?.student?.profile?.resumeUrl ? 'Resume ready' : 'Resume missing'} • Readiness {portfolio?.readiness?.score || 0}%
                  </p>
                </div>
                <StatusBadge status={selectedApplication.status} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {['shortlisted', 'interview', 'selected', 'rejected'].map((status) => (
                  <button key={status} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => updateStatus(status)} type="button">
                    Mark {status}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold">Approved Portfolio</h3>
                {portfolio ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold">Skills</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(portfolio.student?.profile?.skills || []).map((skill) => (
                          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {(portfolio.approvedProjects || []).length ? (
                      portfolio.approvedProjects.map((project) => (
                        <div key={project._id} className="rounded-2xl border border-slate-200 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold">{project.title}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                Faculty approved by {project.faculty?.name}
                              </p>
                            </div>
                            <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                              Score {project.rubricScore || 0}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{project.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(project.tags || []).map((tag) => (
                              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState title="No approved projects visible" description="Only faculty-approved projects are visible to recruiters." />
                    )}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <EmptyState title="Select an applicant" description="Pick an application from the left to review the candidate." />
          )}
        </section>
      </div>
    </AppShell>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
    return <LoadingState label="Mapping recruiter workspace..." />;
  }

  const statCards = [
    { label: 'Active Openings', value: internships.filter((i) => i.status === 'open').length, icon: 'campaign', color: 'text-primary' },
    { label: 'Total Applicants', value: applicantCount, icon: 'person_search', color: 'text-blue-500' },
    { label: 'Verified Portfolio', value: approvedProjects.length, icon: 'verified', color: 'text-emerald-500' },
    { label: 'Company Profile', value: verifiedCompanies > 0 ? 'Verified' : 'Pending', icon: 'domain_verification', color: 'text-indigo-500' },
  ];

  return (
    <AppShell
      title="Talent Acquisitions"
      description="Identify and engage with top-tier student talent through a verified, faculty-backed pipeline."
      navigation={navigationByRole.recruiter}
      user={user}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all hover:border-primary/20">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 ${card.color}`}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">group</span>
              Active Candidates
            </h2>
            <Link to="/recruiter/applicants" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {applications.length ? (
              applications.slice(0, 5).map((application) => (
                <div key={application._id} className="group rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 font-bold shadow-sm group-hover:text-primary transition-colors uppercase">
                      {application.user?.name?.[0] || 'S'}
                    </div>
                    <div>
                      <p className="font-black text-slate-700 dark:text-white tracking-tight leading-none">{application.user?.name || 'Student Candidate'}</p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{application.internship?.title || 'Internship'}</p>
                    </div>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
              ))
            ) : (
              <EmptyState icon="pending" title="Awaiting candidates" description="New candidate profiles will appear here as they apply to your open roles." />
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500">verified</span>
              Verified Student Feed
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Updates</p>
          </div>
          <div className="space-y-4">
            {approvedProjects.length ? (
              approvedProjects.slice(0, 5).map((project) => (
                <div key={project._id} className="group rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-slate-700 dark:text-white tracking-tight">{project.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {project.student?.name} <span className="mx-1.5 opacity-30">•</span> Reviewed by {project.faculty?.name || 'Campus Faculty'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState icon="auto_graph" title="No verified projects" description="Faculty-approved student portfolios will appear here as they are cleared for recruitment." />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

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
    { label: 'Active Openings', value: internships.filter((i) => i.status === 'open').length, icon: 'campaign', color: 'text-indigo-500' },
    { label: 'Total Applicants', value: applicantCount, icon: 'person_search', color: 'text-indigo-500' },
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 uppercase">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-1">
            <div className={`mb-4 flex size-12 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 ${card.color}`}>
              <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#003366] dark:text-white uppercase">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2 uppercase text-[#003366]">
        <div className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tighter text-[#003366] dark:text-white flex items-center gap-3 uppercase">
              <span className="material-symbols-outlined text-indigo-500">group</span>
              Active Candidates
            </h2>
            <Link to="/recruiter/applicants" className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:opacity-70 transition-opacity">View All</Link>
          </div>
          <div className="space-y-4">
            {applications.length ? (
              applications.slice(0, 5).map((application) => (
                <div key={application._id} className="group rounded-sm border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-5 transition-all hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-between hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-sm bg-white dark:bg-slate-800 text-indigo-500 font-bold shadow-sm uppercase border border-slate-100 dark:border-white/10 transition-transform group-hover:rotate-6">
                      {application.user?.name?.[0] || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-[#003366] dark:text-white tracking-tighter leading-none uppercase">{application.user?.name || 'Student Candidate'}</p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate max-w-[120px]">{application.internship?.title || 'Internship'}</p>
                    </div>
                  </div>
                  {application.status === 'accepted' ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                      <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <p className="text-[8px] font-bold uppercase text-emerald-600">ACCEPTED</p>
                    </div>
                  ) : (
                    <StatusBadge status={application.status} />
                  )}
                </div>
              ))
            ) : (
              <EmptyState icon="pending" title="Awaiting candidates" description="New candidate profiles will appear here as they apply to your open roles." />
            )}
          </div>
        </div>

        <div className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tighter text-[#003366] dark:text-white flex items-center gap-3 uppercase">
              <span className="material-symbols-outlined text-emerald-500">verified</span>
              Verified Student Feed
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Updates</p>
          </div>
          <div className="space-y-4">
            {approvedProjects.length ? (
              approvedProjects.slice(0, 5).map((project) => (
                <div key={project._id} className="group rounded-sm border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-6 transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#003366] dark:text-white tracking-tighter uppercase">{project.title}</h3>
                      <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                        {project.student?.name} <span className="mx-2 opacity-30">•</span> Reviewed by {project.faculty?.name || 'Campus Faculty'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
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

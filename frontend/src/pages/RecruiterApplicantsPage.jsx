import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        setSelectedApplication((current) => current || (data.data || [])[0] || null);
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
      try {
        const { data } = await userAPI.getPortfolio(selectedApplication.user._id);
        setPortfolio(data.data || null);
      } catch {
        setPortfolio(null);
      }
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
      toast.error(error.response?.data?.error || 'Unable to update status');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Collating applicant profiles..." />;
  }

  return (
    <AppShell
      title="Applicant Pipeline"
      description="Systematic review of candidate candidacy through verified competence indicators."
      navigation={navigationByRole.recruiter}
      user={user}
    >
      <div className="grid h-[calc(100vh-280px)] gap-6 xl:grid-cols-[380px,1fr]">
        <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Candidate Queue</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 custom-scrollbar">
            {applications.length ? (
              applications.map((app) => (
                <button
                  key={app._id}
                  className={`group w-full rounded-xl p-5 text-left transition-all ${
                    selectedApplication?._id === app._id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-slate-950/20'
                  }`}
                  onClick={() => setSelectedApplication(app)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black tracking-tight line-clamp-1">{app.user?.name || 'Student Candidate'}</p>
                      <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${
                        selectedApplication?._id === app._id ? 'text-white/70' : 'text-slate-500'
                      }`}>{app.internship?.title || 'Applied Role'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                     <StatusBadge status={app.status} />
                     <span className={`text-[10px] font-bold ${selectedApplication?._id === app._id ? 'text-white/40' : 'text-slate-400'}`}>
                       {new Date(app.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                     </span>
                  </div>
                </button>
              ))
            ) : (
              <EmptyState icon="group_off" title="No applicants" description="Your open roles haven't received submissions yet." />
            )}
          </div>
        </section>

        <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm transition-all">
          {selectedApplication ? (
            <div className="flex flex-col h-full overflow-hidden">
               <div className="flex items-start justify-between p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div>
                  <h2 className="text-3xl font-black tracking-tight dark:text-white leading-tight">{selectedApplication.user?.name || 'Applicant'}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                    <span className="text-primary">{selectedApplication.user?.profile?.department || 'General Science'}</span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      Readiness: {portfolio?.readiness?.score || 0}%
                    </span>
                    <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>Applied for {selectedApplication.internship?.title}</span>
                  </div>
                </div>
                <StatusBadge status={selectedApplication.status} />
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                <div className="grid gap-4 md:grid-cols-4">
                  {['shortlisted', 'interview', 'selected', 'rejected'].map((status) => (
                    <button 
                      key={status} 
                      className="group flex flex-col items-center justify-center rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 transition-all hover:border-primary/50 hover:bg-primary/5" 
                      onClick={() => updateStatus(status)}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedApplication.status === status ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                        {status}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    Faculty-Verified Portfolio
                  </h4>
                  
                  {portfolio ? (
                    <div className="space-y-6">
                      <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/20 p-6">
                        <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Core Skillset</p>
                        <div className="flex flex-wrap gap-2">
                          {(portfolio.student?.profile?.skills || []).map((skill) => (
                            <span key={skill} className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Strategic Projects</p>
                        {(portfolio.approvedProjects || []).length ? (
                          portfolio.approvedProjects.map((project) => (
                            <div key={project._id} className="rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/20 p-6 transition-all hover:border-primary/20">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h5 className="font-black text-slate-700 dark:text-white tracking-tight">{project.title}</h5>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Verified by Prof. {project.faculty?.name || 'Department Head'}</p>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1 text-[10px] font-black text-emerald-700 dark:text-emerald-400">
                                  <span className="material-symbols-outlined text-xs">verified</span>
                                  SCORE {project.rubricScore || 0}
                                </div>
                              </div>
                              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 italic italic">{project.description}</p>
                            </div>
                          ))
                        ) : (
                          <EmptyState icon="history_edu" title="No approved projects" description="This student hasn't cleared faculty verification for any specific projects yet." />
                        )}
                      </div>

                      <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-8">
                         <div>
                            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Credentials & Excellence Summary</p>
                            <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/20 p-6">
                               <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium italic italic opacity-80 whitespace-pre-wrap">
                                  {portfolio.student?.profile?.achievementsSummary || "No achievement summary provided yet."}
                               </p>
                               {portfolio.student?.profile?.achievementsImageUrl && (
                                 <img src={portfolio.student?.profile?.achievementsImageUrl} alt="Featured" className="mt-6 rounded-xl w-full h-40 object-cover opacity-80" />
                               )}
                            </div>
                         </div>
                         <div className="grid gap-3">
                            {[...(portfolio.student?.profile?.certifications || []), ...(portfolio.student?.profile?.achievements || [])].slice(0, 4).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                 <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
                                 <p className="text-[11px] font-black dark:text-white uppercase tracking-tight">{item.title}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-12 text-center">
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic italic">Portfolio data is synchronizing...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex gap-4">
                <button 
                  className="flex-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-6 py-4 text-sm font-black text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:border-primary hover:text-primary active:scale-95" 
                  onClick={() => window.open(portfolio?.student?.profile?.resumeUrl, '_blank')}
                  disabled={!portfolio?.student?.profile?.resumeUrl}
                >
                  Download Dossier / Resume
                </button>
                <Link 
                  className="flex-1 rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-center" 
                  to={`/messages`}
                >
                  Initiate Direct Chat
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
               <div className="flex size-24 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-300 mb-8 shadow-sm">
                <span className="material-symbols-outlined text-[48px]">person_check</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight dark:text-white">Review Terminal</h3>
              <p className="mt-3 max-w-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Choose a candidate from the pipeline to perform a deep-dive review of their academic and professional portfolio.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

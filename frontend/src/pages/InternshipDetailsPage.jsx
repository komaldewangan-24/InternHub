import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, internshipAPI } from '../services/api';
import { computeInternshipFit } from '../utils/readiness';

export default function InternshipDetailsPage() {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const { user, loading } = useCurrentUser();
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [internshipResponse, applicationResponse] = await Promise.all([
          internshipAPI.getOne(internshipId),
          applicationAPI.getAll(),
        ]);
        setInternship(internshipResponse.data.data);
        setApplications(applicationResponse.data.data || []);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [internshipId]);

  const hasApplied = useMemo(
    () => applications.some((application) => application.internship?._id === internshipId),
    [applications, internshipId]
  );
  const fit = useMemo(
    () => computeInternshipFit({ internship, user, approvedProjectTags: user?.profile?.skills || [] }),
    [internship, user]
  );

  const handleApply = async () => {
    try {
      setApplying(true);
      await applicationAPI.apply(internshipId);
      toast.success('Application submitted');
      navigate('/applications');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading internship details..." />;
  }

  return (
    <AppShell
      title={internship?.title || 'Internship Details'}
      description="Review the mission and eligibility before submitting your candidacy."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <section className="space-y-8">
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5 transition-all">
            <div className="flex items-start justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight dark:text-white leading-tight">{internship?.title}</h1>
                <p className="mt-3 flex items-center gap-2 text-lg font-bold text-primary">
                  <span className="material-symbols-outlined">corporate_fare</span>
                  {internship?.company?.name || 'Company Profile'}
                </p>
              </div>
              <StatusBadge status={internship?.status} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Mission Description</h2>
              <p className="whitespace-pre-wrap text-base leading-8 text-slate-600 dark:text-slate-300 font-medium italic italic leading-relaxed">{internship?.description}</p>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5 transition-all">
            <h2 className="text-xl font-black tracking-tight dark:text-white mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">task_alt</span>
              Key Requirements
            </h2>
            <div className="flex flex-wrap gap-3">
              {(internship?.skillTags?.length ? internship.skillTags : internship?.requirements || []).map((requirement) => (
                <span key={requirement} className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-200 transition-all hover:border-primary/30">
                  {requirement}
                </span>
              ))}
            </div>
            {fit.missingSkills.length ? (
              <div className="mt-8 flex items-start gap-4 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-6 transition-all">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">lightbulb</span>
                <div className="text-sm">
                  <p className="font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1">Fit Insight</p>
                  <p className="text-amber-700 dark:text-amber-400 font-medium leading-relaxed">Consider highlighting experiences in: {fit.missingSkills.slice(0, 4).join(', ')} to stand out.</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex items-start gap-4 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 transition-all">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">check_circle</span>
                <div className="text-sm">
                  <p className="font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-1">Perfect Fit</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">Your professional profile and verified projects perfectly align with this role's requirements.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-8">
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5 transition-all">
            <h2 className="text-xl font-black tracking-tight dark:text-white mb-8">Role Snapshot</h2>
            <div className="space-y-6">
              {[
                { label: 'Location', value: internship?.location || 'TBD', icon: 'location_on' },
                { label: 'Compensation', value: internship?.stipend || 'Unpaid', icon: 'payments' },
                { label: 'Duration', value: internship?.duration || 'Not specified', icon: 'timelapse' },
                { label: 'Deadline', value: internship?.applyBy ? new Date(internship.applyBy).toLocaleDateString() : 'Rolling', icon: 'calendar_today' },
                { label: 'Eligibility', value: internship?.eligibleDepartments?.length ? internship.eligibleDepartments.join(', ') : 'Open to All', icon: 'diversity_3' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm group-hover:shadow-none">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="mt-10 w-full rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50 active:scale-[0.98] group" 
              disabled={hasApplied || applying || internship?.status === 'closed'} 
              onClick={handleApply} 
              type="button"
            >
              <div className="flex items-center justify-center gap-3">
                {applying ? null : <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">{hasApplied ? 'task_alt' : 'rocket_launch'}</span>}
                {hasApplied ? 'Already Applied' : applying ? 'Processing Request...' : 'Submit Application'}
              </div>
            </button>
            {hasApplied && (
              <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 italic">
                Wait for recruiter response in applications
              </p>
            )}
          </div>
          
          <div className="rounded-[2.5rem] bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/5 p-8 transition-all">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Transparency Notice
            </p>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
              By applying, your <span className="text-slate-700 dark:text-slate-200 font-bold underline decoration-primary/30">Readiness Score</span> and <span className="text-slate-700 dark:text-slate-200 font-bold underline decoration-primary/30">Verified Projects</span> will be shared with the recruiter to facilitate merit-based hiring.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

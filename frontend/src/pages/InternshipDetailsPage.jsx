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
    if (!user?.profile?.resumeUrl) {
      toast.warn('Please upload your resume in your profile before applying.');
      return navigate('/student/profile');
    }

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
    return <LoadingState label="Decompressing mission brief..." />;
  }

  return (
    <AppShell
      title={internship?.title || 'Mission Cluster'}
      description="Validate institutional alignment and analyze eligibility matrices before commitment."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start relative">
        <section className="flex-[1.25] space-y-8 min-w-0">
          <div className="rounded-xl bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-start justify-between gap-8 mb-10">
              <div>
                <h1 className="text-4xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white leading-none uppercase">{internship?.title}</h1>
                <p className="mt-4 flex items-center gap-3 text-lg font-poppins font-bold uppercase tracking-widest text-primary">
                  <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  {internship?.company?.name || 'Institutional Partner'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                 <StatusBadge status={internship?.status} />
                 <div className="px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-[10px] font-poppins font-bold text-primary uppercase tracking-widest">{fit.score}% Alignment</p>
                 </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-[10px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">MISSION_ABSTRACT</h2>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-600 dark:text-slate-300 font-roboto border-l-2 border-slate-100 dark:border-white/5 pl-6 py-1">{internship?.description}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-xl font-poppins font-bold tracking-tight text-[#003366] dark:text-white mb-8 flex items-center gap-4 uppercase">
              <span className="material-symbols-outlined text-primary text-[24px]">science</span>
              Institutional Requirements
            </h2>
            <div className="flex flex-wrap gap-3">
              {(internship?.skillTags?.length ? internship.skillTags : internship?.requirements || []).map((requirement) => (
                <span key={requirement} className="rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 text-[10px] font-poppins font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                  {requirement}
                </span>
              ))}
            </div>
            {fit.missingSkills.length ? (
              <div className="mt-10 flex items-start gap-4 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-6">
                <span className="material-symbols-outlined text-amber-500 text-[24px]">tips_and_updates</span>
                <div className="text-[11px]">
                  <p className="font-poppins font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5">REFINEMENT_INSIGHT</p>
                  <p className="text-slate-500 dark:text-slate-400 font-roboto leading-relaxed">Optimize your repository by highlighting: <span className="text-amber-600 dark:text-amber-300 font-bold">{fit.missingSkills.slice(0, 4).join(', ').toUpperCase()}</span> to maximize system alignment.</p>
                </div>
              </div>
            ) : (
              <div className="mt-10 flex items-start gap-4 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 p-6">
                <span className="material-symbols-outlined text-emerald-500 text-[24px]">verified_user</span>
                <div className="text-[11px]">
                  <p className="font-poppins font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">HIGH_INTEGRITY_MATCH</p>
                  <p className="text-slate-500 dark:text-slate-400 font-roboto leading-relaxed italic">System analysis confirms 1:1 parity between your technological nodes and role requirements.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="flex-[0.75] space-y-8 min-w-0">
          <div className="rounded-xl bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-lg font-poppins font-bold tracking-tighter text-[#003366] dark:text-white mb-10 uppercase leading-none">ROLE_MATRIX</h2>
            <div className="space-y-6">
              {[
                { label: 'Geographic Locale', value: internship?.location || 'Unspecified', icon: 'location_on' },
                { label: 'Credit Allocation', value: internship?.stipend || 'Unpaid Allocation', icon: 'payments' },
                { label: 'System Duration', value: internship?.duration || 'Institutional Scope', icon: 'timelapse' },
                { label: 'Registry Deadline', value: internship?.applyBy ? new Date(internship.applyBy).toLocaleDateString() : 'Rolling Admission', icon: 'history_toggle_off' },
                { label: 'Academic Pool', value: internship?.eligibleDepartments?.length ? internship.eligibleDepartments.join(', ') : 'Open Repository', icon: 'hub' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 group">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-300 group-hover:text-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">{item.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-0.5 leading-none">{item.label}</p>
                    <p className="text-xs font-poppins font-bold text-slate-900 dark:text-slate-100 truncate">{item.value.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="mt-10 w-full rounded-lg bg-[#003366] dark:bg-white px-6 py-4 text-[11px] font-poppins font-bold uppercase tracking-[0.3em] text-white dark:text-[#003366] shadow-lg transition-all hover:bg-primary hover:text-white active:scale-[0.98] group disabled:opacity-50" 
              disabled={hasApplied || applying || internship?.status === 'closed'} 
              onClick={handleApply} 
              type="button"
            >
              <div className="flex items-center justify-center gap-3">
                {applying ? null : (
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    {hasApplied ? 'verified_user' : !user?.profile?.resumeUrl ? 'error_outline' : 'rocket_launch'}
                  </span>
                )}
                {hasApplied ? 'NODE_SECURED' : applying ? 'TRANSMITTING...' : !user?.profile?.resumeUrl ? 'RESUME_REQUIRED' : 'COMMIT CANDIDACY'}
              </div>
            </button>
            {hasApplied && (
              <p className="mt-4 text-center text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                AWAITING_RESPONSE
              </p>
            )}
            {!hasApplied && !user?.profile?.resumeUrl && (
              <p className="mt-4 text-center text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-rose-500 animate-pulse">
                UPLOAD_RESUME_TO_ENABLE
              </p>
            )}
          </div>
          
          <div className="rounded-xl bg-primary/5 dark:bg-white/5 border border-dashed border-primary/20 p-8">
            <p className="text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              PROTOCOL_NOTICE
            </p>
            <p className="text-[10px] font-poppins font-bold uppercase tracking-widest leading-relaxed text-slate-400 opacity-80">
              COMMITTING CANDIDACY SYNCHRONIZES YOUR READINESS MOMENTUM WITH INSTITUTIONAL RECRUITMENT REGISTRIES.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

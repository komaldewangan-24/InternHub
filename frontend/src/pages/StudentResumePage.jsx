import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import ResumeUploadSync from '../components/ResumeUploadSync';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { internshipAPI, settingsAPI } from '../services/api';
import { buildResumeSuggestions, resolveAtsCriteria, scoreResumeText } from '../utils/atsScoring';
import { dataUrlToArrayBuffer, extractPdfText, openResumeDataUrl } from '../utils/resumeParser';

const ScoreBar = ({ label, value }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-xs font-black text-[#003366] dark:text-white">{value}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
      <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default function StudentResumePage() {
  const { user, loading, refreshUser } = useCurrentUser();
  const [settings, setSettings] = useState(null);
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [settingsResponse, internshipsResponse] = await Promise.all([
          settingsAPI.get(),
          internshipAPI.getAll(),
        ]);
        setSettings(settingsResponse.data.data);
        setInternships((internshipsResponse.data.data || []).filter((item) => item.status !== 'closed'));
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedInternship = useMemo(
    () => internships.find((item) => item._id === selectedInternshipId) || null,
    [internships, selectedInternshipId]
  );

  const criteria = useMemo(
    () => resolveAtsCriteria({ selectedInternship, settings }),
    [selectedInternship, settings]
  );

  const suggestions = useMemo(() => buildResumeSuggestions(scoreResult), [scoreResult]);
  const groupedSuggestions = useMemo(
    () =>
      suggestions.reduce((groups, item) => {
        groups[item.priority] = [...(groups[item.priority] || []), item];
        return groups;
      }, {}),
    [suggestions]
  );

  const handleCheckScore = async () => {
    if (!user?.profile?.resumeUrl) {
      toast.info('Upload a PDF resume first.');
      return;
    }

    try {
      setScoring(true);
      const url = getAssetUrl(user.profile.resumeUrl);
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const text = await extractPdfText(arrayBuffer);

      if (!text || text.replace(/\s+/g, '').length < 20) {
        setScoreResult(null);
        toast.info('No readable text was found. Scanned or image PDFs cannot be scored reliably.');
        return;
      }

      setScoreResult(scoreResumeText({ text, criteria, profile: user.profile || {} }));
    } catch (error) {
      toast.error(error?.message || 'Unable to score resume.');
    } finally {
      setScoring(false);
    }
  };

  const handleViewResume = async () => {
    if (!user?.profile?.resumeUrl) {
      toast.info('Upload a PDF resume first.');
      return;
    }

    try {
      if (!(await openResumeDataUrl(user.profile.resumeUrl))) {
        toast.error('Browser blocked the resume preview.');
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to open resume.');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading resume workspace..." />;
  }

  const hasResume = Boolean(user?.profile?.resumeUrl);

  return (
    <AppShell
      title="Resume"
      description="Upload your resume, check ATS readiness, and fix the highest-impact gaps before applying."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
          <section className="space-y-6">
            <ResumeUploadSync user={user} refreshUser={refreshUser} syncLabel="Sync Profile From Resume" />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Score Against</p>
              <select
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none transition-all focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                value={selectedInternshipId}
                onChange={(event) => {
                  setSelectedInternshipId(event.target.value);
                  setScoreResult(null);
                }}
              >
                <option value="">General ATS Score</option>
                {internships.map((internship) => (
                  <option key={internship._id} value={internship._id}>
                    {internship.title} - {internship.company?.name || 'Company'}
                  </option>
                ))}
              </select>

              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
                <p className="font-black text-[#003366] dark:text-white">{criteria.title}</p>
                <p className="mt-1 text-xs">
                  Criteria source: {criteria.sourceLabel}
                  {criteria.source === 'default' ? '. Built-in defaults are active because no saved criteria was found.' : '.'}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCheckScore}
                  disabled={scoring || !hasResume}
                  className="rounded-xl bg-indigo-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 disabled:opacity-60"
                >
                  {scoring ? 'Checking...' : 'Check ATS Score'}
                </button>
                <button
                  type="button"
                  onClick={handleViewResume}
                  disabled={!hasResume}
                  className="rounded-xl border border-slate-200 px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-600 transition-all hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-60 dark:border-white/10 dark:text-slate-300"
                >
                  View Resume
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">ATS Score</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#003366] dark:text-white">
                  {scoreResult ? `${scoreResult.totalScore}%` : 'Not checked'}
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {hasResume
                    ? 'Run a score to see how your resume matches the selected criteria.'
                    : 'Upload a PDF resume to start ATS scoring.'}
                </p>
              </div>
              <div className="flex size-36 items-center justify-center rounded-full border-[12px] border-slate-100 text-4xl font-black text-[#003366] dark:border-white/10 dark:text-white">
                {scoreResult ? scoreResult.totalScore : '--'}
              </div>
            </div>

            {scoreResult ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {Object.entries(scoreResult.categoryScores).map(([key, value]) => (
                  <ScoreBar key={key} label={key} value={value} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center dark:border-white/10">
                <span className="material-symbols-outlined text-5xl text-slate-300">fact_check</span>
                <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-400">
                  ATS report will appear here
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Updates Needed</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#003366] dark:text-white">
                Resume improvement checklist
              </h2>
            </div>
            {scoreResult ? (
              <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                {scoreResult.missingKeywords.length} keyword gaps
              </span>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {scoreResult ? (
              Object.entries(groupedSuggestions).map(([priority, items]) => (
                <div key={priority} className="rounded-2xl bg-slate-50 p-6 dark:bg-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{priority}</p>
                  <div className="mt-5 space-y-4">
                    {items.map((item) => (
                      <div key={`${item.title}-${item.detail}`} className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-950">
                        <p className="font-black text-[#003366] dark:text-white">{item.title}</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="lg:col-span-2 rounded-2xl bg-slate-50 p-8 text-center dark:bg-white/5">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Check your ATS score to see critical fixes, keyword gaps, section improvements, and formatting suggestions.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

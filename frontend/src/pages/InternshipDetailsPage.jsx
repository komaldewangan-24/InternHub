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
    return <LoadingState label="Loading internship..." />;
  }

  return (
    <AppShell
      title={internship?.title || 'Internship Details'}
      description="Review the role details before you apply."
      navigation={navigationByRole.student}
      user={user}
      actions={
        <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-70" disabled={hasApplied || applying || internship?.status === 'closed'} onClick={handleApply} type="button">
          {hasApplied ? 'Already Applied' : applying ? 'Applying...' : 'Apply Now'}
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-black tracking-tight">{internship?.title}</p>
                <p className="mt-2 text-sm text-slate-500">{internship?.company?.name || 'Company'}</p>
              </div>
              <StatusBadge status={internship?.status} />
            </div>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600">{internship?.description}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Requirements</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(internship?.skillTags?.length ? internship.skillTags : internship?.requirements || []).map((requirement) => (
                <span key={requirement} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                  {requirement}
                </span>
              ))}
            </div>
            {fit.missingSkills.length ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
                Missing fit signals: {fit.missingSkills.slice(0, 4).join(', ')}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Role Snapshot</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Location</dt>
              <dd className="font-semibold">{internship?.location || 'TBD'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Stipend</dt>
              <dd className="font-semibold">{internship?.stipend || 'Unpaid'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Duration</dt>
              <dd className="font-semibold">{internship?.duration || 'Not specified'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Apply By</dt>
              <dd className="font-semibold">
                {internship?.applyBy ? new Date(internship.applyBy).toLocaleDateString() : 'Open'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Eligible Department</dt>
              <dd className="font-semibold">
                {internship?.eligibleDepartments?.length ? internship.eligibleDepartments.join(', ') : 'All'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Eligible Batch</dt>
              <dd className="font-semibold">
                {internship?.eligibleBatches?.length ? internship.eligibleBatches.join(', ') : 'All'}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </AppShell>
  );
}

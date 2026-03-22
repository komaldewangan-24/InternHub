import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { authAPI } from '../services/api';
import { computeProfileCompletion } from '../utils/readiness';

const toSkillsArray = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export default function StudentProfilePage() {
  const { user, loading, updateUser } = useCurrentUser();
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    university: '',
    degree: '',
    graduationDate: '',
    department: '',
    batch: '',
    section: '',
    rollNumber: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    skills: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        phone: user.profile?.phone || '',
        location: user.profile?.location || '',
        university: user.profile?.university || '',
        degree: user.profile?.degree || '',
        graduationDate: user.profile?.graduationDate || '',
        department: user.profile?.department || '',
        batch: user.profile?.batch || '',
        section: user.profile?.section || '',
        rollNumber: user.profile?.rollNumber || '',
        resumeUrl: user.profile?.resumeUrl || '',
        githubUrl: user.profile?.githubUrl || '',
        linkedinUrl: user.profile?.linkedinUrl || '',
        skills: (user.profile?.skills || []).join('\n'),
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await authAPI.updateMe({
        name: form.name,
        email: form.email,
        profile: {
          bio: form.bio,
          phone: form.phone,
          location: form.location,
          university: form.university,
          degree: form.degree,
          graduationDate: form.graduationDate,
          department: form.department,
          batch: form.batch,
          section: form.section,
          rollNumber: form.rollNumber,
          resumeUrl: form.resumeUrl,
          githubUrl: form.githubUrl,
          linkedinUrl: form.linkedinUrl,
          skills: toSkillsArray(form.skills),
        },
      });
      updateUser(data.data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading profile..." />;
  }

  const profileCompletion = computeProfileCompletion(user);

  return (
    <AppShell
      title="Student Profile"
      description="Keep your academic, portfolio, and campus details complete so faculty and recruiters can trust your readiness."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Readiness base</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Profile completion: {profileCompletion}%</h2>
            <p className="mt-2 text-sm text-slate-500">
              Assigned faculty: {user?.profile?.assignedFaculty?.name || 'Not assigned yet'}
            </p>
          </div>
          {user?.profile?.assignedFaculty ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm">
              <p className="font-semibold">{user.profile.assignedFaculty.name}</p>
              <p className="mt-1 text-slate-500">{user.profile.assignedFaculty.email}</p>
            </div>
          ) : null}
        </div>
      </div>

      <form className="grid gap-6 lg:grid-cols-[1fr,1fr]" onSubmit={handleSubmit}>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Identity</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Department" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Batch" value={form.batch} onChange={(event) => setForm((current) => ({ ...current, batch: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Section" value={form.section} onChange={(event) => setForm((current) => ({ ...current, section: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Roll number" value={form.rollNumber} onChange={(event) => setForm((current) => ({ ...current, rollNumber: event.target.value }))} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Academic And Portfolio</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="University" value={form.university} onChange={(event) => setForm((current) => ({ ...current, university: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Degree / program" value={form.degree} onChange={(event) => setForm((current) => ({ ...current, degree: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Graduation date" value={form.graduationDate} onChange={(event) => setForm((current) => ({ ...current, graduationDate: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Resume URL" value={form.resumeUrl} onChange={(event) => setForm((current) => ({ ...current, resumeUrl: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="GitHub URL" value={form.githubUrl} onChange={(event) => setForm((current) => ({ ...current, githubUrl: event.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={(event) => setForm((current) => ({ ...current, linkedinUrl: event.target.value }))} />
            <textarea className="md:col-span-2 min-h-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Skills, one per line'} value={form.skills} onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))} />
            <textarea className="md:col-span-2 min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Short bio" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <button className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 disabled:opacity-70" disabled={saving} type="submit">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

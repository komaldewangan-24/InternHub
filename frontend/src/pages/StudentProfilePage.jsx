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
      <div className="mb-8 rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5 transition-all">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Readiness base</p>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Profile completion: {profileCompletion}%</h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Assigned faculty: <span className="font-bold text-slate-700 dark:text-slate-200">{user?.profile?.assignedFaculty?.name || 'Not assigned yet'}</span>
            </div>
          </div>
          {user?.profile?.assignedFaculty ? (
            <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 px-6 py-5 text-sm transition-all hover:bg-slate-50 dark:hover:bg-white/10">
              <p className="font-black text-slate-800 dark:text-white">{user.profile.assignedFaculty.name}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">{user.profile.assignedFaculty.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                Primary Reviewer
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">person_outline</span>
            <h2 className="text-xl font-black tracking-tight dark:text-white">Identity Details</h2>
          </div>
          <div className="grid gap-5">
            {[
              { id: 'name', label: 'Full Name', placeholder: 'Ex: John Doe' },
              { id: 'email', label: 'Email Address', placeholder: 'name@university.edu', type: 'email' },
              { id: 'phone', label: 'Phone Number', placeholder: '+1 234 567 890' },
              { id: 'location', label: 'Location', placeholder: 'City, Country' },
              { id: 'department', label: 'Department', placeholder: 'Computer Science' },
              { id: 'batch', label: 'Batch/Year', placeholder: '2024' },
              { id: 'section', label: 'Section', placeholder: 'A' },
              { id: 'rollNumber', label: 'Roll Number', placeholder: 'University ID' },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{field.label}</label>
                <input 
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-3.5 text-sm outline-none focus:border-primary transition-all dark:text-white" 
                  placeholder={field.placeholder} 
                  type={field.type || 'text'}
                  value={form[field.id]} 
                  onChange={(event) => setForm((current) => ({ ...current, [field.id]: event.target.value }))} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">school</span>
              <h2 className="text-xl font-black tracking-tight dark:text-white">Academic & Links</h2>
            </div>
            <div className="grid gap-5">
              {[
                { id: 'university', label: 'University', placeholder: 'University Name' },
                { id: 'degree', label: 'Degree / Program', placeholder: 'B.Tech / M.B.A' },
                { id: 'graduationDate', label: 'Expected Graduation', placeholder: 'Month Year' },
                { id: 'resumeUrl', label: 'Resume URL', placeholder: 'Drive / Dropbox link' },
                { id: 'githubUrl', label: 'GitHub Portfolio', placeholder: 'github.com/username' },
                { id: 'linkedinUrl', label: 'LinkedIn Profile', placeholder: 'linkedin.com/in/username' },
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{field.label}</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-3.5 text-sm outline-none focus:border-primary transition-all dark:text-white" 
                    placeholder={field.placeholder} 
                    value={form[field.id]} 
                    onChange={(event) => setForm((current) => ({ ...current, [field.id]: event.target.value }))} 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <h2 className="text-xl font-black tracking-tight dark:text-white">Expertise</h2>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Skills Array</label>
                <textarea className="min-h-[120px] w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary transition-all dark:text-white" placeholder={'One skill per line\nReact.js\nSystem Design\nPython'} value={form.skills} onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Professional Bio</label>
                <textarea className="min-h-[140px] w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary transition-all dark:text-white" placeholder="Tell recruiters about your career goals and technical focus." value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <button className="rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={saving} type="submit">
            {saving ? 'Syncing Profile...' : 'Update Student Workspace Profile'}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

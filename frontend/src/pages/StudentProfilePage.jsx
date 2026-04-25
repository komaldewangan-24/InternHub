import React, { useMemo, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import ResumeUploadSync from '../components/ResumeUploadSync';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { userAPI } from '../services/api';
import { openResumeDataUrl } from '../utils/resumeParser';

const emptyProfileForm = {
  name: '',
  email: '',
  phone: '',
  university: '',
  graduationDate: '',
  bio: '',
  location: '',
  degree: '',
  skills: [],
  avatarUrl: '',
  resumeUrl: '',
  resumeFileName: '',
  resumeMimeType: '',
  resumeUploadedAt: '',
  certifications: [],
  achievements: [],
  experience: [],
  achievementsSummary: '',
  achievementsImageUrl: '',
};

const buildProfileFormData = (user) => ({
  ...emptyProfileForm,
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.profile?.phone || '',
  university: user?.profile?.university || '',
  graduationDate: user?.profile?.graduationDate ? new Date(user.profile.graduationDate).toISOString().split('T')[0] : '',
  bio: user?.profile?.bio || '',
  location: user?.profile?.location || '',
  degree: user?.profile?.degree || '',
  skills: user?.profile?.skills || [],
  avatarUrl: user?.profile?.avatarUrl || '',
  resumeUrl: user?.profile?.resumeUrl || '',
  resumeFileName: user?.profile?.resumeFileName || '',
  resumeMimeType: user?.profile?.resumeMimeType || '',
  resumeUploadedAt: user?.profile?.resumeUploadedAt || '',
  certifications: user?.profile?.certifications || [],
  achievements: user?.profile?.achievements || [],
  experience: user?.profile?.experience || [],
  achievementsSummary: user?.profile?.achievementsSummary || '',
  achievementsImageUrl: user?.profile?.achievementsImageUrl || '',
});

export default function StudentProfilePage() {
  const { user, loading, refreshUser } = useCurrentUser();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const currentFormData = useMemo(() => buildProfileFormData(user), [user]);
  const [editableFormData, setEditableFormData] = useState(emptyProfileForm);
  const formData = isEditing ? editableFormData : currentFormData;

  const setFormData = (updater) => {
    setEditableFormData((current) => (typeof updater === 'function' ? updater(current) : updater));
  };

  const startEditing = (patch = {}) => {
    setEditableFormData({ ...currentFormData, ...patch });
    setIsEditing(true);
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    try {
      await userAPI.updateProfile(formData);
      await refreshUser();
      setIsEditing(false);
      toast.success('Identity node synchronized.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Synchronization failed.');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('File exceeds 1MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
        
        if (!isEditing) {
          try {
            await userAPI.updateProfile({ ...currentFormData, avatarUrl: base64 });
            await refreshUser();
            toast.success('Profile photo synchronized.');
          } catch {
            toast.error('Failed to sync photo.');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewResume = async () => {
    if (!formData.resumeUrl) {
      toast.info('Upload a PDF resume first.');
      return;
    }

    try {
      if (!(await openResumeDataUrl(formData.resumeUrl))) {
        toast.error('Browser blocked the resume preview.');
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to open resume.');
    }
  };

  if (loading) {
    return <LoadingState label="Decrypting identity data..." />;
  }

  return (
    <AppShell
      actions={
        <button
          className="rounded-xl text-white px-8 py-3 text-[12px] font-poppins font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] bg-blue-600"
          onClick={() => (isEditing ? handleSubmit() : startEditing())}
          type="button"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      }
      title={`Hi ${user?.name || 'Student'} 👋`}
      description="Manage your professional profile"
      navigation={navigationByRole.student}
      user={user}
    >
      <form className="space-y-10" onSubmit={handleSubmit}>
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/60 dark:shadow-none transition-all duration-500 overflow-hidden">
          <div className="p-8 lg:p-10">
            {/* Header: Avatar | Identity | Strength Widget */}
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="relative shrink-0">
                    <div className="size-52 rounded-full p-2 bg-white dark:bg-slate-800 shadow-xl relative ring-1 ring-slate-100 dark:ring-white/5">
                      <svg className="absolute inset-0 size-full -rotate-90 scale-[1.02]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-50 dark:text-white/5" />
                        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="295" strokeDashoffset="153" strokeLinecap="round" className="text-indigo-600 transition-all duration-1000" />
                      </svg>
                      <div className="size-full rounded-full overflow-hidden cursor-pointer relative z-10 group" onClick={() => fileInputRef.current?.click()}>
                        {formData.avatarUrl ? (
                          <img src={formData.avatarUrl} alt="Rahul" className="size-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="size-full bg-slate-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-200 text-7xl">face</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="material-symbols-outlined text-white">photo_camera</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-indigo-50 dark:bg-slate-700 px-4 py-1 rounded-full shadow-lg border-4 border-white dark:border-slate-900 z-20">
                        <span className="text-[13px] font-black text-indigo-600 dark:text-indigo-400">48%</span>
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div className="flex-1 space-y-4 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <h2 className="text-[44px] font-poppins font-black text-[#003366] dark:text-white leading-tight tracking-tight">
                          {formData.name || 'Anonymous'}
                        </h2>
                        <span className="material-symbols-outlined text-indigo-500 text-3xl">verified</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-[16px] leading-relaxed max-w-md mx-auto md:mx-0">
                        Aspiring Data Scientist | Turning data into insights <span className="animate-pulse">🚀</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100/50 dark:border-emerald-500/20">
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                        ID: ACTIVE
                      </div>
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100/50 dark:border-indigo-500/20">
                        <span className="material-symbols-outlined text-[14px]">stars</span>
                        INSTITUTIONAL POOL
                      </div>
                    </div>

                    <div className="bg-blue-50/40 dark:bg-white/5 border border-blue-100/50 dark:border-white/5 rounded-2xl p-4 flex items-start gap-4 max-w-lg transition-all hover:bg-white dark:hover:bg-slate-800 group">
                      <div className="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 items-center flex gap-1 leading-none">
                          Complete your profile to increase your visibility
                        </p>
                        <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300">
                          Complete <span className="text-indigo-600 underline underline-offset-4 cursor-pointer">3 more sections</span> to get a 80% profile strength
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal Information Grid (Relocated for efficiency) */}
                <div className="mt-14 group/grid">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10">
                    {[
                      { label: 'Full Name', val: formData.name, icon: 'person', color: 'bg-indigo-50 text-indigo-500' },
                      { label: 'Email Address', val: formData.email, icon: 'alternate_email', color: 'text-indigo-500 bg-indigo-50' },
                      { label: 'Phone Number', val: formData.phone, icon: 'call', color: 'text-emerald-500 bg-emerald-50' },
                      { label: 'College / University', val: formData.university, icon: 'school', color: 'text-indigo-500 bg-indigo-50' },
                      { label: 'Academic Designation', val: formData.degree, icon: 'bookmark', color: 'text-amber-500 bg-amber-50' },
                      { label: 'Graduation Window', val: formData.graduationDate, icon: 'event', color: 'text-rose-500 bg-rose-50' },
                    ].map((field, idx) => (
                      <div key={field.label} className={`flex items-center gap-5 px-6 ${idx % 3 !== 2 ? 'md:border-r border-slate-100 dark:border-white/5' : ''} group/field`}>
                        <div className={`size-14 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all group-hover/field:scale-110 ${field.color} dark:bg-white/5`}>
                          <span className="material-symbols-outlined text-[24px]">{field.icon}</span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{field.label}</p>
                          <p className="text-[15px] font-black text-[#003366] dark:text-white leading-tight">
                            {field.val || '—'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Column on Right */}
              <div className="w-full lg:w-[340px] flex flex-col gap-6">
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => (isEditing ? handleSubmit() : startEditing())}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">{isEditing ? 'save' : 'edit'}</span>
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                  <button type="button" onClick={handleViewResume} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                    View Resume
                  </button>
                </div>

                <ResumeUploadSync
                  user={user}
                  refreshUser={refreshUser}
                  compact
                  onProfilePatch={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                />

                <div className="bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[32px] p-6 flex flex-col group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Profile Strength</p>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-[#003366] dark:text-white leading-none">48%</span>
                      <div className="flex items-center text-emerald-500 font-bold text-[11px] pb-0.5 whitespace-nowrap">
                        <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span>
                        12% <span className="text-slate-400 font-normal ml-1">this week</span>
                      </div>
                    </div>
                    <div className="h-10 w-24 relative group/chart">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <path 
                          d="M0 40 L0 32 Q15 15 30 28 T60 12 T100 22 L100 40 Z" 
                          fill="url(#chartGradient)" 
                          className="transition-all duration-700"
                        />
                        {/* Line */}
                        <path 
                          d="M0 32 Q15 15 30 28 T60 12 T100 22" 
                          fill="none" 
                          stroke="#4F46E5" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="drop-shadow-[0_2px_4px_rgba(79,70,229,0.3)]"
                        />
                        {/* Data Points */}
                        <circle cx="30" cy="28" r="3" fill="#4F46E5" className="opacity-0 group-hover/chart:opacity-100 transition-opacity" />
                        <circle cx="60" cy="12" r="3" fill="#4F46E5" className="opacity-0 group-hover/chart:opacity-100 transition-opacity" />
                        <circle cx="100" cy="22" r="3" fill="#4F46E5" className="opacity-0 group-hover/chart:opacity-100 transition-opacity" />
                      </svg>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { l: 'Basic Information', s: 'Completed', d: true },
                      { l: 'Contact Details', s: 'Completed', d: true },
                      { l: 'Professional Summary', s: 'Add a short summary', d: false },
                      { l: 'Skills & Technologies', s: 'Add your skills', d: false },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className={`mt-0.5 size-5 rounded-full flex items-center justify-center shrink-0 border ${item.d ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-200'}`}>
                          {item.d && <span className="material-symbols-outlined text-[12px] font-black">check</span>}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[12px] font-black text-slate-700 dark:text-slate-200 leading-tight truncate">{item.l}</p>
                          <p className="text-[10px] font-medium text-slate-400 truncate">{item.s}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>








        <section className="grid gap-10 lg:grid-cols-2">
           <div className="rounded-3xl bg-white dark:bg-slate-900 p-10 border border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-10 px-2">
                 <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none">
                      <span className="material-symbols-outlined text-[28px]">description</span>
                    </div>
                    <div>
                       <h3 className="text-xl font-poppins font-black text-[#003366] dark:text-white">Professional Summary</h3>
                       <p className="text-[11px] font-bold text-slate-400">Tell us about yourself ✨</p>
                    </div>
                 </div>
                 <button 
                  type="button"
                  onClick={() => {
                    const bio = "Motivated Computer Science student with strong interest in data science and machine learning. Skilled in Python, SQL, and data visualization. Passionate about solving real-world problems with data-driven solutions and contributing to impactful projects.";
                    if (isEditing) {
                      setFormData((prev) => ({ ...prev, bio }));
                    } else {
                      startEditing({ bio });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all"
                 >
                    <span className="material-symbols-outlined text-[16px]">temp_preferences_custom</span>
                    Generate with AI
                 </button>
              </div>
              
              <div className="relative">
                <textarea 
                  className={`w-full h-64 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-8 py-8 text-[14px] font-bold font-roboto leading-relaxed outline-none transition-all dark:text-white shadow-inner resize-none
                    ${isEditing ? 'focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800' : 'cursor-not-allowed'}
                  `}
                  disabled={!isEditing}
                  placeholder="Write 2–3 lines about your skills, interests, and career goals…"
                  value={formData.bio}
                  onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                />
                <div className="absolute bottom-6 right-8 flex items-center gap-4">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.bio.length}/300 characters</p>
                   {isEditing && (
                     <button 
                      type="button"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-200"
                      onClick={() => handleSubmit()}
                     >
                       Save <span className="material-symbols-outlined text-[16px]">check_circle</span>
                     </button>
                   )}
                </div>
              </div>
           </div>

           <div className="rounded-3xl bg-white dark:bg-slate-900 p-10 border border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-10 px-2">
                 <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200/50 dark:shadow-none">
                      <span className="material-symbols-outlined text-[28px]">hub</span>
                    </div>
                    <div>
                       <h3 className="text-xl font-poppins font-black text-[#003366] dark:text-white">Technological Stack</h3>
                       <p className="text-[11px] font-bold text-slate-400">Showcase your skills and tools ⚡</p>
                    </div>
                 </div>
                 <button type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 transition-all">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add Skill
                 </button>
              </div>

              <div className="space-y-8 px-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.length ? formData.skills.map((skill, index) => {
                      const skillConfigs = {
                        'Python': { color: 'bg-emerald-500', level: 'Advanced', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                        'SQL': { color: 'bg-amber-500', level: 'Intermediate', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
                        'Pandas': { color: 'bg-indigo-500', level: 'Intermediate', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
                        'NumPy': { color: 'bg-blue-500', level: 'Intermediate', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' }
                      };
                      const config = skillConfigs[skill] || { color: 'bg-slate-400', level: 'Intermediate', icon: null };
                      
                      return (
                        <div key={index} className="flex items-center justify-between bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl transition-all hover:border-indigo-500 hover:shadow-lg group/skill">
                           <div className="flex items-center gap-4">
                              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center p-2">
                                {config.icon ? <img src={config.icon} alt={skill} className="size-full" /> : <span className="material-symbols-outlined text-slate-300">code</span>}
                              </div>
                              <div>
                                <p className="text-[14px] font-bold text-[#003366] dark:text-white leading-tight">{skill}</p>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${config.color.replace('bg-', 'text-')} bg-opacity-10 ${config.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                                  {config.level}
                                </span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 opacity-0 group-hover/skill:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-slate-300 text-[18px] cursor-pointer hover:text-indigo-600">more_vert</span>
                           </div>
                        </div>
                      );
                    }) : (
                      <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl opacity-50">
                         <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">terminal</span>
                         <p className="text-sm font-bold text-slate-400">No skills identified yet.</p>
                      </div>
                    )}
                 </div>

                 {isEditing && (
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Add more skills..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-white/10 bg-indigo-50/10 text-[14px] font-bold outline-none focus:border-indigo-500 transition-all text-indigo-600 placeholder:text-indigo-300"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !formData.skills.includes(val)) {
                              setFormData(prev => ({ ...prev, skills: [...prev.skills, val] }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">add</span>
                    </div>
                 )}

                 <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                    <p className="text-[11px] font-bold text-emerald-700">Adding more skills increases your match with relevant opportunities.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* LinkedIn-style Experience Section */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 overflow-hidden group">
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200/50">
                  <span className="material-symbols-outlined text-[28px]">work</span>
                </div>
                <div>
                  <h3 className="text-xl font-poppins font-black text-[#003366] dark:text-white">Professional Experience</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your professional journey 📍</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => window.location.href = '/student/credentials'}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Manage Experience
              </button>
            </div>

            <div className="space-y-12">
              {formData.experience?.length > 0 ? (
                formData.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-10 md:pl-20 group/exp">
                    {/* Vertical Timeline Line */}
                    {idx !== formData.experience.length - 1 && (
                      <div className="absolute left-[23px] md:left-[35px] top-12 bottom-[-40px] w-0.5 bg-slate-100 dark:bg-white/5" />
                    )}
                    
                    <div className="absolute left-0 size-12 md:size-16 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center overflow-hidden">
                      {exp.companyLogoUrl ? (
                        <img src={exp.companyLogoUrl} alt={exp.company} className="size-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-3xl">corporate_fare</span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[17px] font-black text-[#003366] dark:text-white">{exp.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">{exp.company}</p>
                          <span className="size-1 rounded-full bg-slate-300" />
                          <p className="text-[14px] font-medium text-slate-500">{exp.employmentType || 'Full-time'}</p>
                        </div>
                        <p className="text-[13px] font-medium text-slate-400 mt-1">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – 
                          {exp.isCurrent ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        </p>
                        <p className="text-[13px] font-medium text-slate-400">{exp.location} • {exp.locationType || 'On-site'}</p>
                      </div>

                      <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
                        {exp.description}
                      </p>

                      {exp.skills?.length > 0 && (
                        <div className="flex items-center gap-3 pt-2">
                          <span className="material-symbols-outlined text-[18px] text-indigo-500">diamond</span>
                          <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                            {exp.skills.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[32px] opacity-60">
                   <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-4xl text-blue-500">history_edu</span>
                   </div>
                   <p className="text-lg font-black text-[#003366] dark:text-white uppercase tracking-widest">No Experience Found</p>
                   <p className="text-sm font-medium text-slate-400 mt-2">Highlight your professional history to impress recruiters.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LinkedIn-style Certifications & Achievements Section */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-2xl transition-all duration-500 overflow-hidden group">
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xl shadow-amber-200/50">
                  <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                </div>
                <div>
                  <h3 className="text-xl font-poppins font-black text-[#003366] dark:text-white">Certifications & Achievements</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Verified Credentials & Excellence 🏆</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => window.location.href = '/student/credentials'}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-500/20 hover:bg-amber-100 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Add Credential
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {formData.certifications?.length > 0 ? (
                formData.certifications.map((cert, idx) => (
                  <div key={idx} className="py-10 flex flex-col md:flex-row gap-8 items-start group/cert">
                    <div className="size-16 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {cert.issuerLogoUrl ? (
                         <img src={cert.issuerLogoUrl} alt={cert.issuer} className="size-full object-cover" />
                      ) : (
                         <span className="material-symbols-outlined text-slate-300 text-4xl">verified</span>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-[17px] font-black text-[#003366] dark:text-white leading-tight">
                          {cert.title}
                        </h4>
                        <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300 mt-1">{cert.issuer}</p>
                        <p className="text-[13px] font-medium text-slate-400 mt-1">
                          Issued {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
                        </p>
                        {cert.credentialId && (
                          <p className="text-[13px] font-medium text-slate-400 uppercase tracking-wider">Credential ID {cert.credentialId}</p>
                        )}
                      </div>

                      {cert.skills?.length > 0 && (
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[18px] text-indigo-500">diamond</span>
                          <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                            {cert.skills.join(', ')}
                          </p>
                        </div>
                      )}

                      {cert.imageUrl && (
                        <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover/cert:border-indigo-500/20 transition-all max-w-2xl">
                          <div className="size-48 md:size-32 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shrink-0">
                             <img src={cert.imageUrl} alt="Credential Preview" className="size-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[14px] font-black text-[#003366] dark:text-white mb-2">{cert.imageDescription || 'Certification Media'}</p>
                            <p className="text-[12px] text-slate-500 line-clamp-3">
                              Displaying proof of academic and professional excellence through verified institutional credentials.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[32px] opacity-60">
                   <div className="size-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-4xl text-amber-500">military_tech</span>
                   </div>
                   <p className="text-lg font-black text-[#003366] dark:text-white uppercase tracking-widest">No Certifications Found</p>
                   <p className="text-sm font-medium text-slate-400 mt-2">Add your verified licenses to boost your professional authority.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </form>
    </AppShell>
  );
}

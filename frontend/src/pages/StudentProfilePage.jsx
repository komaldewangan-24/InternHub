import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { userAPI } from '../services/api';

export default function StudentProfilePage() {
  const { user, loading, refreshUser } = useCurrentUser();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        university: user.profile?.university || '',
        graduationDate: user.profile?.graduationDate ? new Date(user.profile.graduationDate).toISOString().split('T')[0] : '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        degree: user.profile?.degree || '',
        skills: user.profile?.skills || [],
        avatarUrl: user.profile?.avatarUrl || '',
      });
    }
  }, [user]);

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
            await userAPI.updateProfile({ ...formData, avatarUrl: base64 });
            await refreshUser();
            toast.success('Profile photo synchronized.');
          } catch (err) {
            toast.error('Failed to sync photo.');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <LoadingState label="Decrypting identity data..." />;
  }

  return (
    <AppShell
      actions={
        <button
          className="rounded-sm text-white px-8 py-3 text-[11px] font-poppins font-bold uppercase tracking-[0.2em] shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
          style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
          onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
          type="button"
        >
          {isEditing ? 'COMMIT CHANGES' : 'EDIT CREDENTIALS'}
        </button>
      }
      title={`Hi ${user?.name || 'Student'} 👋`}
      description="Manage your professional profile"
      navigation={navigationByRole.student}
      user={user}
    >
      <form className="space-y-10" onSubmit={handleSubmit}>
        <section className="rounded-xl bg-white dark:bg-slate-900 p-12 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group transition-all duration-500 hover:shadow-2xl">
          <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-20 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-12 mb-16 relative z-10">
            <div className="relative group/avatar shrink-0">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <div 
                className="relative flex size-40 items-center justify-center rounded-xl transition-all overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer hover:border-indigo-500 bg-slate-50 dark:bg-white/5 group-hover/avatar:shadow-2xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Identity" className="size-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-[48px]">account_circle</span>
                    <p className="text-[8px] font-poppins font-bold uppercase mt-1 tracking-widest text-[#003366] opacity-30">NO PHOTO</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-[#003366]/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span className="material-symbols-outlined text-white text-[28px]">photo_camera</span>
                  <p className="text-[9px] text-white font-poppins font-bold mt-2 uppercase tracking-widest">POST PHOTO</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
               <h2 className="text-4xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none">{formData.name || 'ANONYMOUS NODE'}</h2>
               <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <p className="text-[9px] font-poppins font-bold uppercase tracking-widest text-emerald-600">ID: ACTIVE</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-sm border border-indigo-500/20">
                    <span className="material-symbols-outlined text-[14px] text-indigo-500">verified</span>
                    <p className="text-[9px] font-poppins font-bold uppercase tracking-widest text-indigo-500">INSTITUTIONAL POOL</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
             {[
               { label: 'Full Identity Name', name: 'name', type: 'text', icon: 'person' },
               { label: 'Primary Network Email', name: 'email', type: 'email', icon: 'alternate_email' },
               { label: 'Mobile Frequency', name: 'phone', type: 'tel', icon: 'call' },
               { label: 'Partner Institution', name: 'university', type: 'text', icon: 'school' },
               { label: 'Academic Designation', name: 'degree', type: 'text', icon: 'architecture' },
               { label: 'Graduation Window', name: 'graduationDate', type: 'date', icon: 'history' },
             ].map((field) => (
               <div key={field.name} className="group/field relative">
                  <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-2.5 px-1 flex items-center gap-2.5 group-hover/field:text-indigo-500 transition-all">
                    <span className="material-symbols-outlined text-[16px] text-indigo-500 opacity-60 group-hover/field:opacity-100">{field.icon}</span>
                    {field.label}
                  </p>
                  <input 
                    className={`w-full rounded-md border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-[11px] font-poppins font-bold uppercase tracking-widest outline-none transition-all dark:text-white 
                      ${isEditing ? 'focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 shadow-md transform -translate-y-0.5' : 'cursor-not-allowed opacity-60'}
                    `}
                    disabled={!isEditing}
                    name={field.name}
                    placeholder={field.label}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
                  />
               </div>
             ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
           <div className="rounded-xl bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl group">
              <div className="flex items-center gap-4 mb-10">
                 <div className="flex size-12 items-center justify-center rounded-sm bg-indigo-500 text-white shadow-lg transition-transform group-hover:rotate-3">
                   <span className="material-symbols-outlined text-[24px]">description</span>
                 </div>
                 <h3 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none group-hover:text-indigo-500 transition-colors">PROFESSIONAL_SUMMARY</h3>
              </div>
              <textarea 
                className={`w-full h-56 rounded-md border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-8 py-6 text-[11px] font-poppins font-bold uppercase tracking-widest leading-relaxed outline-none transition-all dark:text-white shadow-inner resize-none
                  ${isEditing ? 'focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 shadow-md transform -translate-y-0.5' : 'cursor-not-allowed opacity-60'}
                `}
                disabled={!isEditing}
                placeholder="Synchronize your professional intent node..."
                value={formData.bio}
                onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
              />
           </div>

           <div className="rounded-xl bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:shadow-2xl group">
              <div className="flex items-center gap-4 mb-10 px-2">
                 <div className="flex size-12 items-center justify-center rounded-sm bg-indigo-500 text-white shadow-lg transition-transform group-hover:rotate-3">
                   <span className="material-symbols-outlined text-[24px]">hub</span>
                 </div>
                 <h3 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none group-hover:text-indigo-500 transition-colors">TECHNOLOGICAL_STACK</h3>
              </div>
              <div className="flex flex-col h-56 justify-between px-2">
                 <div className="flex flex-wrap gap-3 overflow-y-auto scrollbar-hide">
                    {formData.skills.length ? formData.skills.map((skill, index) => (
                      <span key={index} className="rounded-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-3 text-[9px] font-poppins font-bold uppercase tracking-widest text-slate-500 hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all cursor-default">
                         {skill}
                      </span>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full w-full opacity-30 text-center text-indigo-500">
                         <span className="material-symbols-outlined text-[48px] mb-6">analytics</span>
                         <p className="text-[12px] font-poppins font-bold uppercase tracking-widest text-slate-400">No capability nodes detected</p>
                      </div>
                    )}
                 </div>
                 <div className="mt-8 flex items-center gap-4 text-[10px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400">
                    <span className="material-symbols-outlined text-[20px] text-emerald-500">verified_user</span>
                    Synchronize stack to optimize mission fit.
                 </div>
              </div>
           </div>
        </section>
      </form>
    </AppShell>
  );
}

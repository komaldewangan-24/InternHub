import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import ResumeUploadSync from '../components/ResumeUploadSync';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { userAPI } from '../services/api';

export default function CredentialsPage() {
  const { user, loading, refreshUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('experience');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form States
  const [expForm, setExpForm] = useState({
    title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', skills: '', employmentType: 'Full-time', locationType: 'On-site', companyLogoUrl: ''
  });
  const [certForm, setCertForm] = useState({
    title: '', issuer: '', issueDate: '', credentialId: '', skills: '', imageUrl: '', imageDescription: '', url: '', issuerLogoUrl: ''
  });

  const items = useMemo(() => ({
    experience: user?.profile?.experience || [],
    certifications: user?.profile?.certifications || [],
  }), [user]);

  const buildLogoUrl = (name) => {
    const domain = name.toLowerCase().replace(/\s+/g, '');
    return domain.length > 2 ? `https://logo.clearbit.com/${domain}.com` : '';
  };

  const handleCompanyChange = (company) => {
    setExpForm((prev) => ({
      ...prev,
      company,
      companyLogoUrl: prev.companyLogoUrl || buildLogoUrl(company),
    }));
  };

  const handleIssuerChange = (issuer) => {
    setCertForm((prev) => ({
      ...prev,
      issuer,
      issuerLogoUrl: prev.issuerLogoUrl || buildLogoUrl(issuer),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertForm(prev => ({ ...prev, imageUrl: reader.result }));
        toast.info('Local file attached.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = { ...(user.profile || {}) };
      
      if (activeTab === 'experience') {
        const newExp = { ...expForm, skills: expForm.skills.split(',').map(s => s.trim()).filter(Boolean) };
        const experience = [...(updatedProfile.experience || [])];
        if (editingItem !== null) {
          experience[editingItem] = newExp;
        } else {
          experience.push(newExp);
        }
        updatedProfile.experience = experience;
      } else {
        const newCert = { ...certForm, skills: certForm.skills.split(',').map(s => s.trim()).filter(Boolean) };
        const certifications = [...(updatedProfile.certifications || [])];
        if (editingItem !== null) {
          certifications[editingItem] = newCert;
        } else {
          certifications.push(newCert);
        }
        updatedProfile.certifications = certifications;
      }

      await userAPI.updateProfile(updatedProfile);
      await refreshUser();
      setIsModalOpen(false);
      resetForms();
      toast.success('Professional data synchronized.');
    } catch {
      toast.error('Failed to sync data.');
    }
  };

  const resetForms = () => {
    setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', skills: '', employmentType: 'Full-time', locationType: 'On-site', companyLogoUrl: '' });
    setCertForm({ title: '', issuer: '', issueDate: '', credentialId: '', skills: '', imageUrl: '', imageDescription: '', url: '', issuerLogoUrl: '' });
    setEditingItem(null);
  };

  const deleteItem = async (index) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      const updatedProfile = { ...(user.profile || {}) };
      if (activeTab === 'experience') {
        updatedProfile.experience = [...(updatedProfile.experience || [])];
        updatedProfile.experience.splice(index, 1);
      } else {
        updatedProfile.certifications = [...(updatedProfile.certifications || [])];
        updatedProfile.certifications.splice(index, 1);
      }
      await userAPI.updateProfile(updatedProfile);
      await refreshUser();
      toast.info('Entry removed.');
    } catch {
      toast.error('Failed to remove entry.');
    }
  };

  if (loading) return null;

  return (
    <AppShell
      title="Manage Documents"
      description="Manage your professional experience and verified achievements"
      navigation={navigationByRole.student}
      user={user}
      actions={
        <button 
          onClick={() => { resetForms(); setIsModalOpen(true); }}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Add {activeTab === 'experience' ? 'Experience' : 'Achievement'}
        </button>
      }
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <ResumeUploadSync user={user} refreshUser={refreshUser} />

        <div className="flex gap-4 bg-slate-100/50 dark:bg-white/5 p-2 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'experience' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'certifications' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Certifications & Achievements
          </button>
        </div>

        {/* Content List */}
        <div className="grid gap-6">
          {items[activeTab].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl p-8 flex items-start justify-between shadow-xl shadow-slate-200/50 dark:shadow-none group">
               <div className="flex gap-8">
                  <div className="size-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                     <span className="material-symbols-outlined text-4xl">{activeTab === 'experience' ? 'work' : 'verified'}</span>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-black text-[#003366] dark:text-white leading-tight">{item.title}</h4>
                     <p className="text-[15px] font-bold text-slate-600 dark:text-slate-400">{activeTab === 'experience' ? item.company : item.issuer}</p>
                     <p className="text-[13px] font-medium text-slate-400">
                        {activeTab === 'experience' ? (
                          `${new Date(item.startDate).toLocaleDateString()} - ${item.isCurrent ? 'Present' : new Date(item.endDate).toLocaleDateString()}`
                        ) : (
                          `Issued ${new Date(item.issueDate).toLocaleDateString()}`
                        )}
                     </p>
                  </div>
               </div>
               <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingItem(idx);
                      if (activeTab === 'experience') setExpForm({...item, skills: item.skills?.join(', ') || '', startDate: item.startDate?.split('T')[0], endDate: item.endDate?.split('T')[0]});
                      else setCertForm({...item, skills: item.skills?.join(', ') || '', issueDate: item.issueDate?.split('T')[0]});
                      setIsModalOpen(true);
                    }}
                    className="size-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => deleteItem(idx)} className="size-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
               </div>
            </div>
          ))}

          {items[activeTab].length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px]">
               <span className="material-symbols-outlined text-7xl text-slate-300 mb-6">{activeTab === 'experience' ? 'business_center' : 'auto_award'}</span>
               <p className="text-xl font-black text-slate-400 uppercase tracking-widest">No Records Found</p>
               <button onClick={() => setIsModalOpen(true)} className="mt-6 text-indigo-600 font-bold hover:underline">Add your first entry</button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Dialog/Modal for Adding/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-[#003366] dark:text-white uppercase tracking-tight">
                    {editingItem !== null ? 'Edit' : 'Add New'} {activeTab === 'experience' ? 'Experience' : 'Achievement'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="size-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              
              <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                 {activeTab === 'experience' ? (
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                        <input required className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 transition-all font-bold" value={expForm.title} onChange={e => setExpForm({...expForm, title: e.target.value})} placeholder="e.g. Frontend Intern" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                        <input required className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 transition-all font-bold" value={expForm.company} onChange={e => handleCompanyChange(e.target.value)} placeholder="e.g. Google" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Employment Type</label>
                        <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={expForm.employmentType} onChange={e => setExpForm({...expForm, employmentType: e.target.value})}>
                          <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Freelance</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={expForm.location} onChange={e => setExpForm({...expForm, location: e.target.value})} placeholder="City, Country" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                        <input type="date" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={expForm.startDate} onChange={e => setExpForm({...expForm, startDate: e.target.value})} />
                      </div>
                      {!expForm.isCurrent && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                          <input type="date" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={expForm.endDate} onChange={e => setExpForm({...expForm, endDate: e.target.value})} />
                        </div>
                      )}
                      <div className="md:col-span-2 flex items-center gap-3 py-2">
                         <input type="checkbox" className="size-5 rounded-md text-indigo-600" id="isCurrent" checked={expForm.isCurrent} onChange={e => setExpForm({...expForm, isCurrent: e.target.checked})} />
                         <label htmlFor="isCurrent" className="text-sm font-bold text-slate-600">I am currently working in this role</label>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills (comma separated)</label>
                        <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={expForm.skills} onChange={e => setExpForm({...expForm, skills: e.target.value})} placeholder="React, Node.js, UI/UX" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                           <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Logo URL (Optional)</label>
                           {expForm.companyLogoUrl && (
                             <img src={expForm.companyLogoUrl} alt="Preview" className="size-8 rounded-lg object-contain bg-slate-50 border border-slate-200" onError={(e) => e.target.style.display = 'none'} />
                           )}
                        </div>
                        <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={expForm.companyLogoUrl} onChange={e => setExpForm({...expForm, companyLogoUrl: e.target.value})} placeholder="Auto-filled if valid domain" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                         <textarea className="w-full h-32 p-6 rounded-3xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold resize-none" value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} placeholder="Describe your responsibilities and achievements..." />
                      </div>
                   </div>
                 ) : (
                   <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Certificate Title</label>
                        <input required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} placeholder="e.g. AWS Solutions Architect" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Issuing Organization</label>
                        <input required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.issuer} onChange={e => handleIssuerChange(e.target.value)} placeholder="e.g. Amazon Web Services" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Date</label>
                        <input type="date" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.issueDate} onChange={e => setCertForm({...certForm, issueDate: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Credential ID</label>
                        <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.credentialId} onChange={e => setCertForm({...certForm, credentialId: e.target.value})} placeholder="Optional ID" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Skills (comma separated)</label>
                        <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.skills} onChange={e => setCertForm({...certForm, skills: e.target.value})} placeholder="Cloud Engineering, Security" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Issuer Logo URL (Optional)</label>
                            {certForm.issuerLogoUrl && (
                                <img src={certForm.issuerLogoUrl} alt="Preview" className="size-8 rounded-lg object-contain bg-slate-50 border border-slate-200" onError={(e) => e.target.style.display = 'none'} />
                            )}
                         </div>
                         <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.issuerLogoUrl} onChange={e => setCertForm({...certForm, issuerLogoUrl: e.target.value})} placeholder="Auto-filled if valid domain" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Credential Proof (URL or Upload)</label>
                            <label className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-100 transition-all border border-indigo-100">
                               <span className="material-symbols-outlined text-[16px]">upload_file</span>
                               Upload File
                               <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                         </div>
                         <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.imageUrl} onChange={e => setCertForm({...certForm, imageUrl: e.target.value})} placeholder="Enter URL or upload a file above" />
                         {certForm.imageUrl?.startsWith('data:') && (
                           <p className="text-[10px] font-bold text-emerald-500 mt-2 px-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Local file attached successfully
                           </p>
                         )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Media Description</label>
                         <input className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold" value={certForm.imageDescription} onChange={e => setCertForm({...certForm, imageDescription: e.target.value})} placeholder="Short caption for the preview" />
                      </div>
                   </div>
                 )}

                 <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                       Save Credentials
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 h-14 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                       Cancel
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AppShell>
  );
}

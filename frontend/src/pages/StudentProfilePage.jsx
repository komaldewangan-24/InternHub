import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', email: '', phone: '', location: '', bio: '', graduationDate: '', university: '', degree: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    // Initial fallback to local storage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      setEditForm({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.profile?.phone || '',
        location: parsed.profile?.location || '',
        bio: parsed.profile?.bio || '',
        graduationDate: parsed.profile?.graduationDate || '',
        university: parsed.profile?.university || '',
        degree: parsed.profile?.degree || ''
      });
    }

    try {
      setLoading(true);
      const { data } = await authAPI.getMe();
      if (data.success) {
        setUser(data.data);
        setEditForm({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.profile?.phone || '',
          location: data.data.profile?.location || '',
          bio: data.data.profile?.bio || '',
          graduationDate: data.data.profile?.graduationDate || '',
          university: data.data.profile?.university || '',
          degree: data.data.profile?.degree || ''
        });
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        profile: {
          ...(user?.profile || {}),
          phone: editForm.phone,
          location: editForm.location,
          bio: editForm.bio,
          graduationDate: editForm.graduationDate,
          university: editForm.university,
          degree: editForm.degree
        }
      };
      const { data } = await authAPI.updateMe(updateData);
      if (data.success) {
        toast.success('Profile updated successfully!');
        setUser(data.data);
        setIsEditing(false);
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      
<div className="flex min-h-screen overflow-hidden">

<aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
<div className="p-6 flex items-center gap-3">
<div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
<span className="material-symbols-outlined">school</span>
</div>
<div>
<h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">InternHub</h1>
<p className="text-xs text-slate-500 font-medium">Student Portal</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1 mt-4">
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/student_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg transition-colors" to="/student_profile_page">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>person</span>
<span className="text-sm font-medium">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/internship_discovery_page">
<span className="material-symbols-outlined">work</span>
<span className="text-sm font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/my_applications_web">
<span className="material-symbols-outlined">description</span>
<span className="text-sm font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/interview_schedule_web">
<span className="material-symbols-outlined">event</span>
<span className="text-sm font-medium">Interviews</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/message_page">
<span className="material-symbols-outlined">chat_bubble</span>
<span className="text-sm font-medium">Messages</span>
</Link>
<div className="pt-4 pb-2 px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">Account</div>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-sm font-medium">Settings</span>
</Link>
</nav>
<div className="p-4 mt-auto">
<button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined text-sm">add</span>
                Post a Project
            </button>
</div>
</aside>

<main className="flex-1 ml-64 min-h-screen">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
<h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Profile</h2>
<div className="flex items-center gap-6">
<div className="relative max-w-xs hidden md:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
<input className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64" placeholder="Search internships..." type="text"/>
</div>
<div className="flex items-center gap-3">
<button className="size-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span className="material-symbols-outlined">notifications</span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800"></div>
<div className="flex items-center gap-3 cursor-pointer group">
<div className="size-8 rounded-full bg-slate-300 overflow-hidden">
  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`} alt="Avatar" className="w-full h-full object-cover" />
</div>
<span className="text-sm font-medium hidden sm:block">{user?.name || 'User'}</span>
</div>
</div>
</div>
</header>
<div className="p-8 max-w-6xl mx-auto">

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
<div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40" data-alt="Abstract gradient banner background"></div>
<div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-12">
<div className="size-32 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 overflow-hidden">
  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`} alt="Avatar" className="w-full h-full object-cover" />
</div>
<div className="flex-1 mb-2">
{isEditing ? (
  <input 
    className="text-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1 w-full mb-2 border border-slate-300 dark:border-slate-700" 
    value={editForm.name} 
    onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
    placeholder="Your Name"
  />
) : (
  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</h1>
)}
<p className="text-slate-500 font-medium">
  {isEditing ? (
    <span className="flex gap-2 mb-2">
      <input className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm border border-slate-300 dark:border-slate-700" value={editForm.degree} onChange={(e) => setEditForm({...editForm, degree: e.target.value})} placeholder="Degree (e.g. Computer Science Student)" />
      <span>at</span>
      <input className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm border border-slate-300 dark:border-slate-700" value={editForm.university} onChange={(e) => setEditForm({...editForm, university: e.target.value})} placeholder="University" />
    </span>
  ) : (
    <>{user?.profile?.degree || 'Student'} at {user?.profile?.university || 'Your University'}</>
  )}
</p>
<div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
{isEditing ? (
  <>
    <span className="flex items-center gap-1.5">
      <span className="material-symbols-outlined text-sm">location_on</span>
      <input className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm border border-slate-300 dark:border-slate-700" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Location (e.g. Palo Alto, CA)" />
    </span>
    <span className="flex items-center gap-1.5">
      <span className="material-symbols-outlined text-sm">calendar_today</span> Graduating
      <input className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm border border-slate-300 dark:border-slate-700" value={editForm.graduationDate} onChange={(e) => setEditForm({...editForm, graduationDate: e.target.value})} placeholder="Date (e.g. May 2025)" />
    </span>
  </>
) : (
  <>
    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">location_on</span> {user?.profile?.location || 'Your Location'}</span>
    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">calendar_today</span> Graduating {user?.profile?.graduationDate || 'N/A'}</span>
  </>
)}
</div>
</div>
<div className="flex gap-3 mb-2">
<button className="px-5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={(e) => { e.preventDefault(); setIsEditing(!isEditing); }}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
{isEditing ? (
  <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-shadow" onClick={handleSaveProfile}>Save</button>
) : (
  <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-shadow" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>Share</button>
)}
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

<div className="lg:col-span-2 space-y-8">

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<div className="flex items-center justify-between mb-4">
<h3 className="font-bold text-lg">Personal Details</h3>
{!isEditing && <button className="text-primary text-sm font-medium" onClick={() => setIsEditing(true)}>Edit</button>}
</div>
{isEditing ? (
  <div className="space-y-4">
    <textarea 
      className="w-full bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm border border-slate-300 dark:border-slate-700" 
      rows="3" 
      value={editForm.bio} 
      onChange={(e) => setEditForm({...editForm, bio: e.target.value})} 
      placeholder="Bio"
    />
    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
      <div>
        <label className="text-slate-400 mb-1 block">Email</label>
        <input className="w-full bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 border border-slate-300 dark:border-slate-700" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
      </div>
      <div>
        <label className="text-slate-400 mb-1 block">Phone</label>
        <input className="w-full bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 border border-slate-300 dark:border-slate-700" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
      </div>
    </div>
  </div>
) : (
  <>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
        {user?.profile?.bio || 'Passionate software engineering student with a focus on cloud architecture and distributed systems. Currently seeking a Summer 2024 internship where I can apply my skills in full-stack development and contribute to scalable products.'}
    </p>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-slate-400 mb-1">Email</p>
        <p className="font-medium text-slate-700 dark:text-slate-200">{user?.email || 'email@example.com'}</p>
      </div>
      <div>
        <p className="text-slate-400 mb-1">Phone</p>
        <p className="font-medium text-slate-700 dark:text-slate-200">{user?.profile?.phone || 'Not provided'}</p>
      </div>
    </div>
  </>
)}
</section>

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<div className="flex items-center justify-between mb-6">
<h3 className="font-bold text-lg">Academic Details</h3>
{!isEditing && <button className="text-primary text-sm font-medium" onClick={() => setIsEditing(true)}>Edit</button>}
</div>
<div className="flex gap-4">
<div className="size-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
<span className="material-symbols-outlined text-primary">school</span>
</div>
<div className="flex-1">
{isEditing ? (
  <div className="space-y-2">
    <input className="w-full bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700" value={editForm.university} onChange={(e) => setEditForm({...editForm, university: e.target.value})} placeholder="University" />
    <input className="w-full bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm text-slate-500 border border-slate-300 dark:border-slate-700" value={editForm.degree} onChange={(e) => setEditForm({...editForm, degree: e.target.value})} placeholder="Degree" />
  </div>
) : (
  <>
    <h4 className="font-bold text-slate-900 dark:text-white">{user?.profile?.university || 'Your University'}</h4>
    <p className="text-sm text-slate-500 mb-2">{user?.profile?.degree || 'Your Degree'}</p>
  </>
)}
<p className="text-xs text-slate-400">Sep 2021 - Present</p>
<div className="mt-4 flex flex-wrap gap-2">
<span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] rounded font-medium text-slate-500 uppercase tracking-wider">Relevant Coursework:</span>
<span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] rounded font-medium">Data Structures</span>
<span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] rounded font-medium">Algos</span>
<span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] rounded font-medium">OS</span>
</div>
</div>
</div>
</section>

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<div className="flex items-center justify-between mb-6">
<h3 className="font-bold text-lg">Featured Projects</h3>
<button className="text-primary text-sm font-medium">Add Project</button>
</div>
<div className="space-y-6">
<div className="group">
<div className="flex justify-between items-start mb-2">
<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Distributed Cache System</h4>
<span className="text-xs font-medium text-slate-400">Dec 2023</span>
</div>
<p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Implemented a high-performance LRU cache using Go and Redis with sub-millisecond latency for real-time applications.
                                </p>
<div className="flex gap-2">
<span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">Go</span>
<span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">Redis</span>
<span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">Docker</span>
</div>
</div>
<div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>
<div className="group">
<div className="flex justify-between items-start mb-2">
<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">AI Content Moderator</h4>
<span className="text-xs font-medium text-slate-400">Oct 2023</span>
</div>
<p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Built a full-stack platform using React and Python that leverages LLMs to flag toxic content in online communities.
                                </p>
<div className="flex gap-2">
<span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">React</span>
<span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">Python</span>
<span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">OpenAI API</span>
</div>
</div>
</div>
</section>
</div>

<div className="space-y-8">

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<h3 className="font-bold text-lg mb-4">Resume</h3>
<div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center group hover:border-primary/50 transition-colors cursor-pointer">
<span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-4xl mb-2">upload_file</span>
<p className="text-sm font-medium text-slate-700 dark:text-slate-200">Upload new resume</p>
<p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 10MB</p>
</div>
<div className="mt-4 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
<div>
<p className="text-xs font-bold truncate max-w-[120px]">{user?.name ? user.name.replace(' ', '_') + '_Resume.pdf' : 'Resume.pdf'}</p>
<p className="text-[10px] text-slate-400">Updated recently</p>
</div>
</div>
<button className="text-slate-400 hover:text-slate-600">
<span className="material-symbols-outlined text-sm">download</span>
</button>
</div>
</section>

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<div className="flex items-center justify-between mb-4">
<h3 className="font-bold text-lg">Skills</h3>
<button className="text-primary text-sm font-medium" onClick={(e) => { e.preventDefault(); navigate('/admin_dashboard'); }}>Manage</button>
</div>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">TypeScript</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">React</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">Node.js</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">Python</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">AWS</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">Docker</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">Kubernetes</span>
<span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg">PostgreSQL</span>
</div>
</section>

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<h3 className="font-bold text-lg mb-4">Certifications</h3>
<div className="space-y-4">
<div className="flex gap-3">
<div className="size-10 bg-orange-50 dark:bg-orange-900/20 rounded flex items-center justify-center">
<span className="material-symbols-outlined text-orange-500 text-xl">verified</span>
</div>
<div>
<p className="text-sm font-bold">AWS Certified Cloud Practitioner</p>
<p className="text-[10px] text-slate-400">Amazon Web Services • 2023</p>
</div>
</div>
<div className="flex gap-3">
<div className="size-10 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center justify-center">
<span className="material-symbols-outlined text-blue-500 text-xl">verified</span>
</div>
<div>
<p className="text-sm font-bold">Meta Front-End Developer</p>
<p className="text-[10px] text-slate-400">Coursera • 2023</p>
</div>
</div>
</div>
</section>

<section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
<h3 className="font-bold text-lg mb-4">Connect</h3>
<div className="space-y-3">
<Link className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="#">
<div className="size-8 bg-slate-900 text-white rounded flex items-center justify-center">
<svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
</div>
<span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">github.com/{user?.name?.toLowerCase().replace(' ', '') || 'username'}</span>
</Link>
<Link className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="#">
<div className="size-8 bg-blue-600 text-white rounded flex items-center justify-center">
<svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
</div>
<span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">linkedin.com/in/{user?.name?.toLowerCase().replace(' ', '') || 'username'}</span>
</Link>
</div>
</section>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

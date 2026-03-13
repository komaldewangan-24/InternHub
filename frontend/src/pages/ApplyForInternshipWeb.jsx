import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ApplyForInternshipWeb() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authAPI.getMe();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        const localUser = localStorage.getItem('user');
        if (localUser) setUser(JSON.parse(localUser));
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      
<div className="flex h-screen overflow-hidden">

<aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
<div className="p-6 flex items-center gap-3">
<div className="size-8 bg-primary rounded flex items-center justify-center text-white">
<span className="material-symbols-outlined">layers</span>
</div>
<h1 className="text-xl font-bold tracking-tight">InternHub</h1>
</div>
<nav className="flex-1 px-4 space-y-2 mt-4">
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" to="/student_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-medium text-sm">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-primary bg-primary/5 rounded font-semibold border-r-2 border-primary" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span className="text-sm">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="font-medium text-sm">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" to="#">
<span className="material-symbols-outlined">mail</span>
<span className="font-medium text-sm">Messages</span>
</Link>
<div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</div>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" to="/student_profile_page">
<span className="material-symbols-outlined">person</span>
<span className="font-medium text-sm">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-medium text-sm">Settings</span>
</Link>
</nav>
<div className="p-4 mt-auto">
<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
<p className="text-xs text-slate-500 mb-2">Application Help</p>
<button className="w-full text-xs font-semibold py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm">Contact Support</button>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col overflow-y-auto">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search internships, companies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-800">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500">{user?.profile?.degree || 'Student Applicant'}</p>
</div>
<div className="size-10 rounded-full bg-slate-200 overflow-hidden">
<img alt={user?.name || "Student"} className="w-full h-full rounded-full object-cover" src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Alex')} />
</div>
</div>
</div>
</header>

<div className="p-8 max-w-5xl mx-auto w-full">

<div className="mb-8">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
<div>
<nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
<Link className="hover:text-primary" to="/internship_management_admin">Internships</Link>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-slate-900 dark:text-slate-200 font-medium">Summer 2024 Application</span>
</nav>
<h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">Software Engineer Intern</h2>
<p className="text-slate-500 mt-1 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">apartment</span>
                                Google Cloud • Sunnyvale, CA
                            </p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Save Draft</button>
<button className="px-6 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90">Submit Application</button>
</div>
</div>

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<span className="text-sm font-semibold text-primary uppercase tracking-wider">Step 2 of 4: Documentation</span>
<span className="text-sm font-bold">45% Complete</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[45%] rounded-full"></div>
</div>
<div className="flex justify-between mt-6">
<div className="flex flex-col items-center gap-2 opacity-100">
<div className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
<span className="material-symbols-outlined text-sm">check</span>
</div>
<span className="text-xs font-semibold">General</span>
</div>
<div className="flex-1 h-px bg-primary self-center mx-2 mt-[-20px]"></div>
<div className="flex flex-col items-center gap-2">
<div className="size-8 rounded-full border-2 border-primary bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</div>
<span className="text-xs font-semibold text-primary">Resume</span>
</div>
<div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 self-center mx-2 mt-[-20px]"></div>
<div className="flex flex-col items-center gap-2">
<div className="size-8 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
<span className="text-xs font-medium text-slate-400">Skills</span>
</div>
<div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 self-center mx-2 mt-[-20px]"></div>
<div className="flex flex-col items-center gap-2">
<div className="size-8 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">4</div>
<span className="text-xs font-medium text-slate-400">Review</span>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

<div className="space-y-4">
<div className="flex items-center justify-between">
<h3 className="text-lg font-bold">Resume / CV</h3>
<button className="text-primary text-sm font-semibold hover:underline">Change File</button>
</div>
<div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-8 flex flex-col items-center justify-center text-center">
<div className="size-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-3xl">upload_file</span>
</div>
<p className="font-semibold text-slate-900 dark:text-white">{user?.name ? user.name.replace(' ', '_') + '_Resume.pdf' : 'Student_Resume.pdf'}</p>
<p className="text-xs text-slate-500 mt-1">Uploaded 2 mins ago • 1.2 MB</p>
<div className="mt-6 flex gap-2">
<button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded hover:bg-slate-200 transition-colors">Preview File</button>
<button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition-colors">Remove</button>
</div>
</div>

<div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 h-64 overflow-hidden relative border border-slate-200 dark:border-slate-700">
<div className="absolute inset-x-0 top-0 h-10 bg-slate-200 dark:bg-slate-700 flex items-center px-4 justify-between">
<span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Document Preview</span>
<span className="material-symbols-outlined text-xs">fullscreen</span>
</div>
<div className="mt-8 space-y-4 pt-4">
<div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
<div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
<div className="grid grid-cols-3 gap-2">
<div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
<div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
<div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
</div>
<div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
<div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
</div>
</div>
</div>

<div className="space-y-4">
<div className="flex items-center justify-between">
<h3 className="text-lg font-bold">Cover Letter</h3>
<span className="text-xs text-slate-400">Optional but recommended</span>
</div>
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col h-full min-h-[480px]">
<div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex gap-1">
<button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined text-sm">format_bold</span></button>
<button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined text-sm">format_italic</span></button>
<button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><span className="material-symbols-outlined text-sm">format_list_bulleted</span></button>
<button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded ml-auto"><span className="material-symbols-outlined text-sm">link</span></button>
</div>
<textarea className="flex-1 w-full p-6 bg-transparent border-none focus:ring-0 text-sm leading-relaxed resize-none" placeholder="Explain why you are the best fit for the Summer 2024 Software Engineering Intern role..."></textarea>
<div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
<span className="text-xs text-slate-500">0 / 2,000 characters</span>
<button className="text-xs text-primary font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-xs">auto_fix</span>
                                    AI Assist
                                </button>
</div>
</div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 mb-12 shadow-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h3 className="text-xl font-bold">Technical Skills Confirmation</h3>
<p className="text-sm text-slate-500 mt-1">Please confirm your proficiency level in the required stack for this role.</p>
</div>
<button className="text-sm font-semibold text-primary px-4 py-2 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors">Add Other Skills</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-3 mb-4">
<div className="size-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center font-bold text-xs uppercase">TS</div>
<span className="font-bold">TypeScript &amp; JavaScript</span>
<span className="material-symbols-outlined text-green-500 text-lg ml-auto">verified</span>
</div>
<div className="flex gap-2">
<label className="flex-1">
<input className="peer hidden" name="ts-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Beginner</div>
</label>
<label className="flex-1">
<input checked="" className="peer hidden" name="ts-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Intermediate</div>
</label>
<label className="flex-1">
<input className="peer hidden" name="ts-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Expert</div>
</label>
</div>
</div>

<div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-3 mb-4">
<div className="size-8 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded flex items-center justify-center font-bold text-xs uppercase">RT</div>
<span className="font-bold">React &amp; Next.js</span>
</div>
<div className="flex gap-2">
<label className="flex-1">
<input className="peer hidden" name="react-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Beginner</div>
</label>
<label className="flex-1">
<input className="peer hidden" name="react-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Intermediate</div>
</label>
<label className="flex-1">
<input checked="" className="peer hidden" name="react-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Expert</div>
</label>
</div>
</div>

<div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-3 mb-4">
<div className="size-8 bg-green-100 dark:bg-green-900/30 text-green-600 rounded flex items-center justify-center font-bold text-xs uppercase">DB</div>
<span className="font-bold">PostgreSQL / SQL</span>
</div>
<div className="flex gap-2">
<label className="flex-1">
<input className="peer hidden" name="db-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Beginner</div>
</label>
<label className="flex-1">
<input checked="" className="peer hidden" name="db-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Intermediate</div>
</label>
<label className="flex-1">
<input className="peer hidden" name="db-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Expert</div>
</label>
</div>
</div>

<div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-3 mb-4">
<div className="size-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded flex items-center justify-center font-bold text-xs uppercase">PY</div>
<span className="font-bold">Python &amp; Flask</span>
</div>
<div className="flex gap-2">
<label className="flex-1">
<input checked="" className="peer hidden" name="py-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Beginner</div>
</label>
<label className="flex-1">
<input className="peer hidden" name="py-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Intermediate</div>
</label>
<label className="flex-1">
<input className="peer hidden" name="py-skill" type="radio"/>
<div className="text-center py-2 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">Expert</div>
</label>
</div>
</div>
</div>
</div>

<div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white">
<div className="flex items-center gap-4 mb-4 sm:mb-0">
<div className="size-10 bg-white/10 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-primary">info</span>
</div>
<p className="text-sm">Almost there! Your progress is saved automatically.</p>
</div>
<div className="flex gap-3 w-full sm:w-auto">
<button className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-all">Back</button>
<button className="flex-1 sm:flex-none px-10 py-2.5 text-sm font-bold bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/30 transition-all">Next: Skills Matrix</button>
</div>
</div>
</div>

<footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
<p>© 2024 InternHub Recruitment Platform. All rights reserved.</p>
<div className="flex gap-6 mt-4 md:mt-0 font-medium">
<Link className="hover:text-primary" to="#">Privacy Policy</Link>
<Link className="hover:text-primary" to="#">Terms of Service</Link>
<Link className="hover:text-primary" to="#">Accessibility</Link>
</div>
</footer>
</main>
</div>

    </>
  );
}

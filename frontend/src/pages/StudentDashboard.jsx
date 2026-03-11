import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  return (
    <>
      
<div className="flex h-screen overflow-hidden">

<aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full shrink-0">
<div className="p-6 flex items-center gap-3">
<div className="bg-primary rounded-lg p-2 text-white">
<span className="material-symbols-outlined">rocket_launch</span>
</div>
<h1 className="text-xl font-bold tracking-tight">InternHub</h1>
</div>
<nav className="flex-1 px-4 space-y-2 mt-4">
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold" to="/student_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/student_profile_page">
<span className="material-symbols-outlined">person</span>
<span>Profile</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span>Internships</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span>Applications</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="#">
<span className="material-symbols-outlined">mail</span>
<span>Messages</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="#">
<span className="material-symbols-outlined">quiz</span>
<span>Assessments</span>
</Link>
</nav>
<div className="p-4 mt-auto">
<div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
<p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Pro Member</p>
<p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Access premium listings and AI resume builder.</p>
<button className="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all">
                        Upgrade Plan
                    </button>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col overflow-y-auto">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
<div className="flex items-center gap-4 w-96">
<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary" placeholder="Search internships, companies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
</button>
<button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-2"></div>
<div className="flex items-center gap-3">
<div className="text-right hidden sm:block">
<p className="text-sm font-bold">Alex Johnson</p>
<p className="text-xs text-slate-500">CS Senior</p>
</div>
<div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Student profile photo with professional smile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOqx7JtEjYScIfaCOZxuunqIbMLjDW6hIWLNr_8RtuWy9wjaZwAFPa2nMu1FxF4ukJkXkkGDlAyYn1YgIyIfVSrW8XtRwhCm1vtCLdj5JwXMM71krkK-o1CP3q9ilzvzszk6w_8GIs4koHdxxodrusShkIQx0mPfCFYBcWxyizq3yQsEW5PJ_is6PcwWZ9KI_4Ap-VD626WFkXTGap6EmqNUEbpTq2SUDOgKssylCf1xaHZUZTUu52FkSdYVzeQNVLbRwCmitQUQ"/>
</div>
</div>
</div>
</header>
<div className="p-8 max-w-7xl mx-auto w-full">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
<div>
<h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, Alex!</h2>
<p className="text-slate-500 dark:text-slate-400 mt-1">You have 3 new internship matches and 2 upcoming interviews.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm">
<span className="material-symbols-outlined text-lg">download</span>
                            Resume
                        </button>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25">
<span className="material-symbols-outlined text-lg">add</span>
                            New Application
                        </button>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
<div className="flex items-center justify-between mb-4">
<div>
<h3 className="font-bold text-lg">Profile Completion</h3>
<p className="text-sm text-slate-500">Reach 100% to boost visibility to recruiters by 3x.</p>
</div>
<span className="text-2xl font-black text-primary">75%</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full w-3/4"></div>
</div>
<div className="flex gap-4 mt-4">
<div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
<span className="material-symbols-outlined text-sm">check_circle</span>
                            Academic Info
                        </div>
<div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
<span className="material-symbols-outlined text-sm">check_circle</span>
                            Experience
                        </div>
<div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
<span className="material-symbols-outlined text-sm">add_circle</span>
                            Add Portfolio Link (+25%)
                        </div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
<p className="text-sm font-medium text-slate-500 mb-2">Applications</p>
<div className="flex items-end justify-between">
<p className="text-3xl font-black">12</p>
<span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">+20%</span>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
<p className="text-sm font-medium text-slate-500 mb-2">Interviews</p>
<div className="flex items-end justify-between">
<p className="text-3xl font-black">3</p>
<span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Stable</span>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
<p className="text-sm font-medium text-slate-500 mb-2">Profile Views</p>
<div className="flex items-end justify-between">
<p className="text-3xl font-black">48</p>
<span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">+15%</span>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10">
<span className="material-symbols-outlined text-5xl">verified</span>
</div>
<p className="text-sm font-medium text-slate-500 mb-2">Readiness Score</p>
<div className="flex items-end justify-between">
<p className="text-3xl font-black text-primary">88%</p>
<span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">+5%</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

<div className="lg:col-span-2 space-y-8">

<section>
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-bold">Recommended for you</h3>
<Link className="text-sm font-bold text-primary hover:underline" to="#">View all</Link>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">terminal</span>
</div>
<span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">95% Match</span>
</div>
<h4 className="font-bold text-lg leading-tight">Software Engineer Intern</h4>
<p className="text-sm text-slate-500 mb-4">TechFlow Systems • San Francisco (Remote)</p>
<div className="flex gap-2 flex-wrap mb-4">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">React</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">Node.js</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">Tailwind</span>
</div>
<div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
<span className="text-sm font-bold">$4,500/mo</span>
<button className="text-sm font-bold text-primary" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-4">
<div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
<span className="material-symbols-outlined text-primary">brush</span>
</div>
<span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">88% Match</span>
</div>
<h4 className="font-bold text-lg leading-tight">UI/UX Design Intern</h4>
<p className="text-sm text-slate-500 mb-4">Creative Minds Co. • New York City</p>
<div className="flex gap-2 flex-wrap mb-4">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">Figma</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">Design Systems</span>
</div>
<div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
<span className="text-sm font-bold">$3,800/mo</span>
<button className="text-sm font-bold text-primary" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>
</div>
</div>
</section>

<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
<h3 className="text-lg font-bold mb-6">Skill Match Distribution</h3>
<div className="space-y-6">
<div>
<div className="flex justify-between text-sm mb-2">
<span className="font-medium">Frontend Development</span>
<span className="text-primary font-bold">92%</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full w-[92%]"></div>
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-2">
<span className="font-medium">Backend (Node/Express)</span>
<span className="text-primary font-bold">78%</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full w-[78%] opacity-80"></div>
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-2">
<span className="font-medium">UI Design Principles</span>
<span className="text-primary font-bold">65%</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full w-[65%] opacity-60"></div>
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-2">
<span className="font-medium">DevOps &amp; Cloud</span>
<span className="text-primary font-bold">45%</span>
</div>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full w-[45%] opacity-40"></div>
</div>
</div>
</div>
</section>
</div>

<div className="space-y-8">

<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
<h3 className="text-lg font-bold mb-4">Upcoming Interviews</h3>
<div className="space-y-4">
<div className="flex gap-4 items-start">
<div className="flex flex-col items-center justify-center size-12 bg-primary/10 text-primary rounded-xl shrink-0">
<span className="text-[10px] font-black uppercase">Oct</span>
<span className="text-lg font-black leading-none">12</span>
</div>
<div>
<p className="font-bold text-sm">Google Technical Round</p>
<p className="text-xs text-slate-500">2:00 PM • Google Meet</p>
<Link className="text-[10px] font-bold text-primary mt-1 inline-block" to="#">Join Link</Link>
</div>
</div>
<div className="flex gap-4 items-start">
<div className="flex flex-col items-center justify-center size-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl shrink-0">
<span className="text-[10px] font-black uppercase">Oct</span>
<span className="text-lg font-black leading-none">15</span>
</div>
<div>
<p className="font-bold text-sm">Meta Design Review</p>
<p className="text-xs text-slate-500">10:30 AM • Zoom</p>
<Link className="text-[10px] font-bold text-slate-400 mt-1 inline-block" to="#">Preparation Notes</Link>
</div>
</div>
</div>
<button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                View Full Calendar
                            </button>
</section>

<section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
<h3 className="text-lg font-bold mb-4">Application Status</h3>
<div className="flex items-center justify-center py-6">

<div className="relative size-40 rounded-full border-[12px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
<div className="absolute inset-[-12px] rounded-full border-[12px] border-primary border-t-transparent border-l-transparent rotate-45"></div>
<div className="text-center">
<span className="block text-2xl font-black">12</span>
<span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-3">
<div className="flex items-center gap-2">
<div className="size-2 rounded-full bg-primary"></div>
<span className="text-xs text-slate-600 dark:text-slate-400">Applied (6)</span>
</div>
<div className="flex items-center gap-2">
<div className="size-2 rounded-full bg-yellow-400"></div>
<span className="text-xs text-slate-600 dark:text-slate-400">In Review (3)</span>
</div>
<div className="flex items-center gap-2">
<div className="size-2 rounded-full bg-green-500"></div>
<span className="text-xs text-slate-600 dark:text-slate-400">Accepted (1)</span>
</div>
<div className="flex items-center gap-2">
<div className="size-2 rounded-full bg-red-400"></div>
<span className="text-xs text-slate-600 dark:text-slate-400">Rejected (2)</span>
</div>
</div>
</section>

<section className="bg-primary rounded-xl p-6 text-white shadow-lg shadow-primary/20">
<h3 className="text-lg font-bold mb-4">Recommended Tasks</h3>
<ul className="space-y-4">
<li className="flex gap-3">
<div className="size-5 rounded bg-white/20 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-sm">check</span>
</div>
<p className="text-xs font-medium text-white/90">Update LinkedIn profile with new projects</p>
</li>
<li className="flex gap-3 opacity-60">
<div className="size-5 rounded bg-white/20 flex items-center justify-center shrink-0 border border-white/40">
</div>
<p className="text-xs font-medium text-white/90 line-through">Request recommendation from Prof. Smith</p>
</li>
<li className="flex gap-3">
<div className="size-5 rounded bg-white/20 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-sm">more_horiz</span>
</div>
<p className="text-xs font-medium text-white/90">Submit 2 more applications today</p>
</li>
</ul>
</section>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

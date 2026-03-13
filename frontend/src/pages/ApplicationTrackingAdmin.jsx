import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ApplicationTrackingAdmin() {
  const navigate = useNavigate();
  return (
    <>
      
<div className="flex h-screen overflow-hidden">

<aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-neutral-border dark:border-slate-800 flex flex-col">
<div className="p-6 flex items-center gap-3">
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
<span className="material-symbols-outlined">school</span>
</div>
<div>
<h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">InternHub</h1>
<p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Placement Admin</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-lg transition-colors" to="/student_management_admin">
<span className="material-symbols-outlined">group</span>
<span className="text-sm font-medium">Students</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-lg transition-colors" to="/company_management_admin">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="text-sm font-medium">Companies</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-lg transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span className="text-sm font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="text-sm font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_analytics_dashboard">
<span className="material-symbols-outlined">bar_chart</span>
<span className="text-sm font-medium">Analytics</span>
</Link>
<div className="pt-4 mt-4 border-t border-neutral-border dark:border-slate-800">
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-sm font-medium">Settings</span>
</Link>
</div>
</nav>
<div className="p-4 mt-auto">
<div className="bg-neutral-light dark:bg-slate-800 p-4 rounded-xl">
<p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">System Status</p>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
<span className="text-xs font-medium text-slate-700 dark:text-slate-300">Portals Live</span>
</div>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col overflow-hidden">

<header className="h-16 bg-white dark:bg-slate-900 border-b border-neutral-border dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-neutral-light dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm transition-all" placeholder="Search applications, students..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-neutral-light dark:hover:bg-slate-800 rounded-full transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-px bg-neutral-border dark:bg-slate-800 mx-2"></div>
<div className="flex items-center gap-3">
<div className="text-right hidden sm:block">
<p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Admin User</p>
<p className="text-xs text-slate-500 dark:text-slate-400">Coordinator</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border border-neutral-border dark:border-slate-600 bg-cover bg-center" data-alt="Admin user profile picture" style={{backgroundImage: 'url(\'https'}}></div>
</div>
</div>
</header>

<div className="flex-1 overflow-hidden flex flex-col">

<div className="p-8 pb-4 flex flex-col gap-6">
<div className="flex items-center justify-between">
<div>
<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Application Tracking</h2>
<p className="text-slate-500 dark:text-slate-400 mt-1">Manage student journey through the placement pipeline.</p>
</div>
<button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined">add</span>
                            New Placement Drive
                        </button>
</div>

<div className="flex flex-wrap items-center gap-3">
<div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-neutral-border dark:border-slate-800 rounded-lg cursor-pointer hover:border-primary transition-colors">
<span className="text-xs font-semibold text-slate-500">Company:</span>
<span className="text-sm font-medium">All Companies</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</div>
<div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-neutral-border dark:border-slate-800 rounded-lg cursor-pointer hover:border-primary transition-colors">
<span className="text-xs font-semibold text-slate-500">Department:</span>
<span className="text-sm font-medium">Computer Science</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</div>
<div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-neutral-border dark:border-slate-800 rounded-lg cursor-pointer hover:border-primary transition-colors">
<span className="text-xs font-semibold text-slate-500">Role:</span>
<span className="text-sm font-medium">Software Engineer</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</div>
<div className="ml-auto flex items-center gap-2">
<span className="text-sm text-slate-500 font-medium">Showing 199 Applications</span>
</div>
</div>
</div>

<div className="flex-1 overflow-x-auto p-8 pt-0 flex gap-6 custom-scrollbar">

<div className="kanban-column flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-2">
<h3 className="font-bold text-slate-900 dark:text-white">Applied</h3>
<span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-bold">124</span>
</div>
<button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
</div>
<div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">

<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 bg-cover bg-center" data-alt="Student avatar placeholder" style={{backgroundImage: 'url(\'https'}}></div>
<div className="overflow-hidden">
<h4 className="font-bold text-slate-900 dark:text-white truncate">Arjun Sharma</h4>
<p className="text-xs text-slate-500">Applied 2 days ago</p>
</div>
</div>
<div className="bg-neutral-light dark:bg-slate-800/50 p-2.5 rounded-lg mb-4">
<p className="text-xs font-bold text-primary mb-0.5">Google</p>
<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Associate Developer</p>
</div>
<div className="flex items-center justify-between gap-2">
<button className="flex-1 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-neutral-light dark:bg-slate-800 rounded-lg hover:bg-neutral-border dark:hover:bg-slate-700 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>Profile</button>
<button className="flex-1 py-1.5 text-xs font-bold text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                                        Shortlist <span className="material-symbols-outlined text-xs">arrow_forward</span>
</button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-neutral-border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-rose-100 flex-shrink-0 bg-cover bg-center" data-alt="Student avatar placeholder" style={{backgroundImage: 'url(\'https'}}></div>
<div className="overflow-hidden">
<h4 className="font-bold text-slate-900 dark:text-white truncate">Priya Patel</h4>
<p className="text-xs text-slate-500">Applied 4 days ago</p>
</div>
</div>
<div className="bg-neutral-light dark:bg-slate-800/50 p-2.5 rounded-lg mb-4">
<p className="text-xs font-bold text-primary mb-0.5">Microsoft</p>
<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Manager Intern</p>
</div>
<div className="flex items-center justify-between gap-2">
<button className="flex-1 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-neutral-light dark:bg-slate-800 rounded-lg hover:bg-neutral-border dark:hover:bg-slate-700 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>Profile</button>
<button className="flex-1 py-1.5 text-xs font-bold text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                                        Shortlist <span className="material-symbols-outlined text-xs">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>

<div className="kanban-column flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-2">
<h3 className="font-bold text-slate-900 dark:text-white">Shortlisted</h3>
<span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-bold">45</span>
</div>
<button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
</div>
<div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 border-l-indigo-500 border border-neutral-border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 bg-cover bg-center" data-alt="Student avatar placeholder" style={{backgroundImage: 'url(\'https'}}></div>
<div className="overflow-hidden">
<h4 className="font-bold text-slate-900 dark:text-white truncate">Rohan Das</h4>
<p className="text-xs text-slate-500">Shortlisted 1 day ago</p>
</div>
</div>
<div className="bg-indigo-50 dark:bg-indigo-900/10 p-2.5 rounded-lg mb-4">
<p className="text-xs font-bold text-indigo-600 mb-0.5">Amazon</p>
<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">SDE Intern</p>
</div>
<div className="flex items-center justify-between gap-2">
<button className="flex-1 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-neutral-light dark:bg-slate-800 rounded-lg hover:bg-neutral-border dark:hover:bg-slate-700 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>Profile</button>
<button className="flex-1 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
                                        Interview <span className="material-symbols-outlined text-xs">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>

<div className="kanban-column flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-2">
<h3 className="font-bold text-slate-900 dark:text-white">Interview</h3>
<span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">18</span>
</div>
<button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
</div>
<div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 border-l-amber-500 border border-neutral-border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0 bg-cover bg-center" data-alt="Student avatar placeholder" style={{backgroundImage: 'url(\'https'}}></div>
<div className="overflow-hidden">
<h4 className="font-bold text-slate-900 dark:text-white truncate">Ananya Iyer</h4>
<p className="text-xs text-amber-600 font-semibold">Today @ 3:00 PM</p>
</div>
</div>
<div className="bg-amber-50 dark:bg-amber-900/10 p-2.5 rounded-lg mb-4">
<p className="text-xs font-bold text-amber-600 mb-0.5">Adobe</p>
<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">UI/UX Designer</p>
</div>
<div className="flex items-center justify-between gap-2">
<button className="flex-1 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-neutral-light dark:bg-slate-800 rounded-lg hover:bg-neutral-border dark:hover:bg-slate-700 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/internship_details_page'); }}>Details</button>
<button className="flex-1 py-1.5 text-xs font-bold text-white bg-amber-600 rounded-lg shadow-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-1">
                                        Selected <span className="material-symbols-outlined text-xs">check_circle</span>
</button>
</div>
</div>
</div>
</div>

<div className="kanban-column flex flex-col gap-4">
<div className="flex items-center justify-between px-1">
<div className="flex items-center gap-2">
<h3 className="font-bold text-slate-900 dark:text-white">Selected</h3>
<span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">12</span>
</div>
<button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
</div>
<div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 border-l-emerald-500 border border-neutral-border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-purple-100 flex-shrink-0 bg-cover bg-center" data-alt="Student avatar placeholder" style={{backgroundImage: 'url(\'https'}}></div>
<div className="overflow-hidden">
<h4 className="font-bold text-slate-900 dark:text-white truncate">Karthik R.</h4>
<p className="text-xs text-emerald-600 font-semibold">Offer Accepted</p>
</div>
</div>
<div className="bg-emerald-50 dark:bg-emerald-900/10 p-2.5 rounded-lg mb-4">
<p className="text-xs font-bold text-emerald-600 mb-0.5">Flipkart</p>
<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data Analyst</p>
</div>
<div className="flex items-center justify-between gap-2">
<button className="w-full py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-neutral-light dark:bg-slate-800 rounded-lg hover:bg-neutral-border dark:hover:bg-slate-700 transition-colors">View Offer Letter</button>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 border-l-emerald-500 border border-neutral-border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full bg-orange-100 flex-shrink-0 bg-cover bg-center" data-alt="Student avatar placeholder" style={{backgroundImage: 'url(\'https'}}></div>
<div className="overflow-hidden">
<h4 className="font-bold text-slate-900 dark:text-white truncate">Sneha Kapoor</h4>
<p className="text-xs text-emerald-600 font-semibold">Offer Sent</p>
</div>
</div>
<div className="bg-emerald-50 dark:bg-emerald-900/10 p-2.5 rounded-lg mb-4">
<p className="text-xs font-bold text-emerald-600 mb-0.5">Goldman Sachs</p>
<p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analyst Intern</p>
</div>
<div className="flex items-center justify-between gap-2">
<button className="w-full py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-neutral-light dark:bg-slate-800 rounded-lg hover:bg-neutral-border dark:hover:bg-slate-700 transition-colors">Track Acceptance</button>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

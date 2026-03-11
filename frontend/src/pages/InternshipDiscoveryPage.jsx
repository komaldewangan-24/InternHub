import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function InternshipDiscoveryPage() {
  const navigate = useNavigate();
  return (
    <>
      
<div className="flex min-h-screen">

<aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col sticky top-0 h-screen">
<div className="p-6 flex items-center gap-3">
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
<span className="material-symbols-outlined">layers</span>
</div>
<div>
<h1 className="font-bold text-lg leading-none">InternHub</h1>
<p className="text-xs text-slate-500 font-medium">Student Dashboard</p>
</div>
</div>
<nav className="flex-1 px-4 py-4 space-y-1">
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/student_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/student_profile_page">
<span className="material-symbols-outlined">person</span>
<span className="text-sm font-medium">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span className="text-sm font-semibold">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="text-sm font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" to="#">
<span className="material-symbols-outlined">chat</span>
<span className="text-sm font-medium">Messages</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-8" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-sm font-medium">Settings</span>
</Link>
</nav>
<div className="p-4 border-t border-slate-200 dark:border-slate-800">
<div className="bg-primary/5 rounded-xl p-4">
<p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Pro Plan</p>
<p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Get 2x more internship matches daily.</p>
<button className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg">Upgrade Now</button>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col overflow-y-auto">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
<div className="flex-1 max-w-xl">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input className="w-full pl-11 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm transition-all" placeholder="Search for roles, companies, or skills..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6 pl-8">
<button className="relative text-slate-500 hover:text-primary transition-colors">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
</button>
<div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
<div className="text-right">
<p className="text-sm font-semibold leading-none">Alex Chen</p>
<p className="text-xs text-slate-500">Computer Science Student</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-200" data-alt="Alex Chen user profile avatar" style={{backgroundImage: 'url(\'https'}}></div>
</div>
</div>
</header>
<div className="p-8">

<div className="flex items-center justify-between mb-8">
<div>
<h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Explore Internships</h2>
<p className="text-slate-500 mt-1">Found 124 internships matching your profile.</p>
</div>
<button className="px-5 py-2.5 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors">
<span className="material-symbols-outlined text-lg">add_circle</span>
                        Post a Project
                    </button>
</div>

<div className="flex flex-wrap gap-4 mb-8">
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Skills: <span className="text-primary">React, Python</span> <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Location: <span className="text-primary">Remote</span> <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Stipend: <span className="text-primary">$4k+</span> <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Duration <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Department <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<div className="h-9 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
<button className="flex items-center gap-2 px-4 py-2 text-primary font-bold text-sm">
                        Clear Filters
                    </button>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
<div className="w-full h-full bg-primary/20 rounded-md" data-alt="TechFlow Systems company logo gradient"></div>
</div>
<span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-wider">New</span>
</div>
<h3 className="text-lg font-bold leading-tight mb-1">Software Engineer Intern</h3>
<p className="text-slate-500 text-sm font-medium mb-4">TechFlow Systems</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">location_on</span>
<span>San Francisco (Hybrid)</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">payments</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">$4,500/mo</span>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">React</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Node.js</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">TypeScript</span>
</div>
<button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
<div className="w-full h-full bg-blue-400/20 rounded-md" data-alt="CloudStream logo abstract gradient"></div>
</div>
</div>
<h3 className="text-lg font-bold leading-tight mb-1">Frontend Developer Intern</h3>
<p className="text-slate-500 text-sm font-medium mb-4">CloudStream</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">public</span>
<span>Remote</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">payments</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">$3,800/mo</span>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">React</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Tailwind</span>
</div>
<button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
<div className="w-full h-full bg-indigo-500/20 rounded-md" data-alt="DataScale logo abstract gradient"></div>
</div>
</div>
<h3 className="text-lg font-bold leading-tight mb-1">Data Analyst Intern</h3>
<p className="text-slate-500 text-sm font-medium mb-4">DataScale Inc.</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">location_on</span>
<span>New York, NY</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">payments</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">$5,200/mo</span>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Python</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">SQL</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Pandas</span>
</div>
<button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
<div className="w-full h-full bg-cyan-500/20 rounded-md" data-alt="CyberPulse logo abstract gradient"></div>
</div>
</div>
<h3 className="text-lg font-bold leading-tight mb-1">UI/UX Design Intern</h3>
<p className="text-slate-500 text-sm font-medium mb-4">CyberPulse</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">public</span>
<span>Remote</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">payments</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">$3,500/mo</span>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Figma</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Adobe XD</span>
</div>
<button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
<div className="w-full h-full bg-orange-500/20 rounded-md" data-alt="SwiftPay logo abstract gradient"></div>
</div>
</div>
<h3 className="text-lg font-bold leading-tight mb-1">Backend Engineer Intern</h3>
<p className="text-slate-500 text-sm font-medium mb-4">SwiftPay</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">location_on</span>
<span>Austin, TX</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">payments</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">$4,200/mo</span>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Go</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">PostgreSQL</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Docker</span>
</div>
<button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
<div className="w-full h-full bg-emerald-500/20 rounded-md" data-alt="GreenLogic logo abstract gradient"></div>
</div>
</div>
<h3 className="text-lg font-bold leading-tight mb-1">Product Management Intern</h3>
<p className="text-slate-500 text-sm font-medium mb-4">GreenLogic</p>
<div className="space-y-3 mb-6">
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">location_on</span>
<span>Seattle, WA</span>
</div>
<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
<span className="material-symbols-outlined text-lg opacity-70">payments</span>
<span className="font-semibold text-slate-900 dark:text-slate-100">$4,000/mo</span>
</div>
</div>
<div className="flex flex-wrap gap-2 mb-6">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Analytics</span>
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md">Communication</span>
</div>
<button className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>Apply Now</button>
</div>
</div>

<div className="mt-12 flex items-center justify-center gap-2">
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">3</button>
<span className="px-2 text-slate-400">...</span>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">12</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</main>
</div>

    </>
  );
}

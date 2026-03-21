import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
<header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
<nav className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-xl px-8 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(36,99,235,0.08)] transition-all duration-300">
<Link to="/" className="flex items-center gap-2 group">
<div className="bg-primary rounded-xl p-1.5 transition-transform group-hover:rotate-12">
<span className="material-symbols-outlined text-white text-2xl font-bold block">layers</span>
</div>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-black tracking-tighter">Intern<span className="text-primary">Hub</span></h2>
</Link>

<div className="hidden lg:flex items-center gap-1">
<Link to="/about_page" className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">About Us</Link>
<button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">Features</button>
<button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">How it works</button>
<button onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">Placements</button>
</div>

<div className="flex items-center gap-3">
<button className="hidden sm:block px-6 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" onClick={() => navigate('/login_page')}>
Login
</button>
<button className="bg-primary text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" onClick={() => navigate('/register_page')}>
Register
</button>
</div>
</nav>
</header>
<main className="flex-1 pt-32 md:pt-40">
<section className="max-w-7xl mx-auto px-6 py-12">
<div className="flex flex-col gap-12 lg:flex-row items-center">
<div className="flex flex-col gap-8 lg:w-1/2">
<div className="flex flex-col gap-4">
<span className="text-primary font-semibold tracking-wider uppercase text-sm">Empowering Education &amp; Industry</span>
<h1 className="text-slate-900 dark:text-slate-100 text-5xl md:text-6xl font-black leading-tight tracking-tight">
                                    Internship &amp; <span className="text-primary">Placement</span> Portal
                                </h1>
<p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed">
                                    A seamless recruitment experience for students and companies. Manage applications, track progress, and secure futures in one place.
                                </p>
</div>
<div className="flex flex-wrap gap-4">
<button className="flex h-12 px-8 cursor-pointer items-center justify-center rounded-xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all" onClick={(e) => { e.preventDefault(); navigate('/register_page'); }}>
                                    Get Started
                                </button>
<button className="flex h-12 px-8 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 font-bold text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                    Watch Demo
                                </button>
</div>
</div>
<div className="lg:w-1/2 w-full">
<div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden border border-primary/10 shadow-2xl group">
<img 
  src="/internship_job_illustration.png" 
  alt="Career Bridge Navigation" 
  className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700"
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
<div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
</div>
</div>
</div>
</section>
<section className="bg-white dark:bg-slate-900/50 py-24" id="features">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-16 space-y-4">
<h2 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold tracking-tight">Streamlined Solutions</h2>
<p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to manage modern placement cells and student recruitment workflows.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="flex flex-col gap-4 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all group">
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
<span className="material-symbols-outlined">group</span>
</div>
<h3 className="text-xl font-bold">Student Management</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">Centralized profiles, automated resume verification, and real-time application tracking for every student.</p>
</div>
<div className="flex flex-col gap-4 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all group">
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
<span className="material-symbols-outlined">corporate_fare</span>
</div>
<h3 className="text-xl font-bold">Company Portal</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dedicated dashboards for recruiters to post jobs, shortlist candidates, and schedule interview rounds.</p>
</div>
<div className="flex flex-col gap-4 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:border-primary/50 transition-all group">
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
<span className="material-symbols-outlined">monitoring</span>
</div>
<h3 className="text-xl font-bold">Real-time Analytics</h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">Comprehensive data visualization on placement trends, CTC averages, and department performance.</p>
</div>
</div>
</div>
</section>
<section className="py-24 max-w-5xl mx-auto px-6" id="how-it-works">
<div className="text-center mb-16">
<h2 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
</div>
<div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
<div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 text-slate-500 group-[.is-active]:bg-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
<span className="material-symbols-outlined text-sm">person_add</span>
</div>
<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
<div className="flex items-center justify-between space-x-2 mb-1">
<div className="font-bold text-slate-900 dark:text-slate-100">Create Profile</div>
</div>
<div className="text-slate-500">Students and recruiters sign up and verify their institutional credentials.</div>
</div>
</div>
<div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 text-slate-500 group-[.is-active]:bg-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
<span className="material-symbols-outlined text-sm">work</span>
</div>
<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
<div className="flex items-center justify-between space-x-2 mb-1">
<div className="font-bold text-slate-900 dark:text-slate-100">Apply for Roles</div>
</div>
<div className="text-slate-500">Browse thousands of verified listings and apply with a single click.</div>
</div>
</div>
<div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 text-slate-500 group-[.is-active]:bg-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
<span className="material-symbols-outlined text-sm">check_circle</span>
</div>
<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
<div className="flex items-center justify-between space-x-2 mb-1">
<div className="font-bold text-slate-900 dark:text-slate-100">Get Placed</div>
</div>
<div className="text-slate-500">Complete interviews, receive offers, and launch your professional career.</div>
</div>
</div>
</div>
</section>
<section className="bg-primary py-16" id="stats">
<div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
<div className="space-y-2">
<div className="text-4xl md:text-5xl font-black">15k+</div>
<div className="text-primary-100 font-medium opacity-80">Students Placed</div>
</div>
<div className="space-y-2">
<div className="text-4xl md:text-5xl font-black">450+</div>
<div className="text-primary-100 font-medium opacity-80">Indian MNCs & Startups</div>
</div>
<div className="space-y-2">
<div className="text-4xl md:text-5xl font-black">92%</div>
<div className="text-primary-100 font-medium opacity-80">Success Rate</div>
</div>
<div className="space-y-2">
<div className="text-4xl md:text-5xl font-black">₹45LPA</div>
<div className="text-primary-100 font-medium opacity-80">Highest Package</div>
</div>
</div>
</section>
<section className="py-24 max-w-4xl mx-auto px-6 text-center">
<div className="bg-background-light dark:bg-slate-900/40 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
<h2 className="text-3xl font-bold mb-6">Ready to transform your placement cell?</h2>
<p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">Join hundreds of institutions using InternHub to automate their recruitment processes.</p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button className="bg-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/40 transition-all">Start Free Trial</button>
<button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Contact Sales</button>
</div>
</div>
</section>
</main>
<footer className="bg-slate-50 dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-16">
<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
<div className="col-span-1 md:col-span-1 space-y-6">
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-2xl font-bold">layers</span>
<h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">InternHub</h2>
</div>
<p className="text-slate-500 text-sm leading-relaxed">
                            The comprehensive platform for managing end-to-end recruitment cycles in academic institutions and corporations.
                        </p>
</div>
<div>
<h4 className="font-bold mb-6">Platform</h4>
<ul className="space-y-4 text-sm text-slate-500">
<li><Link className="hover:text-primary" to="#">For Universities</Link></li>
<li><Link className="hover:text-primary" to="/student_management_admin">For Students</Link></li>
<li><Link className="hover:text-primary" to="#">For Recruiters</Link></li>
<li><Link className="hover:text-primary" to="#">Job Board</Link></li>
</ul>
</div>
<div>
<h4 className="font-bold mb-6">Company</h4>
<ul className="space-y-4 text-sm text-slate-500">
<li><Link className="hover:text-primary" to="#">About Us</Link></li>
<li><Link className="hover:text-primary" to="#">Success Stories</Link></li>
<li><Link className="hover:text-primary" to="#">Careers</Link></li>
<li><Link className="hover:text-primary" to="#">Contact</Link></li>
</ul>
</div>
<div>
<h4 className="font-bold mb-6">Support</h4>
<ul className="space-y-4 text-sm text-slate-500">
<li><Link className="hover:text-primary" to="#">Help Center</Link></li>
<li><Link className="hover:text-primary" to="#">Privacy Policy</Link></li>
<li><Link className="hover:text-primary" to="#">Terms of Service</Link></li>
<li><Link className="hover:text-primary" to="#">Cookie Settings</Link></li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                    © 2024 InternHub. All rights reserved. Built with precision for the next generation of talent.
                </div>
</footer>
</div>
</div>

    </>
  );
}

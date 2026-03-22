import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="group cursor-pointer">
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">InternHub</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium group-hover:text-primary transition-colors">Unified Internship Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex size-10 items-center justify-center rounded-xl bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 transition-all shadow-sm"
              title="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <Link className="rounded-full px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors" to="/about">
              About
            </Link>
            <Link className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors" to="/login">
              Log In
            </Link>
            <Link className="rounded-full bg-primary px-5 py-2 text-sm font-bold shadow-lg shadow-primary/30 text-white" to="/register">
              Student Join
            </Link>
          </div>
        </header>

        <section className="grid gap-12 py-24 lg:grid-cols-[1.3fr,0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Global Role Access</p>
            <h1 className="mt-6 text-5xl font-black tracking-tight lg:text-7xl text-slate-900 dark:text-white">
              One platform. <br/><span className="text-primary/90">Four key roles.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A comprehensive workflow for Students, Faculty, Recruiters, and Placement Cells. 
              <span className="block mt-2 font-semibold text-slate-800 dark:text-slate-100 italic">Students can self-register; all other roles are managed by the administration.</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="rounded-2xl bg-primary px-7 py-4 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-white" to="/register">
                Register as Student
              </Link>
              <Link className="rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 px-7 py-4 text-sm font-bold text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors" to="/login">
                Access Workspace
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ['Students', 'Build profiles, submit projects, track reviews, apply to internships.'],
              ['Faculty', 'Comment, request resubmission, and approve student work.'],
              ['Recruiters', 'Post internships, review applicants, and see approved portfolios only.'],
              ['Placement Cell', 'Manage companies, internships, applications, and analytics.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur shadow-sm dark:shadow-none hover:border-primary/50 transition-colors">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

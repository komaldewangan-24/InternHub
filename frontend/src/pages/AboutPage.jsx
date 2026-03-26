import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#003366] transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <button onClick={() => navigate('/')} className="mb-12 flex items-center gap-2 text-primary font-poppins font-bold hover:gap-3 transition-all">
          <span className="material-symbols-outlined shrink-0">arrow_back</span>
          Return to Portal
        </button>

        <p className="text-sm font-poppins font-bold uppercase tracking-[0.24em] text-primary">Operating Philosophy</p>
        <h1 className="mt-6 text-5xl font-poppins font-bold tracking-tight dark:text-white lg:text-6xl uppercase">About InternHub</h1>
        <p className="mt-8 max-w-4xl text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-roboto font-normal">
          InternHub is a high-fidelity, four-role internship and placement ecosystem designed for modern institutions. 
          We bridge the gap between academic progress and professional placement through rigorous project verification and role-specific collaboration.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="rounded-sm bg-white dark:bg-[#003366]/50 p-10 shadow-xl dark:shadow-none border border-slate-200 dark:border-white/5 transition-all hover:border-primary/20">
            <div className="flex size-14 items-center justify-center rounded-sm bg-primary/10 text-primary mb-8">
              <span className="material-symbols-outlined text-[32px]">hub</span>
            </div>
            <h2 className="text-2xl font-poppins font-bold tracking-tight dark:text-white">The Unified Structure</h2>
            <ul className="mt-6 space-y-4 text-slate-500 dark:text-slate-400 font-medium">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>Students do not ship blind. Every project is reviewed by faculty before recruiter visibility.</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>Real-time feedback loops integrate professional standards into the academic workflow.</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>Recruiters access a curated pool of verified talent rather than unvetted applications.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-sm bg-white dark:bg-slate-900 p-10 shadow-xl dark:shadow-none border border-slate-200 dark:border-white/5 transition-all hover:border-primary/20">
            <div className="flex size-14 items-center justify-center rounded-sm bg-emerald-500/10 text-emerald-500 mb-8">
              <span className="material-symbols-outlined text-[32px]">analytics</span>
            </div>
            <h2 className="text-2xl font-poppins font-bold tracking-tight dark:text-white">System Outcomes</h2>
            <ul className="mt-6 space-y-4 text-slate-500 dark:text-slate-400 font-medium">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">insights</span>
                <span>Merit-based placement tracking through verifiable project checkpoints.</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">insights</span>
                <span>Comprehensive analytics for placement cells to monitor institutional performance.</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">insights</span>
                <span>Role-aware communication channels that maintain academic integrity.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-sm bg-primary p-12 text-center text-white shadow-2xl shadow-primary/30">
          <h2 className="text-3xl font-poppins font-bold tracking-tight text-white">Ready to transform your campus?</h2>
          <p className="mt-4 text-primary-foreground/80 font-poppins font-bold uppercase tracking-widest text-sm">Join hundred of students in the unified portal today.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/register')} className="rounded-sm bg-white px-8 py-4 text-sm font-poppins font-medium text-primary transition-all hover:scale-105 active:scale-95 shadow-lg uppercase tracking-widest">Create Student Profile</button>
            <button onClick={() => navigate('/login')} className="rounded-sm bg-primary-foreground/10 px-8 py-4 text-sm font-poppins font-medium text-white border border-white/20 transition-all hover:bg-white/10 active:scale-95 uppercase tracking-widest">Internal Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

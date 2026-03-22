import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black tracking-tight">InternHub</p>
            <p className="text-sm text-slate-400">Students, faculty, recruiters, placement cell</p>
          </div>
          <div className="flex gap-3">
            <Link className="rounded-full px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10" to="/about">
              About
            </Link>
            <Link className="rounded-full px-5 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10" to="/login">
              Login
            </Link>
            <Link className="rounded-full bg-primary px-5 py-2 text-sm font-bold" to="/register">
              Student Sign Up
            </Link>
          </div>
        </header>

        <section className="grid gap-12 py-24 lg:grid-cols-[1.3fr,0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">4-role internship workflow</p>
            <h1 className="mt-6 text-5xl font-black tracking-tight lg:text-7xl">
              One platform for project review, internship hiring, and placement operations.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Students submit projects to faculty, faculty review and approve them, recruiters discover approved talent, and placement cell monitors the whole pipeline.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="rounded-2xl bg-primary px-6 py-4 text-sm font-bold shadow-lg shadow-primary/20" to="/register">
                Create Student Account
              </Link>
              <Link className="rounded-2xl border border-white/15 px-6 py-4 text-sm font-bold text-slate-100" to="/login">
                Open Workspace
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
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-lg font-bold">{title}</p>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

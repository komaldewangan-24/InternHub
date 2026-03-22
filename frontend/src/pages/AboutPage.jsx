import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-black tracking-tight">About InternHub</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          InternHub is a four-role internship and placement workflow for institutions that need student project review, faculty feedback loops, recruiter collaboration, and placement cell oversight in one product.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold">Why this structure works</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Students do not ship blind. Their work is reviewed before it is externally visible.</li>
              <li>Faculty feedback becomes part of the placement-readiness workflow.</li>
              <li>Recruiters see cleaner, approved student material instead of incomplete drafts.</li>
              <li>Placement cell keeps oversight without replacing academic review.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold">Core outcomes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Clear approval workflow for student projects.</li>
              <li>Shared but role-aware messaging and visibility.</li>
              <li>Recruiter-side hiring tools connected to real student data.</li>
              <li>Placement analytics across users, internships, projects, and applications.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

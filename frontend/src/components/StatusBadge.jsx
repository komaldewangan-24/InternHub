import React from 'react';

const classMap = {
  draft: 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10',
  submitted: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  needs_resubmission: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-500/20',
  approved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  shortlisted: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  interview: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-500/20',
  selected: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-500/20',
  open: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  closed: 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10',
  commented: 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10',
  pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-500/20',
  verified: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  flagged: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export default function StatusBadge({ status }) {
  const normalized = String(status || 'draft').toLowerCase();
  
  const isEmerald = ['approved', 'selected', 'open', 'verified'].includes(normalized);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[8px] font-bold font-poppins uppercase tracking-widest ${classMap[normalized] || classMap.draft}`}>
      {isEmerald && <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
      {normalized.replaceAll('_', ' ')}
    </span>
  );
}

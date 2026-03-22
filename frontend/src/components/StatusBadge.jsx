import React from 'react';

const classMap = {
  draft: 'bg-slate-200 text-slate-700',
  submitted: 'bg-blue-100 text-blue-700',
  needs_resubmission: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  shortlisted: 'bg-blue-100 text-blue-700',
  interview: 'bg-amber-100 text-amber-700',
  selected: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  open: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-200 text-slate-700',
  commented: 'bg-slate-200 text-slate-700',
  pending: 'bg-amber-100 text-amber-700',
  verified: 'bg-emerald-100 text-emerald-700',
  flagged: 'bg-rose-100 text-rose-700',
};

const labelMap = {
  needs_resubmission: 'Needs Resubmission',
};

export default function StatusBadge({ status }) {
  const normalized = String(status || 'draft').toLowerCase();
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classMap[normalized] || classMap.draft}`}>
      {labelMap[normalized] || normalized.replaceAll('_', ' ')}
    </span>
  );
}

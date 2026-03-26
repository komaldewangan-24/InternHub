import React from 'react';

export default function EmptyState({ title, description, icon = 'inbox_customize' }) {
  return (
    <div className="rounded-sm border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-12 text-center transition-all hover:border-primary/20">
      <div className="mx-auto flex size-14 items-center justify-center rounded-sm bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/5 mb-6">
        <span className="material-symbols-outlined text-[28px] text-slate-300 dark:text-slate-600">{icon}</span>
      </div>
      <h3 className="text-xl font-bold dark:text-white leading-tight">{title}</h3>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

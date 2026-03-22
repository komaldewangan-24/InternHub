import React from 'react';

export default function LoadingState({ label = 'Preparing your experience...' }) {
  return (
    <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-16 text-center shadow-lg shadow-black/5 flex flex-col items-center">
      <div className="relative">
        <div className="size-16 animate-spin rounded-full border-[3px] border-primary/10 border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
      <p className="mt-8 text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 animate-pulse">{label}</p>
    </div>
  );
}

import React from 'react';

export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

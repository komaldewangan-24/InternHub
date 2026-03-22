import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { settingsAPI } from '../services/api';

const blankRubric = { key: '', label: '', description: '', maxScore: 5 };

export default function AdminSettingsPage() {
  const { user, loading } = useCurrentUser();
  const [settings, setSettings] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setPageLoading(true);
        const { data } = await settingsAPI.get();
        setSettings(data.data);
      } finally {
        setPageLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateField = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const updateRubric = (index, key, value) => {
    setSettings((current) => ({
      ...current,
      reviewRubric: current.reviewRubric.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addRubricItem = () => {
    setSettings((current) => ({
      ...current,
      reviewRubric: [...(current.reviewRubric || []), { ...blankRubric, key: `criterion_${(current.reviewRubric || []).length + 1}` }]
    }));
  };

  const removeRubricItem = (index) => {
    setSettings((current) => ({
      ...current,
      reviewRubric: current.reviewRubric.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...settings,
        departments: Array.isArray(settings.departments) ? settings.departments : String(settings.departments || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        batches: Array.isArray(settings.batches) ? settings.batches : String(settings.batches || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        placementCategories: Array.isArray(settings.placementCategories) ? settings.placementCategories : String(settings.placementCategories || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const { data } = await settingsAPI.update(payload);
      setSettings(data.data);
      toast.success('Configuration synchronized');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Synchronization failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || pageLoading || !settings) {
    return <LoadingState label="Hydrating system parameters..." />;
  }

  return (
    <AppShell
      title="System Architecture"
      description="Fine-tune institutional parameters, pedagogical rubrics, and operational SLAs for the current placement cycle."
      navigation={navigationByRole.admin}
      user={user}
    >
      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="grid gap-10 lg:grid-cols-2">
          <section className="rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">account_balance</span>
              Institutional Scope
            </h2>
            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Organization Taxonomy</label>
                <input className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white" placeholder="University Name" value={settings.organizationName || ''} onChange={(event) => updateField('organizationName', event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Departments (One per line)</label>
                <textarea className="min-h-[140px] w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white font-mono" placeholder="Ex: Computer Science" value={Array.isArray(settings.departments) ? settings.departments.join('\n') : settings.departments || ''} onChange={(event) => updateField('departments', event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Academic Batches</label>
                <textarea className="min-h-[100px] w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white font-mono" placeholder="Ex: 2025" value={Array.isArray(settings.batches) ? settings.batches.join('\n') : settings.batches || ''} onChange={(event) => updateField('batches', event.target.value)} />
              </div>
            </div>
          </section>

          <section className="space-y-10">
            <div className="rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500">event_note</span>
                Operational Cycle
              </h2>
              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Cycle Designation</label>
                  <input className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white" placeholder="Ex: Spring 2026 Core" value={settings.activeCycle?.name || ''} onChange={(event) => updateField('activeCycle', { ...settings.activeCycle, name: event.target.value })} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Epoch Start</label>
                    <input className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white" type="date" value={settings.activeCycle?.startDate ? new Date(settings.activeCycle.startDate).toISOString().split('T')[0] : ''} onChange={(event) => updateField('activeCycle', { ...settings.activeCycle, startDate: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Epoch End</label>
                    <input className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white" type="date" value={settings.activeCycle?.endDate ? new Date(settings.activeCycle.endDate).toISOString().split('T')[0] : ''} onChange={(event) => updateField('activeCycle', { ...settings.activeCycle, endDate: event.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-indigo-500">timer</span>
                SLA Thresholds
              </h2>
              <div className="mt-8 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Faculty Review Latency (Days)</label>
                <input className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary dark:text-white" min="1" type="number" value={settings.projectReviewSlaDays || 7} onChange={(event) => updateField('projectReviewSlaDays', Number(event.target.value) || 7)} />
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <span className="material-symbols-outlined text-[24px]">rule</span>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight dark:text-white">Pedagogical Rubric</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Standardized criteria used by faculty for project endorsements.</p>
              </div>
            </div>
            <button 
              className="rounded-2xl border border-slate-200 dark:border-white/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95" 
              onClick={addRubricItem} 
              type="button"
            >
              Add Assessment Criterion
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {(settings.reviewRubric || []).map((item, index) => (
              <div key={`${item.key}-${index}`} className="relative group rounded-[2rem] border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-8 transition-all hover:border-primary/30">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Key</label>
                       <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-xs outline-none focus:border-primary dark:text-white font-mono" value={item.key || ''} onChange={(event) => updateRubric(index, 'key', event.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Max Score</label>
                       <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-xs outline-none focus:border-primary dark:text-white" type="number" value={item.maxScore || 5} onChange={(event) => updateRubric(index, 'maxScore', Number(event.target.value) || 5)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Display Label</label>
                     <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-bold outline-none focus:border-primary dark:text-white" value={item.label || ''} onChange={(event) => updateRubric(index, 'label', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Guideline Description</label>
                     <textarea className="min-h-[80px] w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-4 py-3 text-xs outline-none focus:border-primary dark:text-white leading-relaxed" value={item.description || ''} onChange={(event) => updateRubric(index, 'description', event.target.value)} />
                  </div>
                </div>
                <button 
                  className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeRubricItem(index)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end border-t border-slate-200 dark:border-white/5 pt-10">
           <button className="rounded-2xl bg-primary px-10 py-5 text-sm font-black text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-70" disabled={saving} type="submit">
             {saving ? 'Synchronizing State...' : 'Commit System Configuration'}
           </button>
        </div>
      </form>
    </AppShell>
  );
}

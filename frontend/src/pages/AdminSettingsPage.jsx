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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...settings,
        departments: String(settings.departments || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        batches: String(settings.batches || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        placementCategories: String(settings.placementCategories || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const { data } = await settingsAPI.update(payload);
      setSettings(data.data);
      toast.success('Placement settings updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || pageLoading || !settings) {
    return <LoadingState label="Loading placement settings..." />;
  }

  return (
    <AppShell
      title="Placement Settings"
      description="Configure departments, active cycles, rubric criteria, and review SLAs for your campus."
      navigation={navigationByRole.admin}
      user={user}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Campus Configuration</h2>
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Organization name" value={settings.organizationName || ''} onChange={(event) => updateField('organizationName', event.target.value)} />
              <textarea className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Departments, one per line'} value={Array.isArray(settings.departments) ? settings.departments.join('\n') : settings.departments || ''} onChange={(event) => updateField('departments', event.target.value)} />
              <textarea className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Batches, one per line'} value={Array.isArray(settings.batches) ? settings.batches.join('\n') : settings.batches || ''} onChange={(event) => updateField('batches', event.target.value)} />
              <textarea className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder={'Placement categories, one per line'} value={Array.isArray(settings.placementCategories) ? settings.placementCategories.join('\n') : settings.placementCategories || ''} onChange={(event) => updateField('placementCategories', event.target.value)} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Active Cycle</h2>
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Cycle name" value={settings.activeCycle?.name || ''} onChange={(event) => updateField('activeCycle', { ...settings.activeCycle, name: event.target.value })} />
              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" type="date" value={settings.activeCycle?.startDate ? new Date(settings.activeCycle.startDate).toISOString().split('T')[0] : ''} onChange={(event) => updateField('activeCycle', { ...settings.activeCycle, startDate: event.target.value })} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" type="date" value={settings.activeCycle?.endDate ? new Date(settings.activeCycle.endDate).toISOString().split('T')[0] : ''} onChange={(event) => updateField('activeCycle', { ...settings.activeCycle, endDate: event.target.value })} />
              </div>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" min="1" placeholder="Project review SLA days" type="number" value={settings.projectReviewSlaDays || 7} onChange={(event) => updateField('projectReviewSlaDays', Number(event.target.value) || 7)} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Faculty Review Rubric</h2>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => updateField('reviewRubric', [...(settings.reviewRubric || []), { ...blankRubric }])} type="button">
              Add Criterion
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {(settings.reviewRubric || []).map((item, index) => (
              <div key={`${item.key}-${index}`} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr,1fr,120px]">
                <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Key" value={item.key || ''} onChange={(event) => updateRubric(index, 'key', event.target.value)} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Label" value={item.label || ''} onChange={(event) => updateRubric(index, 'label', event.target.value)} />
                <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" min="1" placeholder="Max score" type="number" value={item.maxScore || 5} onChange={(event) => updateRubric(index, 'maxScore', Number(event.target.value) || 5)} />
                <textarea className="md:col-span-3 min-h-[90px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Criterion description" value={item.description || ''} onChange={(event) => updateRubric(index, 'description', event.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <button className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-70" disabled={saving} type="submit">
          {saving ? 'Saving...' : 'Save Placement Settings'}
        </button>
      </form>
    </AppShell>
  );
}

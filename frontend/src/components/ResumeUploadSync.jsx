import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { userAPI, uploadFile } from '../services/api';
import {
  RESUME_MAX_BYTES,
  openResumeDataUrl,
  parseResumePdf,
} from '../utils/resumeParser';
import { getAssetUrl } from '../utils/assets';

const SCALAR_FIELDS = [
  ['name', 'Full name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['location', 'Location'],
  ['university', 'College / University'],
  ['degree', 'Academic designation'],
  ['graduationDate', 'Graduation year'],
  ['bio', 'Professional summary'],
  ['githubUrl', 'GitHub'],
  ['linkedinUrl', 'LinkedIn'],
  ['achievementsSummary', 'Achievement summary'],
];

const ARRAY_FIELDS = [
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['certifications', 'Certifications'],
];

const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(String(value || '').trim());
};

const uniqueByText = (items, getKey) => {
  const seen = new Set();
  const merged = [];

  items.forEach((item) => {
    const key = getKey(item).toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });

  return merged;
};

const buildSelectedState = (data) => {
  const selected = {};

  [...SCALAR_FIELDS, ...ARRAY_FIELDS].forEach(([field]) => {
    selected[field] = hasValue(data?.[field]);
  });

  return selected;
};

const renderValue = (value) => {
  if (Array.isArray(value)) {
    if (!value.length) return 'No value detected';
    if (typeof value[0] === 'string') return value.join(', ');
    return value.map((item) => item.title || item.company || item.issuer).filter(Boolean).join(', ');
  }

  return value || 'No value detected';
};

export default function ResumeUploadSync({
  user,
  refreshUser,
  compact = false,
  onProfilePatch,
  syncLabel = 'Sync Data',
}) {
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [selectedFields, setSelectedFields] = useState({});

  const profile = user?.profile || {};
  const hasResume = Boolean(profile.resumeUrl);
  const resumeLabel = profile.resumeFileName || 'Uploaded resume';

  const visibleFields = useMemo(
    () => [...SCALAR_FIELDS, ...ARRAY_FIELDS].filter(([field]) => hasValue(previewData?.[field])),
    [previewData]
  );

  const openPreview = (data) => {
    const selected = buildSelectedState(data);
    if (!Object.values(selected).some(Boolean)) {
      toast.info('Resume parsed, but no profile fields were detected.');
      return;
    }

    setPreviewData(data);
    setSelectedFields(selected);
  };

  const parseAndPreview = async (arrayBuffer) => {
    setParsing(true);
    try {
      const result = await parseResumePdf(arrayBuffer);
      if (!result.data) {
        toast.info('No readable text was found in this PDF.');
        return;
      }
      openPreview(result.data);
    } catch (error) {
      toast.error(error?.message || 'Unable to parse resume.');
    } finally {
      setParsing(false);
    }
  };

  const saveResume = async (file) => {
    setSaving(true);
    try {
      // Step 1: Upload to disk storage
      const { data } = await uploadFile('resumes', file);
      const uploadedUrl = data.url;

      // Step 2: Save metadata to profile
      const patch = {
        ...(profile || {}),
        resumeUrl: uploadedUrl,
        resumeFileName: file.name,
        resumeMimeType: file.type || 'application/pdf',
        resumeUploadedAt: new Date().toISOString(),
      };
      await userAPI.updateProfile(patch);
      onProfilePatch?.(patch);
      await refreshUser?.();
      toast.success('Resume synchronized to disk.');
      return uploadedUrl;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to save resume.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleResumeFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF resumes are supported.');
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      toast.error('Resume must be 4 MB or smaller.');
      return;
    }

    try {
      await saveResume(file);
      // For parsing, we can use the local file buffer directly
      const buffer = await file.arrayBuffer();
      await parseAndPreview(buffer);
    } catch (error) {
      console.error('Resume processing failed:', error);
    }
  };

  const onDrop = (acceptedFiles) => handleResumeFile(acceptedFiles[0]);

  const onDropRejected = (fileRejections) => {
    const firstError = fileRejections[0]?.errors?.[0];
    if (firstError?.code === 'file-too-large') {
      toast.error('Resume must be 4 MB or smaller.');
      return;
    }
    if (firstError?.code === 'file-invalid-type') {
      toast.error('Only PDF resumes are supported.');
      return;
    }
    toast.error(firstError?.message || 'Resume upload rejected.');
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: RESUME_MAX_BYTES,
    noClick: true,
    noKeyboard: true,
  });

  const handleViewResume = async () => {
    if (!profile.resumeUrl) {
      toast.info('Upload a PDF resume first.');
      return;
    }

    try {
      const url = getAssetUrl(profile.resumeUrl);
      if (url.startsWith('data:')) {
        if (!(await openResumeDataUrl(url))) {
          toast.error('Browser blocked the resume preview.');
        }
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to open resume.');
    }
  };

  const handleSyncExisting = async () => {
    if (!profile.resumeUrl) {
      toast.info('Upload a PDF resume first.');
      return;
    }

    try {
      setParsing(true);
      const url = getAssetUrl(profile.resumeUrl);
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      await parseAndPreview(buffer);
    } catch (error) {
      toast.error(error?.message || 'Unable to read uploaded resume.');
    } finally {
      setParsing(false);
    }
  };

  const toggleField = (field) => {
    setSelectedFields((current) => ({ ...current, [field]: !current[field] }));
  };

  const applySelectedFields = async () => {
    if (!previewData || !user) return;

    const existingProfile = user.profile || {};
    const payload = {
      ...existingProfile,
      name: user.name,
      email: user.email,
    };

    SCALAR_FIELDS.forEach(([field]) => {
      if (!selectedFields[field] || !hasValue(previewData[field])) return;
      payload[field] = previewData[field];
    });

    if (selectedFields.skills && previewData.skills?.length) {
      payload.skills = uniqueByText(
        [...(existingProfile.skills || []), ...previewData.skills],
        (skill) => String(skill)
      );
    }

    if (selectedFields.experience && previewData.experience?.length) {
      payload.experience = uniqueByText(
        [...(existingProfile.experience || []), ...previewData.experience],
        (item) => `${item.title || ''}-${item.company || ''}`
      );
    }

    if (selectedFields.certifications && previewData.certifications?.length) {
      payload.certifications = uniqueByText(
        [...(existingProfile.certifications || []), ...previewData.certifications],
        (item) => `${item.title || ''}-${item.issuer || ''}`
      );
    }

    setSaving(true);
    try {
      await userAPI.updateProfile(payload);
      onProfilePatch?.(payload);
      await refreshUser?.();
      setPreviewData(null);
      toast.success('Profile synced from resume.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to sync profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section
        {...getRootProps()}
        className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm transition-all ${
          isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : ''
        } ${compact ? 'space-y-4' : 'space-y-5'}`}
      >
        <input {...getInputProps()} />
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Resume Sync</p>
            <p className="mt-1 truncate text-sm font-black text-[#003366] dark:text-white">
              {hasResume ? resumeLabel : 'No resume uploaded'}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Upload a PDF resume and preview detected profile fields before applying them.
            </p>
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
          <button
            type="button"
            onClick={open}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 disabled:opacity-60"
            disabled={saving || parsing}
          >
            {saving ? 'Uploading...' : 'Upload Resume'}
          </button>
          <button
            type="button"
            onClick={handleSyncExisting}
            className="rounded-xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-indigo-500 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300"
            disabled={saving || parsing || !hasResume}
          >
            {parsing ? 'Reading...' : syncLabel}
          </button>
          <button
            type="button"
            onClick={handleViewResume}
            className="rounded-xl border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-indigo-500 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300"
            disabled={!hasResume}
          >
            View Resume
          </button>
        </div>
      </section>

      {previewData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-6 border-b border-slate-100 p-8 dark:border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Resume Preview</p>
                <h2 className="mt-2 text-2xl font-black text-[#003366] dark:text-white">Apply detected profile data</h2>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Choose the fields you want to copy into your profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 dark:bg-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-8">
              <div className="grid gap-4 md:grid-cols-2">
                {visibleFields.map(([field, label]) => (
                  <label
                    key={field}
                    className="flex cursor-pointer gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-indigo-500/30 dark:border-white/10 dark:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 size-4 shrink-0"
                      checked={Boolean(selectedFields[field])}
                      onChange={() => toggleField(field)}
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
                      <span className="mt-2 block break-words text-sm font-bold leading-relaxed text-slate-700 dark:text-slate-200">
                        {renderValue(previewData[field])}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-slate-100 p-6 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="rounded-xl border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:border-white/10 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applySelectedFields}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 disabled:opacity-60"
                disabled={saving || !Object.values(selectedFields).some(Boolean)}
              >
                {saving ? 'Applying...' : 'Apply Selected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

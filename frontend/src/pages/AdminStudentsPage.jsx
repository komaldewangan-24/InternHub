import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { userAPI } from '../services/api';
import { computeStudentReadiness } from '../utils/readiness';
import { downloadBlobResponse } from '../utils/download';

const blankProvisionForm = {
  name: '',
  email: '',
  password: '',
  role: 'faculty',
  department: '',
  designation: '',
};

export default function AdminStudentsPage() {
  const { user, loading } = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [provisionForm, setProvisionForm] = useState(blankProvisionForm);
  const [assignmentFacultyId, setAssignmentFacultyId] = useState('');
  const [assignmentDepartment, setAssignmentDepartment] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    const { data } = await userAPI.getAll();
    setUsers(data.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        await loadUsers();
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, []);

  const students = useMemo(() => users.filter((item) => item.role === 'student'), [users]);
  const facultyList = useMemo(() => users.filter((item) => item.role === 'faculty'), [users]);
  const recruiters = useMemo(() => users.filter((item) => item.role === 'recruiter'), [users]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [
        student.name,
        student.email,
        student.profile?.university,
        student.profile?.degree,
        student.profile?.department,
        student.profile?.batch,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [search, students]);

  const handleProvision = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await userAPI.create({
        name: provisionForm.name,
        email: provisionForm.email,
        password: provisionForm.password,
        role: provisionForm.role,
        profile: {
          department: provisionForm.department,
          designation: provisionForm.designation,
        },
      });
      toast.success(`${provisionForm.role} account created`);
      setProvisionForm(blankProvisionForm);
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to create account');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignFaculty = async (studentId = null) => {
    try {
      setSaving(true);
      const payload = {
        facultyId: studentId ? activeFacultyIdMap[studentId] : assignmentFacultyId,
        department: studentId ? undefined : assignmentDepartment,
        studentIds: studentId ? [studentId] : undefined,
      };

      if (!payload.facultyId) {
        toast.warn('Please select a faculty member first');
        return;
      }

      await userAPI.assignFaculty(payload);
      toast.success('Faculty assignment updated');
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to update assignment');
    } finally {
      setSaving(false);
    }
  };

  const [activeFacultyIdMap, setActiveFacultyIdMap] = useState({});

  const updateIndividualFacultySelection = (studentId, facultyId) => {
    setActiveFacultyIdMap(curr => ({ ...curr, [studentId]: facultyId }));
  };

  const exportStudents = async () => {
    try {
      const response = await userAPI.exportStudents();
      downloadBlobResponse(response, 'students-readiness.csv');
      toast.success('Student readiness export downloaded');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to export students');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Indexing campus users..." />;
  }

  return (
    <AppShell
      title="User Management"
      description="Provision accounts and maintain departmental oversight for all institutional stakeholders."
      navigation={navigationByRole.admin}
      user={user}
      actions={
        <button className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95" onClick={exportStudents} type="button">
          Export Readiness CSV
        </button>
      }
    >
      <div className="grid gap-8 xl:grid-cols-[400px,1fr]">
        <div className="space-y-8">
          <form className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all" onSubmit={handleProvision}>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <h2 className="text-xl font-black tracking-tight dark:text-white">Account Provision</h2>
            </div>
            <div className="space-y-4">
              <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" placeholder="Name" value={provisionForm.name} onChange={(event) => setProvisionForm((current) => ({ ...current, name: event.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" placeholder="Email" value={provisionForm.email} onChange={(event) => setProvisionForm((current) => ({ ...current, email: event.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" placeholder="Password" type="password" value={provisionForm.password} onChange={(event) => setProvisionForm((current) => ({ ...current, password: event.target.value }))} />
              <select className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" value={provisionForm.role} onChange={(event) => setProvisionForm((current) => ({ ...current, role: event.target.value }))}>
                <option value="faculty" className="dark:bg-slate-900 text-slate-900 dark:text-white">Faculty</option>
                <option value="recruiter" className="dark:bg-slate-900 text-slate-900 dark:text-white">Recruiter</option>
                <option value="student" className="dark:bg-slate-900 text-slate-900 dark:text-white">Student</option>
                <option value="admin" className="dark:bg-slate-900 text-slate-900 dark:text-white">Admin</option>
              </select>
              <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" placeholder="Department" value={provisionForm.department} onChange={(event) => setProvisionForm((current) => ({ ...current, department: event.target.value }))} />
            </div>
            <button className="mt-8 w-full rounded-xl bg-primary px-5 py-4 text-sm font-black text-white shadow-lg shadow-primary/30 disabled:opacity-50 transition-all hover:scale-105 active:scale-95" disabled={saving} type="submit">
              {saving ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <span className="material-symbols-outlined">assignment_ind</span>
              </div>
              <h2 className="text-xl font-black tracking-tight dark:text-white">Faculty Assignment</h2>
            </div>
            <div className="space-y-4">
              <select className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" value={assignmentFacultyId} onChange={(event) => setAssignmentFacultyId(event.target.value)}>
                <option value="" className="dark:bg-slate-900">Select evaluator</option>
                {facultyList.map((member) => (
                  <option key={member._id} value={member._id} className="dark:bg-slate-900">
                    {member.name}
                  </option>
                ))}
              </select>
              <input className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary dark:text-white" placeholder="Department key" value={assignmentDepartment} onChange={(event) => setAssignmentDepartment(event.target.value)} />
            </div>
            <button className="mt-8 w-full rounded-xl border border-slate-200 dark:border-white/10 px-5 py-4 text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:border-primary hover:text-primary disabled:opacity-50" disabled={saving || !assignmentFacultyId || !assignmentDepartment} onClick={handleAssignFaculty} type="button">
              Assign to Department
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
             {[
               { val: students.length, lab: 'Students' },
               { val: facultyList.length, lab: 'Faculty' },
               { val: recruiters.length, lab: 'Recruiters' }
             ].map(s => (
               <div key={s.lab} className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 text-center">
                  <p className="text-sm font-black dark:text-white leading-tight">{s.val}</p>
                  <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-slate-400">{s.lab}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative group max-w-2xl">
             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-sm">search</span>
             <input 
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-10 py-2.5 text-xs outline-none focus:border-primary shadow-sm transition-all dark:text-white" 
              placeholder="Search student candidates by name, email, department or degree" 
              value={search} 
              onChange={(event) => setSearch(event.target.value)} 
             />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredStudents.length ? (
              filteredStudents.map((student) => {
                const readiness = computeStudentReadiness({
                  user: student,
                  approvedProjects: 0,
                  applications: 0,
                });
                return (
                  <div key={student._id} className="group rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 shadow-sm transition-all hover:border-primary/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-primary font-black shadow-sm group-hover:scale-105 transition-transform">
                          {student.name?.[0]}
                        </div>
                        <div>
                          <p className="text-base font-black tracking-tight dark:text-white leading-tight">{student.name}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium italic italic">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-[10px] font-black">{readiness.score}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                          <span className="material-symbols-outlined text-xs">account_balance</span>
                          {student.profile?.department || 'Applied Science'} <span className="mx-1">•</span> {student.profile?.batch || '2025'}
                       </div>
                       <div className="flex items-center justify-between gap-4 mt-6">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-xs">person_check</span>
                            {student.profile?.assignedFaculty?.name || 'Not assigned'}
                         </div>
                         <div className="flex items-center gap-2">
                            <select 
                              className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-2 py-1 text-[9px] font-bold outline-none focus:border-primary dark:text-slate-300"
                              value={activeFacultyIdMap[student._id] || student.profile?.assignedFaculty?._id || ''}
                              onChange={(e) => updateIndividualFacultySelection(student._id, e.target.value)}
                            >
                              <option value="">Move To...</option>
                              {facultyList.map(f => (
                                <option key={f._id} value={f._id}>{f.name}</option>
                              ))}
                            </select>
                            <button 
                              className="size-7 flex items-center justify-center rounded-xl bg-primary text-white shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
                              onClick={() => handleAssignFaculty(student._id)}
                              disabled={saving || !activeFacultyIdMap[student._id] || activeFacultyIdMap[student._id] === student.profile?.assignedFaculty?._id}
                            >
                              <span className="material-symbols-outlined text-sm">check</span>
                            </button>
                         </div>
                       </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-2">
                <EmptyState icon="person_off" title="No matching students" description="Adjust your search parameters or confirm that student accounts have been provisioned." />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

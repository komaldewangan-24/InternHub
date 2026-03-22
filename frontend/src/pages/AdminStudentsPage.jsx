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
  const faculty = useMemo(() => users.filter((item) => item.role === 'faculty'), [users]);
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

  const handleAssignFaculty = async () => {
    try {
      setSaving(true);
      await userAPI.assignFaculty({
        facultyId: assignmentFacultyId,
        department: assignmentDepartment,
      });
      toast.success('Faculty assignment updated');
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to assign faculty');
    } finally {
      setSaving(false);
    }
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
    return <LoadingState label="Loading students..." />;
  }

  return (
    <AppShell
      title="Placement Students"
      description="Provision controlled accounts, assign faculty by department, and monitor student readiness at the campus level."
      navigation={navigationByRole.admin}
      user={user}
      actions={
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold" onClick={exportStudents} type="button">
          Export Student Readiness
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-6">
          <form className="rounded-3xl bg-white p-6 shadow-sm" onSubmit={handleProvision}>
            <h2 className="text-xl font-bold">Controlled Account Provisioning</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Full name" value={provisionForm.name} onChange={(event) => setProvisionForm((current) => ({ ...current, name: event.target.value }))} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Email" value={provisionForm.email} onChange={(event) => setProvisionForm((current) => ({ ...current, email: event.target.value }))} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Password" type="password" value={provisionForm.password} onChange={(event) => setProvisionForm((current) => ({ ...current, password: event.target.value }))} />
              <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" value={provisionForm.role} onChange={(event) => setProvisionForm((current) => ({ ...current, role: event.target.value }))}>
                <option value="faculty">Faculty</option>
                <option value="recruiter">Recruiter</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Department" value={provisionForm.department} onChange={(event) => setProvisionForm((current) => ({ ...current, department: event.target.value }))} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Designation" value={provisionForm.designation} onChange={(event) => setProvisionForm((current) => ({ ...current, designation: event.target.value }))} />
            </div>
            <button className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-70" disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Create Controlled Account'}
            </button>
          </form>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Faculty Assignment By Department</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" value={assignmentFacultyId} onChange={(event) => setAssignmentFacultyId(event.target.value)}>
                <option value="">Select faculty</option>
                {faculty.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Department to assign" value={assignmentDepartment} onChange={(event) => setAssignmentDepartment(event.target.value)} />
            </div>
            <button className="mt-6 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold" disabled={saving || !assignmentFacultyId || !assignmentDepartment} onClick={handleAssignFaculty} type="button">
              Assign Faculty To Department
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Students', students.length],
              ['Faculty', faculty.length],
              ['Recruiters', recruiters.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Search students" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div className="mt-6 space-y-4">
            {filteredStudents.length ? (
              filteredStudents.map((student) => {
                const readiness = computeStudentReadiness({
                  user: student,
                  approvedProjects: 0,
                  applications: 0,
                });

                return (
                  <div key={student._id} className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg font-bold">{student.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{student.email}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {student.profile?.department || 'Department not set'} • {student.profile?.batch || 'Batch not set'}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Faculty: {student.profile?.assignedFaculty?.name || 'Not assigned'}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold">
                        Readiness: {readiness.score}%
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No students found" description="Students will appear here once accounts are created." />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

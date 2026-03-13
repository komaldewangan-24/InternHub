import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StudentManagementAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchStudents();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      const localUser = localStorage.getItem('user');
      if (localUser) setUser(JSON.parse(localUser));
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await userAPI.getAll();
      if (data.success) {
        // Filter only students or show all? Let's show all for now or filter role === 'student'
        setStudents(data.data.filter(u => u.role === 'student'));
      }
    } catch (error) {
      console.error('Failed to fetch students', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await userAPI.delete(id);
        toast.success('Student deleted successfully');
        setStudents(students.filter(s => s._id !== id));
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      
<div className="flex h-screen overflow-hidden">

<aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
<div className="p-6 flex items-center gap-3">
<div className="bg-primary rounded-lg p-2 text-white">
<span className="material-symbols-outlined block">school</span>
</div>
<div>
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">InternHub</h1>
<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Placement Cell Admin</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1">
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg transition-colors" to="/student_management_admin">
<span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>group</span>
<span className="font-medium">Students</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/company_management_admin">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="font-medium">Companies</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span className="font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_analytics_dashboard">
<span className="material-symbols-outlined">bar_chart</span>
<span className="font-medium">Analytics</span>
</Link>
</nav>
<div className="p-4 border-t border-slate-200 dark:border-slate-800">
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-medium">Settings</span>
</Link>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0 overflow-hidden">

<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
<div className="flex-1 max-w-xl">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
<input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Search student by name, ID or skills..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4 ml-8">
<button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
<div className="flex items-center gap-3 pl-2">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500 mt-1">{user?.role || 'Placement Head'}</p>
</div>
<div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
<img alt="Admin Avatar" className="w-full h-full object-cover" src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Admin')} />
</div>
</div>
</div>
</header>

<div className="flex-1 overflow-y-auto p-8 space-y-8">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Management</h2>
<p className="text-slate-500 dark:text-slate-400 mt-1">Review, track and manage student placement data and eligibility.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold">
<span className="material-symbols-outlined text-lg">upload</span>
                            Export CSV
                        </button>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold shadow-lg shadow-primary/20">
<span className="material-symbols-outlined text-lg">person_add</span>
                            Add Student
                        </button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Students</p>
<span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">groups</span>
</div>
<p className="text-3xl font-bold text-slate-900 dark:text-white">1,240</p>
<p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-xs">trending_up</span> +4% from last batch</p>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placed</p>
<span className="material-symbols-outlined text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">verified</span>
</div>
<p className="text-3xl font-bold text-slate-900 dark:text-white">850</p>
<p className="text-xs text-slate-500 mt-2 font-medium">68.5% Success rate</p>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unplaced</p>
<span className="material-symbols-outlined text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">hourglass_empty</span>
</div>
<p className="text-3xl font-bold text-slate-900 dark:text-white">390</p>
<p className="text-xs text-slate-500 mt-2 font-medium">Seeking opportunities</p>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average CGPA</p>
<span className="material-symbols-outlined text-purple-600 bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">military_tech</span>
</div>
<p className="text-3xl font-bold text-slate-900 dark:text-white">8.42</p>
<p className="text-xs text-slate-500 mt-2 font-medium">Batch of 2024</p>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">

<div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
<select className="form-select text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary/20 focus:border-primary px-3 py-2 min-w-[160px]">
<option value="">Department</option>
<option>Computer Science</option>
<option>Electronics</option>
<option>Mechanical</option>
</select>
<select className="form-select text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary/20 focus:border-primary px-3 py-2 min-w-[160px]">
<option value="">Skills</option>
<option>React</option>
<option>Python</option>
<option>Java</option>
<option>UI/UX</option>
</select>
<select className="form-select text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary/20 focus:border-primary px-3 py-2 min-w-[160px]">
<option value="">CGPA Range</option>
<option>9.0 - 10.0</option>
<option>8.0 - 9.0</option>
<option>7.0 - 8.0</option>
</select>
<select className="form-select text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary/20 focus:border-primary px-3 py-2 min-w-[160px]">
<option value="">Placement Status</option>
<option>Placed</option>
<option>Seeking</option>
<option>In-Progress</option>
</select>
<button className="text-primary text-sm font-semibold hover:underline px-2">Clear Filters</button>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50">
<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CGPA</th>
<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</th>
<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
<th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
{loading ? (
  <tr>
    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">Loading students...</td>
  </tr>
) : students.length === 0 ? (
  <tr>
    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">No students found.</td>
  </tr>
) : (
  students.map((student) => (
    <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            <img alt={student.name} className="w-full h-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{student.name}</p>
            <p className="text-xs text-slate-500 mt-1">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.profile?.university || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{student.profile?.degree || 'N/A'}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2025</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">3.92</td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Verified</span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
          <button onClick={() => handleDelete(student._id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
        </div>
      </td>
    </tr>
  ))
)}
</tbody>
</table>
</div>

<div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
<p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">10</span> of <span className="font-medium text-slate-900 dark:text-white">1,240</span> students
                        </p>
<div className="flex items-center gap-2">
<button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium" disabled="">Previous</button>
<button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">1</button>
<button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium">2</button>
<button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium">3</button>
<span className="text-slate-400">...</span>
<button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium">124</button>
<button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Next</button>
</div>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

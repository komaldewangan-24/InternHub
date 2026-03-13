import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, companyAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyManagementAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchCompanies();
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

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await companyAPI.getAll();
      if (data.success) {
        setCompanies(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyAPI.delete(id);
        toast.success('Company deleted successfully');
        setCompanies(companies.filter(c => c._id !== id));
      } catch (error) {
        toast.error('Failed to delete company');
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      
<div className="flex h-screen overflow-hidden">

<aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
<div className="p-6 flex items-center gap-3">
<div className="bg-primary rounded-lg p-2 flex items-center justify-center">
<span className="material-symbols-outlined text-white">hub</span>
</div>
<div>
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">InternHub</h1>
<p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Admin Portal</p>
</div>
</div>
<nav className="flex-1 px-4 py-4 space-y-1">
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/student_management_admin">
<span className="material-symbols-outlined">group</span>
<span className="font-medium">Students</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" to="/company_management_admin">
<span className="material-symbols-outlined">domain</span>
<span className="font-medium">Companies</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span className="font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_analytics_dashboard">
<span className="material-symbols-outlined">bar_chart</span>
<span className="font-medium">Analytics</span>
</Link>
<div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 my-4">
<p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
</div>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-medium">Settings</span>
</Link>
</nav>
<div className="p-4 border-t border-slate-200 dark:border-slate-800">
<button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
<span className="material-symbols-outlined text-sm">add</span>
<span>Add Company</span>
</button>
</div>
</aside>

<main className="flex-1 overflow-y-auto flex flex-col">

<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" placeholder="Search companies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-3">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
<div className="flex items-center gap-3 pl-2">
<div className="text-right hidden sm:block">
<p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.name || 'Loading...'}</p>
<p className="text-[10px] text-slate-500 font-medium">{user?.role || 'Super Admin'}</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Admin')} />
</div>
</div>
</div>
</header>

<div className="p-8 space-y-8">
<div className="flex justify-between items-end">
<div>
<h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company Management</h2>
<p className="text-slate-500 text-sm">Overview and verification of partnered organizations.</p>
</div>
<div className="flex gap-2">
<button className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
<span className="material-symbols-outlined text-base">filter_list</span>
                            Filter
                        </button>
<button className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
<span className="material-symbols-outlined text-base">download</span>
                            Export
                        </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-2xl">apartment</span>
</div>
<div>
<p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Companies</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,240</h3>
<p className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-xs">trending_up</span>
                                12% increase
                            </p>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
<span className="material-symbols-outlined text-2xl">pending_actions</span>
</div>
<div>
<p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Approvals</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white">42</h3>
<p className="text-xs text-orange-600 font-semibold flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-xs">priority_high</span>
                                Requires action
                            </p>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
<span className="material-symbols-outlined text-2xl">handshake</span>
</div>
<div>
<p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Partners</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white">856</h3>
<p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-xs">check_circle</span>
                                Verified accounts
                            </p>
</div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Internships</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hired Students</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
{loading ? (
  <tr>
    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading companies...</td>
  </tr>
) : companies.length === 0 ? (
  <tr>
    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No companies found.</td>
  </tr>
) : (
  companies.map((company) => (
    <tr key={company._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">
            {company.name?.[0] || 'C'}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{company.name}</p>
            <p className="text-xs text-slate-500 mt-1">{company.industry || 'Technology'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">12</td>
      <td className="px-6 py-4">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${company.name+i}`} alt="Hired Student" />
            </div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+9</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Active Partner</span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
          <button onClick={() => handleDelete(company._id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
        </div>
      </td>
    </tr>
  ))
)}
</tbody>
</table>
</div>
<div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
<p className="text-xs text-slate-500 font-medium">Showing 4 of 1,240 companies</p>
<div className="flex gap-1">
<button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50" disabled="">
<span className="material-symbols-outlined text-lg">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-bold text-xs">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold text-xs">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold text-xs">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
<span className="material-symbols-outlined text-lg">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex items-start gap-4">
<div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
<span className="material-symbols-outlined">lightbulb</span>
</div>
<div>
<h4 className="font-bold text-primary text-sm">Pro Tip: Bulk Verification</h4>
<p className="text-slate-600 dark:text-slate-400 text-sm mt-1">You can select multiple companies to verify them all at once. Click the checkboxes (coming soon) or use the filter to group pending applications by industry.</p>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

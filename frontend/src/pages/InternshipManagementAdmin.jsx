import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function InternshipManagementAdmin() {
  const navigate = useNavigate();
  return (
    <>
      
<div className="flex min-h-screen">

<aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full">
<div className="p-6 flex items-center gap-3">
<div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
<span className="material-symbols-outlined text-white text-2xl">school</span>
</div>
<div>
<h1 className="text-xl font-bold tracking-tight">InternHub</h1>
<p className="text-xs text-slate-500 font-medium">Placement Cell Admin</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1 mt-4">
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/admin_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/student_management_admin">
<span className="material-symbols-outlined">group</span>
<span className="font-medium">Students</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/company_management_admin">
<span className="material-symbols-outlined">corporate_fare</span>
<span className="font-medium">Companies</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg active-nav bg-primary/10 text-primary" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
<span className="font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/admin_analytics_dashboard">
<span className="material-symbols-outlined">bar_chart</span>
<span className="font-medium">Analytics</span>
</Link>
</nav>
<div className="p-4 border-t border-slate-200 dark:border-slate-800">
<button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/login_page'); }}>
<span className="material-symbols-outlined">logout</span>
<span className="font-medium">Sign Out</span>
</button>
</div>
</aside>

<main className="flex-1 ml-64">

<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
<div className="flex items-center flex-1 max-w-md">
<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search internships, companies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
<div className="flex items-center gap-3 cursor-pointer">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold leading-tight">Alex Sterling</p>
<p className="text-xs text-slate-500">Placement Officer</p>
</div>
<img alt="Admin Profile" className="w-10 h-10 rounded-full bg-slate-200 object-cover" data-alt="Admin user profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt5giLuEB27NEcItQC1-KDEqXcw-v8W6J53hwKY_gOa11As3o9kK3Wg5UGX9XK7oqnLLSk1QJMYOwZ8SPgwh1jOoB4PAOJ9Rp_QH5nV-iupGO-ybenAhtL6gqLJYTvDH3AzOA4BnvRBbediGrub_dGG35kDi6aKKyBbwWp7jlJqYfdx18kp-KVXIw23Xt_T4T1H_SrFS5CinRafwbykn1Jva6kSEznGnCNvrytFAeT1N_ccER_PV7fd89uIvWnlBK-uYwWURR-xg"/>
</div>
</div>
</header>
<div className="p-8 max-w-7xl mx-auto">

<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h2 className="text-3xl font-extrabold tracking-tight">Internship Management</h2>
<p className="text-slate-500 mt-1">Configure and track internship cycles for the upcoming semester.</p>
</div>
<button className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all">
<span className="material-symbols-outlined text-[20px]">add_circle</span>
                        Create New Internship
                    </button>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
<span className="material-symbols-outlined">assignment_turned_in</span>
</div>
<span className="text-green-600 text-sm font-bold flex items-center">
<span className="material-symbols-outlined text-sm">trending_up</span> 12%
                            </span>
</div>
<p className="text-slate-500 font-medium text-sm">Active Internships</p>
<h3 className="text-2xl font-bold mt-1">42</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
<span className="material-symbols-outlined">group</span>
</div>
<span className="text-green-600 text-sm font-bold flex items-center">
<span className="material-symbols-outlined text-sm">trending_up</span> 8.4%
                            </span>
</div>
<p className="text-slate-500 font-medium text-sm">Total Applications</p>
<h3 className="text-2xl font-bold mt-1">1,284</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg">
<span className="material-symbols-outlined">new_releases</span>
</div>
<span className="text-slate-400 text-sm font-medium">This Week</span>
</div>
<p className="text-slate-500 font-medium text-sm">New Postings</p>
<h3 className="text-2xl font-bold mt-1">12</h3>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50 border-bottom border-slate-200 dark:border-slate-800">
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Company</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Department Eligibility</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Stipend</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Deadline</th>
<th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">TC</div>
<span className="font-semibold">TechCorp Solutions</span>
</div>
</td>
<td className="px-6 py-4 font-medium">Software Dev Intern</td>
<td className="px-6 py-4">
<div className="flex gap-1 flex-wrap">
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">CS</span>
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">IT</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">$1,200/mo</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
<span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                            Active
                                        </span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Dec 15, 2024</td>
<td className="px-6 py-4 text-right">
<div className="flex items-center justify-end gap-2">
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-orange-500">FB</div>
<span className="font-semibold">Future Bank</span>
</div>
</td>
<td className="px-6 py-4 font-medium">Financial Analyst</td>
<td className="px-6 py-4">
<div className="flex gap-1 flex-wrap">
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Commerce</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">$850/mo</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
<span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                            Draft
                                        </span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Jan 05, 2025</td>
<td className="px-6 py-4 text-right">
<div className="flex items-center justify-end gap-2">
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-purple-600">CC</div>
<span className="font-semibold">Creative Co.</span>
</div>
</td>
<td className="px-6 py-4 font-medium">UI/UX Design Intern</td>
<td className="px-6 py-4">
<div className="flex gap-1 flex-wrap">
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Arts</span>
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Design</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">$900/mo</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
<span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                            Closed
                                        </span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Nov 20, 2024</td>
<td className="px-6 py-4 text-right">
<div className="flex items-center justify-end gap-2">
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-teal-600">LI</div>
<span className="font-semibold">Legacy Inc.</span>
</div>
</td>
<td className="px-6 py-4 font-medium">Operations Trainee</td>
<td className="px-6 py-4">
<div className="flex gap-1 flex-wrap">
<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">All</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">$600/mo</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
<span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                            Active
                                        </span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Dec 22, 2024</td>
<td className="px-6 py-4 text-right">
<div className="flex items-center justify-end gap-2">
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
<button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
<button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
<span className="text-sm text-slate-500 font-medium">Showing 1 to 4 of 42 internships</span>
<div className="flex items-center gap-2">
<button className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors" disabled="">
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-sm font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-bold">2</button>
<button className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-bold">3</button>
<button className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

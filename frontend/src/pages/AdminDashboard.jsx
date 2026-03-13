import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <>
      
<div className="flex min-h-screen">

<aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
<div className="p-6 flex items-center gap-3">
<div className="bg-primary rounded-lg p-2 text-white">
<span className="material-symbols-outlined">school</span>
</div>
<div>
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">InternHub</h1>
<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold tracking-wider">Placement Cell</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1 mt-4">
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold" to="/admin_dashboard">
<span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/student_management_admin">
<span className="material-symbols-outlined">group</span>
                    Students
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/company_management_admin">
<span className="material-symbols-outlined">corporate_fare</span>
                    Companies
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined">work</span>
                    Internships
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
                    Applications
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="/admin_analytics_dashboard">
<span className="material-symbols-outlined">bar_chart</span>
                    Analytics
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
                    Settings
                </Link>
</nav>
<div className="p-4 mt-auto">
<div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
<p className="text-sm font-medium text-slate-900 dark:text-white">Admin Account</p>
<p className="text-xs text-slate-500 truncate">admin@university.edu</p>
<button className="w-full mt-3 bg-primary text-white text-sm font-bold py-2 rounded-xl hover:bg-primary/90 transition-all">
                        Post Internship
                    </button>
</div>
</div>
</aside>

<main className="flex-1 ml-64 min-h-screen">

<header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Search students, companies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-primary/10">
<div className="w-full h-full bg-cover bg-center" data-alt="Administrator user profile picture" style={{backgroundImage: 'url(\'https'}}></div>
</div>
<div className="hidden lg:block text-left">
<p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Prof. Anderson</p>
<p className="text-xs text-slate-500 mt-1">Dean of Career Services</p>
</div>
</div>
</div>
</header>
<div className="p-8">

<div className="mb-8">
<h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h2>
<p className="text-slate-500 dark:text-slate-400">Real-time placement performance and student engagement metrics.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
<span className="material-symbols-outlined">group</span>
</div>
<span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+12% <span className="material-symbols-outlined text-xs">trending_up</span></span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2,450</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
<span className="material-symbols-outlined">work</span>
</div>
<span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+5% <span className="material-symbols-outlined text-xs">trending_up</span></span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Internships</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">124</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
<span className="material-symbols-outlined">corporate_fare</span>
</div>
<span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+8% <span className="material-symbols-outlined text-xs">trending_up</span></span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Companies Registered</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">86</h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-4">
<div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
<span className="material-symbols-outlined">task_alt</span>
</div>
<span className="text-emerald-500 text-sm font-bold flex items-center gap-1">+15% <span className="material-symbols-outlined text-xs">trending_up</span></span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Students Placed</p>
<h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">412</h3>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

<div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-6">
<div>
<h3 className="text-lg font-bold text-slate-900 dark:text-white">Placement Rate Trends</h3>
<p className="text-sm text-slate-500">Global university placement index (Last 6 Months)</p>
</div>
<div className="text-right">
<span className="text-3xl font-black text-primary">78%</span>
<p className="text-xs text-emerald-500 font-bold">+4.2% YoY</p>
</div>
</div>
<div className="h-48 flex items-end gap-2 relative mt-4">
<svg className="absolute inset-0 w-full h-full" fill="none" preserveaspectratio="none" viewBox="0 0 100 40">
<path d="M0,35 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15 V40 H0 Z" fill="url(#chartGradient)"></path>
<path d="M0,35 Q10,15 20,25 T40,10 T60,20 T80,5 T100,15" fill="none" stroke="#2463eb" strokeWidth="2"></path>
<defs>
<lineargradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#2463eb" stop-opacity="0.2"></stop>
<stop offset="100%" stop-color="#2463eb" stop-opacity="0"></stop>
</lineargradient>
</defs>
</svg>
<div className="w-full flex justify-between absolute bottom-[-24px] px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
</div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-6">
<div>
<h3 className="text-lg font-bold text-slate-900 dark:text-white">Department Performance</h3>
<p className="text-sm text-slate-500">Placed student count by faculty</p>
</div>
<div className="text-right">
<span className="text-3xl font-black text-slate-800 dark:text-slate-100">1,200</span>
<p className="text-xs text-red-500 font-bold">-2.1%</p>
</div>
</div>
<div className="flex items-end justify-between h-48 px-4">
<div className="flex flex-col items-center gap-3 w-12 group">
<div className="bg-primary/20 hover:bg-primary transition-all rounded-t-lg w-full" style={{height: '90%'}}></div>
<span className="text-[10px] font-bold text-slate-400">CS</span>
</div>
<div className="flex flex-col items-center gap-3 w-12 group">
<div className="bg-primary/20 hover:bg-primary transition-all rounded-t-lg w-full" style={{height: '75%'}}></div>
<span className="text-[10px] font-bold text-slate-400">IT</span>
</div>
<div className="flex flex-col items-center gap-3 w-12 group">
<div className="bg-primary/20 hover:bg-primary transition-all rounded-t-lg w-full" style={{height: '60%'}}></div>
<span className="text-[10px] font-bold text-slate-400">ECE</span>
</div>
<div className="flex flex-col items-center gap-3 w-12 group">
<div className="bg-primary/20 hover:bg-primary transition-all rounded-t-lg w-full" style={{height: '45%'}}></div>
<span className="text-[10px] font-bold text-slate-400">ME</span>
</div>
<div className="flex flex-col items-center gap-3 w-12 group">
<div className="bg-primary/20 hover:bg-primary transition-all rounded-t-lg w-full" style={{height: '35%'}}></div>
<span className="text-[10px] font-bold text-slate-400">CE</span>
</div>
</div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
<h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Placement Activity</h3>
<button className="text-sm font-semibold text-primary hover:underline">View all reports</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-slate-50 dark:bg-slate-800/50">
<tr>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Company</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">CTC Offered</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-slate-200" data-alt="Student profile avatar" style={{backgroundImage: 'url(\'https'}}></div>
<span className="font-medium text-slate-900 dark:text-slate-100">Arjun Sharma</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Google Inc.</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Software Engineer Intern</td>
<td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">$4,500/mo</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">Accepted</span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Oct 24, 2023</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-slate-200" data-alt="Student profile avatar" style={{backgroundImage: 'url(\'https'}}></div>
<span className="font-medium text-slate-900 dark:text-slate-100">Siddharth V.</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Microsoft</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Cloud Architect</td>
<td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">$3,200/mo</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">Offered</span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Oct 23, 2023</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-slate-200" data-alt="Student profile avatar" style={{backgroundImage: 'url(\'https'}}></div>
<span className="font-medium text-slate-900 dark:text-slate-100">Ananya Roy</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Stripe</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Product Designer</td>
<td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">$5,100/mo</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">Interviewing</span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Oct 22, 2023</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-slate-200" data-alt="Student profile avatar" style={{backgroundImage: 'url(\'https'}}></div>
<span className="font-medium text-slate-900 dark:text-slate-100">Rahul Kapoor</span>
</div>
</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Amazon</td>
<td className="px-6 py-4 text-slate-600 dark:text-slate-400">Backend Dev</td>
<td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">$2,800/mo</td>
<td className="px-6 py-4">
<span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">Declined</span>
</td>
<td className="px-6 py-4 text-slate-500 text-sm">Oct 20, 2023</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

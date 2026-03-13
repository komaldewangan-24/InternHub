import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../services/api';

export default function AdminAnalyticsDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const { data } = await userAPI.getStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <>
      
<div className="flex min-h-screen">

<aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
<div className="p-6 flex items-center gap-3">
<div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">rocket_launch</span>
</div>
<div>
<h1 className="text-lg font-bold leading-none">InternHub</h1>
<p className="text-xs text-slate-custom dark:text-slate-400 mt-1 font-medium">Management System</p>
</div>
</div>
<nav className="flex-1 px-4 space-y-1 mt-4">
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-custom hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="/admin_dashboard">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-custom hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="/student_management_admin">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary">group</span>
<span className="text-sm font-medium">Students</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-custom hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="/company_management_admin">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary">corporate_fare</span>
<span className="text-sm font-medium">Companies</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-custom hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="/internship_management_admin">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary">work</span>
<span className="text-sm font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-custom hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="/application_tracking_admin">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary">description</span>
<span className="text-sm font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg transition-colors" to="/admin_analytics_dashboard">
<span className="material-symbols-outlined">analytics</span>
<span className="text-sm font-semibold">Analytics</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2.5 text-slate-custom hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group" to="#">
<span className="material-symbols-outlined text-slate-400 group-hover:text-primary">settings</span>
<span className="text-sm font-medium">Settings</span>
</Link>
</nav>
<div className="p-4 mt-auto">
<div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
<p className="text-xs font-bold text-primary uppercase tracking-wider">Upgrade Pro</p>
<p className="text-xs text-slate-custom dark:text-slate-400 mt-1">Get advanced AI predictions for placements.</p>
<button className="w-full mt-3 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">Learn More</button>
</div>
</div>
</aside>

<main className="flex-1 flex flex-col min-w-0">

<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
<div className="flex items-center gap-4 flex-1">
<div className="relative max-w-md w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl leading-none">search</span>
<input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search analytics, students, reports..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="size-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
<div className="flex items-center gap-3">
<div className="text-right hidden sm:block">
<p className="text-sm font-bold leading-none">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-custom mt-1">{user?.role || 'System Controller'}</p>
</div>
<div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
<img src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Admin')} className="w-full h-full object-cover" />
</div>
</div>
</div>
</header>

<div className="p-8 space-y-8">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="text-3xl font-black tracking-tight">Placement Analytics</h2>
<p className="text-slate-custom dark:text-slate-400 mt-1">Real-time performance metrics and industry trends.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium shadow-sm cursor-pointer hover:border-primary/40 transition-colors">
<span className="material-symbols-outlined text-primary mr-2 text-lg">calendar_month</span>
<span>Oct 1, 2023 - Oct 31, 2023</span>
</div>
<button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
<span className="material-symbols-outlined text-lg">download</span>
                            Export
                        </button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="size-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-2xl">school</span>
</div>
<span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
</div>
<p className="text-slate-custom dark:text-slate-400 text-sm font-medium">Total Students</p>
<p className="text-2xl font-black mt-1">{stats?.totalStudents || '0'}</p>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="size-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-2xl">verified</span>
</div>
<span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">{stats?.placedRate}%</span>
</div>
<p className="text-slate-custom dark:text-slate-400 text-sm font-medium">Placement Rate</p>
<p className="text-2xl font-black mt-1">{stats?.placedRate}%</p>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="size-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-2xl">work</span>
</div>
<span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">+8%</span>
</div>
<p className="text-slate-custom dark:text-slate-400 text-sm font-medium">Total Internships</p>
<p className="text-2xl font-black mt-1">{stats?.totalInternships || '0'}</p>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-4">
<div className="size-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg flex items-center justify-center">
<span className="material-symbols-outlined text-2xl">handshake</span>
</div>
<span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-full">-2%</span>
</div>
<p className="text-slate-custom dark:text-slate-400 text-sm font-medium">Active Partners</p>
<p className="text-2xl font-black mt-1">{stats?.totalCompanies || '0'}</p>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
<div className="flex items-center justify-between mb-6">
<h3 className="font-bold text-lg">Internship Success Rate</h3>
<select className="bg-slate-50 dark:bg-slate-800 border-none text-xs font-bold rounded-lg focus:ring-0">
<option>Last 6 Months</option>
<option>Last 12 Months</option>
</select>
</div>
<div className="flex-1 min-h-[300px] relative flex items-end gap-2 pb-8 px-2 border-b border-l border-slate-100 dark:border-slate-800">

<div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-full bg-primary/10 rounded-t-md relative" style={{height: '40%'}}>
<div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md h-full transition-all group-hover:bg-primary/80"></div>
</div>
<span className="text-[10px] text-slate-custom font-bold">MAY</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-full bg-primary/10 rounded-t-md relative" style={{height: '55%'}}>
<div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md h-full transition-all group-hover:bg-primary/80"></div>
</div>
<span className="text-[10px] text-slate-custom font-bold">JUN</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-full bg-primary/10 rounded-t-md relative" style={{height: '70%'}}>
<div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md h-full transition-all group-hover:bg-primary/80"></div>
</div>
<span className="text-[10px] text-slate-custom font-bold">JUL</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-full bg-primary/10 rounded-t-md relative" style={{height: '65%'}}>
<div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md h-full transition-all group-hover:bg-primary/80"></div>
</div>
<span className="text-[10px] text-slate-custom font-bold">AUG</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-full bg-primary/10 rounded-t-md relative" style={{height: '85%'}}>
<div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md h-full transition-all group-hover:bg-primary/80"></div>
</div>
<span className="text-[10px] text-slate-custom font-bold text-primary">SEP</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-full bg-primary/10 rounded-t-md relative" style={{height: '88%'}}>
<div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-md h-full transition-all group-hover:bg-primary/80"></div>
</div>
<span className="text-[10px] text-slate-custom font-bold">OCT</span>
</div>

<div className="absolute top-[10%] right-[12%] bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none font-bold">
                                88.5%
                            </div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 className="font-bold text-lg mb-6">Top Skill Demands</h3>
<div className="space-y-5">
<div className="space-y-2">
<div className="flex justify-between text-xs font-bold">
<span>React.js / Frontend</span>
<span className="text-primary">92%</span>
</div>
<div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{width: '92%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-xs font-bold">
<span>Python / AI-ML</span>
<span className="text-primary">84%</span>
</div>
<div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{width: '84%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-xs font-bold">
<span>UI/UX Design</span>
<span className="text-primary">76%</span>
</div>
<div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{width: '76%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-xs font-bold">
<span>Cloud (AWS/Azure)</span>
<span className="text-primary">68%</span>
</div>
<div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{width: '68%'}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between text-xs font-bold">
<span>Node.js / Backend</span>
<span className="text-primary">60%</span>
</div>
<div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{width: '60%'}}></div>
</div>
</div>
</div>
<button className="w-full mt-6 py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all">View All Skills</button>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 className="font-bold text-lg mb-6">Department-wise Placements</h3>
<div className="flex items-center gap-8 justify-center py-4">

<div className="relative size-40 rounded-full border-[12px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
<div className="absolute inset-0 rounded-full border-[12px] border-primary border-l-transparent border-t-transparent -rotate-45"></div>
<div className="text-center">
<p className="text-2xl font-black leading-none">88%</p>
<p className="text-[10px] text-slate-custom mt-1 uppercase font-bold tracking-wider">Avg Rate</p>
</div>
</div>
<div className="space-y-3">
<div className="flex items-center gap-2">
<span className="size-3 rounded-full bg-primary"></span>
<span className="text-sm font-medium">CS &amp; IT</span>
<span className="text-sm font-black ml-auto">94%</span>
</div>
<div className="flex items-center gap-2">
<span className="size-3 rounded-full bg-indigo-400"></span>
<span className="text-sm font-medium">Electronics</span>
<span className="text-sm font-black ml-auto">82%</span>
</div>
<div className="flex items-center gap-2">
<span className="size-3 rounded-full bg-amber-400"></span>
<span className="text-sm font-medium">Mechanical</span>
<span className="text-sm font-black ml-auto">76%</span>
</div>
<div className="flex items-center gap-2">
<span className="size-3 rounded-full bg-emerald-400"></span>
<span className="text-sm font-medium">Others</span>
<span className="text-sm font-black ml-auto">68%</span>
</div>
</div>
</div>
</div>

<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="flex items-center justify-between mb-6">
<h3 className="font-bold text-lg">Top Performing Companies</h3>
<button className="text-primary text-xs font-bold hover:underline">View All</button>
</div>
<div className="overflow-x-auto -mx-6">
<table className="w-full text-left">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-custom font-black uppercase tracking-wider">
<th className="px-6 py-3">Company</th>
<th className="px-6 py-3 text-center">Students</th>
<th className="px-6 py-3 text-center">Avg Rating</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
<img alt="Google company logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1igSCc_bD02KDV6UBevhu9URxp2LOTZzbbh8yidr-i-LQA9A5sdtnvRHSCAtbZJhkVuLOZ76-Stadk-l4-mVl-KdAXeB1qQ_B9n9R9_FwhMiyntLbzGEG07y5-fVb-JesiG_4pTxET6qzWhjrMRIBa_GMX7wD6PLs5gpYuy0C9nIK1btIwFBIdd0ANCO8iM3HHTshM5fHdoM1_bpF4KNOtO43AK-XVPjR2f5408KCvyuZxoV3qOlm-ZObYkTtrw3nEC8gONe9xw"/>
</div>
<span className="text-sm font-bold">Google Cloud</span>
</div>
</td>
<td className="px-6 py-4 text-center text-sm font-medium">45</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-amber-400 text-sm fill-current">star</span>
<span className="text-sm font-bold">4.9</span>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
<img alt="Microsoft company logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiqTQrLFT6TgFKyKn0OAL4L4boLpySnwQNQ54uha1YCdMjY2ea96ADkG8FmJYA-lj0FbWK18wORj2cyOzbIg5Tghoc9IkrLBfl3Et-hl51bfmqJ9rqRTjRU9smUyQ6SbeAHBN2M-I3zTO9Gg3yqVC4hr5YR3So4bvxRAQ3U15swniXJsj9HmwDy8wiE-jgEU1sTOQO8CastFejgSLnTrwO5HSjxUPSRQ-_JFvwUfpAQTYnUmBHb21AF1UKk1HXIl5ST9-Q4TWYfQ"/>
</div>
<span className="text-sm font-bold">Microsoft Corp</span>
</div>
</td>
<td className="px-6 py-4 text-center text-sm font-medium">38</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-amber-400 text-sm fill-current">star</span>
<span className="text-sm font-bold">4.8</span>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
<img alt="Amazon company logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh7sk-VY7E7C74K93doDe11URbbTnYcpZHgXeZwRW1buyzW9sxUE7DB8ziILe6mplSY-V2yER8fsbA6J83xoQfUF76FDo1Vf0qmzsORVtZWsW-y3iWQma_SFF9sw3hRmFV5YOGoa9rgJaayXq-AoeViKXHIjFvahQ3F9VsukzSAniBnGMciCkWD89RRgRamTEhf8Plcpr6gzmYjW9FjZ9-Y_SPZvELQavvPofUxgxGSaRbqrb00vVziUmwCmkRNQzvMASDUegYoA"/>
</div>
<span className="text-sm font-bold">AWS Labs</span>
</div>
</td>
<td className="px-6 py-4 text-center text-sm font-medium">32</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-amber-400 text-sm fill-current">star</span>
<span className="text-sm font-bold">4.7</span>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
<img alt="Meta company logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAal6aTIet4ocCYU8A52KikHPnO396oqMscxHaWChGnDNYw9FONbcGaDTRlr5HUd8mXe3p_2bs0JGbtJj_B642hGYNi36lBVMn0QJs359Y0QDf1AyeS8q1oEjkRDDZWppQURd4pfIwOO1AVZhDIfGEZQ1nZqseWLzW20jajwdyyksmDPMUIIJyiSOOuBXUdd0YoWi1R3Nmt_rsev46kZmU87w9pbsMXq1CFwvqgnt-iqLtrZrPFftEVSsv9jnszxCIHm2lVyg_BA"/>
</div>
<span className="text-sm font-bold">Meta Reality</span>
</div>
</td>
<td className="px-6 py-4 text-center text-sm font-medium">29</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-amber-400 text-sm fill-current">star</span>
<span className="text-sm font-bold">4.6</span>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
<p className="text-xs text-slate-custom">© 2023 InternHub Management System. Data updated as of Oct 31, 2023 11:59 PM.</p>
</div>
</div>
</main>
</div>

    </>
  );
}

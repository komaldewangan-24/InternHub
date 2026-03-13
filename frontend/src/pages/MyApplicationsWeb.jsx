import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function MyApplicationsWeb() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    fetchUser();
  }, []);

  return (
    <>
      <div className="relative flex h-screen w-full overflow-hidden">

<aside className="flex h-full w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6">
<div className="flex items-center gap-3 px-2 mb-8">
<div className="flex items-center justify-center size-8 bg-primary rounded-lg text-white">
<span className="material-symbols-outlined text-xl">database</span>
</div>
<h2 className="text-xl font-bold tracking-tight">InternHub</h2>
</div>
<nav className="flex flex-1 flex-col gap-2">
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/student_dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg" to="/my_applications_web">
<span className="material-symbols-outlined">description</span>
<span className="text-sm font-medium">Applications</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/internship_discovery_page">
<span className="material-symbols-outlined">work</span>
<span className="text-sm font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/interview_schedule_web">
<span className="material-symbols-outlined">event</span>
<span className="text-sm font-medium">Interviews</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">chat_bubble</span>
<span className="text-sm font-medium">Messages</span>
</Link>
<div className="mt-auto">
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/student_profile_page">
<span className="material-symbols-outlined">account_circle</span>
<span className="text-sm font-medium">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-sm font-medium">Settings</span>
</Link>
</div>
</nav>
</aside>

<main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

<header className="flex items-center justify-between h-16 px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
<div className="flex items-center gap-4 flex-1 max-w-xl">
<div className="relative w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 py-2 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search applications..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-2"></div>
<div className="flex items-center gap-3">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500">{user?.profile?.degree || 'Student Portal'}</p>
</div>
<img alt="User profile picture" className="size-10 rounded-full object-cover" data-alt="Professional student headshot for profile picture" src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Alex')}/>
</div>
</div>
</header>
<div className="p-8 space-y-8">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">My Applications</h1>
<p className="text-slate-500 mt-1">Track and manage your internship journey across top tech companies.</p>
</div>
<button className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined text-lg">add</span>
                    New Application
                </button>
</div>

<div className="border-b border-slate-200 dark:border-slate-800">
<nav className="flex gap-8">
<Link className="border-b-2 border-primary text-primary px-1 pb-4 text-sm font-bold flex items-center gap-2" to="/application_tracking_admin">
                        All Applications <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs">12</span>
</Link>
<Link className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-1 pb-4 text-sm font-medium" to="#">
                        Pending
                    </Link>
<Link className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-1 pb-4 text-sm font-medium" to="#">
                        Interview
                    </Link>
<Link className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-1 pb-4 text-sm font-medium" to="#">
                        Selected
                    </Link>
<Link className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-1 pb-4 text-sm font-medium" to="#">
                        Rejected
                    </Link>
</nav>
</div>

<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50">
<th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Company</th>
<th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Role</th>
<th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
<th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Interview Date</th>
<th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">G</div>
<span className="font-bold">Google</span>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Software Engineering Intern</span>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
<span className="size-1.5 rounded-full bg-amber-500 mr-2"></span>
                                        Interview
                                    </span>
</td>
<td className="px-6 py-5">
<span className="text-sm text-slate-500">Oct 15, 2023</span>
</td>
<td className="px-6 py-5 text-right">
<button className="text-primary hover:text-primary/80 text-sm font-bold tracking-wide">VIEW DETAILS</button>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">M</div>
<span className="font-bold">Meta</span>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Design Intern</span>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
<span className="size-1.5 rounded-full bg-blue-500 mr-2"></span>
                                        Pending
                                    </span>
</td>
<td className="px-6 py-5">
<span className="text-sm text-slate-400 italic">TBD</span>
</td>
<td className="px-6 py-5 text-right">
<button className="text-primary hover:text-primary/80 text-sm font-bold tracking-wide">VIEW DETAILS</button>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">A</div>
<span className="font-bold">Amazon</span>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Frontend Developer</span>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
<span className="size-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                        Selected
                                    </span>
</td>
<td className="px-6 py-5">
<span className="text-sm text-slate-400">-</span>
</td>
<td className="px-6 py-5 text-right">
<button className="text-primary hover:text-primary/80 text-sm font-bold tracking-wide">VIEW DETAILS</button>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">N</div>
<span className="font-bold">Netflix</span>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Science Intern</span>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
<span className="size-1.5 rounded-full bg-rose-500 mr-2"></span>
                                        Rejected
                                    </span>
</td>
<td className="px-6 py-5">
<span className="text-sm text-slate-400">-</span>
</td>
<td className="px-6 py-5 text-right">
<button className="text-primary hover:text-primary/80 text-sm font-bold tracking-wide">VIEW DETAILS</button>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-5">
<div className="flex items-center gap-3">
<div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">S</div>
<span className="font-bold">Spotify</span>
</div>
</td>
<td className="px-6 py-5">
<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Backend Engineering</span>
</td>
<td className="px-6 py-5">
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
<span className="size-1.5 rounded-full bg-amber-500 mr-2"></span>
                                        Interview
                                    </span>
</td>
<td className="px-6 py-5">
<span className="text-sm text-slate-500">Nov 02, 2023</span>
</td>
<td className="px-6 py-5 text-right">
<button className="text-primary hover:text-primary/80 text-sm font-bold tracking-wide">VIEW DETAILS</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:divide-slate-800">
<p className="text-sm text-slate-500">Showing 1 to 5 of 12 applications</p>
<div className="flex gap-2">
<button className="px-3 py-1 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled="">Previous</button>
<button className="px-3 py-1 text-sm font-medium bg-primary text-white rounded-lg shadow-sm">1</button>
<button className="px-3 py-1 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
<button className="px-3 py-1 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">3</button>
<button className="px-3 py-1 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
</div>
</div>
</div>
</div>
</main>
</div>

    </>
  );
}

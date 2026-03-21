import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function InterviewScheduleWeb() {
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
      <div className="flex bg-slate-50 dark:bg-slate-950 h-screen overflow-hidden">
<Sidebar role="Student" />

<main className="flex-1 flex flex-col min-w-0">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-8 flex items-center justify-between">
<div className="flex items-center gap-4 flex-1">
<div className="relative max-w-md w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" placeholder="Search candidates or slots..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-2"></div>
<div className="flex items-center gap-3">
<div className="text-right hidden sm:block">
<p className="text-sm font-bold leading-none">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500 mt-1">{user?.profile?.degree || 'Student'}</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-200" data-alt="Profile avatar of student">
<img alt={user?.name || "Student"} className="w-full h-full rounded-full object-cover" src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Alex')} />
</div>
</div>
</div>
</header>

<div className="flex-1 flex overflow-hidden">

<div className="flex-1 p-8 overflow-y-auto">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
<div>
<h2 className="text-3xl font-black tracking-tight">My Interviews</h2>
<p className="text-slate-500 mt-1">Track and join your upcoming internship assessments</p>
</div>
<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
<span className="material-symbols-outlined text-xl">sync</span>
                            Sync Calendar
                        </button>
</div>

<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
<div className="flex items-center gap-4">
<div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
<button className="px-4 py-1.5 text-sm font-bold bg-white dark:bg-slate-700 shadow-sm rounded-lg">Monthly</button>
<button className="px-4 py-1.5 text-sm font-bold text-slate-500">Weekly</button>
<button className="px-4 py-1.5 text-sm font-bold text-slate-500">Daily</button>
</div>
<div className="flex items-center gap-3 ml-4">
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<span className="font-bold text-lg">October 2024</span>
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
<div className="flex items-center gap-2">
<button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2">
<span className="material-symbols-outlined text-base">filter_list</span>
                                All Companies
                            </button>
<button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2">
<span className="material-symbols-outlined text-base">video_camera_front</span>
                                Technical Rounds
                            </button>
</div>
</div>

<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Sun</div>
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Mon</div>
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Tue</div>
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Wed</div>
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Thu</div>
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Fri</div>
<div className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Sat</div>
</div>
<div className="grid grid-cols-7 auto-rows-[120px]">

<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2 opacity-40 bg-slate-50/50">29</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2 opacity-40 bg-slate-50/50">30</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">
<span className="text-sm font-semibold">1</span>
</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">
<span className="text-sm font-semibold">2</span>
<div className="mt-1 space-y-1">
<div className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded truncate">Design Interview - 10 AM</div>
</div>
</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">
<span className="text-sm font-semibold">3</span>
</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">
<span className="text-sm font-semibold">4</span>
</div>
<div className="border-b border-slate-200 dark:border-slate-800 p-2">
<span className="text-sm font-semibold">5</span>
</div>

<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">6</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">7</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2 bg-primary/5">
<span className="text-sm font-bold text-primary">8</span>
<div className="mt-1 space-y-1">
<div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded truncate">Final Interview - 9 AM</div>
<div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded truncate">Intro Call - 2 PM</div>
</div>
</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">9</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">10</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">11</div>
<div className="border-b border-slate-200 dark:border-slate-800 p-2">12</div>

<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">13</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">14</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">15</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">16</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">17</div>
<div className="border-r border-b border-slate-200 dark:border-slate-800 p-2">18</div>
<div className="border-b border-slate-200 dark:border-slate-800 p-2">19</div>
</div>
</div>
</div>

<aside className="w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col gap-8 overflow-y-auto">
<div>
<h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                            Upcoming Today
                            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">3 Events</span>
</h3>
<div className="space-y-4">

<div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-3">
<div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-lg">
G
</div>
<div>
<h4 className="font-bold text-sm">Google</h4>
<p className="text-xs text-slate-500">Technical Round - SWE</p>
</div>
</div>
<span className="text-[10px] font-black uppercase text-slate-400 bg-white dark:bg-slate-700 px-2 py-1 rounded">10:00 AM</span>
</div>
<div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
<span className="material-symbols-outlined text-sm">timer</span>
                                    Starts in 15 mins
                                </div>
<button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90">
<span className="material-symbols-outlined text-sm">videocam</span>
                                    Join Meeting
                                </button>
</div>

<div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-3">
<div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-lg">
M
</div>
<div>
<h4 className="font-bold text-sm">Meta</h4>
<p className="text-xs text-slate-500">Design Challenge Review</p>
</div>
</div>
<span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">02:30 PM</span>
</div>
<div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
<span className="material-symbols-outlined text-sm">video_camera_front</span>
                                    Technical Interview
                                </div>
<div className="flex gap-2">
<button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">Resume</button>
<button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">Brief</button>
</div>
</div>

<div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-3">
<div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-lg">
A
</div>
<div>
<h4 className="font-bold text-sm">Amazon</h4>
<p className="text-xs text-slate-500">HR Intro Call</p>
</div>
</div>
<span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">04:00 PM</span>
</div>
<div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
<span className="material-symbols-outlined text-sm">schedule</span>
                                    Introductory Call
                                </div>
</div>
</div>
</div>

<div className="mt-auto">
<div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
<h4 className="font-bold text-primary text-sm mb-4">Weekly Progress</h4>
<div className="space-y-4">
<div className="flex justify-between items-end">
<span className="text-xs font-medium">Preparation Tasks</span>
<span className="text-sm font-bold">2 / 5</span>
</div>
<div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{width: '40%'}}></div>
</div>
<p className="text-[10px] text-slate-500">Review Data Structures for Google interview tomorrow.</p>
</div>
</div>
</div>
</aside>
</div>
</main>
</div>

    </>
  );
}

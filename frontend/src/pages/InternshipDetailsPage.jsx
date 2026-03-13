import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function InternshipDetailsPage() {
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
      
<div className="flex h-screen overflow-hidden">

<aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col">
<div className="p-6 flex items-center gap-3">
<div className="bg-primary p-1.5 rounded-lg text-white">
<span className="material-symbols-outlined block">hub</span>
</div>
<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">InternHub</h1>
</div>
<nav className="flex-1 px-4 space-y-1">
<p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/admin_dashboard">
<span className="material-symbols-outlined text-[22px]">dashboard</span>
<span className="text-sm font-medium">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" to="/internship_management_admin">
<span className="material-symbols-outlined text-[22px]">work</span>
<span className="text-sm font-medium">Internships</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined text-[22px]">chat_bubble</span>
<span className="text-sm font-medium">Messages</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined text-[22px]">description</span>
<span className="text-sm font-medium">Applications</span>
</Link>
<div className="pt-6">
<p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/student_profile_page">
<span className="material-symbols-outlined text-[22px]">person</span>
<span className="text-sm font-medium">Profile</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined text-[22px]">settings</span>
<span className="text-sm font-medium">Settings</span>
</Link>
</div>
</nav>
<div className="p-4 mt-auto">
<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
<p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-center uppercase">Pro Plan Active</p>
<button className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-opacity">Upgrade Account</button>
</div>
</div>
</aside>

<div className="flex-1 flex flex-col min-w-0 overflow-hidden">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-8 flex items-center justify-between z-10">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm outline-none" placeholder="Search internships, companies..." type="text"/>
</div>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:border-slate-700 mx-1"></div>
<div className="flex items-center gap-3 cursor-pointer group">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500">{user?.role || 'Candidate Profile'}</p>
</div>
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800">
<img className="w-full h-full object-cover" alt={user?.name || "User"} src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Alex')} />
</div>
</div>
</div>
</header>

<main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
<div className="max-w-6xl mx-auto space-y-6">

<nav className="flex text-sm font-medium text-slate-500 dark:text-slate-400">
<Link className="hover:text-primary" to="/internship_management_admin">Internships</Link>
<span className="mx-2">/</span>
<Link className="hover:text-primary" to="#">TechFlow Systems</Link>
<span className="mx-2">/</span>
<span className="text-slate-900 dark:text-white">Software Engineer Intern</span>
</nav>

<div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
<div className="flex items-center gap-6">
<div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="TechFlow Systems company logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYFrWsvneeCb_g0L4J18E5Yczse99FOoLXvcMagYDGMpZuTF3dd06JbCT43KvTjoIfyyewWq8XR_o1lkV2DGHLNSG1pfx7_G3D8qHVPb-BpoQod7TU2XIFNP9TZU03nBQT4qD-smFy2e7T0oYE7UYusCvtwQM_x-h7wXx8w-n9tnBA2I4-__jSCRyNKFaUX5cs6HajQurng7ZjH2YoVqMpdL5E205Qm9LNM5PTVKy4mhNzrY75DHW1FRF6ODU8IBoM43yuuMc8wA"/>
</div>
<div className="space-y-1">
<h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">Software Engineer Intern</h2>
<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 dark:text-slate-400">
<span className="flex items-center gap-1.5 font-semibold text-primary">
<span className="material-symbols-outlined text-lg">corporate_fare</span>
                                            TechFlow Systems
                                        </span>
<span className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-lg text-slate-400">location_on</span>
                                            San Francisco, CA (Remote Friendly)
                                        </span>
<span className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-lg text-slate-400">schedule</span>
                                            Posted 2 days ago
                                        </span>
</div>
</div>
</div>
<div className="flex items-center gap-3">
<button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined text-lg">bookmark</span>
                                    Save
                                </button>
<button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all" onClick={(e) => { e.preventDefault(); navigate('/apply_for_internship_web'); }}>
                                    Apply Now
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-2 space-y-6">

<section className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">info</span>
                                    Company Overview
                                </h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    TechFlow Systems is a fast-growing SaaS company based in San Francisco that focuses on streamlining workflow automation for modern enterprises. We believe in building tools that empower developers and creative teams to do their best work without the friction of outdated systems.
                                </p>
</section>

<section className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">psychology</span>
                                    The Role
                                </h3>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    As a Software Engineer Intern, you will join our core engineering team to help build and maintain scalable features. This is a hands-on role where you'll be treated as a full member of the team, participating in sprints, code reviews, and architectural discussions. We're looking for curious minds who love solving complex problems.
                                </p>
<h4 className="font-bold text-slate-900 dark:text-white mb-3">Key Responsibilities</h4>
<ul className="space-y-3">
<li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        Collaborate with senior engineers to design and implement RESTful APIs using Node.js and TypeScript.
                                    </li>
<li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        Build responsive and intuitive UI components using React and Tailwind CSS.
                                    </li>
<li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        Write comprehensive unit and integration tests to ensure high software quality.
                                    </li>
<li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                                        Optimize database queries for performance and scalability in PostgreSQL.
                                    </li>
</ul>
</section>

<section className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">terminal</span>
                                    Required Skills
                                </h3>
<div className="flex flex-wrap gap-2">
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">React</span>
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">Node.js</span>
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">TypeScript</span>
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">PostgreSQL</span>
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">Git</span>
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">Docker</span>
<span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">Agile Methodologies</span>
</div>
</section>
</div>

<div className="space-y-6">

<div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative group">
<div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-110 transition-transform"></div>
<h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Conversion Potential</h3>
<div className="flex items-end gap-3 mb-4">
<span className="text-5xl font-black text-slate-900 dark:text-white">85%</span>
<span className="text-green-500 font-bold mb-1 flex items-center">
<span className="material-symbols-outlined text-sm">trending_up</span>
                                        High
                                    </span>
</div>
<p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Chance of full-time placement offer upon successful completion of the internship.</p>
<div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{width: '85%'}}></div>
</div>
<p className="mt-4 text-[11px] text-slate-400 font-medium">Based on 12 previous internship cohorts.</p>
</div>

<div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
<div className="pb-4">
<h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Program Details</h3>
<div className="space-y-4">
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 flex items-center gap-2">
<span className="material-symbols-outlined text-lg">payments</span>
                                                Stipend
                                            </span>
<span className="font-bold text-slate-900 dark:text-white">$4,500/mo</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 flex items-center gap-2">
<span className="material-symbols-outlined text-lg">calendar_month</span>
                                                Duration
                                            </span>
<span className="font-bold text-slate-900 dark:text-white">6 Months</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 flex items-center gap-2">
<span className="material-symbols-outlined text-lg">distance</span>
                                                Location
                                            </span>
<span className="font-bold text-slate-900 dark:text-white">San Francisco</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-slate-500 flex items-center gap-2">
<span className="material-symbols-outlined text-lg">laptop_mac</span>
                                                Work Type
                                            </span>
<span className="font-bold text-slate-900 dark:text-white">Remote</span>
</div>
</div>
</div>
<div className="pt-6">
<h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Perks &amp; Benefits</h3>
<ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            Home office equipment budget
                                        </li>
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            Weekly 1-on-1 mentorship
                                        </li>
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            Access to internal tech talks
                                        </li>
<li className="flex items-center gap-3">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            Paid sick leave
                                        </li>
</ul>
</div>
</div>

<div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="h-40 bg-slate-200 relative">
<img className="w-full h-full object-cover grayscale opacity-60" data-alt="Stylized map of San Francisco area" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOE3vgOfc_ezCwv3KvMpUhe9-GTmeLB8_YJNN5-_gEXyX6f1Lb5Tkpah0w7j3a5CrxS_SVUc6mVG1S5hF8k4y-nAX0iL1kIJ6GJMkCXst5Pa6d5-vZDVIH_qhl0Uou3UHnu60Wf07KgPEhx5RrilVmsMHp7A8SqsD21mmsSptj5BxXxhoZNQ9IYaL79Zn-N5NZbuQaP_pavxEUpxCRMaWUkOHy6K_NJqnHpAWqBg-Ee57fBQ6ccbszIsjBy8GxHb6eLZq6-2fd2w"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-primary text-white p-2 rounded-full shadow-lg animate-bounce">
<span className="material-symbols-outlined">location_on</span>
</div>
</div>
</div>
<div className="p-4">
<p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">HQ Location</p>
<p className="text-sm font-semibold text-slate-900 dark:text-white">101 California St, San Francisco, CA</p>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
</div>

    </>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentManagementAdmin() {
  const navigate = useNavigate();
  return (
    <>
      
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
<p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">Admin User</p>
<p className="text-xs text-slate-500 mt-1">Placement Head</p>
</div>
<div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
<img alt="Admin Avatar" className="w-full h-full object-cover" data-alt="Professional avatar portrait of a man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC43wpihn0W0Xdud1-NOG15fHkUbBd4aAncBzU2MHIzo1MBetPa7-sf0zpsy6R11MKGLpnt4DGicHIg839hv1ntLJm412fxfWVIiBxeBCALhaWvFD9h8VDtIyUdu6r1grX8NAW9WmU9RKoVO3BZ2ta3NLXMA3h-zT8szWHJFYNjckntobFimEAsmT2zcjvQ8iFXFAcB_5D4NIJpQ_9n_KOYhyvsOY_tyxHJWeg5Nre1b1VXtwxrTyEzAfTnCTPGU8QYo2VAqqgMOA"/>
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

<tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img alt="Student" className="w-10 h-10 rounded-full bg-slate-100" data-alt="Avatar of student Aria" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiGchISM-zjvPGkMdZl8K9blEer2_4xJI3rRrGZJsK3uTihBie0cIAplGJQF3Wkx5wT1Oz-UQpgb-eKbqG_tihw9sR15SMPdcbY4k0YTpXKda3JdEInt21DgVchvtml2dSM4dtHMF9BgfyUzdT9WxIdw_Ze0m3IGW78CHAzrWU8jz1RF1dZWXEtxlSfijlYAyE5l6wjpArEr4N9aW8Jk0n6uDQMmEBWJq_yRlstQOVtjkmbe4LqCi1TrJdW9T7FHVSXsmCrZqcCg"/>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">Aria Montgomery</p>
<p className="text-xs text-slate-500">ID: 2024CS102</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Computer Science</td>
<td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">9.45</td>
<td className="px-6 py-4">
<div className="flex flex-wrap gap-1">
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">React</span>
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">Node.js</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">Placed</span>
</td>
<td className="px-6 py-4 text-right space-x-3">
<button className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>View Profile</button>
<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>

<tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img alt="Student" className="w-10 h-10 rounded-full bg-slate-100" data-alt="Avatar of student Leo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFYlTzb1y4pYDxzrH_YzAbaobZG_lQGwJjQu3kxpCbK4NR4E-oeHi_XObfPuszPkM3IUQR6k5BZI8JZHz7iTzgl9ZLX8BQIHGWF-pGrbFzY4RTG96tjIE-dUqnnUBSiqG2moE9Ky6ku-mnXNibom3M-XXC6Dw4lfcSgjI5Qx3YHVgLq3EgYO-Uam6No3iWs4aSGna99GYWhH52Q5cKKJwMe_rXQIB0f-AHzPygiKe6RGb8djoEy-Ke5w7s8_C4racX7C7kZnwPnQ"/>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">Leo Fitzgerald</p>
<p className="text-xs text-slate-500">ID: 2024EC405</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Electronics</td>
<td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">8.12</td>
<td className="px-6 py-4">
<div className="flex flex-wrap gap-1">
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">Python</span>
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">Embedded C</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">Seeking</span>
</td>
<td className="px-6 py-4 text-right space-x-3">
<button className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>View Profile</button>
<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>

<tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img alt="Student" className="w-10 h-10 rounded-full bg-slate-100" data-alt="Avatar of student Sarah" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJTOekSm6xBGtJo11iF5mkfzONLF2ALLwFYvSlhupsCFCqtRZssVNfFDlUIFYZoJNkk9ZJUYwPMJ70ecYpmPiEI67DG5jlDs6RHrB_SxFherSE4HvBS2NiclsJrmeGRACRkPr8fI-V2K6RHB3AdqwxjagM5_VbGJDzxQVbod0RCI-6qKcxBl-OOOETreRf7R1sXttHshFtZAyfWzcKdAtF1WwO1HCCZAJYc6sHPWUVT23Ki_NCGHK_CaBZtSUwbqQ8-AVJTpjchw"/>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
<p className="text-xs text-slate-500">ID: 2024CS088</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Computer Science</td>
<td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">7.80</td>
<td className="px-6 py-4">
<div className="flex flex-wrap gap-1">
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">UI/UX</span>
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">Figma</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">In-Progress</span>
</td>
<td className="px-6 py-4 text-right space-x-3">
<button className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>View Profile</button>
<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>

<tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<img alt="Student" className="w-10 h-10 rounded-full bg-slate-100" data-alt="Avatar of student James" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBmW5RU9dUQAptY5ZKE4T_RZnZzAvGCNSNxDETxGXWrlMRBh9mFxmdHzDGDQmeVHwElIzvFFNFZNplKFu654oCZFHBnPNydGM0bUUf_ii24OzjhgLqX2tviwT-LGl0XJ0rClzCrLFIFvIcsl-URRuJN0QsmTA-QVuqVQKKmmVMEP1cEkl8rvTmBs7wUwes4VDgiG5KdhiIrUEWE_rl5NqxNrbNqTsSAPUVqL___KkfwxFh5YAKQ-yC1hMUVxjjZKqG0qZCexauTA"/>
<div>
<p className="text-sm font-bold text-slate-900 dark:text-white">James Wilson</p>
<p className="text-xs text-slate-500">ID: 2024ME221</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Mechanical</td>
<td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">8.67</td>
<td className="px-6 py-4">
<div className="flex flex-wrap gap-1">
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">AutoCAD</span>
<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded">SolidWorks</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">Placed</span>
</td>
<td className="px-6 py-4 text-right space-x-3">
<button className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_profile_page'); }}>View Profile</button>
<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
<span className="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>
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

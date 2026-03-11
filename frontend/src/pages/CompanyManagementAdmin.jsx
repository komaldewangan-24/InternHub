import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CompanyManagementAdmin() {
  const navigate = useNavigate();
  return (
    <>
      
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
<Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" to="/company_management_admin">
<span className="material-symbols-outlined">domain</span>
<span className="font-medium">Companies</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="#">
<span className="material-symbols-outlined">group</span>
<span className="font-medium">Interns</span>
</Link>
<Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/application_tracking_admin">
<span className="material-symbols-outlined">description</span>
<span className="font-medium">Applications</span>
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
<p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Admin User</p>
<p className="text-[10px] text-slate-500 font-medium">Super Admin</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Admin user avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSa_WvE2pkGGcFq-5qry6ehoM2ilm9OHzHG6mg1bRVtEo5FJ_qCN81NMCnNECLH0YTX4QYxB_k3FuznbDt3xUjd5S_ZiRWuG8zfTJpxthwyDKvELfbJDAufDRA74hiTciOGF3t01T8_lFeX8SV9EqbdGfeHzQzFkwnedxLcfl42Xec4RKLh12KMQ3Gzpp2HU6e7oesQjzOXbIc3tvjNi7anCxFFTPQtam7gRqxducRX6V4j4IoXVyd0xHJZR8KhdDmi9nfJWfKuQ"/>
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
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Logo</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Date</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="TechCorp professional company logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD85mbn1SKS-1SurFTiTxW-v6EsmMAWVxG6ivx3QPAFg5BoVqBZg5LwEP1-ToGsSxFxyXu8kw9YyIZNZFT5MkZeFRFPKIoDtNJF_GJpACEUfSeuiLO5UYsr1BMP4Sb3tN6JpQaTybhl1FLUbR1-U7VXC33Iqt-uT3h94Y99yeFOXMcG5Y3eYjMicv2e53WLE_Z2T6mMtUFDWtpxLeOAiyYIxJlyIwzw8EsgzKlAJAh4ET9nDZvlHmy3tZ5fB14cK46dOy-s-qcE6Q"/>
</div>
</td>
<td className="px-6 py-4">
<div className="font-semibold text-slate-900 dark:text-white">TechCorp Solutions</div>
<div className="text-xs text-slate-500">techcorp.com</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Software &amp; AI</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Oct 12, 2023</span>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Approved
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors" onClick={(e) => { e.preventDefault(); navigate('/internship_details_page'); }}>View Details</button>
<button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="DataSystems professional company logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9AZb4SqQYebqp35vdZo4NnxbAsHKSIAtZUawhmIeQB62hDxiQjlm1ZwtUbSqZqX1j3gBN_DruPBGSrKXmHWxMrSQHwxW_SHeS_G8Id3uXgfmb4qh8vjQS6Uzw4tdnHhRrlyvgX5xpPQ7WFGtXixl7LaY6tiLtR26OSd9OKwGPpoicOpt2uRS0k6-eBw7Z3l2tcgPpszZ6q2Ay06v3LpoxG2rLW7EfN2SVKaSUymRout8VR9uWO7cJVYCTTHI5QXHI063EIy-ukg"/>
</div>
</td>
<td className="px-6 py-4">
<div className="font-semibold text-slate-900 dark:text-white">DataSystems Inc.</div>
<div className="text-xs text-slate-500">datasystems.io</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Big Data Analytics</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Oct 15, 2023</span>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                            Pending
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">Approve</button>
<button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">Reject</button>
<button className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg" onClick={(e) => { e.preventDefault(); navigate('/internship_details_page'); }}>Details</button>
</div>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="CloudNet professional company logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPNraBI5thJ0IjTz5QZ6f8wao_CcM2Er2krwMkIu-1rl5w9XdnGsBlqA4tPE4dS8mb817bsKxVNgFEiDkT_Jf3_Ho7mk-WOuZS8OYksx_Qy875Veu0eN-qWQqqXx5WM19tK-CtQ7A7MRM2zm7mZNjPjRMUp2Yta0aCw_DkIeCpu-I3uv83kyf9kZ1lX78MONOaVAFjGFEM608hwaG5Qyi-pxUA_pLKYwQEq50opbczTVSrHOizOLy3GAO-wVRsZRUEIyTltJIAoA"/>
</div>
</td>
<td className="px-6 py-4">
<div className="font-semibold text-slate-900 dark:text-white">CloudNet Global</div>
<div className="text-xs text-slate-500">cloudnet.net</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Networking</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Oct 18, 2023</span>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                            Rejected
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg" onClick={(e) => { e.preventDefault(); navigate('/internship_details_page'); }}>View Details</button>
<button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
<img className="w-full h-full object-cover" data-alt="GreenMotion professional company logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu2q0I-ph2zlV1TNnN0ZQGCnOZlR2PM0ZdI5uEkVenRu7pD9ZLFcEirqHKfOvAUQQYhCtSv2g3Vb8PLInQWi_yTJBBWVsjeJLPpSc8-HeYJ0NwpllLUZ_n15q9qvoXQNdm2w3q8KN8OXQVKnV1vVEsGvv8m4sksApbjcKN30QPsT3faJ-M6aPK46r0EMBHYFIrfA1U3c_Kj-Owy6Vugqndoyx1MaY7HbR1tbAd5DinGK_MrpDUgdSdkJbZG1oWaHvZbMSqC-IO5A"/>
</div>
</td>
<td className="px-6 py-4">
<div className="font-semibold text-slate-900 dark:text-white">GreenMotion</div>
<div className="text-xs text-slate-500">greenmotion.eco</div>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Renewable Energy</span>
</td>
<td className="px-6 py-4">
<span className="text-sm text-slate-600 dark:text-slate-400">Oct 20, 2023</span>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Approved
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg" onClick={(e) => { e.preventDefault(); navigate('/internship_details_page'); }}>View Details</button>
<button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</td>
</tr>
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const registered = location.state?.registered;
  const registeredName = location.state?.name;

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
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-white">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">InternHub</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold tracking-wider">Company Partner</p>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('postings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'postings' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">work</span>
              My Postings
            </button>
            <button 
              onClick={() => setActiveTab('applicants')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'applicants' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">people</span>
              Applicants
            </button>
            <Link 
              to="/message_page"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              Messages
            </Link>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </button>
          </nav>
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Recruiter Account</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'hr@company.com'}</p>
              <button className="w-full mt-3 bg-primary text-white text-sm font-bold py-2 rounded-xl hover:bg-primary/90 transition-all">
                Post New Job
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 min-h-screen">
          <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Search candidates, postings..." type="text"/>
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
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Recruiter'}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block text-left">
<p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500 mt-1">{user?.profile?.degree || 'Recruiter'}</p>
</div>
              </div>
            </div>
          </header>
          <div className="p-8">
            {activeTab === 'dashboard' && (
              <>
                <div className="mb-8">
  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
    {registered ? `Welcome to InternHub, ${registeredName || user?.name || 'Partner'}!` : 'Recruiter Dashboard'}
  </h2>
  <p className="text-slate-500 dark:text-slate-400">
    {registered ? "We're thrilled to have your company on board. Start posting internships and find top talent today!" : 'Manage your postings and review incoming applications.'}
  </p>
</div>                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <span className="material-symbols-outlined">work</span>
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Internship Postings</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4</h3>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <span className="material-symbols-outlined">group_add</span>
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Candidates</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">56</h3>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Applicants</h3>
                    <button className="text-sm font-semibold text-primary hover:underline" onClick={() => setActiveTab('applicants')}>View all candidates</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate Name</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Applied Role</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">David Koh</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Software Engineer Intern</td>
                          <td className="px-6 py-4">
                             <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">In Review</span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-primary text-sm font-bold hover:underline">Schedule Interview</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Emily Chen</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">UX Design Intern</td>
                          <td className="px-6 py-4">
                             <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">New</span>
                          </td>
                          <td className="px-6 py-4">
                           <button className="text-primary text-sm font-bold hover:underline">View Resume</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'postings' && (
              <>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Postings</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage and edit your company's active internships.</p>
                  </div>
                  <button className="bg-primary text-white font-bold py-2 px-4 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span> Create Posting
                  </button>
                </div>
                
                <div className="grid gap-6">
                  {/* Posting Item 1 */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Software Engineer Intern</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">TechFlow Systems • San Francisco (Remote)</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded">Active</span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">Full-time</span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">124 Views</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-lg text-slate-900 dark:text-white">45</p>
                        <p className="text-xs text-slate-500">Applicants</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Edit</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Close</button>
                      </div>
                    </div>
                  </div>

                  {/* Posting Item 2 */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">UX Design Intern</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">TechFlow Systems • San Francisco</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded">Active</span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">Part-time</span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded">89 Views</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-lg text-slate-900 dark:text-white">12</p>
                        <p className="text-xs text-slate-500">Applicants</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Edit</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'applicants' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Applicants Pipeline</h2>
                  <p className="text-slate-500 dark:text-slate-400">Review candidates and manage their application status.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Kanban Column 1 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl min-h-[500px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between">New <span className="bg-slate-200 dark:bg-slate-700 px-2 rounded-full text-xs flex items-center">2</span></h3>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary transition-colors">
                        <h4 className="font-bold text-sm">Emily Chen</h4>
                        <p className="text-xs text-slate-500 mb-3">UX Design Intern</p>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Portfolio Attached</span>
                           <span className="text-[10px] text-slate-400">2d ago</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary transition-colors">
                        <h4 className="font-bold text-sm">Michael Ross</h4>
                        <p className="text-xs text-slate-500 mb-3">Software Engineer Intern</p>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Resume Attached</span>
                           <span className="text-[10px] text-slate-400">1d ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kanban Column 2 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl min-h-[500px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between">In Review <span className="bg-slate-200 dark:bg-slate-700 px-2 rounded-full text-xs flex items-center">1</span></h3>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary transition-colors">
                        <h4 className="font-bold text-sm">David Koh</h4>
                        <p className="text-xs text-slate-500 mb-3">Software Engineer Intern</p>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Pending Assessment</span>
                           <span className="text-[10px] text-slate-400">1w ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kanban Column 3 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl min-h-[500px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between">Interviewing <span className="bg-slate-200 dark:bg-slate-700 px-2 rounded-full text-xs flex items-center">0</span></h3>
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400">No candidates</p>
                    </div>
                  </div>

                  {/* Kanban Column 4 */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl min-h-[500px]">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between">Offered <span className="bg-slate-200 dark:bg-slate-700 px-2 rounded-full text-xs flex items-center">0</span></h3>
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-400">No candidates</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Company Settings</h2>
                  <p className="text-slate-500 dark:text-slate-400">Update your company profile and communication preferences.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-3xl">
                  <h3 className="text-xl font-bold mb-6">Company Profile</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-primary transition-colors">
                      <span className="material-symbols-outlined text-slate-400 text-3xl">add_photo_alternate</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Company Logo</h4>
                      <p className="text-sm text-slate-500 mb-2">Upload a high-resolution logo in PNG or SVG format.</p>
                      <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Upload Base</button>
                    </div>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" type="text" defaultValue="TechFlow Systems" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" type="text" defaultValue="Software & Technology" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Description</label>
                        <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px]" defaultValue="TechFlow Systems is a leading provider of cloud-based workflow automation solutions. We empower businesses to streamline their operations through innovative software." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website URL</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" type="text" defaultValue="https://techflow.example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Email</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" type="email" defaultValue="hr@techflow.example.com" />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all">Save Changes</button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
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
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">InternHub</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold tracking-wider">Faculty Mentor</p>
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
              onClick={() => setActiveTab('mentees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'mentees' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">group</span>
              My Mentees
            </button>
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'approvals' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined">fact_check</span>
              Approvals
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
              <p className="text-sm font-medium text-slate-900 dark:text-white">Faculty Account</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'faculty@university.edu'}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 min-h-screen">
          <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Search mentees..." type="text"/>
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
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Faculty'}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.name || 'Loading...'}</p>
                  <p className="text-xs text-slate-500 mt-1">{user?.profile?.degree || 'Faculty'}</p>
                </div>
              </div>
            </div>
          </header>
          <div className="p-8">
            {activeTab === 'dashboard' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Faculty Dashboard</h2>
                  <p className="text-slate-500 dark:text-slate-400">Monitor your mentees and evaluate internship proposals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <span className="material-symbols-outlined">group</span>
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Assigned Mentees</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">45</h3>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                        <span className="material-symbols-outlined">pending_actions</span>
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Approvals</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</h3>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Mentee Activity</h3>
                    <button className="text-sm font-semibold text-primary hover:underline" onClick={() => setActiveTab('mentees')}>View all</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Year</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Application Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action Needed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Arjun Sharma</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">3rd Year</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Applied to Google</td>
                          <td className="px-6 py-4">
                             <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">Review Proposal</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Priya Patel</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">4th Year</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Interviewing at Microsoft</td>
                          <td className="px-6 py-4">
                             <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">None</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'mentees' && (
              <>
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Mentees</h2>
                    <p className="text-slate-500 dark:text-slate-400">View your assigned students and their progress.</p>
                  </div>
                  <div className="relative w-64 inline-block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Search by name or ID..." type="text"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Mentee Card Protocol */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex gap-4 items-center mb-4">
                          <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 text-xl">AS</div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Arjun Sharma</h3>
                            <p className="text-xs text-slate-500">3rd Year, Computer Science</p>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Active Applications:</span>
                             <span className="font-bold">3</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Status:</span>
                             <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-bold">Interviewing</span>
                           </div>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">View Profile</button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex gap-4 items-center mb-4">
                          <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 text-xl">PP</div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Priya Patel</h3>
                            <p className="text-xs text-slate-500">4th Year, Data Science</p>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Active Applications:</span>
                             <span className="font-bold">1</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">Status:</span>
                             <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold">Placed</span>
                           </div>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">View Profile</button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'approvals' && (
              <>
                 <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pending Approvals</h2>
                    <p className="text-slate-500 dark:text-slate-400">Review internship proposals submitted by your mentees.</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Company & Role</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Arjun Sharma</td>
                          <td className="px-6 py-4">
                             <p className="font-bold text-slate-900 dark:text-white">Google</p>
                             <p className="text-xs text-slate-500">Software Engineer Intern</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">3 Months (Summer)</td>
                          <td className="px-6 py-4">
                             <div className="flex gap-2">
                               <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded shadow-sm">Approve</button>
                               <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded shadow-sm">Reject</button>
                             </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h2>
                  <p className="text-slate-500 dark:text-slate-400">Update your preferences and availability.</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-3xl">
                   <h3 className="text-xl font-bold mb-6">Availability for Mentees</h3>
                   <form>
                     <div className="space-y-4 mb-6">
                       <label className="flex items-center gap-3">
                         <input type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300" defaultChecked/>
                         <span className="text-slate-700 dark:text-slate-300 font-medium">Allow mentees to schedule 1:1 meetings</span>
                       </label>
                       <label className="flex items-center gap-3">
                         <input type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300" defaultChecked/>
                         <span className="text-slate-700 dark:text-slate-300 font-medium">Receive email notifications for new approvals</span>
                       </label>
                     </div>
                     <button type="button" className="bg-primary text-white font-bold py-2 px-6 rounded-xl hover:bg-primary/90 transition-all">Save Changes</button>
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

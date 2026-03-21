import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ role = 'Student' }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: 'grid_view', path: '/student_dashboard' },
    { name: 'Profile', icon: 'person', path: '/student_profile_page' },
    { name: 'Internships', icon: 'work', path: '/internship_discovery_page' },
    { name: 'Applications', icon: 'description', path: '/my_applications_web' },
    { name: 'Interviews', icon: 'event', path: '/interview_schedule_web' },
    { name: 'Messages', icon: 'chat', path: '/message_page' },
    { name: 'Settings', icon: 'settings', path: '/settings_page' },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login_page');
  };

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-50 overflow-y-auto overflow-x-hidden">
      <div className="p-8 flex items-center gap-4">
        <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>layers</span>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">InternHub</h1>
          <p className="text-[11px] text-slate-400 font-medium mt-1">{role} Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-5 mt-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-blue-50 text-primary font-bold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}
              >
                {item.icon}
              </span>
              <span className={`text-[15px] ${isActive ? 'text-primary' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-primary/5 dark:bg-slate-800/50 rounded-2xl p-5 border border-primary/10">
          <div className="flex items-center justify-between mb-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Member</span>
             <span className="material-symbols-outlined text-primary text-lg">verified</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">Access premium listings, AI resume builder & priority support.</p>
          <button className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            Upgrade Plan
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

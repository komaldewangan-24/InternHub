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
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-white dark:bg-[#00152b] border-r border-slate-100 dark:border-white/5 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-50 overflow-y-auto overflow-x-hidden transition-colors">
      <div className="p-8 flex items-center gap-4">
        <div className="size-10 bg-[#003366] rounded-sm flex items-center justify-center text-white shadow-lg shadow-primary/10">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        </div>
        <div>
          <h1 className="text-xl font-poppins font-bold tracking-tighter uppercase text-[#003366] dark:text-white leading-none">InternHub</h1>
          <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">{role} SYSTEM</p>
        </div>
      </div>

      <nav className="flex-1 px-5 mt-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3 rounded-sm transition-all duration-300 group border-l-2 ${
                isActive
                  ? 'bg-slate-50 dark:bg-white/5 border-primary text-[#003366] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 border-transparent'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'opacity-40'}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}
              >
                {item.icon}
              </span>
              <span className={`text-[12px] font-poppins font-bold uppercase tracking-widest ${isActive ? '' : 'opacity-80'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 dark:bg-white/5 rounded-sm p-5 border border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
             <span className="text-[10px] font-poppins font-bold uppercase tracking-widest text-[#003366] dark:text-primary">Institutional Access</span>
             <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4 font-roboto">Complete your profile integrity to unlock prioritized matching nodes.</p>
          <button className="w-full py-2.5 bg-[#003366] text-white rounded-sm text-[10px] font-poppins font-bold uppercase tracking-widest shadow-md hover:bg-primary transition-all">
            Optimize Profile
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-sm text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-poppins font-bold uppercase tracking-widest text-[10px] transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

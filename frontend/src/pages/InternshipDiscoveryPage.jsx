import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, internshipAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast, ToastContainer } from 'react-toastify';

export default function InternshipDiscoveryPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchInternships();
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

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const { data } = await internshipAPI.getAll();
      if (data.success) {
        setInternships(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch internships', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    navigate(`/internship_details_page?id=${id}`);
  };

  const filteredInternships = internships.filter(internship => 
    internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.requirements?.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      
<div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
<Sidebar role="Student" />

<main className="flex-1 flex flex-col overflow-y-auto">

<header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
<div className="flex-1 max-w-xl">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
<input 
  className="w-full pl-11 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm transition-all shadow-sm" 
  placeholder="Search for roles, companies, or skills..." 
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>
</div>
<div className="flex items-center gap-6 pl-8">
<button className="relative text-slate-500 hover:text-primary transition-colors">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
</button>
<div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
<div className="text-right">
<p className="text-sm font-semibold leading-none">{user?.name || 'Loading...'}</p>
<p className="text-xs text-slate-500">{user?.profile?.degree || 'Student'}</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
<img alt={user?.name || "Student"} className="w-full h-full rounded-full object-cover" src={'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.name || 'Alex')} />
</div>
</div>
</div>
</header>
<div className="p-8">

<div className="flex items-center justify-between mb-8">
<div>
<h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Explore Internships</h2>
<p className="text-slate-500 mt-1">Found {filteredInternships.length} internships matching your profile.</p>
</div>
<button className="px-5 py-2.5 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors">
<span className="material-symbols-outlined text-lg">add_circle</span>
                        Post a Project
                    </button>
</div>

<div className="flex flex-wrap gap-4 mb-8">
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Skills: <span className="text-primary">React, Python</span> <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Location: <span className="text-primary">Remote</span> <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Stipend: <span className="text-primary">$4k+</span> <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Duration <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        Department <span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<div className="h-9 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
<button 
  onClick={() => setSearchTerm('')}
  className="flex items-center gap-2 px-4 py-2 text-primary font-bold text-sm hover:underline"
>
  Clear Filters
</button>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{loading ? (
  <div className="col-span-full py-20 text-center">
    <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-slate-500 font-medium">Finding best matches for you...</p>
  </div>
) : filteredInternships.length > 0 ? (
  filteredInternships.map(internship => (
    <div key={internship._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="size-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden border border-slate-100 dark:border-slate-700">
          {internship.company?.logoUrl ? (
            <img src={internship.company.logoUrl} className="w-full h-full object-contain" alt={internship.company.name} />
          ) : (
            <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center font-black text-primary text-xl">
              {internship.company?.name?.charAt(0) || 'I'}
            </div>
          )}
        </div>
        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-wider border border-green-100 italic">New</span>
      </div>
      <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">{internship.title}</h3>
      <p className="text-slate-500 text-sm font-medium mb-4">{internship.company?.name || 'Company'}</p>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
          <span className="material-symbols-outlined text-lg opacity-60">location_on</span>
          <span>{internship.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
          <span className="material-symbols-outlined text-lg opacity-60">payments</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{internship.stipend}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 h-[64px] overflow-hidden content-start">
        {internship.requirements?.map((req, i) => (
          <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 dark:border-slate-700">
            {req}
          </span>
        ))}
      </div>
      <button 
        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
        onClick={() => handleApply(internship._id)}
      >
        View Details
      </button>
    </div>
  ))
) : (
  <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
    <p className="text-slate-500 font-bold text-lg">No internships found</p>
    <p className="text-slate-400 text-sm">Try adjusting your filters or search terms</p>
  </div>
)}
</div>

<div className="mt-12 flex items-center justify-center gap-2">
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">3</button>
<span className="px-2 text-slate-400">...</span>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">12</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</main>
</div>

    </>
  );
}

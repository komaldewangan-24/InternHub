import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import LoadingState from '../components/LoadingState';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { applicationAPI, projectAPI, internshipAPI } from '../services/api';
import { computeStudentReadiness } from '../utils/readiness';

const SkillBar = ({ label, percentage }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] font-poppins">{label}</span>
      <span className="text-[11px] font-black text-[#003366] dark:text-indigo-400 font-poppins">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const StatCard = ({ label, value, icon, description, trend, trendDown }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-indigo-500/30 transition-all flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-sm bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-poppins">{label}</span>
        </div>
        {trend && (
          <div className={`text-[9px] font-black ${trendDown ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'} dark:bg-opacity-10 px-2 py-1 rounded-sm uppercase tracking-widest font-poppins`}>
            {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-[#003366] dark:text-white font-poppins tracking-tighter leading-tight mb-2">{value}</div>
    </div>
    {description && (
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-roboto mt-4 border-t border-slate-50 dark:border-white/5 pt-4">
        {description}
      </p>
    )}
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] -mr-8 -mt-8 rounded-full blur-3xl group-hover:bg-indigo-500/5 transition-all" />
  </div>
);

const InternshipCard = ({ title, company, location, salary, tags, match }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 rounded-2xl flex-1 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-2xl group flex flex-col items-center text-center">
    <div className="size-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-all">
      <span className="material-symbols-outlined text-[36px]">{title.toLowerCase().includes('design') ? 'brush' : 'code'}</span>
    </div>
    
    <div className="space-y-3 mb-8">
      <h3 className="text-xl font-bold text-[#003366] dark:text-white uppercase tracking-tighter font-poppins leading-tight">{title}</h3>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium font-roboto uppercase tracking-widest">{company} • {location}</p>
    </div>

    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {tags.map(tag => (
        <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-sm uppercase tracking-widest border border-slate-100 dark:border-white/5 font-poppins">
          {tag}
        </span>
      ))}
    </div>

    <div className="w-full pt-6 border-t border-slate-50 dark:border-white/5 flex flex-col items-center gap-4 mt-auto">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black text-[#003366] dark:text-white font-poppins tracking-tighter">{salary}</span>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-sm uppercase tracking-widest font-poppins border border-blue-100 dark:border-blue-500/10">
          {match}% MATCH
        </span>
      </div>
      <button className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest font-poppins hover:scale-105 transition-transform flex items-center gap-2">
        Apply Now <span className="material-symbols-outlined text-[18px]">east</span>
      </button>
    </div>
  </div>
);

export default function StudentDashboard() {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applications: 0, underReview: 0, approved: 0, internships: 0 });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setPageLoading(true);
        const [appRes, projRes, internRes] = await Promise.all([
          applicationAPI.getAll(),
          projectAPI.getAll(),
          internshipAPI.getAll(),
        ]);

        const allProjects = projRes.data.data || [];
        setStats({
          applications: (appRes.data.data || []).length,
          underReview: allProjects.filter(p => p.status === 'pending' || p.status === 'submitted').length,
          approved: allProjects.filter(p => p.status === 'approved').length,
          internships: (internRes.data.data || []).length,
        });
      } finally {
        setPageLoading(false);
      }
    };
    if (user) loadDashboardData();
  }, [user]);

  if (loading || pageLoading) return <LoadingState label="Loading dashboard..." />;

  const readiness = computeStudentReadiness({
    user,
    approvedProjects: stats.approved,
    applications: stats.applications,
  });

  return (
    <AppShell
      title="Student Dashboard"
      navigation={navigationByRole.student}
      user={user}
    >
      {/* Refined Welcome Section */}
      <div className="max-w-[1440px] mx-auto pt-0 mb-4 overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter leading-none text-slate-800 dark:text-white font-poppins">
              Hey {user?.name?.split(' ')[0]}👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-md lg:text-lg font-roboto">
              You’re making great progress. Let’s keep going!
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold text-[12px] uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md font-poppins group">
              <span className="material-symbols-outlined text-[20px] group-hover:-translate-y-1 transition-transform">download</span>
              Resume
            </button>
            <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold text-[12px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all border border-blue-500 font-poppins group">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-125 transition-transform">add</span>
              New Application
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto space-y-4 pb-8">

        {/* Profile Completion Card (Compact) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm relative overflow-hidden group">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <h2 className="text-xl font-bold text-[#003366] dark:text-white font-poppins tracking-tight uppercase">Placement Readiness</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-roboto leading-none max-w-xl">
                You’re {readiness.profileCompletion}% placement-ready. Let’s push it to 30% today 🚀
              </p>
            </div>
            <div className="text-3xl font-black text-[#003366] dark:text-white font-poppins tracking-tighter">{readiness.profileCompletion}%</div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 mb-6 relative overflow-hidden shadow-inner">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-[1s] ease-out" style={{ width: `${readiness.profileCompletion}%` }}></div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 px-6 py-2 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest font-poppins border border-green-100 dark:border-green-500/20">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Academic Info
            </span>
            <span className="flex items-center gap-2 px-6 py-2 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest font-poppins border border-green-100 dark:border-green-500/20">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Experience
            </span>
            <button className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-white/5 border-2 border-dashed border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest font-poppins hover:bg-amber-50 transition-all">
              <span className="material-symbols-outlined text-[16px]">add_circle</span> Add Portfolio (+25%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  label: 'Profile Strength', 
                  value: '48% Complete', 
                  icon: 'visibility', 
                  description: 'Complete your profile to increase visibility',
                  trend: '+15%',
                  color: 'blue'
                },
                { 
                  label: 'Career Readiness', 
                  value: `Getting Started (${readiness.score}%)`, 
                  icon: 'rocket_launch', 
                  description: 'Participate in more activities to level up',
                  trend: '+5%',
                  color: 'amber'
                },
                { 
                  label: 'Active Applications', 
                  value: '4 Ongoing', 
                  icon: 'folder_open', 
                  description: 'Track your existing internship pipelines',
                  trend: 'Stable',
                  color: 'emerald'
                },
                { 
                  label: 'Interviews', 
                  value: '3 Scheduled', 
                  icon: 'event_available', 
                  description: 'Manage your upcoming selection rounds',
                  trend: 'Active',
                  color: 'emerald'
                }
              ].map((stat, i) => {
                const colors = {
                  blue: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
                  amber: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
                  emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
                };
                return (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                          <div className={`size-8 rounded-sm ${colors[stat.color]} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-poppins">{stat.label}</span>
                        </div>
                        {stat.trend && (
                          <div className={`text-[9px] font-black ${stat.trendDown ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'} dark:bg-opacity-10 px-2 py-1 rounded-sm uppercase tracking-widest font-poppins`}>
                            {stat.trend}
                          </div>
                        )}
                      </div>
                      <div className="text-3xl font-black text-[#003366] dark:text-white font-poppins tracking-tighter leading-tight mb-2">{stat.value}</div>
                    </div>
                    {stat.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-roboto mt-4 border-t border-slate-50 dark:border-white/5 pt-4">
                        {stat.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recommendation Section in Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                <h2 className="text-xl font-bold text-[#003366] dark:text-white font-poppins tracking-tighter uppercase">Recommendation</h2>
                <button onClick={() => navigate('/internships')} className="text-[11px] font-black text-blue-500 uppercase tracking-widest hover:opacity-70 transition-all font-poppins flex items-center gap-2">View More <span className="material-symbols-outlined text-sm">open_in_new</span></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Data Scientist Intern', company: 'MoSPI India', match: 98, salary: '₹25,000', location: 'Delhi', tags: ['Python', 'SQL', 'Statistics'] },
                  { title: 'Software Engineer', company: 'TechFlow Solutions', match: 92, salary: '₹35,000', location: 'Remote', tags: ['React', 'Node.js'] },
                  { title: 'Product Design', company: 'Creative Labs', match: 88, salary: '₹22,000', location: 'Bangalore', tags: ['Figma', 'UX'] }
                ].map((item, idx) => (
                  <InternshipCard key={idx} {...item} />
                ))}
              </div>
            </div>

            {/* Skill match distribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#003366] dark:text-white font-poppins tracking-tighter uppercase mb-8 pb-4 border-b border-slate-50 dark:border-white/5">Skill Proficiency</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                <SkillBar label="Statistical Analysis" percentage={92} />
                <SkillBar label="Machine Learning" percentage={78} />
                <SkillBar label="System Design" percentage={65} />
                <SkillBar label="Database Mgmt" percentage={85} />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Status Tracking */}
            <div className="bg-white dark:bg-[#003366] border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-slate-800 dark:text-white shadow-sm dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 size-48 rounded-full bg-indigo-500/5 dark:bg-white/5 -mr-10 -mt-10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <h3 className="text-xl font-bold font-poppins mb-8 uppercase tracking-tighter text-[#003366] dark:text-white">Live Status</h3>
              <div className="flex justify-center mb-8">
                <div className="size-40 rounded-full border-[10px] border-slate-100 dark:border-white/5 flex items-center justify-center relative shadow-sm dark:shadow-2xl">
                  <div className="absolute inset-0 rounded-full border-[10px] border-blue-500 dark:border-blue-400 border-t-transparent animate-[spin_10s_linear_infinite]" />
                  <div className="text-center">
                    <span className="text-4xl font-black font-poppins tracking-tighter text-[#003366] dark:text-white">04</span>
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-white/50 font-poppins mt-1">Pipelines</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Pending Approval', count: 2, color: 'bg-rose-500 dark:bg-rose-400' },
                  { label: 'In Review', count: 1, color: 'bg-amber-500 dark:bg-amber-400' },
                  { label: 'Interviewing', count: 1, color: 'bg-emerald-500 dark:bg-emerald-400' }
                ].map((status, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group/status">
                    <div className="flex items-center gap-4">
                      <div className={`size-3 rounded-full ${status.color} shadow-lg`} />
                      <span className="text-[11px] font-bold uppercase tracking-widest font-poppins text-slate-500 dark:text-white/70 group-hover/status:text-slate-800 dark:group-hover/status:text-white transition-colors">{status.label}</span>
                    </div>
                    <span className="text-[16px] font-black font-poppins text-[#003366] dark:text-white">{status.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                 <h3 className="text-xl font-bold text-[#003366] dark:text-white font-poppins uppercase tracking-tighter">Calendar</h3>
                 <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                 </div>
              </div>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-emerald-500/20 hover:border-emerald-500 transition-all">
                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] font-poppins mb-3">MAR 2{i + 4} • 10:00</p>
                    <h4 className="text-[16px] font-bold text-slate-800 dark:text-white font-poppins mb-2 uppercase tracking-tight leading-tight">Institutional Selection Round</h4>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium font-roboto leading-relaxed mb-4">Verification of statistics portfolio and project approvals.</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-12 py-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:border-blue-500/50 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-poppins">Sync Calendar</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AppShell from '../components/AppShell';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StatusBadge from '../components/StatusBadge';
import { navigationByRole } from '../constants/navigation';
import useCurrentUser from '../hooks/useCurrentUser';
import { projectAPI } from '../services/api';

export default function StudentProjectsPage() {
  const { user, loading } = useCurrentUser();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const initialFormState = {
    title: '',
    description: '',
    githubLink: '',
    liveLink: '',
    tags: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const loadProjects = async () => {
    try {
      setPageLoading(true);
      const { data } = await projectAPI.getAll();
      setProjects(data.data || []);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = () => {
    setSelectedProject(null);
    setFormData(initialFormState);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      githubLink: project.links?.github || '',
      liveLink: project.links?.live || '',
      tags: project.tags?.join(', ') || '',
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectAPI.delete(projectId);
      toast.success('Project deleted successfully.');
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
        setIsEditing(false);
      }
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete project.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedData = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
    };

    try {
      if (isCreating) {
        await projectAPI.create(formattedData);
        toast.success('Project created successfully.');
      } else {
        await projectAPI.update(selectedProject._id, formattedData);
        toast.success('Project updated successfully.');
      }
      setIsEditing(false);
      setIsCreating(false);
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Submission failed.');
    }
  };

  if (loading || pageLoading) {
    return <LoadingState label="Loading projects..." />;
  }

  return (
    <AppShell
      actions={
        <button
          className="rounded-sm text-white px-8 py-3 text-[11px] font-poppins font-bold uppercase tracking-[0.2em] shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
          style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
          onClick={handleCreate}
        >
          Add New Project
        </button>
      }
      title="Projects"
      description="Showcase your technological nodes and implementation proficiency."
      navigation={navigationByRole.student}
      user={user}
    >
      <div className="flex h-[calc(100vh-280px)] flex-col gap-10 lg:flex-row lg:items-start lg:px-4 uppercase">
        <section className="flex-[0.85] flex flex-col overflow-hidden rounded-sm bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 h-full lg:min-w-[340px] transition-all group hover:shadow-2xl duration-500">
          <div className="p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/10 dark:bg-transparent relative">
             <div className="flex items-center gap-4 mb-5 relative">
                <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[11px] font-poppins font-bold uppercase tracking-[0.3em] text-indigo-500">PORTFOLIO NODES</p>
             </div>
             <p className="text-[11px] font-poppins font-bold uppercase tracking-widest text-slate-400 opacity-60">Total Nodes: {projects.length}</p>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto p-8 scrollbar-hide">
            {projects.length ? projects.map((project) => {
              const isSelected = selectedProject?._id === project._id;
              return (
              <div
                key={project._id}
                className={`group relative rounded-sm p-6 text-left transition-all duration-500 border-2 cursor-pointer 
                  ${isSelected
                    ? 'text-white border-transparent shadow-xl scale-[1.01]'
                    : 'bg-white dark:bg-white/5 border-slate-50 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-lg'
                  }
                `}
                style={{ backgroundImage: isSelected ? 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' : 'none' }}
                onClick={() => handleEdit(project)}
              >
                <div className="flex justify-between items-start mb-3">
                   <h4 className={`text-xs font-poppins font-bold tracking-tight uppercase leading-none truncate pr-4 ${isSelected ? 'text-white' : 'text-[#003366] dark:text-white'}`}>{project.title}</h4>
                   {project.status === 'approved' ? (
                     <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                       <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                       <p className="text-[8px] font-poppins font-bold text-emerald-600">ACTIVE</p>
                     </div>
                   ) : (
                     <StatusBadge status={project.status} />
                   )}
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                   {(project.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className={`text-[8px] font-poppins font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border ${
                      isSelected ? 'border-white/20 text-white/60' : 'border-slate-100 dark:border-white/10 text-slate-400'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50/10">
                   <p className={`text-[8px] font-poppins font-bold uppercase tracking-widest ${isSelected ? 'text-white/40' : 'text-slate-300'}`}>NODE_LINK</p>
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}
                     className={`material-symbols-outlined text-[18px] transition-all hover:scale-125 ${isSelected ? 'text-rose-400' : 'text-slate-200 hover:text-rose-500'}`}
                   >
                     delete_forever
                   </button>
                </div>
              </div>
            )}) : (
              <EmptyState icon="folder_off" title="No Projects" description="Start by adding your first project." />
            )}
          </div>
        </section>

        {/* Project Editor */}
        <section className="flex-[1.15] flex flex-col overflow-hidden rounded-sm bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 h-full relative group transition-all duration-500 hover:shadow-2xl">
          {(isEditing || isCreating) ? (
            <form className="flex h-full flex-col px-12 py-12 relative" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-12 border-b border-slate-100 dark:border-white/5 pb-10">
                <div className="flex items-center gap-8">
                  <div 
                    className="flex size-16 items-center justify-center rounded-sm text-white text-2xl font-poppins font-bold shadow-lg transition-transform group-hover:rotate-3"
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                  >
                    {isCreating ? 'N' : 'E'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none">{isCreating ? 'New Project Node' : 'Edit Project Node'}</h2>
                    <p className="mt-3 text-[10px] font-poppins font-bold uppercase tracking-[0.4em] text-indigo-500">INSTITUTIONAL DATA ENTRY</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="group/field relative">
                       <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                         <span className="material-symbols-outlined text-[18px]">title</span>
                         Project Title
                       </p>
                        <input 
                          required 
                          className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm focus:shadow-md transform focus:-translate-y-0.5" 
                          placeholder="e.g. Neural Matching System" 
                          type="text" 
                          value={formData.title} 
                          onChange={(event) => setFormData({ ...formData, title: event.target.value })} 
                        />
                    </div>
                    <div className="group/field relative">
                       <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                         <span className="material-symbols-outlined text-[18px]">hub</span>
                         Tech Stack
                       </p>
                        <input 
                          className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm focus:shadow-md transform focus:-translate-y-0.5" 
                          placeholder="React, Node.js, Tailwind..." 
                          type="text" 
                          value={formData.tags} 
                          onChange={(event) => setFormData({ ...formData, tags: event.target.value })} 
                        />
                    </div>
                </div>

                <div className="group/field relative">
                   <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                     <span className="material-symbols-outlined text-[18px]">description</span>
                     Project Architecture
                   </p>
                   <textarea 
                     required 
                     className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-8 py-6 text-sm font-roboto leading-relaxed outline-none focus:border-indigo-500 transition-all dark:text-white resize-none h-48 lowercase shadow-inner focus:shadow-md transform focus:-translate-y-0.5" 
                     placeholder="Outline the architectural decisions and your specific implementation role..." 
                     value={formData.description} 
                     onChange={(event) => setFormData({ ...formData, description: event.target.value })} 
                   />
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                   <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">terminal</span>
                        Repository
                      </p>
                      <input 
                        className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm focus:shadow-md transform focus:-translate-y-0.5" 
                        placeholder="https://github.com/..." 
                        type="url" 
                        value={formData.githubLink} 
                        onChange={(event) => setFormData({ ...formData, githubLink: event.target.value })} 
                      />
                   </div>
                   <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">captive_portal</span>
                        Live Service
                      </p>
                      <input 
                        className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm focus:shadow-md transform focus:-translate-y-0.5" 
                        placeholder="https://..." 
                        type="url" 
                        value={formData.liveLink} 
                        onChange={(event) => setFormData({ ...formData, liveLink: event.target.value })} 
                      />
                   </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex gap-6">
                <button 
                  className="flex-1 rounded-sm text-white py-5 text-[11px] font-poppins font-bold uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-all active:scale-[0.98]" 
                  style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                  type="submit"
                >
                  Synchronize Node
                </button>
                <button 
                  className="px-10 rounded-sm bg-slate-50 dark:bg-white/5 text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all" 
                  onClick={() => { setIsEditing(false); setIsCreating(false); }}
                  type="button"
                >
                  Abort
                </button>
              </div>
            </form>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-20 text-center relative">
               <div className="flex size-32 items-center justify-center rounded-sm bg-[#f8fafc] dark:bg-white/5 border border-slate-100 dark:border-white/5 text-indigo-500/20 mb-10 shadow-inner">
                 <span className="material-symbols-outlined text-[56px] opacity-20 transition-transform group-hover:scale-110">add_task</span>
               </div>
               <h3 className="text-3xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none mb-6">Select Project Node</h3>
               <p className="max-w-xs text-[11px] font-poppins font-bold uppercase tracking-widest text-slate-400 leading-relaxed overflow-hidden opacity-70">Choose an existing technological node to visualize or modify system data.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

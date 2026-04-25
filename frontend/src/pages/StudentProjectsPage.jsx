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
  const [currentStep, setCurrentStep] = useState(1);

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
    setCurrentStep(1);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      githubLink: project.links?.find(l => l.includes('github.com')) || project.links?.[0] || '',
      liveLink: project.links?.find(l => !l.includes('github.com') && l.startsWith('http')) || project.links?.[1] || '',
      tags: project.tags?.join(', ') || '',
    });
    setIsEditing(true);
    setIsCreating(false);
    setCurrentStep(5); // Start at review step for quick save, or 1 if you want
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
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
      links: [formData.githubLink, formData.liveLink].filter(Boolean),
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

  const templates = {
    'Web App': { title: 'Modern Web Application', tags: 'React, Node.js, Tailwind CSS', description: 'A comprehensive full-stack solution featuring responsive architecture and institutional-grade data management.' },
    'Data Science': { title: 'Predictive Analytics Engine', tags: 'Python, Pandas, Scikit-learn', description: 'Implementation of advanced data processing nodes and statistical visualizations for institutional insight.' },
    'AI/ML': { title: 'Neural Logic Processor', tags: 'TensorFlow, Python, NumPy', description: 'Development of an AI-driven optimization system for automated decision making and neural node routing.' },
    'Mobile App': { title: 'Cross-platform Mobile Node', tags: 'React Native, Expo, Firebase', description: 'A seamless mobile experience utilizing real-time data synchronization and edge implementation.' }
  };

  const handleTemplateClick = (type) => {
    const template = templates[type];
    setFormData({
      title: template.title,
      tags: template.tags,
      description: template.description,
      githubLink: '',
      liveLink: ''
    });
    setIsCreating(true);
    setIsEditing(false);
    setCurrentStep(1);
    toast.info(`${type} template loaded. Adjust the details to match your project.`);
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
      <div className="flex h-[calc(100vh-220px)] flex-col gap-6 lg:flex-row lg:items-stretch lg:px-4 uppercase">
        <section className="flex-[0.85] flex flex-col overflow-hidden rounded-sm bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 h-full lg:min-w-[340px] transition-all group hover:shadow-2xl duration-500">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/10 dark:bg-transparent relative">
            <div className="flex items-center gap-4 mb-3 relative">
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
                  className={`group relative rounded-sm p-8 text-left transition-all duration-500 border-2 cursor-pointer 
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
                      <span key={tag} className={`text-[8px] font-poppins font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border ${isSelected ? 'border-white/20 text-white/60' : 'border-slate-100 dark:border-white/10 text-slate-400'
                        }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50/10">
                      <p className={`text-[8px] font-poppins font-bold uppercase tracking-widest ${isSelected ? 'text-white/40' : 'text-slate-300'}`}>NODE_LINK</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                          className={`material-symbols-outlined text-[18px] transition-all hover:scale-125 ${isSelected ? 'text-white' : 'text-slate-200 hover:text-indigo-500'}`}
                        >
                          edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}
                          className={`material-symbols-outlined text-[18px] transition-all hover:scale-125 ${isSelected ? 'text-rose-400' : 'text-slate-200 hover:text-rose-500'}`}
                        >
                          delete_forever
                        </button>
                      </div>
                    </div>
                </div>
              )
            }) : (
              <div className="py-6 flex flex-col items-center text-center animate-in fade-in duration-700">
                <h3 className="text-2xl font-poppins font-black text-[#003366] dark:text-white uppercase tracking-tighter mb-4 leading-none">
                  Start Building Your Portfolio 🚀
                </h3>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12 max-w-sm opacity-70">
                  Formalize your implementation experience into verified career credentials.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-3 px-8 py-5 rounded-sm text-white text-[12px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all w-full"
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Create New Project
                  </button>

                  <button className="flex items-center justify-center gap-3 px-8 py-5 rounded-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 w-full group">
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-y-0.5 transition-transform">folder_open</span>
                    Import Project (GitHub / File)
                  </button>
                </div>

                <div className="mt-12 w-full max-w-xs animate-in slide-in-from-bottom-5 duration-1000">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Create Project From Template</p>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                  </div>

                  <div className="relative group">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleTemplateClick(e.target.value);
                          e.target.value = ''; // Reset for next selection
                        }
                      }}
                      className="w-full h-15 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none hover:bg-white dark:hover:bg-white/10"
                    >
                      <option value="" className="text-slate-400">Select Core Technology Node...</option>
                      {Object.keys(templates).map(type => (
                        <option key={type} value={type} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-3">
                          {type === 'Web App' ? '💻 ' : type === 'Data Science' ? '📊 ' : type === 'AI/ML' ? '🤖 ' : '📱 '}
                          {type.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Project Editor */}
        <section className="flex-[1.2] flex flex-col overflow-hidden rounded-sm bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 h-full relative group transition-all duration-500 hover:shadow-2xl">
          {(isEditing || isCreating) ? (
            <div className="flex h-full flex-col px-10 py-10 relative">
              <div className="flex items-start justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-8">
                <div className="flex items-center gap-8">
                  <div
                    className="flex size-16 items-center justify-center rounded-sm text-white text-2xl font-poppins font-bold shadow-lg transition-transform group-hover:rotate-3 shrink-0"
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                  >
                    {isCreating ? 'N' : 'E'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none">{isCreating ? 'New Project Node' : 'Edit Project Node'}</h2>
                    <p className="mt-3 text-[10px] font-poppins font-bold uppercase tracking-[0.4em] text-indigo-500">
                      Step {currentStep}: {['Basic Info', 'Tech Stack', 'Architecture', 'Links', 'Review'][currentStep - 1]}
                    </p>
                  </div>
                </div>

                {/* Visual Progress Indicator */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/10">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`size-2.5 rounded-full transition-all duration-500 ${s <= currentStep ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-200 dark:bg-white/10'}`} />
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
                    <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">title</span>
                        Project Title
                      </p>
                      <input
                        required
                        className="w-full h-14 rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-6 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm hover:shadow-md transition-all"
                        placeholder="e.g. Neural Matching System"
                        type="text"
                        value={formData.title}
                        onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium px-1">Define an authoritative title for your technological implementation.</p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
                    <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">hub</span>
                        Tech Stack
                      </p>
                      <input
                        className="w-full h-14 rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-6 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm hover:shadow-md transition-all"
                        placeholder="React, Node.js, Tailwind..."
                        type="text"
                        value={formData.tags}
                        onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium px-1">Enumerate the core technologies comprising this implementation node.</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
                    <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        Project Architecture
                      </p>
                      <textarea
                        required
                        className="w-full rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-8 py-6 text-sm font-roboto leading-relaxed outline-none focus:border-indigo-500 transition-all dark:text-white resize-none h-64 shadow-inner focus:shadow-md transition-all"
                        placeholder="Outline the architectural decisions and your specific implementation role..."
                        value={formData.description}
                        onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
                    <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">terminal</span>
                        Repository Link
                      </p>
                      <input
                        className="w-full h-14 rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-6 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm hover:shadow-md transition-all"
                        placeholder="https://github.com/..."
                        type="url"
                        value={formData.githubLink}
                        onChange={(event) => setFormData({ ...formData, githubLink: event.target.value })}
                      />
                    </div>
                    <div className="group/field relative">
                      <p className="text-[9px] font-poppins font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-1 flex items-center gap-3 group-hover/field:text-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                        Live Service URL
                      </p>
                      <input
                        className="w-full h-14 rounded-sm border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-6 py-4 text-sm font-medium outline-none focus:border-indigo-500 transition-all dark:text-white shadow-sm hover:shadow-md transition-all"
                        placeholder="https://..."
                        type="url"
                        value={formData.liveLink}
                        onChange={(event) => setFormData({ ...formData, liveLink: event.target.value })}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="p-8 rounded-sm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                        <h4 className="text-sm font-black text-[#003366] dark:text-white uppercase tracking-widest">{formData.title}</h4>
                        <button 
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[10px] font-bold text-indigo-500 hover:underline hover:text-indigo-600 transition-all"
                        >
                          EDIT CONFIGURATION
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tech Stack</p>
                          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">{formData.tags}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Links Attached</p>
                          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{(formData.githubLink || formData.liveLink) ? 'Status: Integrated' : 'None'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture Summary</p>
                        <p className="text-[10px] font-medium text-slate-500 leading-relaxed line-clamp-3">{formData.description}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Everything looks correct? Ready to synchronize.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex gap-6">
                {currentStep > 1 && (
                  <button
                    className="px-10 rounded-sm bg-slate-50 dark:bg-white/5 text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    type="button"
                  >
                    Back
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    className="flex-1 rounded-sm text-white py-5 text-[11px] font-poppins font-bold uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                    onClick={() => {
                      if (currentStep === 1 && !formData.title) return toast.error('Project title is required');
                      if (currentStep === 3 && !formData.description) return toast.error('Description is required');
                      setCurrentStep(prev => prev + 1);
                    }}
                    type="button"
                  >
                    Continue Implementation
                  </button>
                ) : (
                  <button
                    className="flex-1 rounded-sm text-white py-5 text-[11px] font-poppins font-bold uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                    style={{ backgroundImage: 'linear-gradient(135deg, #003366 0%, #0066cc 100%)' }}
                    onClick={handleSubmit}
                    type="button"
                  >
                    {isEditing ? 'Save Changes' : 'Synchronize Node'}
                  </button>
                )}

                {isEditing && currentStep < 5 && (
                  <button
                    className="px-10 rounded-sm bg-indigo-600 text-white text-[10px] font-poppins font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
                    onClick={handleSubmit}
                    type="button"
                  >
                    Quick Save
                  </button>
                )}

                <button
                  className="px-10 rounded-sm bg-slate-50 dark:bg-white/5 text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all ml-auto"
                  onClick={() => { setIsEditing(false); setIsCreating(false); }}
                  type="button"
                >
                  Abort
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-20 text-center relative">
              <div className="flex size-32 items-center justify-center rounded-sm bg-[#f8fafc] dark:bg-white/5 border border-slate-100 dark:border-white/5 text-indigo-500/20 mb-10 shadow-inner">
                <span className="material-symbols-outlined text-[56px] opacity-20 transition-transform group-hover:scale-110">add_task</span>
              </div>
              <h3 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase leading-none mb-4">No Project Selected</h3>
              <p className="max-w-xs text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 leading-relaxed opacity-70">Select a project node from the left to visualize implementation details.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

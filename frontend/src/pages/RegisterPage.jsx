import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, companyAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  
  // Student state
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  
  // Company state
  const [cName, setCName] = useState('');
  const [cRecruiterName, setCRecruiterName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cPassword, setCPassword] = useState('');

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if(!sName || !sEmail || !sPassword) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name: sName, email: sEmail, password: sPassword, role: 'student' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful!');
      setTimeout(() => navigate('/student_dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if(!cName || !cRecruiterName || !cEmail || !cPhone || !cPassword) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name: cRecruiterName, email: cEmail, password: cPassword, role: 'recruiter' });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Also construct company profile
      await companyAPI.create({ name: cName, description: 'Newly registered company', email: cEmail, phone: cPhone });
      
      toast.success('Registration successful!');
      setTimeout(() => navigate('/recruiter_dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };
  return (
    <>
      
<div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<ToastContainer position="top-right" />
<div className="layout-container flex h-full grow flex-col">

<header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-white dark:bg-slate-900">
<div className="flex items-center gap-2 text-primary">
<span className="material-symbols-outlined text-3xl font-bold">layers</span>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">InternHub</h2>
</div>
<div className="flex items-center gap-4">
<span className="hidden md:inline text-slate-600 dark:text-slate-400 text-sm">Already have an account?</span>
<button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/student_dashboard'); }}>
<span>Sign In</span>
</button>
</div>
</header>
<main className="flex-1 flex items-center justify-center p-6 lg:p-12">
<div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
<div className="p-8 md:p-10">
<div className="text-center mb-10">
<h1 className="text-slate-900 dark:text-slate-100 text-3xl font-bold mb-2">Create your account</h1>
<p className="text-slate-500 dark:text-slate-400 text-base">Join the leading internship network and launch your career</p>
</div>

<div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
<button 
  onClick={() => setActiveTab('student')}
  className={`flex-1 flex flex-col items-center justify-center border-b-2 pb-4 transition-colors ${activeTab === 'student' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
>
<span className="text-sm font-bold tracking-tight">Student Registration</span>
</button>
<button 
  onClick={() => setActiveTab('company')}
  className={`flex-1 flex flex-col items-center justify-center border-b-2 pb-4 transition-colors ${activeTab === 'company' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
>
<span className="text-sm font-bold tracking-tight">Company Registration</span>
</button>
</div>

{activeTab === 'student' ? (
<form className="space-y-5">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Full Name</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="John Doe" type="text" value={sName} onChange={(e)=>setSName(e.target.value)}/>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Roll Number</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="CS2024001" type="text"/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Department</label>
<select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all appearance-none">
<option>Computer Science</option>
<option>Electrical Engineering</option>
<option>Mechanical Engineering</option>
<option>Business Administration</option>
<option>Design &amp; Arts</option>
</select>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Email Address</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="john@university.edu" type="email" value={sEmail} onChange={(e)=>setSEmail(e.target.value)}/>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Password</label>
<div className="relative">
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="••••••••" type="password" value={sPassword} onChange={(e)=>setSPassword(e.target.value)}/>
<span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 cursor-pointer">visibility</span>
</div>
<p className="text-xs text-slate-500 mt-1">Must be at least 8 characters with one number.</p>
</div>
<div className="pt-4">
<button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70" type="submit" onClick={handleStudentSubmit}>
<span>{loading ? 'Creating...' : 'Create Student Account'}</span>
{!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
</button>
</div>
</form>
) : (
<form className="space-y-5">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Company Name</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="Tech Innovations Ltd" type="text" value={cName} onChange={(e)=>setCName(e.target.value)}/>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Recruiter Name</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="Jane Smith" type="text" value={cRecruiterName} onChange={(e)=>setCRecruiterName(e.target.value)}/>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Email Address</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="jane@company.com" type="email" value={cEmail} onChange={(e)=>setCEmail(e.target.value)}/>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Phone</label>
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="+1 (555) 000-0000" type="text" value={cPhone} onChange={(e)=>setCPhone(e.target.value)}/>
</div>
</div>
<div className="flex flex-col gap-2">
<label className="text-slate-700 dark:text-slate-300 text-sm font-medium">Password</label>
<div className="relative">
<input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent p-3 outline-none transition-all" placeholder="••••••••" type="password" value={cPassword} onChange={(e)=>setCPassword(e.target.value)}/>
<span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 cursor-pointer">visibility</span>
</div>
</div>
<div className="pt-4">
<button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70" type="submit" onClick={handleCompanySubmit}>
<span>{loading ? 'Creating...' : 'Create Company Account'}</span>
{!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
</button>
</div>
</form>
)}
<div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
<p className="text-center text-slate-500 text-xs px-10">
                            By signing up, you agree to our <Link className="text-primary underline" to="#">Terms of Service</Link> and <Link className="text-primary underline" to="#">Privacy Policy</Link>.
                        </p>
</div>
</div>
</div>
</main>

<div className="fixed bottom-0 right-0 -z-10 opacity-10 dark:opacity-5 pointer-events-none p-20">
<svg height="400" viewBox="0 0 200 200" width="400" xmlns="http://www.w3.org/2000/svg">
<path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.2,88.5,-0.9C87,14.5,81.4,28.9,72.9,41.4C64.4,53.8,53,64.2,39.9,71.5C26.8,78.8,13.4,83,0,83C-13.4,83,-26.8,78.8,-39.7,71.3C-52.6,63.9,-65.1,53.1,-73.4,40.1C-81.8,27.1,-86,11.8,-84.9,-2.7C-83.8,-17.2,-77.4,-30.9,-68.2,-42.6C-58.9,-54.3,-46.8,-64,-33.7,-71.8C-20.6,-79.7,-10.3,-85.7,2.5,-90C15.2,-94.3,30.5,-83.6,44.7,-76.4Z" fill="#2463eb" transform="translate(100 100)"></path>
</svg>
</div>
</div>
</div>

    </>
  );
}

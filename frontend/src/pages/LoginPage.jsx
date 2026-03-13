import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <>
      
<div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<ToastContainer position="top-right" />
<div className="layout-container flex h-full grow flex-col">
<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-white dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
<div className="flex items-center gap-3 text-primary">
<div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
<span className="material-symbols-outlined text-primary">layers</span>
</div>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">InternHub</h2>
</div>
<div className="hidden md:flex items-center gap-6">
<Link className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" to="#">Help Center</Link>
<Link className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" to="#">Privacy Policy</Link>
</div>
</header>
<main className="flex-1 flex items-center justify-center p-6 md:p-12">
<div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-12 items-center">
<div className="hidden md:flex flex-col gap-8">
<div>
<h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
                                Empowering your <span className="text-primary">career journey.</span>
</h1>
<p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                                The all-in-one platform for students, faculty, and industry partners to collaborate on meaningful internships.
                            </p>
</div>
<div className="space-y-4">
<div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
<div className="bg-primary/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-primary">verified_user</span>
</div>
<div>
<h4 className="font-semibold text-slate-900 dark:text-slate-100">Verified Opportunities</h4>
<p className="text-sm text-slate-500">Connect with pre-vetted top companies worldwide.</p>
</div>
</div>
<div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
<div className="bg-primary/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-primary">monitoring</span>
</div>
<div>
<h4 className="font-semibold text-slate-900 dark:text-slate-100">Real-time Tracking</h4>
<p className="text-sm text-slate-500">Monitor your application status and feedback live.</p>
</div>
</div>
</div>
</div>
<div className="w-full max-w-[440px] mx-auto">
<div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800">
<div className="mb-8">
<h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h3>
<p className="text-slate-500 dark:text-slate-400 mt-1">Please enter your details to sign in.</p>
</div>
<form className="space-y-5" onSubmit={async (e) => { 
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Login Successful!');
      
      const userRole = data.user.role;
      setTimeout(() => {
        if (userRole === 'student') navigate('/student_dashboard');
        else if (userRole === 'faculty') navigate('/faculty_dashboard');
        else if (userRole === 'recruiter') navigate('/recruiter_dashboard');
        else navigate('/admin_dashboard');
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed!');
    } finally {
      setLoading(false);
    }
  }}>
<div className="space-y-2">
<label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email or Student ID</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</span>
<input 
  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
  placeholder="name@university.edu" 
  type="text"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_open</span>
<input 
  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
  placeholder="••••••••" 
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
</div>
</div>
<div className="space-y-2">
<label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Login Role</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person_search</span>
<select 
  className="custom-select w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
<option disabled value="">Select your role</option>
<option value="student">Student</option>
<option value="faculty">Faculty</option>
<option value="placement">Placement Cell</option>
<option value="recruiter">Recruiter</option>
</select>
</div>
</div>
<div className="flex items-center justify-between text-sm py-1">
<label className="flex items-center gap-2 cursor-pointer group">
<input className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20" type="checkbox"/>
<span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Remember me</span>
</label>
<Link className="font-semibold text-primary hover:text-primary/80 transition-colors" to="#">Forgot password?</Link>
</div>
<button 
  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed" 
  type="submit"
  disabled={loading} 
>
<span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
{!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
</button>
</form>
<div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
<p className="text-sm text-slate-500 dark:text-slate-400">
                                    New to InternHub? <Link className="text-primary font-bold hover:underline" to="/register_page">Request access</Link>
</p>
</div>
</div>
</div>
</div>
</main>
<footer className="px-6 md:px-20 py-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<div className="flex items-center gap-2 opacity-60">
<div className="size-5 flex items-center justify-center bg-slate-400 rounded-sm">
<span className="material-symbols-outlined text-[12px] text-white">layers</span>
</div>
<span className="text-xs font-semibold text-slate-600 dark:text-slate-400">© 2024 InternHub Platform. All rights reserved.</span>
</div>
<div className="flex gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
<Link className="hover:text-primary transition-colors" to="#">Terms of Service</Link>
<Link className="hover:text-primary transition-colors" to="#">Security</Link>
<Link className="hover:text-primary transition-colors" to="#">System Status</Link>
</div>
</div>
</footer>
</div>
</div>

    </>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { getDefaultRouteForRole, setStoredSession } from '../services/session';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await authAPI.login(form);
      setStoredSession({ token: data.token, user: data.user });
      toast.success('Signed in successfully');
      navigate(getDefaultRouteForRole(data.user.role));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.3fr,0.7fr] lg:items-center">
        <div>
          <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">InternHub Unified Login</p>
          <h1 className="mt-6 text-5xl font-black tracking-tight lg:text-6xl text-slate-900 dark:text-white">Sign in to your<br/>workspace.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Our unified authentication system automatically detects your role and redirects you to the appropriate dashboard for Students, Faculty, Recruiters, or Admins.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { role: 'Student', icon: 'school' },
              { role: 'Faculty', icon: 'account_balance' },
              { role: 'Recruiter', icon: 'business_center' },
              { role: 'Admin', icon: 'bolt' },
            ].map(({ role, icon }) => (
              <div key={role} className="flex flex-col items-center rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 text-center transition-all hover:border-primary/50 group shadow-sm dark:shadow-none">
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:scale-110 transition-transform">{icon}</span>
                <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[3rem] bg-primary/10 blur-3xl opacity-50"></div>
          <form className="relative rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-10 shadow-xl dark:shadow-none backdrop-blur-xl" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Welcome</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Access your personalized workspace</p>
            
            <div className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary transition-all dark:text-white"
                  placeholder="name@university.edu"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Password</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary transition-all dark:text-white"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </div>
            
            <button
              className="mt-10 w-full rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-70 active:scale-[0.98]"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
            
            <div className="mt-8 flex flex-col gap-4 text-center text-sm">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                New student?{' '}
                <Link className="font-bold text-primary hover:underline" to="/register">
                  Create an account
                </Link>
              </p>
              
              <div className="mt-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 text-[10px] text-slate-500 dark:text-slate-400">
                <p className="mb-3 font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">lab_profile</span>
                  Sandbox Access (Pass: password123)
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <span>Student: student@test.com</span>
                  <span>Faculty: faculty@test.com</span>
                  <span>Recruiter: recruiter@test.com</span>
                  <span>Admin: admin@test.com</span>
                </div>
              </div>

              <p className="mt-4 text-[9px] leading-relaxed text-slate-400 dark:text-slate-600 uppercase tracking-tight italic font-bold">
                * Faculty and Recruiter roles are admin-provisioned only.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

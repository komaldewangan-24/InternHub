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

  const blueGradient = 'linear-gradient(135deg, #003366 0%, #0066cc 100%)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-[#00152b] dark:via-[#001a33] dark:to-[#000d1a] text-slate-900 dark:text-white px-6 py-16 transition-colors duration-300 font-roboto uppercase">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.3fr,0.7fr] lg:items-center">
        <div>
          <button onClick={() => navigate('/')} className="mb-12 flex items-center gap-3 text-indigo-500 font-poppins text-[10px] font-bold uppercase tracking-[0.4em] hover:gap-4 transition-all group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </button>
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-indigo-500 leading-none font-poppins">InternHub Unified Login</p>
          <h1 className="mt-8 text-3xl font-poppins font-bold tracking-tighter uppercase lg:text-7xl leading-tight text-[#003366] dark:text-white">Sign in to your<br/>workspace.</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400 font-roboto lowercase italic">
            Our unified authentication system automatically detects your role and redirects you to the appropriate dashboard for Students, Faculty, Recruiters, or Admins.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { role: 'Student', icon: 'school' },
              { role: 'Faculty', icon: 'account_balance' },
              { role: 'Recruiter', icon: 'business_center' },
              { role: 'Admin', icon: 'bolt' },
            ].map(({ role, icon }) => (
              <div key={role} className="flex flex-col items-center rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 p-8 text-center transition-all hover:border-indigo-500/50 group shadow-sm dark:shadow-none hover:-translate-y-1">
                <span className="material-symbols-outlined text-[32px] text-indigo-500 group-hover:scale-110 transition-transform">{icon}</span>
                <span className="mt-4 text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-xl bg-indigo-500/5 blur-3xl opacity-50"></div>
          <form className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-12 shadow-2xl dark:shadow-none transition-all group overflow-hidden" onSubmit={handleSubmit}>
            <div className="absolute top-0 right-0 size-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase">Welcome</h2>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Access your personalized workspace</p>
            
            <div className="mt-12 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
                <input
                  className="w-full rounded-md border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-all dark:text-white font-roboto placeholder-slate-300 dark:placeholder-white/10"
                  placeholder="name@university.edu"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Password</label>
                <input
                  className="w-full rounded-md border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-all dark:text-white font-roboto placeholder-slate-300 dark:placeholder-white/10"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </div>
            </div>
            
            <button
              className="mt-12 w-full rounded-lg text-white px-4 py-4 text-[12px] font-poppins font-bold uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-all disabled:opacity-70 active:scale-[0.98]"
              style={{ backgroundImage: blueGradient }}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
            
            <div className="mt-12 flex flex-col gap-6 text-center">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-poppins">
                New student?{' '}
                <Link className="text-indigo-500 hover:opacity-70 transition-opacity border-b border-indigo-500/30" to="/register">
                  Create an account
                </Link>
              </p>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-[9px] leading-relaxed text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic font-poppins font-bold">
                  * Faculty and Recruiter roles are admin-provisioned only.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

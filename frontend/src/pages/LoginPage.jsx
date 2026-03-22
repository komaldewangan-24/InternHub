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
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">InternHub workspace</p>
          <h1 className="mt-6 text-5xl font-black tracking-tight">Sign in to your role-based workspace.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Authentication routes you automatically to the correct student, faculty, recruiter, or placement dashboard.
          </p>
        </div>

        <form className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </div>
          <button
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-70"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="mt-4 text-sm text-slate-400">
            New student?{' '}
            <Link className="font-semibold text-primary" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

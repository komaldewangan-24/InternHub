import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { setStoredSession } from '../services/session';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await authAPI.register({ ...form, role: 'student' });
      setStoredSession({ token: data.token, user: data.user });
      toast.success('Student account created');
      navigate('/student');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Student onboarding</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Create your InternHub account</h1>
        <p className="mt-3 text-sm text-slate-500">
          Faculty, recruiter, and placement accounts are controlled roles. Public signup is student-first.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Academic email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <button
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 disabled:opacity-70"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

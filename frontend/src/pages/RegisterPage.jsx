import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16 transition-colors duration-300">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-12 shadow-xl dark:shadow-none transition-all">
        <button onClick={() => navigate('/')} className="mb-10 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Home
        </button>
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Student onboarding</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight dark:text-white">Create your profile</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl">
          Join the unified portal to manage your internship journey. 
          <span className="block mt-2 font-semibold text-slate-700 dark:text-slate-200 italic">Self-registration is exclusive to Students; all other roles are managed by admins.</span>
        </p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {[
            { id: 'name', label: 'Full Name', placeholder: 'Ex: John Doe' },
            { id: 'email', label: 'Professional Email', placeholder: 'name@university.edu', type: 'email' },
            { id: 'password', label: 'Secure Password', placeholder: '••••••••', type: 'password' },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{field.label}</label>
              <input
                className="w-full rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm outline-none focus:border-primary transition-all dark:text-white"
                placeholder={field.placeholder}
                type={field.type || 'text'}
                required
                value={form[field.id]}
                onChange={(event) => setForm((current) => ({ ...current, [field.id]: event.target.value }))}
              />
            </div>
          ))}
          <button
            className="w-full rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-70 active:scale-[0.98] mt-4"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Committing Profile...' : 'Create Student Account'}
          </button>
        </form>
        
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          Already registered?{' '}
          <Link className="font-bold text-primary hover:underline" to="/login">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { setStoredSession } from '../services/session';

import { ROLES } from '../constants/roles';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await authAPI.register({ ...form, role: selectedRole });
      setStoredSession({ token: data.token, user: data.user });
      toast.success(`${ROLES[selectedRole].label} account created`);
      navigate(ROLES[selectedRole].route);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  const blueGradient = 'linear-gradient(135deg, #003366 0%, #0066cc 100%)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-[#00152b] dark:via-[#001a33] dark:to-[#000d1a] text-slate-900 dark:text-white px-6 py-16 transition-colors duration-300 font-roboto uppercase">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-12 shadow-2xl dark:shadow-none transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 size-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
        
        <button onClick={() => navigate('/')} className="mb-10 flex items-center gap-3 text-indigo-500 font-poppins text-[10px] font-bold uppercase tracking-[0.4em] hover:gap-4 transition-all group-btn">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </button>
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-indigo-500 leading-none font-poppins">INSTITUTIONAL ONBOARDING</p>
        <h1 className="mt-6 text-3xl font-bold tracking-tighter uppercase leading-tight text-[#003366] dark:text-white font-poppins">Create your profile</h1>

        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Select your account role</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(ROLES).map(([role, config]) => (
                <div
                  key={role}
                  className={`cursor-pointer rounded-xl border p-5 text-center transition-all group relative overflow-hidden ${
                    selectedRole === role
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10'
                      : 'border-slate-100 bg-slate-50/30 dark:border-white/5 dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <span className={`material-symbols-outlined text-[24px] mb-2 block transition-transform group-hover:scale-110 ${selectedRole === role ? 'text-indigo-500' : 'text-slate-300'}`}>{config.icon}</span>
                  <span className={`text-[10px] font-poppins font-bold uppercase tracking-widest ${selectedRole === role ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{config.label}</span>
                  {selectedRole === role && (
                    <div className="absolute top-2 right-2">
                      <span className="material-symbols-outlined text-indigo-500 text-[16px]">check_circle</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { id: 'name', label: 'Full Name', placeholder: 'Ex: Amit Sharma' },
              { id: 'email', label: 'Professional Email', placeholder: 'name@university.edu', type: 'email' },
              { id: 'password', label: 'Secure Password', placeholder: '••••••••', type: 'password' },
            ].map((field) => (
              <div key={field.id} className={`space-y-3 ${field.id === 'password' ? 'md:col-span-1' : ''}`}>
                <label className="text-[10px] font-poppins font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">{field.label}</label>
                <input
                  className="w-full rounded-md border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-4 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-all dark:text-white font-roboto placeholder-slate-300 dark:placeholder-white/10"
                  placeholder={field.placeholder}
                  type={field.type || 'text'}
                  required
                  value={form[field.id]}
                  onChange={(event) => setForm((current) => ({ ...current, [field.id]: event.target.value }))}
                />
              </div>
            ))}
          </div>

          <button
            className="w-full rounded-lg text-white px-4 py-4 text-[12px] font-poppins font-bold uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-all disabled:opacity-70 active:scale-[0.98] mt-4"
            style={{ backgroundImage: blueGradient }}
            disabled={loading}
            type="submit"
          >
            {loading ? 'Committing Profile...' : `Join as ${ROLES[selectedRole].label}`}
          </button>
        </form>
        
        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-poppins">
            Already registered?{' '}
            <Link className="text-indigo-500 hover:opacity-70 transition-opacity border-b border-indigo-500/30" to="/login">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

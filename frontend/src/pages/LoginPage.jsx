import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { getDefaultRouteForRole, setStoredSession } from '../services/session';

import { ROLES, getDefaultRouteForRole as getRoute } from '../constants/roles';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [mismatch, setMismatch] = useState(null); // { actualRole, message }

  const handleLogin = async (roleOverride = null) => {
    const roleToUse = roleOverride || selectedRole;
    try {
      setLoading(true);
      const { data } = await authAPI.login({ ...form, selectedRole: roleToUse });
      setStoredSession({ token: data.token, user: data.user });
      toast.success('Signed in successfully');
      navigate(getRoute(data.user.role));
    } catch (error) {
      if (error.response?.status === 409 && error.response?.data?.code === 'ROLE_MISMATCH') {
        setMismatch({
          actualRole: error.response.data.actualRole,
          message: error.response.data.message,
        });
      } else {
        toast.error(error.response?.data?.error || 'Unable to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
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
            Select your workspace role below. Our system will verify your credentials and grant access to the appropriate institutional terminal.
          </p>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(ROLES).map(([role, config]) => (
              <div
                key={role}
                className={`flex cursor-pointer flex-col items-center rounded-xl border p-8 text-center transition-all group shadow-sm dark:shadow-none hover:-translate-y-1 relative overflow-hidden ${
                  selectedRole === role
                    ? 'border-indigo-500 bg-white dark:bg-white/5 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/3 hover:border-indigo-500/50'
                }`}
                onClick={() => {
                  setSelectedRole(role);
                  setMismatch(null);
                }}
              >
                <span className={`material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform ${selectedRole === role ? 'text-indigo-500' : 'text-slate-300'}`}>{config.icon}</span>
                <span className={`mt-4 text-[10px] font-poppins font-bold uppercase tracking-widest ${selectedRole === role ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{config.label}</span>
                {selectedRole === role && (
                  <div className="absolute top-2 right-2">
                    <span className="material-symbols-outlined text-indigo-500 text-[18px]">verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-xl bg-indigo-500/5 blur-3xl opacity-50"></div>
          <form className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-12 shadow-2xl dark:shadow-none transition-all group overflow-hidden" onSubmit={handleSubmit}>
            <div className="absolute top-0 right-0 size-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
            
            {mismatch ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mx-auto">
                  <span className="material-symbols-outlined text-[32px]">warning</span>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-poppins font-bold tracking-tight text-[#003366] dark:text-white uppercase">Role Mismatch</h3>
                  <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto normal-case italic">
                    {mismatch.message} Would you like to proceed with your registered role?
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleLogin(mismatch.actualRole)}
                    className="w-full rounded-lg bg-indigo-600 text-white px-4 py-4 text-[12px] font-poppins font-bold uppercase tracking-[0.3em] shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
                  >
                    Continue as {ROLES[mismatch.actualRole]?.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMismatch(null)}
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-transparent text-slate-500 dark:text-slate-400 px-4 py-4 text-[11px] font-poppins font-bold uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-poppins font-bold tracking-tighter text-[#003366] dark:text-white uppercase">Authentication</h2>
                <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Sign in to your {ROLES[selectedRole].label} terminal</p>
                
                <div className="mt-12 space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Account Identifier</label>
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
                    <label className="text-[10px] font-poppins font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Gateway Password</label>
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
                  {loading ? 'Decrypting Access...' : `Authorize ${ROLES[selectedRole].label}`}
                </button>
                
                <div className="mt-12 flex flex-col gap-6 text-center">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-poppins">
                    No institutional ID?{' '}
                    <Link className="text-indigo-500 hover:opacity-70 transition-opacity border-b border-indigo-500/30" to="/register">
                      Register your profile
                    </Link>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const blueGradient = 'linear-gradient(135deg, #003366 0%, #0066cc 100%)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-[#00152b] dark:via-[#001a33] dark:to-[#000d1a] text-slate-900 dark:text-white transition-colors duration-300 font-roboto">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#003366]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="group cursor-pointer flex items-center gap-3" onClick={() => scrollToSection('home')}>
              <div
                className="size-10 rounded-sm flex items-center justify-center text-white shadow-lg shadow-[#003366]/20 transition-transform group-hover:rotate-12"
                style={{ backgroundImage: blueGradient }}
              >
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </div>
              <p className="text-2xl font-bold tracking-tighter uppercase font-poppins text-[#003366] dark:text-white">InternHub</p>
            </div>

            <nav className="hidden md:flex items-center gap-3">
              {[
                { label: 'Home', id: 'home' },
                { label: 'About', id: 'about' },
                { label: 'Highlights', id: 'highlights' },
                { label: 'How to Apply', id: 'how-to-apply' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 font-poppins
                             bg-[#003366] hover:bg-[#004488] active:scale-95
                             shadow-sm hover:shadow-md
                             flex items-center justify-center border border-white/5"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex size-11 items-center justify-center rounded-sm bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-slate-100 transition-all border border-slate-100 dark:border-white/5"
            >
              <span className="material-symbols-outlined text-[20px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <Link
              to="/login"
              className="px-6 py-2.5 text-[14px] font-medium text-[#003366] dark:text-white hover:opacity-70 rounded-sm transition-all font-poppins"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 text-[14px] font-medium text-white rounded-sm shadow-md hover:opacity-90 transition-all font-poppins"
              style={{ backgroundImage: blueGradient }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Home / Hero Section - Compact Banner Variant */}
      <section id="home" className="relative h-[530px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-[#001a33] via-[#003366] to-[#001a33]">
        {/* Immersive Background Container */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#003366] via-transparent to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#003366]/40 to-[#003366]" />
        </div>

        <div className="relative z-20 w-full max-w-7xl px-8 flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl lg:text-7xl font-bold tracking-tight leading-tight text-white font-poppins drop-shadow-lg">
            Unlock Opportunities. Build Skills.<br />
            <span className="text-white">Shape Your Career.</span>
          </h1>

          <p className="max-w-4xl mx-auto text-lg md:text-2xl font-normal leading-relaxed text-white/90 mt-6 drop-shadow-md font-roboto">
            A complete platform to discover internships, manage projects, track your applications, and build a powerful professional profile.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            <button
              onClick={() => scrollToSection('how-to-apply')}
              className="rounded-sm bg-white px-8 py-3 text-[16px] font-medium text-[#003366] hover:bg-slate-50 transition-all shadow-sm border border-slate-100 font-poppins"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* About Section - Centered Architecture */}
      <section id="about" className="pt-16 pb-24 mx-4 md:mx-10 lg:mx-20 my-10 bg-gradient-to-b from-white to-slate-50 dark:from-[#002244] dark:to-[#003366] rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden transition-colors border border-slate-100 dark:border-white/5 group hover:shadow-2xl duration-500">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-indigo-500" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-indigo-500 leading-none font-poppins">Our Strategic Vision</p>
                </div>
                <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase leading-tight text-[#003366] dark:text-white font-poppins">
                  Empowering the<br />Next <span className="text-indigo-500">Generation.</span>
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-roboto">
                    This portal is a centralized platform designed to help students discover internships, manage applications, and track their placement readiness. It enables seamless interaction between students, faculty, and recruiters by providing tools for profile management, project approvals, and real-time application tracking.
                  </p>
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-roboto italic border-l-4 border-indigo-500/20 pl-6">
                    The goal is to simplify the internship process, improve transparency, and enhance student outcomes by connecting them with relevant opportunities and structured guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/5 rounded-xl blur-2xl group-hover:bg-indigo-500/10 transition-all duration-700" />
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 aspect-[4/3]">
                <img
                  src="/img.jpeg"
                  alt="Statistical Tablet Dashboard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section - Perfectly Centered Container */}
      <section id="highlights" className="py-20 mx-4 md:mx-10 lg:mx-20 my-10 bg-white dark:bg-[#002244] rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 transition-all hover:shadow-2xl duration-500">
        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tighter text-[#003366] dark:text-white uppercase font-poppins leading-[0.9]">
              Key <span className="text-indigo-500">Features</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* ... other code ... */}
            {[
              { title: 'Student', desc: 'Discover internships, manage applications, and track your placement readiness.', icon: 'school' },
              { title: 'Faculty', desc: 'Review student projects, manage approvals, and provide structured mentorship.', icon: 'supervisor_account' },
              { title: 'Recruiter', desc: 'Post opportunities, screen top talent, and manage seamless placements.', icon: 'business_center' },
              { title: 'Admin', desc: 'Oversee entire portal operations, manage users, and ensure data integrity.', icon: 'admin_panel_settings' },
            ].map((item, index) => (
              <div key={index} className="group p-10 rounded-xl bg-white dark:bg-[#003366]/20 border border-[#E5F1FF] dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center">
                <div className="size-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#333333] dark:text-white font-poppins mb-4 uppercase tracking-wide">{item.title}</h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps to Apply Section - Premium Workflow Design */}
      <section id="how-to-apply" className="py-32 mx-4 md:mx-10 lg:mx-20 my-16 bg-[#F8FAFC] dark:bg-[#001a33] rounded-3xl border border-slate-100 dark:border-white/5 relative overflow-hidden transition-colors shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <div className="text-center mb-24 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500 font-poppins">Seamless Workflow</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-[#003366] dark:text-white uppercase font-poppins leading-none">
              Steps to <span className="text-indigo-500">Apply</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-lg font-roboto leading-relaxed">
              Follow our streamlined four-step process to get started with your national internship journey through the MoSPI portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24 relative">
            {/* Connecting Connector Line - Desktop Only */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent z-0" />

            {[
              { title: 'Register', desc: 'Securely create your account on the official MoSPI internship portal.', icon: 'app_registration' },
              { title: 'Profile', desc: 'Complete your academic profile and showcase your skills to recruiters.', icon: 'person_edit' },
              { title: 'Documents', desc: 'Upload necessary academic certificates and identity verification.', icon: 'upload_file' },
              { title: 'Selection', desc: 'Monitor your application status and attend interviews as required.', icon: 'task_alt' },
            ].map((step, index) => (
              <div key={index} className="relative group flex flex-col items-center">
                {/* Large Background Number - Increased Visibility */}
                <div className="absolute -top-16 -left-4 text-9xl font-black text-slate-500/10 dark:text-white/10 font-poppins pointer-events-none group-hover:text-indigo-500/20 transition-colors duration-500">
                  {index + 1}
                </div>

                {/* Icon Bubble with Premium Depth */}
                <div className="size-24 rounded-[2rem] bg-white dark:bg-[#002244] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none flex items-center justify-center border border-slate-100 dark:border-white/10 mb-10 transform group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-500 ease-out z-20 overflow-hidden relative">
                  {/* Inner Gradient Aura */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4 px-2 relative z-30">
                  <div className="inline-block py-1 px-3 rounded-lg bg-slate-100 dark:bg-white/5 text-[#003366] dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">Step 0{index + 1}</div>
                  <h3 className="text-2xl font-bold text-[#003366] dark:text-white uppercase font-poppins tracking-tighter group-hover:text-indigo-500 transition-colors">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed font-roboto font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Creative Hover Indicator */}
                <div className="mt-10 h-1.5 w-12 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden transition-all duration-500 group-hover:w-24 group-hover:bg-indigo-500">
                  <div className="h-full w-0 bg-white/20 group-hover:w-full transition-all duration-700 delay-100" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center relative z-20">
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-6 bg-[#003366] hover:bg-[#002244] text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest transition-all duration-500 shadow-2xl shadow-[#003366]/40 hover:shadow-indigo-500/20 active:scale-95 overflow-hidden"
            >
              {/* Button Gloss Effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="relative z-10 text-[14px] font-poppins">Start Registration Now</span>
              <div className="relative z-10 size-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-500">
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">east</span>
              </div>
            </Link>

            <p className="mt-8 text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em] font-poppins">No Application Fees Required</p>
          </div>
        </div>

        {/* Advanced Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#003366 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      <footer className="relative w-full bg-[#002244] dark:bg-[#001a33] border-t border-white/5 pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24 mb-10">

            {/* Left: Branding & Vision */}
            <div className="flex-1 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className="size-12 rounded-sm flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundImage: blueGradient }}
                  >
                    <span className="material-symbols-outlined text-[28px]">hub</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tighter uppercase font-poppins text-white">InternHub</p>
                </div>
                <p className="text-lg text-slate-400 leading-relaxed max-w-sm font-roboto">
                  Empowering the next generation of statisticians and professionals through immersive, high-impact internship opportunities nationwide.
                </p>
              </div>

              {/* Social Icons - Clean SVGs */}
              <div className="flex gap-4">
                {[
                  {
                    label: 'Twitter',
                    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
                  },
                  {
                    label: 'LinkedIn',
                    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a2.7 2.7 0 0 0-2.7-2.7c-1.17 0-2.3 1.1-2.3 2.5v5.5h-2.8v-8.8h2.8v1.2c.5-.8 1.6-1.5 2.8-1.5 1.9 0 3.8 1.5 3.8 4v5.1h-2.6m-10.4-11.2c-.9 0-1.6.7-1.6 1.6 0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6 0-.9-.7-1.6-1.6-1.6m1.4 11.2V9.2h-2.8v8.8h2.8z'
                  },
                  {
                    label: 'Email',
                    path: 'M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18H4V8l8,5l8-5V18z M12,11L4,6h16L12,11z'
                  },
                  {
                    label: 'Facebook',
                    path: 'M12,2.04c-5.5,0-10,4.49-10,10.02c0,5,3.66,9.15,8.44,9.9c0.01,0,0.01,0,0.02,0V14.89H7.89V12.06h2.57V9.9c0-2.53,1.51-3.93,3.82-3.93c1.1,0,2.25,0.2,2.25,0.2v2.47h-1.27c-1.25,0-1.64,0.78-1.64,1.58v1.89h2.78l-0.44,2.83h-2.33V22c4.78-0.75,8.44-4.89,8.44-9.9C22.02,6.53,17.52,2.04,12,2.04z'
                  },
                ].map((social, idx) => (
                  <a key={idx} href="#" className="size-10 bg-white/5 flex items-center justify-center text-white hover:bg-indigo-500 transition-all duration-300 group">
                    <svg className="size-5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>

              {/* Back to Top */}
              <button
                onClick={() => scrollToSection('home')}
                className="group flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all font-poppins"
              >
                <span className="material-symbols-outlined text-[18px] text-indigo-500 group-hover:-translate-y-1 transition-transform">north</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Back to Top</p>
              </button>
            </div>

            {/* Right: Site Map & Legal */}
            <div className="flex flex-col sm:flex-row gap-16 md:gap-32">
              <div className="space-y-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500 font-poppins">Site Map</p>
                <ul className="space-y-4">
                  {[
                    { label: 'Homepage', id: 'home' },
                    { label: 'About', id: 'about' },
                    { label: 'Highlights', id: 'highlights' },
                    { label: 'How to Apply', id: 'how-to-apply' },
                    { label: 'Portal', id: '/login' },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => item.id.startsWith('/') ? navigate(item.id) : scrollToSection(item.id)}
                        className="text-slate-400 hover:text-white transition-colors text-[14px] font-normal font-roboto text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500 font-poppins">Legal</p>
                <ul className="space-y-4">
                  {['Privacy Policy', 'Terms of Service', 'Lawyer\'s Corner'].map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors text-[14px] font-normal font-roboto">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500 font-poppins text-center">
              © 2026 INTERNHUB NATIONAL PORTAL [MoSPI]. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>

        {/* Sharp Gradient Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
      </footer>
    </div>
  );
}

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

            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', id: 'home' },
                { label: 'About', id: 'about' },
                { label: 'Highlights', id: 'highlights' },
                { label: 'How to Apply', id: 'how-to-apply' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 hover:text-[#003366] dark:hover:text-white transition-colors font-poppins"
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
               National Internship in <br/>
               <span className="text-white">Official Statistics</span>
             </h1>
             
             <p className="max-w-4xl mx-auto text-lg md:text-2xl font-normal leading-relaxed text-white/90 mt-6 drop-shadow-md font-roboto">
               Facilitating the students to get familiarized with the prevailing system of Official Statistics in India.
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
                     Empowering the<br/>Next <span className="text-indigo-500">Generation.</span>
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
                      src="/statistical_tablet_dashboard.png" 
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

      {/* Steps to Apply Section */}
      <section id="how-to-apply" className="py-24 mx-4 md:mx-10 lg:mx-20 my-10 bg-white dark:bg-[#002244] border border-slate-100 dark:border-white/5 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-8 relative z-10">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-5xl font-bold tracking-tighter text-[#003366] dark:text-white uppercase font-poppins leading-[0.9]">
               Steps to <span className="text-indigo-500">Apply</span>
             </h2>
             <p className="text-slate-400 font-medium uppercase tracking-[0.3em] text-[10px] font-poppins">Seamless Registration Workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: 'Register', desc: 'Create an account on the MoSPI portal', icon: 'app_registration', color: 'bg-[#003366]' },
              { title: 'Profile', desc: 'Fill your educational and personal details', icon: 'person_edit', color: 'bg-indigo-500' },
              { title: 'Documents', desc: 'Submit required certificates and ID proof', icon: 'upload_file', color: 'bg-[#003366]' },
              { title: 'Selection', desc: 'Shortlisting and interview if required', icon: 'task_alt', color: 'bg-indigo-500' },
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center group">
                {/* Icon Circle */}
                <div className="size-16 rounded-full border-2 border-slate-100 dark:border-white/10 flex items-center justify-center bg-white dark:bg-[#003366] mb-[-32px] z-20 shadow-lg transition-transform group-hover:scale-110">
                   <span className="material-symbols-outlined text-[28px] text-indigo-500">{step.icon}</span>
                </div>
                
                {/* Card Container */}
                <div className="w-full bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 pt-12 pb-10 px-8 text-center shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-xl overflow-hidden">
                   <div className={`${step.color} py-2 mb-6 -mx-8`}>
                      <h3 className="text-white text-[12px] font-bold uppercase tracking-widest font-poppins">{step.title}</h3>
                   </div>
                   <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed font-roboto">{step.desc}</p>
                   
                   {/* Step Number Badge */}
                   <div className="mt-8 inline-flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Step</span>
                     <span className="text-xl font-bold text-indigo-500/20">0{index + 1}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
             <Link 
                to="/register" 
                className="inline-flex rounded-sm px-12 py-4 text-[13px] font-bold uppercase tracking-widest shadow-lg text-white hover:opacity-90 transition-all font-poppins"
                style={{ backgroundImage: blueGradient }}
             >
               Start Registration
             </Link>
          </div>
        </div>
        
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
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

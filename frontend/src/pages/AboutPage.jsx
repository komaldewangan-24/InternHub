import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
<nav className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-xl px-8 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(36,99,235,0.08)] transition-all duration-300">
<Link to="/" className="flex items-center gap-2 group">
<div className="bg-primary rounded-xl p-1.5 transition-transform group-hover:rotate-12">
<span className="material-symbols-outlined text-white text-2xl font-bold block">layers</span>
</div>
<h2 className="text-slate-900 dark:text-slate-100 text-xl font-black tracking-tighter">Intern<span className="text-primary">Hub</span></h2>
</Link>

<div className="hidden lg:flex items-center gap-1">
<Link to="/" className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">Home</Link>
<Link to="/about_page" className="px-5 py-2 text-sm font-bold text-primary transition-all rounded-full bg-primary/5">About Us</Link>
<button onClick={() => navigate('/')} className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">Features</button>
<button onClick={() => navigate('/')} className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-all rounded-full hover:bg-primary/5">Placements</button>
</div>

<div className="flex items-center gap-3">
<button className="hidden sm:block px-6 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" onClick={() => navigate('/login_page')}>
Login
</button>
<button className="bg-primary text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" onClick={() => navigate('/register_page')}>
Register
</button>
</div>
</nav>
</header>

      <main className="flex-1 pt-32 md:pt-40">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Transforming the <span className="text-primary">Internship Ecosystem</span> in India
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              InternHub is India's leading unified platform designed to bridge the gap between academic institutions and the corporate world. We empower students to find meaningful opportunities and help companies discover the next generation of Indian talent.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                To create a world where every capable student in India, regardless of their background or location, has equal access to high-quality professional opportunities. We aim to become the digital backbone of India's placement infrastructure.
              </p>
              <div className="pt-4 flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Verified Excellence</h4>
                    <p className="text-sm text-slate-500">Every recruiter and students is verified through institutional credentials.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Growth Oriented</h4>
                    <p className="text-sm text-slate-500">Focusing on skill-match analytics to ensure better placement conversion.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img src="/internhub_hero_thematic_1773428794434.png" alt="Vision Vision" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="text-3xl font-black italic">"92%"</p>
                <p className="text-sm font-medium opacity-80 uppercase tracking-widest mt-1">Placement success</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why InternHub? */}
        <section className="py-20 bg-slate-900 text-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Why Indian Universities Trust Us?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">InternHub provides a comprehensive suite of tools tailored for the Indian recruitment landscape.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">security</span>
                  Data Privacy
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">Secure handling of student academic data with role-based access for placement officers and faculty.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  CTC Analytics
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">Real-time insights into salary trends across Bengaluru, Gurugram, and other major Indian tech hubs.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">handshake</span>
                  MNC Partnerships
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">Direct links to hiring portals of major Indian MNCs and high-growth Indian startups.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-2xl font-bold">layers</span>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">InternHub</h2>
          </div>
          <p className="text-slate-400 text-xs">
            © 2024 InternHub Platform. Powered by India's next generation of talent.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-xs text-slate-500 hover:text-primary underline">Home</Link>
            <Link to="/about_page" className="text-xs text-slate-500 hover:text-primary underline">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

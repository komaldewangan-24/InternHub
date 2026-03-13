import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-sans bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 md:px-20 py-4">
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-3xl font-bold">layers</span>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">InternHub</h2>
        </Link>
        <div className="hidden md:flex flex-1 justify-center gap-8">
          <Link to="/" className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/about_page" className="text-primary text-sm font-bold border-b-2 border-primary transition-colors">About Us</Link>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Features</a>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')}>Placements</a>
        </div>
        <div className="flex gap-3">
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold transition-all hover:bg-slate-300 dark:hover:bg-slate-700" onClick={() => navigate('/login_page')}>
            Login
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all" onClick={() => navigate('/register_page')}>
            Register
          </button>
        </div>
      </header>

      <main className="flex-1">
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

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Main Application Crash Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0b0f1a] p-10 font-sans text-white">
          <div className="w-full max-w-2xl rounded-[3rem] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-3xl">
            <div className="mb-8 flex size-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 shadow-xl shadow-rose-500/20">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-4">Application Interface Halt</h1>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">
              The InternHub system cluster encountered a critical runtime exception in the UI layer. 
              Our integrity checks stopped the render process to prevent session corruption.
            </p>
            
            <div className="mb-10 rounded-2xl bg-black/40 p-6 font-mono text-sm border border-white/5 overflow-x-auto">
              <p className="text-rose-400 font-bold mb-2">Error: {this.state.error?.message || "Unknown Runtime Exception"}</p>
              <pre className="text-slate-500 text-[10px] leading-tight opacity-50">
                {this.state.errorInfo?.componentStack?.split('\n').slice(0, 5).join('\n')}
              </pre>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                Attempt Recovery
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-black text-white hover:bg-white/10 transition-all"
              >
                Reset App & Credentials
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

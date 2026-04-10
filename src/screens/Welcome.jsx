import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div className="relative flex flex-col h-full w-full bg-background-light dark:bg-background-dark overflow-hidden font-display text-slate-900 dark:text-slate-100 antialiased italic-none">
        {/* Status Bar Spacer (iOS Style) */}
        <div className="h-12 w-full shrink-0"></div>

        {/* Top AppBar */}
        <div className="flex items-center p-4 justify-end z-20">
          <button className="flex size-10 shrink-0 items-center justify-center rounded-full glass-panel text-slate-900 dark:text-slate-100 transition-transform active:scale-90">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center px-6">
          {/* Hero Image / Hologram Placeholder */}
          <div className="relative w-full aspect-square mt-4 mb-8 shrink-0">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative w-full h-full rounded-xl overflow-hidden glass-panel flex items-center justify-center">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-cover opacity-90 transition-transform duration-1000" 
                style={{ backgroundImage: 'url("/assets/welcome_hologram.png")' }}
              ></div>
              {/* Overlay Grid for High-Tech feel */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,242,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none"></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 text-center">
            <h1 className="font-urbanist text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 italic-none">
              Welcome to <span className="text-primary">FitMorph AI</span>
            </h1>
            <p className="text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-400 max-w-[280px] mx-auto italic-none">
              Your AI-powered body transformation journey starts now
            </p>
          </div>

          {/* Pagination Dots */}
          <div className="flex w-full flex-row items-center justify-center gap-2 mt-10">
            <div className="h-2 w-6 rounded-full bg-primary shadow-[0_0_10px_rgba(110,61,255,0.5)]"></div>
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Footer / Action Area */}
        <div className="p-8 space-y-4 shrink-0">
          <button 
            onClick={() => navigate('/benefits')}
            className="w-full py-4 px-6 rounded-full bg-[#00f2ff] text-slate-950 font-bold text-lg neon-glow transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            Get Started
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button 
            onClick={() => navigate('/join')}
            className="w-full py-4 px-6 rounded-full glass-panel text-slate-900 dark:text-slate-100 font-semibold transition-colors hover:bg-white/10 active:scale-95"
          >
            I already have an account
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}

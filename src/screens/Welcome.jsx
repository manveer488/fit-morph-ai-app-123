import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden max-w-[430px] mx-auto italic-none">
        {/* Status Bar Spacer (iOS Style) */}
        <div className="h-12 w-full shrink-0"></div>

        {/* Top AppBar */}
        <div className="flex items-center p-4 justify-end shrink-0">
          <button className="flex size-10 items-center justify-center rounded-full glass-panel text-slate-900 dark:text-slate-100 transition-transform active:scale-90">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center px-6 pt-4">
          {/* Hero Hero Section */}
          <div className="relative w-full aspect-[4/5] mb-10 shrink-0 group">
            <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-card-dark">
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" 
                className="w-full h-full object-cover animate-zoom" 
                alt="Fitness Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
              
              {/* Dynamic Overlay Elements */}
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-2xl border border-white/10 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-accent-aqua/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent-aqua">auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-accent-aqua leading-none mb-1">AI Protocol</p>
                    <p className="text-white font-bold text-sm">Neural Transformation Active</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floaties */}
            <div className="absolute -top-4 -right-4 size-20 glass-panel rounded-full flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="material-symbols-outlined text-3xl text-primary">monitoring</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3 text-center mb-8">
            <h1 className="font-urbanist text-5xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white">
              FitMorph <span className="text-primary italic">AI</span>
            </h1>
            <p className="text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto uppercase tracking-widest">
              Biometric Evolution Engine
            </p>
          </div>

          {/* Pagination Dots */}
          <div className="flex w-full flex-row items-center justify-center gap-2 mt-10 shrink-0">
            <div className="h-2 w-6 rounded-full bg-primary shadow-[0_0_10px_rgba(110,61,255,0.5)]"></div>
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>

        {/* Footer / Action Area */}
        <div className="p-8 space-y-4 shrink-0 pb-12">
          <button 
            onClick={() => navigate('/benefits')}
            className="w-full py-4 px-6 rounded-full bg-neon-blue text-slate-950 font-bold text-lg neon-glow transition-transform active:scale-95 flex items-center justify-center gap-2"
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

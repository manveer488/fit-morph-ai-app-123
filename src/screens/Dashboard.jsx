import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { useUser } from '../contexts/UserContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleAction = (path) => {
    navigate(path);
  };

  return (
    <MobileContainer>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dashboard border-x border-slate-200 dark:border-slate-800 font-display text-slate-900 dark:text-slate-100 antialiased">
        {/* Header */}
        <header className="flex items-center justify-between p-6 pb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-12 rounded-full border-2 border-primary p-0.5">
                <img 
                  alt="Profile" 
                  className="size-full rounded-full object-cover" 
                  src="/assets/remaining_assets.png" 
                  style={{ objectPosition: 'center 40%', backgroundSize: '400%' }}
                />
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-accent-aqua rounded-full border-2 border-background-dark shadow-[0_0_10px_rgba(0,242,234,0.5)]"></div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
              </p>
              <h2 className="text-xl font-bold tracking-tight leading-none font-urbanist italic-none">Good Morning, {(user.email || 'Alex').split('@')[0]}</h2>
            </div>
          </div>
          <button className="size-12 rounded-full glass-panel flex items-center justify-center text-slate-900 dark:text-slate-100 active:scale-95 transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-4 space-y-6 overflow-y-auto pb-32">
          {/* Weekly Goal Progress Ring */}
          <section className="relative flex flex-col items-center justify-center py-6 glass-panel rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <div className="relative size-48 flex items-center justify-center">
              {/* Progress Circle Background */}
              <svg className="size-full -rotate-90">
                <circle className="text-slate-200 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                {/* Progress Circle Fill */}
                <circle 
                  className="glow-aqua transition-all duration-1000 ease-out" 
                  cx="96" cy="96" fill="transparent" r="88" 
                  stroke="url(#aquaGradient)" 
                  strokeDasharray="552.9" 
                  strokeDashoffset={552.9 * (1 - 0.75)} 
                  strokeLinecap="round" 
                  strokeWidth="12"
                ></circle>
                <defs>
                  <linearGradient id="aquaGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#6e3dff"></stop>
                    <stop offset="100%" stopColor="#00f2ea"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tracking-tighter text-accent-aqua font-urbanist neon-glow">75%</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Weekly Goal</span>
              </div>
            </div>
            <div className="mt-4 text-center z-10">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Almost there! <span className="text-primary font-bold">2 more sessions</span> to go.</p>
            </div>
          </section>

          {/* Quick Action Tiles */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-urbanist tracking-tight">Quick Actions</h3>
              <span className="text-xs text-primary font-bold uppercase tracking-widest cursor-pointer">View All</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => handleAction('/workout')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5 active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-colors group-hover:from-primary/60"></div>
                <img 
                  alt="Workout" 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="/assets/remaining_assets.png" 
                  style={{ objectPosition: 'right center', backgroundSize: '400%' }}
                />
                <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-accent-aqua text-2xl">fitness_center</span>
                  <p className="text-white font-bold text-sm uppercase tracking-wider font-urbanist">Start Workout</p>
                </div>
              </div>
              <div onClick={() => handleAction('/scan')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5 active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-colors group-hover:from-primary/60"></div>
                <img 
                  alt="AI Scanner" 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="/assets/remaining_assets.png" 
                  style={{ objectPosition: 'center bottom', backgroundSize: '300%' }}
                />
                <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-accent-aqua text-2xl">body_system</span>
                  <p className="text-white font-bold text-sm uppercase tracking-wider font-urbanist">Analyze Body</p>
                </div>
              </div>
              <div onClick={() => handleAction('/diet')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5 active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-colors group-hover:from-primary/60"></div>
                <img 
                  alt="Meal Plan" 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="/assets/welcome_hologram.png" 
                />
                <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-accent-aqua text-2xl">restaurant</span>
                  <p className="text-white font-bold text-sm uppercase tracking-wider font-urbanist">Meal Plan</p>
                </div>
              </div>
              <div onClick={() => handleAction('/progress')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5 active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-colors group-hover:from-primary/60"></div>
                <img 
                  alt="Progress" 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="/assets/remaining_assets.png" 
                  style={{ objectPosition: 'right bottom', backgroundSize: '300%' }}
                />
                <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1">
                  <span className="material-symbols-outlined text-accent-aqua text-2xl">query_stats</span>
                  <p className="text-white font-bold text-sm uppercase tracking-wider font-urbanist">My Progress</p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Assistant Card */}
          <section onClick={() => handleAction('/progress')} className="p-5 rounded-xl bg-primary/20 border border-primary/30 relative overflow-hidden shadow-2xl backdrop-blur-xl cursor-pointer group hover:bg-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/40 text-primary">
                <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
              </span>
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">AI Suggestion</span>
              <h4 className="text-lg font-bold font-urbanist italic-none">New HIIT Routine</h4>
              <p className="text-sm text-slate-400 dark:text-slate-400 leading-relaxed italic-none">Based on your recovery score, a 20-min explosive HIIT session is recommended today.</p>
              <button className="mt-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full transition-all active:scale-95">
                <span>Start Now</span>
                <span className="material-symbols-outlined text-sm">play_arrow</span>
              </button>
            </div>
          </section>

          {/* Calorie Widget */}
          <section className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-card-dark border border-slate-800 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Eaten</span>
              <span className="text-lg font-bold text-accent-aqua font-urbanist">1,420</span>
              <span className="text-[8px] text-slate-400 uppercase font-black">kcal</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Burned</span>
              <span className="text-lg font-bold text-primary font-urbanist">680</span>
              <span className="text-[8px] text-slate-400 uppercase font-black">kcal</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Left</span>
              <span className="text-lg font-bold text-white font-urbanist">400</span>
              <span className="text-[8px] text-slate-400 uppercase font-black">kcal</span>
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 shrink-0">
          <div className="flex gap-2 border-t border-slate-800 bg-[#0a0714]/90 backdrop-blur-xl px-4 pb-8 pt-3">
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-primary" href="#">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px] fill-1">home</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
            </a>
            <a onClick={() => handleAction('/workout')} className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 cursor-pointer" href="#">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">fitness_center</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Workouts</p>
            </a>
            <a onClick={() => handleAction('/scan')} className="flex flex-1 flex-col items-center justify-end gap-1" href="#">
              <div className="flex h-12 w-12 -mt-4 items-center justify-center bg-primary rounded-full shadow-lg shadow-primary/40 text-white active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[32px]">scan</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mt-1">Scan</p>
            </a>
            <a onClick={() => handleAction('/diet')} className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 cursor-pointer" href="#">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">nutrition</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Nutrition</p>
            </a>
            <a onClick={() => handleAction('/settings')} className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 cursor-pointer" href="#">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">person</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Profile</p>
            </a>
          </div>
        </nav>
      </div>
    </MobileContainer>
  );
}

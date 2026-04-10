import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { useUser } from '../contexts/UserContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isScanStale } = useUser();
  const isLocked = !user.hasCompletedBodyScan || isScanStale();

  const handleAction = (path) => {
    if (isLocked && path !== '/scan') return;
    navigate(path);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).toUpperCase();

  const displayName = user.profile?.fullName?.split(' ')[0] || "User";
  const aiPlan = user.aiPlan;

  // Calculate progress (Mocking 75% if no plan yet, or real value if available)
  const progressPercent = user.hasCompletedBodyScan ? 75 : 0;
  const dashOffset = 552.9 - (552.9 * progressPercent) / 100;

  return (
    <MobileContainer>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark border-x border-slate-200 dark:border-slate-800 italic-none">
        
        {/* Header */}
        <header className="flex items-center justify-between p-6 pb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-12 rounded-full border-2 border-primary p-0.5 overflow-hidden">
                <img 
                  alt="Profile" 
                  className="size-full rounded-full object-cover" 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80" 
                />
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-accent-aqua rounded-full border-2 border-background-dark"></div>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formattedDate}</p>
              <h2 className="text-xl font-bold tracking-tight">Good Morning, {displayName}</h2>
            </div>
          </div>
          <button className="size-12 rounded-full glass-panel flex items-center justify-center text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </header>

        {/* Main Content Area with Lock Logic */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {isLocked && (
            <div className="absolute inset-0 z-40 backdrop-blur-md bg-background-dark/60 flex flex-col items-center justify-center p-8 text-center">
              <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                <span className="material-symbols-outlined text-4xl text-primary">lock</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Protocols Locked</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Your 7-day optimized nutrition or workout cycle is being synthesized. <span className="text-primary font-bold">Complete a body scan to unlock.</span>
              </p>
              <button 
                onClick={() => navigate('/scan')}
                className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">body_system</span>
                <span>Complete Body Scan</span>
              </button>
              
              {user.lastScanDate && (
                <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Last Scan: {new Date(user.lastScanDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <main className={`flex-1 px-6 py-4 space-y-6 overflow-y-auto pb-32 ${isLocked ? 'blur-sm grayscale-[0.5] opacity-50' : ''}`}>
          
          {/* Weekly Goal Progress Ring */}
          <section className="relative flex flex-col items-center justify-center py-6 glass-panel rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <div className="relative size-48 flex items-center justify-center">
              <svg className="size-full -rotate-90">
                <circle className="text-slate-200 dark:text-slate-100/5" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="glow-aqua transition-all duration-1000 ease-out" 
                  cx="96" cy="96" fill="transparent" r="88" 
                  stroke="url(#aquaGradient)" 
                  strokeDasharray="552.9" 
                  strokeDashoffset={dashOffset} 
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
                <span className="text-4xl font-extrabold tracking-tighter text-accent-aqua">{progressPercent}%</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Weekly Goal</span>
              </div>
            </div>
            <div className="mt-4 text-center z-10">
              <p className="text-sm font-medium text-slate-300">
                {user.hasCompletedBodyScan ? (
                  <>Almost there! <span className="text-primary font-bold">2 more sessions</span> to go.</>
                ) : (
                  <>Ready to start? <span className="text-primary font-bold">Complete scan</span> to see progress.</>
                )}
              </p>
            </div>
          </section>

          {/* Quick Action Tiles */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <span className="text-xs text-primary font-semibold">View All</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => navigate('/workout')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img alt="Workout" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1541534741688-6078c64b52d2?w=500&q=80"/>
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="material-symbols-outlined text-accent-aqua mb-1">fitness_center</span>
                  <p className="text-white font-bold text-sm">Start Workout</p>
                </div>
              </div>
              <div onClick={() => navigate('/scan')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img alt="AI Scanner" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=500&q=80"/>
                <div className="absolute bottom-3 left-3 z-20">
                   <span className="material-symbols-outlined text-accent-aqua mb-1">body_system</span>
                  <p className="text-white font-bold text-sm">Analyze Body</p>
                </div>
              </div>
              <div onClick={() => navigate('/diet')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img alt="Meal Plan" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80"/>
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="material-symbols-outlined text-accent-aqua mb-1">restaurant</span>
                  <p className="text-white font-bold text-sm">Meal Plan</p>
                </div>
              </div>
              <div onClick={() => navigate('/progress')} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg active:scale-95 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img alt="Progress" className="size-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1594882645126-14020914d58d?w=500&q=80"/>
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="material-symbols-outlined text-accent-aqua mb-1">query_stats</span>
                  <p className="text-white font-bold text-sm">My Progress</p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Assistant Card */}
          <section className="p-5 rounded-xl bg-primary/20 border border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/40 text-primary">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </span>
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Suggestion</span>
              <h4 className="text-lg font-bold">Strategic Insight</h4>
              <p className="text-sm text-slate-400 leading-relaxed italic-none">
                {aiPlan?.summary || "Analyzing your biometrics for a custom routine..."}
              </p>
              <button onClick={() => navigate('/workout')} className="mt-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full transition-colors active:scale-95">
                <span>View Full Plan</span>
                <span className="material-symbols-outlined text-sm">play_arrow</span>
              </button>
            </div>
          </section>

          {/* Calorie Widget */}
          <section className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-card-dark border border-slate-800 shrink-0">
            <div className="flex flex-col items-center text-center">
              <span className="text-xs text-slate-500 mb-1 leading-none">Eaten</span>
              <span className="text-lg font-bold text-accent-aqua">{aiPlan?.mealPlan?.macros?.kcal || user.aiPlan?.mealPlan?.dailyCalories || 0}</span>
              <span className="text-[8px] text-slate-400 uppercase">kcal</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-slate-800">
              <span className="text-xs text-slate-500 mb-1 leading-none">Burned</span>
              <span className="text-lg font-bold text-primary">1,240</span>
              <span className="text-[8px] text-slate-400 uppercase">kcal</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-xs text-slate-500 mb-1 leading-none">Steps</span>
              <span className="text-lg font-bold text-white">8,420</span>
              <span className="text-[8px] text-slate-400 uppercase">Today</span>
            </div>
          </section>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
          <div className="flex gap-2 border-t border-slate-800 bg-background-dark/90 backdrop-blur-xl px-4 pb-8 pt-3">
            <button key="home" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px] fill-1">home</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
            </button>
            <button onClick={() => navigate('/workout')} className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">fitness_center</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Workouts</p>
            </button>
            <button onClick={() => navigate('/scan')} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div className="flex h-12 w-12 -mt-4 items-center justify-center bg-primary rounded-full shadow-lg shadow-primary/40 text-white active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[32px]">scan</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mt-1">Scan</p>
            </button>
            <button onClick={() => navigate('/diet')} className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">nutrition</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Nutrition</p>
            </button>
            <button onClick={() => navigate('/settings')} className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500">
              <div className="flex h-8 items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">person</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Profile</p>
            </button>
          </div>
        </nav>
      </div>
    </MobileContainer>
  );
}

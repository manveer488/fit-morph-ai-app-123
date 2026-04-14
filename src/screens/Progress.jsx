import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { useUser } from '../contexts/UserContext.jsx';

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('Overview');

  // Generate dynamic looking chart paths once per component mount
  const { weightPath, weightFill, fatPath, fatFill } = useMemo(() => {
    const generatePath = (start, down) => {
      let currentY = start;
      const pts = [`0 ${currentY}`];
      for (let x = 50; x <= 400; x += (Math.random() * 50 + 50)) {
         currentY += (Math.random() * 40 - 20) + (down ? 10 : -10);
         pts.push(`${x} ${currentY.toFixed(1)}`);
      }
      pts.push(`400 ${currentY.toFixed(1)}`);
      
      const pathStr = `M${pts[0]} ` + pts.slice(1).map((p, i) => `L ${p}`).join(' ');
      const fillStr = pathStr + ` V 150 H 0 Z`;
      return { p: pathStr, f: fillStr };
    };
    
    // Weight trend (downward or slightly volatile)
    const w = generatePath(90, true);
    // Fat trend (downward)
    const f = generatePath(110, true);
    
    return { weightPath: w.p, weightFill: w.f, fatPath: f.p, fatFill: f.f };
  }, [user?.profile?.weight]);


  // Use real data from user profile (updated via scans)
  const bodyScan = user?.metrics || {
    bodyFat: "--",
    muscleMass: "--",
    lastScanImage: null
  };

  const weight = user?.profile?.weight || "--";

  return (
    <MobileContainer>
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative overflow-hidden antialiased italic-none">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary active:scale-95 transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight font-urbanist uppercase">Progress & Analytics</h1>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary active:scale-95 transition-all">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
          {/* Tabs */}
          <div className="flex mt-6 gap-2 p-1 bg-primary/5 rounded-xl">
            {['Overview', 'Timeline', 'Badges'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 pb-32 pt-6 space-y-8 overflow-y-auto no-scrollbar">
          {activeTab === 'Overview' && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 gap-6">
                {/* Weight Chart Card */}
                <div className="bg-[#161229] rounded-2xl p-5 border border-primary/20 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl text-primary">monitoring</span>
                  </div>
                  <div className="flex flex-col gap-1 mb-4">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Weight Trend</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white tracking-tighter font-urbanist">{weight.toString().replace(/[^0-9.]/g, '')} <span className="text-lg font-medium text-slate-500">kg</span></span>
                    </div>
                  </div>
                  <div className="h-40 w-full relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                      <defs>
                        <linearGradient id="neonGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4"></stop>
                          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      <path d={weightFill} fill="url(#neonGradient)"></path>
                      <path className="drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" d={weightPath} fill="none" stroke="#00d4ff" strokeWidth="3"></path>
                    </svg>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                  </div>
                </div>

                {/* Body Fat Chart Card */}
                <div className="bg-[#161229] rounded-2xl p-5 border border-primary/20 shadow-2xl">
                  <div className="flex flex-col gap-1 mb-4">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Body Fat %</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white tracking-tighter font-urbanist">{bodyScan.bodyFat} <span className="text-lg font-medium text-slate-500">%</span></span>
                    </div>
                  </div>
                  <div className="h-40 w-full relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                      <defs>
                        <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#6e3dff" stopOpacity="0.4"></stop>
                          <stop offset="100%" stopColor="#6e3dff" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      <path d={fatFill} fill="url(#primaryGradient)"></path>
                      <path className="drop-shadow-[0_0_8px_rgba(110,61,255,0.8)]" d={fatPath} fill="none" stroke="#6e3dff" strokeWidth="3"></path>
                    </svg>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                  </div>
                </div>
                
                {/* Muscle Mass Card */}
                <div className="bg-[#161229] rounded-2xl p-5 border border-primary/20 shadow-2xl relative overflow-hidden">
                   <div className="flex flex-col gap-1 mb-4">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Lean Muscle Mass</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white tracking-tighter font-urbanist">{bodyScan.muscleMass} <span className="text-lg font-medium text-slate-500">kg</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Anabolic State Identified</span>
                  </div>
                </div>
              </div>

              {/* Before/After Prototype Section */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight px-1 font-urbanist">Evolution AI Scan</h2>
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-primary/30 group shadow-2xl shadow-primary/20 bg-slate-900">
                  {bodyScan.lastScanImage ? (
                    <img className="absolute inset-0 w-full h-full object-cover" src={bodyScan.lastScanImage} alt="Current Scan" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white opacity-20 text-[10px] uppercase font-bold tracking-widest">Awaiting First Scan</span>
                    </div>
                  )}
                  
                  {/* Slider Divider Tool */}
                  <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-[#00d4ff] shadow-[5px_0_15px_rgba(0,212,255,0.5)] z-10">
                    <img className="absolute inset-0 w-[200%] h-full object-cover opacity-50 grayscale" src={bodyScan.baselineImage || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"} alt="Initial Baseline" />
                    <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20 text-white">Baseline</div>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-primary/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20 text-white z-20">Current</div>
                  
                  {/* Slider Handle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-[#00d4ff] rounded-full shadow-[0_0_25px_rgba(0,212,255,0.8)] flex items-center justify-center border-2 border-white pointer-events-none active:scale-125 transition-transform">
                    <span className="material-symbols-outlined text-white font-bold">unfold_more</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'Badges' && (
            <section className="grid grid-cols-2 gap-4">
               {[
                { name: 'First Scan', status: user.hasCompletedBodyScan ? 'COMPLETED' : 'LOCKED', color: 'accent-blue', icon: 'local_fire_department', locked: !user.hasCompletedBodyScan },
                { name: 'AI Plan Active', status: user.aiPlan ? 'ACTIVE' : 'LOCKED', color: 'yellow-500', icon: 'military_tech', locked: !user.aiPlan },
                { name: 'Elite Body Fat', status: parseFloat(bodyScan.bodyFat) <= 15 ? 'UNLOCKED' : 'LOCKED', color: 'emerald-400', icon: 'trophy', locked: parseFloat(bodyScan.bodyFat) > 15 || bodyScan.bodyFat === "--" },
                { name: 'Profile Ready', status: user.profile?.goal ? 'COMPLETED' : 'LOCKED', color: 'primary', icon: 'person', locked: !user.profile?.goal }
              ].map((badge, i) => (
                <div key={i} className={`bg-[#161229] rounded-3xl border border-primary/20 flex flex-col items-center justify-center p-6 gap-3 shadow-xl ${badge.locked ? 'opacity-50 grayscale' : ''}`}>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-${badge.color}/20 blur-xl rounded-full`}></div>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${badge.locked ? 'from-slate-700 to-slate-800' : 'from-primary to-accent-blue'} flex items-center justify-center shadow-lg relative z-10`}>
                      <span className="material-symbols-outlined text-white text-3xl">{badge.icon}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-300">{badge.name}</p>
                    <p className={`text-[8px] font-black tracking-widest mt-1 ${badge.locked ? 'text-slate-500' : 'text-primary'}`}>{badge.status}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {activeTab === 'Timeline' && (
             <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight px-1 font-urbanist">Photo Timeline</h2>
              <div className="text-center py-10 opacity-50 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No historical data available</p>
                <p className="text-xs text-slate-600 mt-2">Complete more scans to unlock timeline progress.</p>
              </div>
            </section>
          )}

          <div className="h-20"></div>
        </main>

        {/* Bottom Nav Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto px-6 pb-8 pointer-events-none z-50">
          <div className="flex items-center justify-around bg-white/10 dark:bg-[#1e1b28]/95 backdrop-blur-2xl rounded-full p-2 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            <button onClick={() => navigate('/dashboard')} key="home" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">home</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Home</p>
            </button>
            <button onClick={() => navigate('/diet')} key="diet" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">restaurant</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Nutrition</p>
            </button>
            <button onClick={() => navigate('/workout')} key="workout" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">fitness_center</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Workout</p>
            </button>
            <button key="stats" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary relative">
               <div className="bg-primary/20 rounded-full p-3 -mt-6 mb-1 border border-primary/30 shadow-[0_0_20px_rgba(110,61,255,0.3)]">
                <span className="material-symbols-outlined fill-1 text-2xl">leaderboard</span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Stats</p>
            </button>
            <button onClick={() => navigate('/settings')} key="profile" className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">person</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Profile</p>
            </button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

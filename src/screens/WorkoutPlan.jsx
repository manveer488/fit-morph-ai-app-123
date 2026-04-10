import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { useUser } from '../contexts/UserContext.jsx';

export default function WorkoutPlan() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("AI Plan");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);

  // Robust normalization of workout data
  const currentPlan = user.aiPlan?.workoutPlan || [];
  const isPlanAvailable = Array.isArray(currentPlan) && currentPlan.length > 0;

  if (!isPlanAvailable && !loading) {
    return (
      <MobileContainer>
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
            <span className="material-symbols-outlined text-4xl">Auto_Awesome</span>
          </div>
          <h2 className="text-2xl font-bold font-urbanist mb-2">Routine Pending</h2>
          <p className="text-slate-500 text-sm mb-8">Your personalized 7-day training routine is being calculated. Please complete a body scan to proceed.</p>
          <button onClick={() => navigate('/scan')} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all">
            Go to Scanner
          </button>
        </div>
      </MobileContainer>
    );
  }

  const getImage = (term, name) => {
    const search = term || name || "fitness workout";
    return `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(search)},fitness,workout`;
  };

  const currentDayPlan = currentPlan[selectedDay] || currentPlan[0];

  return (
    <MobileContainer>
      <div className="relative mx-auto min-h-screen w-full flex flex-col bg-background-light dark:bg-background-dark overflow-hidden pb-24 font-display text-slate-900 dark:text-slate-100 antialiased italic-none">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between p-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-primary/10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-primary/20 text-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight font-urbanist uppercase">Training Plan</h1>
          <button className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-primary/20 text-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </header>

        <main className="flex-1 px-6 space-y-8 overflow-y-auto pt-4 pb-32">
          {/* Tab Selector */}
          <div className="flex gap-4 border-b border-slate-200 dark:border-white/5">
            {["AI Plan", "Recovery"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold transition-all px-1 ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* AI Generated Exercises */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold tracking-tight font-urbanist">7-Day Protocol</h2>
              <span className="text-[10px] font-bold px-3 py-1 bg-[#00f2ff]/10 text-[#00f2ff] rounded-full border border-[#00f2ff]/20 tracking-wider uppercase mb-1 neon-glow italic-none">AI OPTIMIZED</span>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {currentPlan.map((day, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex-1 min-w-[80px] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all active:scale-95 ${selectedDay === idx ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-transparent border-slate-200 dark:border-white/5 text-slate-400'}`}
                >
                  {day.day || `Day ${idx+1}`}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{currentDayPlan.focus || "Daily Focus"}</h3>
              </div>

              {currentDayPlan.exercises && currentDayPlan.exercises.map((ex, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xl transition-all hover:border-primary/40 group cursor-pointer backdrop-blur-xl">
                  <div className="relative size-20 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-primary/10">
                    <img className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" src={getImage(ex.name)} alt={ex.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base tracking-tight mb-1 font-urbanist">{ex.name}</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{ex.sets} Sets x {ex.reps} Reps</p>
                  </div>
                  <button onClick={() => setSelectedExercise(ex)} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-primary active:scale-95">
                    <span className="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Muscle Recovery Plan Section */}
          {user.aiPlan?.recoveryPlan && (
            <section className="mt-12 p-6 rounded-3xl bg-slate-100 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">rebase_edit</span>
                <div>
                  <h2 className="text-xl font-bold font-urbanist leading-none">Muscle Recovery</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Bio-Regeneration Protocol</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">healing</span> Post-Workout
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{user.aiPlan.recoveryPlan.postWorkout}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-accent-aqua uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">bedtime</span> Sleep
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight">{user.aiPlan.recoveryPlan.sleepOptimization}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-accent-pink uppercase tracking-widest mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">self_improvement</span> Mobility
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight">{user.aiPlan.recoveryPlan.stretchingRoutine}</p>
                  </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <span className="material-symbols-outlined text-sm">pill</span> Optional Supplements
                   </h4>
                   <p className="text-sm text-slate-400 leading-relaxed">{user.aiPlan.recoveryPlan.supplements}</p>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Exercise Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-background-light dark:bg-[#161229] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
              <div className="relative h-64">
                <img className="size-full object-cover" src={getImage(selectedExercise.name)} alt={selectedExercise.name} />
                <button onClick={() => setSelectedExercise(null)} className="absolute top-4 right-4 size-10 rounded-full bg-black/50 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto no-scrollbar">
                <h3 className="text-3xl font-black font-urbanist">{selectedExercise.name}</h3>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 italic">
                  "{selectedExercise.formTips || "Focus on mind-muscle connection and controlled tempo."}"
                </div>
                <button onClick={() => setSelectedExercise(null)} className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-transform">
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto px-6 pb-8 pointer-events-none z-50">
          <div className="flex items-center justify-around bg-white/10 dark:bg-[#1e1b28]/95 backdrop-blur-2xl rounded-full p-2 pointer-events-auto border border-white/10">
            <button onClick={() => navigate('/dashboard')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">home</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Home</p>
            </button>
            <button key="workout" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary relative">
              <div className="bg-primary/20 rounded-full p-3 -mt-6 mb-1 border border-primary/30 shadow-[0_0_20px_rgba(110,61,255,0.3)]">
                <span className="material-symbols-outlined fill-1 text-2xl">fitness_center</span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Workout</p>
            </button>
            <button onClick={() => navigate('/diet')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">restaurant</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Nutrition</p>
            </button>
            <button onClick={() => navigate('/settings')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">person</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Profile</p>
            </button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

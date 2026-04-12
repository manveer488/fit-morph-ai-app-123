import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { useUser } from '../contexts/UserContext.jsx';

export default function DietPlan() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedDay, setSelectedDay] = useState(0);

  // Normalize meal plan data from AI response
  const mealPlanData = user.aiPlan?.mealPlan;
  const days = mealPlanData?.days || [];
  const dailyCalories = mealPlanData?.dailyCalories || 2000;
  const dailyMacros = mealPlanData?.macros || { p: "---", c: "---", f: "---" };
  const isPlanAvailable = days.length > 0;

  if (!isPlanAvailable) {
    return (
      <MobileContainer>
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <div className="size-20 rounded-full bg-accent-aqua/10 flex items-center justify-center text-accent-aqua mb-6 animate-pulse">
            <span className="material-symbols-outlined text-4xl">Restaurant</span>
          </div>
          <h2 className="text-2xl font-bold font-urbanist mb-2">Nutrition Pending</h2>
          <p className="text-slate-500 text-sm mb-8">Your 7-day optimized nutrition cycle is being synthesized. Complete a body scan to unlock.</p>
          <button onClick={() => navigate('/scan')} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            Go to Scanner
          </button>
        </div>
      </MobileContainer>
    );
  }

  const currentDayData = days[selectedDay] || days[0];
  const guidelines = mealPlanData?.guidelines || { hydration: "2-3L Water", avoid: ["Processed Sugar"], supplements: "Consult professional" };

  const premiumFoodImages = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    "https://images.unsplash.com/photo-1463183547458-6a2c760d0912?w=800&q=80",
    "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    "https://images.unsplash.com/photo-1484723091791-c0e7e1471d69?w=800&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
  ];

  const getImage = (term) => {
    let hash = 0;
    const text = term || "meal";
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return premiumFoodImages[Math.abs(hash) % premiumFoodImages.length];
  };

  return (
    <MobileContainer>
      <div className="relative mx-auto min-h-screen w-full flex flex-col bg-background-light dark:bg-background-dark overflow-hidden pb-24 font-display text-slate-900 dark:text-slate-100 antialiased italic-none">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between p-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-primary/10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-primary/20 text-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight font-urbanist uppercase">Nutrition Plan</h1>
          <button className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-primary/20 text-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined">calendar_month</span>
          </button>
        </header>

        <main className="flex-1 px-6 space-y-8 overflow-y-auto pt-4 pb-32">
          {/* Day Selector */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold tracking-tight font-urbanist">7-Day Fueling</h2>
              <span className="text-[10px] font-bold px-3 py-1 bg-accent-aqua/10 text-accent-aqua rounded-full border border-accent-aqua/20 tracking-wider uppercase mb-1 neon-glow italic-none">Weekly Cycle</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {days.map((day, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex-1 min-w-[80px] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all active:scale-95 ${selectedDay === idx ? 'bg-accent-aqua/10 border-accent-aqua text-accent-aqua shadow-lg shadow-accent-aqua/10' : 'bg-transparent border-slate-200 dark:border-white/5 text-slate-400'}`}
                >
                  {day.day || `Day ${idx+1}`}
                </button>
              ))}
            </div>
          </section>

          {/* Daily Macros */}
          <section className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Protein</p>
              <p className="text-lg font-bold text-primary font-urbanist">{dailyMacros.p}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Carbs</p>
              <p className="text-lg font-bold text-accent-aqua font-urbanist">{dailyMacros.c}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Fat</p>
              <p className="text-lg font-bold text-accent-pink font-urbanist">{dailyMacros.f}</p>
            </div>
          </section>

          {/* Meals */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Intake: {dailyCalories} Kcal</h3>
            
            {Object.entries(currentDayData.meals || {}).map(([type, meal]) => (
              meal?.title && (
                <div key={type} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-100 dark:bg-white/[0.03] shadow-xl">
                  <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white">{type}</p>
                  </div>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={getImage(meal.imageSearchTerm || meal.title)} 
                      alt={meal.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <h4 className="text-xl font-bold text-white font-urbanist">{meal.title}</h4>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                     <p className="text-xs text-slate-400 font-medium italic">"{meal.recipe?.instructions?.[0] || 'Optimized for metabolic performance'}"</p>
                     <div className="flex flex-wrap gap-2">
                        {meal.recipe?.ingredients?.slice(0, 3).map((ing, i) => (
                           <span key={i} className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded-lg text-slate-500">#{ing}</span>
                        ))}
                     </div>
                  </div>
                </div>
              )
            ))}
          </section>

          {/* AI Guidelines */}
          <section className="p-6 rounded-3xl bg-slate-100 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 space-y-4">
             <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">tips_and_updates</span> Daily Protocol
             </h4>
             <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-400">
                   <span className="size-1.5 rounded-full bg-accent-aqua"></span>
                   Hydration Goals: {mealPlanData.guidelines?.hydration || "2-3 L Daily"}
                </li>
                <li className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 text-sm font-medium text-accent-pink">
                      <span className="size-1.5 rounded-full bg-accent-pink"></span>
                      Foods to Avoid:
                   </div>
                   <div className="flex flex-wrap gap-2 pl-4">
                      {(mealPlanData.guidelines?.foodsToAvoid || []).map((food, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-1 bg-accent-pink/5 rounded-lg text-accent-pink border border-accent-pink/10">{food}</span>
                      ))}
                   </div>
                </li>
                <li className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 text-sm font-medium text-[#00f2ff]">
                      <span className="size-1.5 rounded-full bg-[#00f2ff]"></span>
                      Optimal Choices:
                   </div>
                   <div className="flex flex-wrap gap-2 pl-4">
                      {(mealPlanData.guidelines?.foodsToInclude || []).map((food, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-1 bg-[#00f2ff]/5 rounded-lg text-[#00f2ff] border border-[#00f2ff]/10">{food}</span>
                      ))}
                   </div>
                </li>
             </ul>
          </section>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto px-6 pb-8 pointer-events-none z-50">
          <div className="flex items-center justify-around bg-white/10 dark:bg-[#1e1b28]/95 backdrop-blur-2xl rounded-full p-2 pointer-events-auto border border-white/10">
            <button onClick={() => navigate('/dashboard')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">home</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Home</p>
            </button>
            <button onClick={() => navigate('/workout')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">fitness_center</span>
              <p className="text-[9px] font-bold uppercase tracking-tighter">Workout</p>
            </button>
            <button key="diet" className="flex flex-1 flex-col items-center justify-center gap-1 text-accent-aqua relative">
              <div className="bg-accent-aqua/20 rounded-full p-3 -mt-6 mb-1 border border-accent-aqua/30 shadow-[0_0_20px_rgba(0,242,234,0.3)]">
                <span className="material-symbols-outlined fill-1 text-2xl">restaurant</span>
              </div>
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

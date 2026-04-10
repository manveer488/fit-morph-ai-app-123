import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';

export default function KeyBenefits() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div className="relative flex flex-col h-full w-full bg-background-light dark:bg-background-dark overflow-x-hidden font-display text-slate-900 dark:text-slate-100 antialiased">
        {/* Header Section */}
        <div className="flex items-center p-6 pb-2 justify-between shrink-0">
          <div 
            onClick={() => navigate(-1)}
            className="text-primary flex size-10 items-center justify-center rounded-full bg-primary/10 transition-colors cursor-pointer active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 font-urbanist">FitMorph AI</h2>
        </div>

        {/* Progress Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-6 shrink-0">
          <div className="h-1.5 w-6 rounded-full bg-primary/20"></div>
          <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_8px_rgba(110,61,255,0.6)]"></div>
          <div className="h-1.5 w-6 rounded-full bg-primary/20"></div>
        </div>

        {/* Main Heading */}
        <div className="px-6 text-center shrink-0">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight pb-3 pt-4 font-urbanist">
            Key AI Benefits
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed px-4">
            Experience the future of fitness with our advanced AI-driven transformation engine.
          </p>
        </div>

        {/* Features Section (Glassmorphism Cards) */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Benefit 1: AI Body Analysis */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-neon-blue rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-between gap-4 rounded-xl glass-card p-5 shadow-xl">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-neon-blue text-2xl">android_fingerprint</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight font-urbanist">AI Body Analysis</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">
                  High-precision 3D scanning for real-time tracking of your physical evolution.
                </p>
              </div>
              <div 
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10" 
                style={{ backgroundImage: 'url("/assets/benefit_cards.png")', backgroundPosition: 'left top', backgroundSize: '300%' }}
              ></div>
            </div>
          </div>

          {/* Benefit 2: Personalized Workouts */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-between gap-4 rounded-xl glass-card p-5 shadow-xl">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-2xl">fitness_center</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight font-urbanist">Smart Workouts</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">
                  Dynamic training plans that adapt instantly based on your performance.
                </p>
              </div>
              <div 
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10" 
                style={{ backgroundImage: 'url("/assets/benefit_cards.png")', backgroundPosition: 'center top', backgroundSize: '300%' }}
              ></div>
            </div>
          </div>

          {/* Benefit 3: Smart Diet Planning */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-neon-blue to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-between gap-4 rounded-xl glass-card p-5 shadow-xl">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-neon-blue text-2xl">restaurant</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight font-urbanist">Diet Tracking</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">
                  Hyper-personalized nutrition insights with real-time macro adjustments.
                </p>
              </div>
              <div 
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10" 
                style={{ backgroundImage: 'url("/assets/benefit_cards.png")', backgroundPosition: 'right top', backgroundSize: '300%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer / Action Button */}
        <div className="mt-auto p-6 pb-10 shrink-0">
          <button 
            onClick={() => navigate('/join')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl shadow-[0_0_20px_rgba(110,61,255,0.4)] transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
          >
            Next Step
            <span className="material-symbols-outlined">trending_flat</span>
          </button>
          <p className="text-center text-slate-500 dark:text-slate-500 text-sm mt-4 font-medium uppercase tracking-[0.2em]">Step 2 of 3</p>
        </div>
      </div>
    </MobileContainer>
  );
}

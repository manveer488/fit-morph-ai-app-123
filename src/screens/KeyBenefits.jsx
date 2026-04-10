import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';

export default function KeyBenefits() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display text-slate-900 dark:text-slate-100 italic-none">
        {/* Header Section */}
        <div className="flex items-center p-6 pb-2 justify-between shrink-0">
          <div 
            onClick={() => navigate(-1)}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors cursor-pointer active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">FitMorph AI</h2>
        </div>

        {/* Progress Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-6 shrink-0">
          <div className="h-1.5 w-6 rounded-full bg-primary/20 dark:bg-primary/20"></div>
          <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_8px_rgba(110,61,255,0.6)]"></div>
          <div className="h-1.5 w-6 rounded-full bg-primary/20 dark:bg-primary/20"></div>
        </div>

        {/* Main Heading */}
        <div className="px-6 text-center shrink-0">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight pb-3 pt-4 italic-none">
            Key AI Benefits
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed px-4 italic-none">
            Experience the future of fitness with our advanced AI-driven transformation engine.
          </p>
        </div>

        {/* Features Section (Glassmorphism Cards) */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Benefit 1: AI Body Analysis */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-[#00f2ff] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-between gap-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 shadow-xl">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#00f2ff] text-2xl">android_fingerprint</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">AI Body Analysis</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal italic-none">
                  High-precision 3D scanning for real-time tracking of your physical evolution.
                </p>
              </div>
              <div 
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10" 
                style={{ backgroundImage: 'url("/assets/body_scan_bg.png")' }}
              ></div>
            </div>
          </div>

          {/* Benefit 2: Personalized Workouts */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f2ff] to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-between gap-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 shadow-xl">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-2xl">fitness_center</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Smart Workouts</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal italic-none">
                  Dynamic training plans that adapt instantly based on your performance.
                </p>
              </div>
              <div 
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10" 
                style={{ backgroundImage: 'url("/assets/join_silhouette.png")' }}
              ></div>
            </div>
          </div>

          {/* Benefit 3: Smart Diet Planning */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-[#00f2ff] to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center justify-between gap-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 shadow-xl">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#00f2ff] text-2xl">restaurant</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Diet Tracking</p>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal italic-none">
                  Hyper-personalized nutrition insights with real-time macro adjustments.
                </p>
              </div>
              <div 
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-white/10" 
                style={{ backgroundImage: 'url("/assets/welcome_hologram.png")' }}
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
          <p className="text-center text-slate-500 dark:text-slate-500 text-sm mt-4 font-medium uppercase tracking-widest">Step 2 of 3</p>
        </div>
      </div>
    </MobileContainer>
  );
}

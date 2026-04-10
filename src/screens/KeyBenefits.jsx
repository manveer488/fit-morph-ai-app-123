import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';

export default function KeyBenefits() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden max-w-[430px] mx-auto italic-none">
        
        {/* Header Section */}
        <header className="flex items-center p-6 pb-2 justify-between shrink-0">
          <button 
            onClick={() => navigate(-1)}
            className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">FitMorph AI</h2>
        </header>

        {/* Progress Indicators */}
        <div className="flex w-full flex-row items-center justify-center gap-3 py-6 shrink-0">
          <div className="h-1.5 w-6 rounded-full bg-primary/20 dark:bg-primary/20"></div>
          <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_8px_rgba(110,61,255,0.6)]"></div>
          <div className="h-1.5 w-6 rounded-full bg-primary/20 dark:bg-primary/20"></div>
        </div>

        {/* Main Heading */}
        <section className="px-6 text-center shrink-0">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-extrabold leading-tight pb-3 pt-4 font-urbanist">
            Key AI Benefits
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed px-4 italic-none">
            Experience the future of fitness with our advanced AI-driven transformation engine.
          </p>
        </section>

        {/* Features Section (Glassmorphism Cards) */}
        <main className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
          {/* Benefit 1: AI Body Analysis */}
          <div className="relative group overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-aqua/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative flex flex-col gap-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all hover:border-primary/30">
              <div className="h-40 w-full overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="AI Analysis"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(110,61,255,1)]">android_fingerprint</span>
                  <h3 className="text-white text-xl font-bold tracking-tight">AI Body Analysis</h3>
                </div>
              </div>
              <div className="p-5 pt-2">
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  High-precision 3D scanning for real-time tracking of your physical evolution and biometric balance.
                </p>
              </div>
            </div>
          </div>

          {/* Benefit 2: Smart Workouts */}
          <div className="relative group overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-aqua/20 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative flex flex-col gap-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all hover:border-accent-aqua/30">
              <div className="h-40 w-full overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1541534741688-6078c64b52d2?w=800&q=80" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Workouts"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-aqua text-2xl drop-shadow-[0_0_8px_rgba(0,242,234,1)]">fitness_center</span>
                  <h3 className="text-white text-xl font-bold tracking-tight">Smart Workouts</h3>
                </div>
              </div>
              <div className="p-5 pt-2">
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Dynamic training plans that adapt instantly based on your performance, metabolic data, and recovery speed.
                </p>
              </div>
            </div>
          </div>

          {/* Benefit 3: Smart Diet Planning */}
          <div className="relative group overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-pink/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative flex flex-col gap-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all hover:border-primary/30">
              <div className="h-40 w-full overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Nutrition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-pink text-2xl drop-shadow-[0_0_8px_rgba(255,0,229,1)]">restaurant</span>
                  <h3 className="text-white text-xl font-bold tracking-tight">Diet Tracking</h3>
                </div>
              </div>
              <div className="p-5 pt-2">
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Hyper-personalized nutrition insights with real-time macro adjustments to fuel your specific goals.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer / Action Button */}
        <footer className="mt-auto p-6 pb-12 shrink-0">
          <button 
            onClick={() => navigate('/join')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl shadow-[0_0_20px_rgba(110,61,255,0.4)] transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
          >
            Next Step
            <span className="material-symbols-outlined">trending_flat</span>
          </button>
          <p className="text-center text-slate-500 dark:text-slate-500 text-sm mt-4 font-medium italic-none">Step 2 of 3</p>
        </footer>
      </div>
    </MobileContainer>
  );
}

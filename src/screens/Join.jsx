import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';

export default function Join() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    }
  };

  return (
    <MobileContainer>
      <div className="relative flex flex-col h-full w-full bg-background-light dark:bg-background-dark overflow-hidden font-display text-slate-900 dark:text-slate-100 antialiased italic-none">
        {/* Header / Top Bar */}
        <div className="flex items-center p-6 justify-between z-10 shrink-0">
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-100 active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="text-xs font-bold tracking-widest uppercase opacity-50">Step 3 of 3</div>
          <div className="size-10"></div>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 px-6 flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-background-dark/90 z-0"></div>
          
          <div className="relative z-10">
            <div className="w-full aspect-square rounded-full bg-primary/20 blur-3xl absolute -top-20 -right-20 animate-pulse"></div>
            
            {/* Silhouette Asset */}
            <div 
              className="relative w-full h-80 bg-cover bg-center rounded-xl overflow-hidden shadow-2xl border border-white/5" 
              style={{ backgroundImage: "url('/assets/remaining_assets.png')", backgroundPosition: 'left top', backgroundSize: '200%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            </div>

            <div className="mt-8">
              <h1 className="text-slate-100 tracking-tight text-4xl font-extrabold leading-tight text-left font-urbanist italic-none">
                Join FitMorph AI
              </h1>
              <p className="text-slate-400 text-lg font-normal leading-relaxed mt-3 text-left italic-none">
                Experience the future of fitness with AI-driven transformation and precision tracking.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleJoin} className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 text-xl">mail</span>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xl"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-[0_0_25px_rgba(110,61,255,0.5)] transform transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
              >
                Create Account
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm font-medium">
              <span className="text-slate-500">Already a member?</span>
              <button type="button" className="text-primary font-bold hover:underline">Log In</button>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

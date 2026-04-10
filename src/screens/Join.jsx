import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { useUser } from '../contexts/UserContext.jsx';

export default function Join() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authFlow, setAuthFlow] = useState(null); // 'google', 'apple', or null

  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/\d/.test(pass)) return "Password must contain at least one number.";
    return null;
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    login({ email, password, name: email.split('@')[0] });
    navigate('/scan');
  };

  const handleSocialAuth = (provider, userData) => {
    login(userData);
    setAuthFlow(null);
    navigate('/scan');
  };

  return (
    <MobileContainer>
      <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased italic-none">
        
        {/* Social Auth Overlay */}
        {authFlow && (
          <div className="absolute inset-0 z-[100] flex items-end justify-center px-4 pb-20 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/20 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {authFlow === 'google' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  ) : (
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.96.95-2.04 1.72-3.32 1.72-1.22 0-1.66-.75-3.15-.75-1.5 0-1.98.74-3.13.75-1.27 0-2.45-.82-3.41-1.78C2.1 18.28 1 15.65 1 13.04c0-2.63 1.64-4.02 3.23-4.02 1.6 0 2.5.95 3.44.95.93 0 2.05-.95 3.53-.95 1.25 0 2.5.65 3.24 1.57-2.67 1.5-2.22 5.38.44 6.55-.54 1.37-1.3 2.65-2.43 3.14zM12.03 8.35c-.02-2.13 1.76-3.95 3.73-4.08.18 2.33-2.14 4.26-3.73 4.08z"/></svg>
                  )}
                  Choose an account
                </h3>
                <button onClick={() => setAuthFlow(null)} className="opacity-50 hover:opacity-100">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleSocialAuth(authFlow, { email: 'user@example.com', name: 'Fitness Enthusiast' })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">FE</div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Fitness Enthusiast</p>
                    <p className="text-xs opacity-50">user@example.com</p>
                  </div>
                </button>
                <button 
                   onClick={() => handleSocialAuth(authFlow, { email: 'newbie@fitmorph.ai', name: 'Future Athlete' })}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="size-10 rounded-full bg-accent-cyan/20 flex items-center justify-center font-bold">FA</div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Future Athlete</p>
                    <p className="text-xs opacity-50">newbie@fitmorph.ai</p>
                  </div>
                </button>
              </div>
              
              <p className="mt-6 text-[10px] text-center opacity-40 uppercase tracking-widest font-bold">
                To continue, {authFlow === 'google' ? 'Google' : 'Apple'} will share your name and email with FitMorph AI.
              </p>
            </div>
          </div>
        )}

        {/* Header / Top Bar */}
        <div className="flex items-center p-6 justify-between z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-100 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="text-xs font-bold tracking-widest uppercase opacity-50">Step 3 of 3</div>
          <div className="size-10"></div>
        </div>

        {/* Hero Section with Fitness Silhouette Concept */}
        <div className="relative flex-1 min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-background-dark/90 z-0"></div>
          <div className="relative w-full h-full px-6 flex flex-col justify-center">
            <div className="w-full aspect-square rounded-full bg-primary/20 blur-3xl absolute -top-20 -right-20 animate-pulse"></div>
            
            {/* Fitness Silhouette Visualization */}
            <div 
              className="relative w-full h-64 bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl border border-white/5" 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548690312-e3b507d17a12?w=800&q=80")' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
            </div>

            <div className="mt-8">
              <h1 className="text-slate-100 tracking-tight text-3xl font-bold leading-tight text-left">
                Join <span className="text-primary">FitMorph AI</span>
              </h1>
              <p className="text-slate-400 text-sm font-normal leading-relaxed mt-2 text-left">
                Experience the future of fitness with AI-driven transformation and precision tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Auth Buttons Section */}
        <div className="px-6 pb-10 pt-4 z-10 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl animate-shake">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Email Input Field */}
            <div className="relative">
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Password Input Field */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password (8+ chars, 1 number)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            
            {/* Primary Action: Join */}
            <button 
              onClick={handleJoin}
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              <span>Start Transformation</span>
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <button 
                onClick={() => setAuthFlow('google')}
                className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-semibold transition-all hover:bg-white/10 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Google</span>
              </button>

              {/* Apple */}
              <button 
                onClick={() => setAuthFlow('apple')}
                className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-semibold transition-all hover:bg-white/10 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.96.95-2.04 1.72-3.32 1.72-1.22 0-1.66-.75-3.15-.75-1.5 0-1.98.74-3.13.75-1.27 0-2.45-.82-3.41-1.78C2.1 18.28 1 15.65 1 13.04c0-2.63 1.64-4.02 3.23-4.02 1.6 0 2.5.95 3.44.95.93 0 2.05-.95 3.53-.95 1.25 0 2.5.65 3.24 1.57-2.67 1.5-2.22 5.38.44 6.55-.54 1.37-1.3 2.65-2.43 3.14zM12.03 8.35c-.02-2.13 1.76-3.95 3.73-4.08.18 2.33-2.14 4.26-3.73 4.08z"></path>
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest font-bold">
              By continuing, you agree to our Terms
            </p>
          </div>
        </div>

        {/* Home Indicator Mockup */}
        <div className="shrink-0 h-1.5 w-32 bg-slate-100/20 rounded-full mx-auto mb-2"></div>
      </div>
    </MobileContainer>
  );
}

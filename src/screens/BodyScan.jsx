import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '../components/MobileContainer.jsx';
import { analyzeBody } from '../services/ai';
import { analyzePhysique, generateFullFitnessPlan } from '../services/geminiService';
import { useUser } from '../contexts/UserContext.jsx';
import { resizeImage } from '../utils/imageUtils';

export default function BodyScan() {
  const navigate = useNavigate();
  const { user, saveScanResult } = useUser();
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [aiAnalysisStep, setAiAnalysisStep] = useState("");
  const [metrics, setMetrics] = useState(user.metrics || {
    bodyFat: "---",
    muscleMass: "---",
    posture: "Awaiting biometric input scan...",
    postureScore: "---",
    symmetryScore: "---"
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const scanSteps = [
    "Initializing neural vision...",
    "Detecting 33 body landmarks...",
    "Analyzing posture alignment...",
    "Calculating muscle-fat ratio...",
    "Finalizing biometric synthesis..."
  ];

  const handleRetake = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    setScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const img = new Image();
      img.src = previewUrl;
      await img.decode();
      
      const resizedForScanBase64 = await resizeImage(file, 800); 
      const resizedImg = new Image();
      resizedImg.src = resizedForScanBase64;
      await resizedImg.decode();

      const result = await analyzeBody(resizedImg);
      clearInterval(stepInterval);
      
      if (result.success) {
        setMetrics(result.metrics);
        setScanning(false);
        await runRealAIAnalysis(result, file);
      } else {
        alert(result.error);
        setScanning(false);
      }
    } catch (err) {
      console.error("Scan failed:", err);
      alert("Scan failed. Ensure you are well-lit and standing fully in frame.");
      setScanning(false);
      clearInterval(stepInterval);
    }
  };

  const runRealAIAnalysis = async (scanResult, file) => {
    setGenerating(true);
    try {
      setAiAnalysisStep("Analyzing body physique...");
      const resizedBase64 = await resizeImage(file, 512);
      const aiMetrics = await analyzePhysique(scanResult.metrics || scanResult, user.profile, resizedBase64);
      
      const updatedMetrics = {
        ...(scanResult.metrics || scanResult),
        bodyFat: aiMetrics.predictedBodyFat,
        muscleMass: aiMetrics.predictedMuscleMass,
        physiqueAssessment: aiMetrics.physiqueAssessment
      };
      setMetrics(updatedMetrics);
      
      setAiAnalysisStep("Generating 7-day protocols...");
      const fullPlan = await generateFullFitnessPlan(aiMetrics, user.profile);
      
      console.log("Full AI Plan Generated:", fullPlan);
      saveScanResult(updatedMetrics, fullPlan); 
      navigate('/dashboard');
    } catch (err) {
      console.error("AI Analysis failed:", err);
      // Even if AI fails, save the core scan metrics if they exist
      saveScanResult(scanResult.metrics || scanResult, null);
      navigate('/dashboard');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden relative">
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-primary/10 shrink-0">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-primary/20 text-slate-900 dark:text-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight font-urbanist">AI Body Analysis</h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-primary/20 text-slate-900 dark:text-primary">
            <span className="material-symbols-outlined">info</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-32">
          {/* Hero Section */}
          <section className="mt-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 font-urbanist">3D Body Scan</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Full-body heatmap based on AI visual synthesis</p>
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 flex items-center justify-center group">
              {/* Image / Silhouette */}
              {imagePreview ? (
                <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover animate-zoom" alt="Scan preview" />
              ) : (
                <div 
                  className="absolute inset-0 opacity-40 bg-center bg-no-repeat bg-contain animate-zoom" 
                  style={{ backgroundImage: "url('/assets/remaining_assets.png')", backgroundPosition: 'center top', backgroundSize: '150%' }}
                ></div>
              )}
              {/* Scan Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
              {(scanning || generating) && (
                <div className="absolute inset-x-0 h-1 bg-accent-cyan shadow-[0_0_20px_rgba(0,242,255,1)] z-20 animate-scan"></div>
              )}
              
              {/* Heatmap Dots (Only when not scanning) */}
              {!scanning && !generating && (
                <>
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-accent-cyan animate-pulse heatmap-glow"></div>
                  <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-accent-pink animate-pulse heatmap-glow"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-5 h-5 rounded-full bg-primary animate-pulse heatmap-glow"></div>
                </>
              )}

              {/* Action Button Overlay */}
              <button 
                onClick={handleRetake}
                className="relative z-10 flex flex-col items-center gap-3 bg-white/10 dark:bg-primary/30 backdrop-blur-xl px-8 py-6 rounded-2xl border border-white/20 hover:scale-105 transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-4xl text-white">photo_camera</span>
                <span className="text-white font-bold tracking-tight uppercase text-xs">
                  {generating ? aiAnalysisStep : scanning ? scanSteps[scanStep] : 'Capture Body Scan'}
                </span>
              </button>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-xl">monitor_weight</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Body Fat</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-urbanist">{metrics.bodyFat?.toString().replace(/%/g, '')}</span>
                <span className="text-sm font-medium text-slate-400">{metrics.bodyFat === '---' ? '' : '%'}</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-accent-cyan text-xl">fitness_center</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Muscle Mass</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-urbanist">{metrics.muscleMass?.toString().replace(/kg/g, '')}</span>
                <span className="text-sm font-medium text-slate-400">{metrics.muscleMass === '---' ? '' : 'kg'}</span>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-pink text-xl">accessibility_new</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Vision Assessment</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${generating || scanning ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-accent-pink/20 text-accent-pink border-accent-pink/20'}`}>
                  {generating ? 'ANALYZING...' : scanning ? 'SCANNING...' : metrics.bodyFat === '---' ? 'AWAITING SCAN' : 'SUCCESS'}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed italic-none">
                {generating ? 'Expert AI analyzing physique proportions...' : metrics.physiqueAssessment || metrics.posture}
              </p>
            </div>
          </section>

          {/* Real-time Insights (AI Plan driven) */}
          <section className="mt-8 mb-4">
            <h3 className="text-xl font-bold mb-4 font-urbanist">AI Insights</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
              {user.aiPlan ? (
                <>
                  <div className="min-w-[280px] bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Primary Goal</p>
                    <p className="text-sm font-medium leading-relaxed text-slate-400">{user.aiPlan.summary?.roadmap30Day || user.aiPlan.strategy}</p>
                  </div>
                  <div className="min-w-[280px] bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-accent-aqua uppercase tracking-widest mb-2">Performance Prediction</p>
                    <p className="text-sm font-medium leading-relaxed text-slate-400">Targeting {user.aiPlan.summary?.targetBodyFat} body fat with {user.aiPlan.summary?.expectedWeeklyProgress} weekly progress.</p>
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-6 opacity-40">
                  <p className="text-xs font-bold uppercase tracking-widest">Complete scan to unlock AI insights</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Action Button */}
        <div className="fixed bottom-24 left-0 right-0 px-6 flex justify-center z-40">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-3 px-8 py-5 rounded-full shadow-2xl transition-all w-full max-w-sm justify-center ${user.hasCompletedBodyScan ? 'bg-primary text-white shadow-primary/40 active:scale-95' : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'}`}
            disabled={!user.hasCompletedBodyScan}
          >
            <span className="material-symbols-outlined fill-1">auto_awesome</span>
            <span className="font-bold tracking-tight uppercase text-sm font-urbanist">View Transformation Plan</span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}

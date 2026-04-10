import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '', // New field for security
    isLoggedIn: false,
    hasCompletedBodyScan: false,
    lastScanDate: null,
    metrics: {
      bodyFat: '---',
      muscleMass: '---',
      lastScanImage: null // Store actual uploaded photo base64
    },
    // Detailed profile for AI
    profile: {
      fullName: '',
      age: "24",
      gender: "Female",
      height: "172cm",
      weight: "68kg",
      goal: "recomposition",
      experience: "intermediate",
      dietType: "mixed",
      medicalConditions: "none"
    },
    aiPlan: null,
    notificationsEnabled: true,
    language: "English"
  });

  // Helper to check if scan is older than 7 days
  const isScanStale = () => {
    if (!user.lastScanDate) return true;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - user.lastScanDate) > sevenDaysInMs;
  };

  // Load state from localStorage on mount (mocking persistence)
  useEffect(() => {
    const saved = localStorage.getItem('fitmorph_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure metrics structure exists
        if (!parsed.metrics) parsed.metrics = { bodyFat: '---', muscleMass: '---', lastScanImage: null };
        setUser(parsed);
      } catch (e) {
        console.error("Failed to load user state", e);
      }
    }
  }, []);

  // Save to localStorage whenever user state changes
  useEffect(() => {
    localStorage.setItem('fitmorph_user', JSON.stringify(user));
  }, [user]);

  const login = (userData = {}) => setUser(prev => ({ 
    ...prev, 
    ...userData, 
    isLoggedIn: true 
  }));

  const logout = () => {
    const initialState = { 
      name: '', 
      email: '',
      password: '',
      isLoggedIn: false, 
      hasCompletedBodyScan: false, 
      lastScanDate: null,
      metrics: { bodyFat: '---', muscleMass: '---', lastScanImage: null },
      profile: {
        fullName: '', age: "24", gender: "Female", height: "172cm", weight: "68kg", 
        goal: "recomposition", experience: "intermediate", dietType: "mixed", medicalConditions: "none"
      },
      aiPlan: null,
      notificationsEnabled: true,
      language: "English"
    };
    setUser(initialState);
    localStorage.removeItem('fitmorph_user');
  };
  
  const completeBodyScan = (metrics) => {
    setUser(prev => ({ ...prev, hasCompletedBodyScan: true, metrics }));
  };

  const saveScanResult = (metrics, plan) => {
    setUser(prev => ({ 
      ...prev, 
      hasCompletedBodyScan: true, 
      lastScanDate: Date.now(),
      metrics: {
        ...prev.metrics,
        ...metrics // includes lastScanImage
      }, 
      aiPlan: plan 
    }));
  };

  const setAiPlan = (plan) => {
    setUser(prev => ({ ...prev, aiPlan: plan }));
  };

  const updateProfile = (profileData) => {
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...profileData } }));
  };

  const toggleNotifications = () => {
    setUser(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  };

  const setLanguage = (lang) => {
    setUser(prev => ({ ...prev, language: lang }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, completeBodyScan, saveScanResult, updateProfile, setAiPlan, toggleNotifications, setLanguage, isScanStale }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';

export default function ProtectedRoute() {
  const { user } = useUser();
  
  const isScanExpired = user.lastScanDate && (Date.now() - user.lastScanDate > 7 * 24 * 60 * 60 * 1000);
  
  console.log("ProtectedRoute check:", { 
    hasCompletedBodyScan: user.hasCompletedBodyScan, 
    isScanExpired 
  });
  
  if (!user.hasCompletedBodyScan || isScanExpired) {
    return <Navigate to="/scan" replace />;
  }
  
  console.log("ProtectedRoute: Access granted to", window.location.pathname);

  return <Outlet />;
}

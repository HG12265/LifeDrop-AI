import React, { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Check if user already dismissed the banner in this session
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');

    const handleBeforeInstallPrompt = (e) => {
      // Prevent default mini-infobar
      e.preventDefault();
      // Save the event
      setDeferredPrompt(e);
      
      // User munnadiye dismiss pannala na mattum banner-ah kaattu
      if (!isDismissed) {
        setTimeout(() => setShowBanner(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowBanner(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // ✅ DISMISS LOGIC FIX
  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Event bubbling-ah thadukka
    
    setShowBanner(false);
    // Session storage-la save panroam, so refresh panra varaikkum thirumba varaathu
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[3000] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 text-white p-5 rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-lg flex items-center gap-4 relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-600/20 rounded-full blur-2xl"></div>

        <div className="bg-red-600 p-3 rounded-2xl shadow-lg relative z-10">
          <Smartphone size={24} />
        </div>

        <div className="flex-1 relative z-10">
          <h4 className="text-sm font-black italic tracking-tight">Install LifeDrop</h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Get Live Emergency Alerts</p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={handleInstallClick}
            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            Install
          </button>
          
          {/* ✅ FIXED CLOSE BUTTON */}
          <button 
            type="button"
            onClick={handleDismiss}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
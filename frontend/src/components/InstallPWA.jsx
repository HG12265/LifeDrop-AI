import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Listen for the browser's install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome from showing its default mini-infobar
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom banner after 3 seconds of landing
      setTimeout(() => setShowBanner(true), 3000);
    });

    // 2. Hide banner if app is already installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowBanner(false);
      console.log('LifeDrop App was installed');
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the browser's install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[2000] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 text-white p-5 rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-lg flex items-center gap-4 relative overflow-hidden group">
        
        {/* Background Glow */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/40 transition-all"></div>

        <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-900/20">
          <Smartphone size={24} />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-black italic tracking-tight">Install LifeDrop App</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Faster access & Live Alerts</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleInstallClick}
            className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
          >
            Install
          </button>
          <button 
            onClick={() => setShowBanner(false)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
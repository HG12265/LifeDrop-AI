import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// --- Capacitor Plugins for Native Features ---
import { StatusBar } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen'; 
import { Capacitor } from '@capacitor/core';

// --- Components & Global UI ---
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import ChatBot from './components/ChatBot';
import ConfirmModal from './components/ConfirmModal';
import BroadcastAlert from './components/BroadcastAlert';
import LanguageSwitcher from './components/LanguageSwitcher';

// --- Pages ---
import Home from './pages/Home';
import DonorRegister from './pages/DonorRegister';
import RequesterRegister from './pages/RequesterRegister';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import AdminVerification from './pages/AdminVerification';
import DonorDashboard from './pages/DonorDashboard';     
import RequesterDashboard from './pages/RequesterDashboard'; 
import BloodRequestForm from './pages/BloodRequestForm';
import DonorMatching from './pages/DonorMatching';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminDetails from './pages/AdminDetails';
import InventoryManager from './pages/InventoryManager';
import AdminAnalytics from './pages/AdminAnalytics';
import CampManager from './pages/CampManager';
import BlockchainView from './pages/BlockchainView';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import EditProfile from './pages/EditProfile';
import UniversityDashboard from './pages/UniversityDashboard';
import UniversityDetails from './pages/UniversityDetails';
import SecurityVault from './pages/SecurityVault';

// --- Sub-Component to handle Native Logic (Needs Router Context) ---
const NativeAppLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. ✅ HIDE STATUS BAR (TOP)
    const setupNativeUI = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.hide();
        } catch (e) {
          console.warn("StatusBar plugin not available");
        }
      }
    };

    // 2. ✅ HARDWARE BACK BUTTON LOGIC
    const setupBackButton = async () => {
      if (Capacitor.isNativePlatform()) {
        CapApp.addListener('backButton', (data) => {
          // Home page-la irundha app-ah exit pannuvom
          if (location.pathname === '/') {
            CapApp.exitApp();
          } else {
            // Vera page-la irundha munnadi irukura page-ku kuttittu povom
            navigate(-1);
          }
        });
      }
    };

    setupNativeUI();
    setupBackButton();

    // Cleanup listeners
    return () => {
      if (Capacitor.isNativePlatform()) {
        CapApp.removeAllListeners();
      }
    };
  }, [location.pathname, navigate]);

  return null; // Intha component UI ethuvum kaattaathu
};

function App() {
  const { t } = useTranslation();
  // --- User Session Logic (LocalStorage Sync) ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lifedrop_user');
    try {
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
        return null;
    }
  });

  // Modal State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 1. User Session Logic (LocalStorage Sync)
  // Intha effect 'user' state maarum pothu mattum run aagum
  useEffect(() => {
    if (user) {
      localStorage.setItem('lifedrop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lifedrop_user');
    }
  }, [user]);

  // 2. ✅ NEW: Native App Initialization (Splash Screen Fix)
  // Intha effect app open aagum pothu orey oru vaati mattum run aagum
  useEffect(() => {
    
  }, []);

  const handleLogoutTrigger = () => {
    setShowLogoutConfirm(true);
  };

  const finalizeLogout = () => {
    setUser(null);
    localStorage.removeItem('lifedrop_user');
    setShowLogoutConfirm(false);
    toast.success(t('app.toast_logout'));
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
        
        {/* ✅ Capacitor Native Logic Handler */}
        <NativeAppLogic />

        {/* Fixed & Global UI Elements */}
        <Navbar user={user} handleLogout={handleLogoutTrigger} />
        <Toaster richColors position="top-center" />
        <ChatBot />
        <BroadcastAlert />

        {/* CUSTOM LOGOUT CONFIRMATION MODAL */}
        <ConfirmModal 
          isOpen={showLogoutConfirm}
          title={t('app.modal_logout_title')}
          message={t('app.modal_logout_msg')}
          confirmText={t('app.btn_logout')}
          cancelText={t('app.btn_stay')}
          onConfirm={finalizeLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        {/* Main Content Area */}
        <main className="flex-grow pt-24 md:pt-28">
          <Routes>
            {/* 1. Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register-donor" element={<DonorRegister />} />
            <Route path="/register-requester" element={<RequesterRegister />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/blockchain/:id" element={<BlockchainView />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 2. Donor Protected Routes */}
            <Route 
              path="/donor-dashboard" 
              element={user && user.role === 'donor' ? <DonorDashboard user={user} /> : <Navigate to="/login" />} 
            />

            {/* 3. Requester Protected Routes */}
            <Route 
              path="/requester-dashboard" 
              element={user && user.role === 'requester' ? <RequesterDashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
             path="/new-request" 
             element={user && user.role === 'requester' ? <BloodRequestForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/matching/:id" 
              element={user ? <DonorMatching user={user} /> : <Navigate to="/login" />} 
            />

            {/* 4. Admin Portal Protected Routes */}
            <Route 
              path="/admin-dashboard" 
              element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/details/:category" 
              element={user && user.role === 'admin' ? <AdminDetails /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/inventory" 
              element={user && user.role === 'admin' ? <InventoryManager /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/analytics" 
              element={user && user.role === 'admin' ? <AdminAnalytics /> : <Navigate to="/login" />} 
            />
            <Route path="/admin/security-vault" element={user?.role === 'admin' ? <SecurityVault /> : <Navigate to="/login" />} />
            
            <Route 
              path="/admin/camps" 
              element={user && user.role === 'admin' ? <CampManager /> : <Navigate to="/login" />} 
            />
            <Route path="/admin/university-dashboard" element={user?.role === 'admin' ? <UniversityDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/university/details/:type" element={user?.role === 'admin' ? <UniversityDetails /> : <Navigate to="/login" />} />
            <Route 
              path="/admin/verifications" 
              element={user?.role === 'admin' ? <AdminVerification /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/edit-profile" 
              element={user ? <EditProfile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />

            {/* Catch-all: Redirect to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Premium Footer Component */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
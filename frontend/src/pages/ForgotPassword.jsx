import React, { useState } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- STEP 1: Send OTP to Email ---
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('forgot_pass.toast_otp_sent'));
        setStep(2);
      } else {
        toast.error(data.message || t('forgot_pass.toast_email_not_found'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('forgot_pass.toast_conn_err'));
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Verify OTP (THE FIX IS HERE) ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Namma registration-ku use panna adhey check-otp API-ah ingaiyum use panroam
      const res = await fetch(`${API_URL}/api/check-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success(t('forgot_pass.toast_otp_success'));
        setStep(3); // Correct OTP-na mattum thaan step 3-ku pogum
      } else {
        toast.error(data.message || t('forgot_pass.toast_otp_invalid'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('forgot_pass.toast_verify_fail'));
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: Final Password Reset ---
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('forgot_pass.toast_pass_update'));
        navigate('/login');
      } else {
        toast.error(data.message || t('forgot_pass.toast_pass_err'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('forgot_pass.toast_server_err'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 md:p-10 mt-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <KeyRound size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black italic">{t('forgot_pass.title')}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t('forgot_pass.subtitle')}</p>
        </div>

        <div className="p-8">
          {/* STEP 1: EMAIL INPUT */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <p className="text-xs text-gray-500 text-center">{t('forgot_pass.step1_desc')}</p>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-400" size={18}/>
                <input type="email" placeholder={t('forgot_pass.email_ph')} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold" onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                {loading ? t('forgot_pass.btn_sending') : t('forgot_pass.btn_send_code')} <ArrowRight size={18}/>
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION (Fixed Logic) */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 text-center">
              <p className="text-xs text-gray-500">{t('forgot_pass.step2_desc')} <br/><span className="font-bold text-slate-800">{email}</span></p>
              <input type="text" maxLength="4" placeholder="0000" className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-red-500 outline-none text-center text-3xl font-black tracking-[15px]" onChange={e => setOtp(e.target.value)} required />
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                {loading ? t('forgot_pass.btn_verifying') : t('forgot_pass.btn_verify')}
              </button>
              <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-gray-400 uppercase hover:text-red-600 transition">{t('forgot_pass.btn_change_email')}</button>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-5">
              <p className="text-xs text-gray-500 text-center">{t('forgot_pass.step3_desc')}</p>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={18}/>
                <input type="password" placeholder={t('forgot_pass.new_pass_ph')} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold" onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg">
                {loading ? t('forgot_pass.btn_updating') : t('forgot_pass.btn_update')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
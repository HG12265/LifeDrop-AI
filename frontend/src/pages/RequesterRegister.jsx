import React, { useState } from 'react';
import { API_URL } from '../config'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SuccessModal from '../components/SuccessModal';
import OTPModal from '../components/OTPModal'; 
import IDCardUpload from '../components/IDCardUpload'; 
import { 
  User, Mail, Phone, Lock, ShieldAlert, ArrowRight, 
  UserPlus, ShieldCheck, School, Loader2
} from 'lucide-react';

const RequesterRegister = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    fullName: '', phone: '', email: '', password: '',
    department: '', roleType: 'Student', year: '' 
  });
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredId, setRegisteredId] = useState(''); 
  const [showModal, setShowModal] = useState(false); 

  const [community, setCommunity] = useState('Public');
  const [idFile, setIdFile] = useState(null); // Inga thaan base64 string store aagum
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [verifyingId, setVerifyingId] = useState(false);

  // --- ✅ FIXED AI VERIFICATION LOGIC ---
  const handleAiVerify = async () => {
    // Safety Check: idFile string-ah irukanum
    if (!idFile || typeof idFile !== 'string') {
      return toast.error("Please select an ID card image first and wait for it to load.");
    }
    
    setVerifyingId(true);
    try {
      // Base64 prefix-ah safe-ah split panroam
      const base64Parts = idFile.split(',');
      if (base64Parts.length < 2) {
        throw new Error("Invalid image format");
      }
      const base64Data = base64Parts[1]; 

      const res = await fetch(`${API_URL}/api/verify-id-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      
      const result = await res.json();

      if (res.ok && result.is_valid) {
        setIsIdVerified(true);
        setFormData(prev => ({ ...prev, roleType: result.role || "Student" }));
        toast.success("AI Verified Successfully! ✅");
      } else {
        toast.error(result.message || "AI could not verify this ID. Try a clearer photo.");
      }
    } catch (err) {
      console.error("AI Error:", err);
      toast.error("AI Service Error. Please try again.");
    } finally {
      setVerifyingId(false);
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (community === 'Periyar University' && !isIdVerified) {
        return toast.error("Please verify your University ID card with AI first.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/verify/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setShowOTP(true);
        toast.success("Verification code sent!");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeRegistration = async () => {
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        community: community,
        is_verified: isIdVerified,
        id_card_image: idFile // Compressed base64 string
      };

      const res = await fetch(`${API_URL}/register/requester`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      const data = await res.json();
      if (res.ok && data.unique_id) {
        setRegisteredId(data.unique_id);
        setShowOTP(false);
        setShowModal(true);
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Registration error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 relative animate-in fade-in zoom-in duration-500">
      {showOTP && <OTPModal email={formData.email} onVerify={finalizeRegistration} onClose={() => setShowOTP(false)} onResend={handleInitialSubmit} />}
      {showModal && <SuccessModal userId={registeredId} type="requester" onClose={() => navigate('/login')} />}

      <div className={`bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 ${(showModal || showOTP) ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="bg-slate-900 p-10 md:p-14 text-white text-center relative overflow-hidden border-b-8 border-red-600">
            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/10">
                <UserPlus size={36} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Requester Sign Up</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic">LifeDrop Emergency Portal</p>
        </div>

        <form onSubmit={handleInitialSubmit} className="p-8 md:p-12 space-y-12">
          <div className="max-w-md mx-auto space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><School size={12}/> Select Community</label>
            <select className="w-full p-5 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-black text-slate-700 transition-all shadow-inner" onChange={(e) => { setCommunity(e.target.value); setIsIdVerified(false); }} value={community}>
                <option value="Public">Public (General)</option>
                <option value="Periyar University">Periyar University, Salem</option>
            </select>
          </div>

          {community === 'Periyar University' && (
            <div className="bg-indigo-50/50 p-8 rounded-[40px] border-2 border-dashed border-indigo-100 animate-in slide-in-from-top duration-500">
                <h3 className="font-black text-indigo-900 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6"><School size={20} className="text-indigo-600"/> University AI Verification</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <input type="text" placeholder="Department" className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, department: e.target.value})} required />
                        <select className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, roleType: e.target.value})}>
                            <option value="Student">Student</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                    {/* ✅ CORRECTED ID CARD UPLOAD USAGE */}
                    <IDCardUpload 
                        mode="ai" 
                        isVerified={isIdVerified}
                        onImageSelect={(base64, verified, role) => {
                            setIdFile(base64); // Store the base64 string
                            if(verified) {
                                setIsIdVerified(true);
                                setFormData(prev => ({ ...prev, roleType: role }));
                            }
                        }} 
                    />
                    {!isIdVerified && idFile && (
                        <button type="button" onClick={handleAiVerify} disabled={verifyingId} className="lg:col-span-2 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                            {verifyingId ? <><Loader2 className="animate-spin" size={16}/> AI SCANNING...</> : "START AI VERIFICATION"}
                        </button>
                    )}
                </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><User size={10}/> Full Name</label>
                <input type="text" placeholder="Enter your name" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold text-gray-700 shadow-inner" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Phone size={10}/> Mobile Number</label>
                <input type="tel" placeholder="+91" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold text-gray-700 shadow-inner" onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Mail size={10}/> Email ID</label>
                <input type="email" placeholder="mail@example.com" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold text-gray-700 shadow-inner" onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1 tracking-widest"><Lock size={10}/> Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold text-gray-700 shadow-inner" onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest">
            {loading ? "PROCESSING..." : "VERIFY & SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequesterRegister;
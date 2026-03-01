import React, { useState } from 'react';
import { API_URL } from '../config'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SuccessModal from '../components/SuccessModal';
import OTPModal from '../components/OTPModal'; 
import IDCardUpload from '../components/IDCardUpload'; 
import { 
  User, Mail, Phone, Lock, ShieldAlert, ArrowRight, 
  UserPlus, ShieldCheck, School, Loader2, Calendar, CheckCircle2
} from 'lucide-react';

const RequesterRegister = () => {
  const navigate = useNavigate();
  
  // --- MODAL & LOADING STATES ---
  const [showModal, setShowModal] = useState(false); 
  const [showOTP, setShowOTP] = useState(false); 
  const [registeredId, setRegisteredId] = useState(''); 
  const [loading, setLoading] = useState(false);

  // --- UNIVERSITY / AI STATES ---
  const [community, setCommunity] = useState('Public');
  const [idFile, setIdFile] = useState(null); 
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [verifyingId, setVerifyingId] = useState(false);

  // --- FORM DATA ---
  const [formData, setFormData] = useState({ 
    fullName: '', phone: '', email: '', password: '',
    department: '', roleType: 'Student', year: '' 
  });

  // --- AI ID VERIFICATION LOGIC ---
  const handleAiVerify = async () => {
    if (!idFile) return toast.error("Please select your ID card image first");
    
    setVerifyingId(true);
    try {
      const base64Data = idFile.split(',')[1]; 

      const res = await fetch(`${API_URL}/api/verify-id-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      
      const result = await res.json();

      if (res.ok && result.is_valid) {
       setIsIdVerified(true);
       setFormData(prev => ({ ...prev, roleType: result.role || "Student" }));
       toast.success("Periyar University ID Verified! ✅");
      } else {
    // ✅ REASON-AH KAATTUVOM
       toast.error(result.reason || "Invalid ID Card. Only Main University Campus IDs are accepted.");
      }
    } catch (err) {
      toast.error("AI Verification service error. Try again.");
    } finally {
      setVerifyingId(false);
    }
  };

  // STEP 1: Initial Submit (Sends OTP)
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    if (community === 'Periyar University' && !isIdVerified) {
        return toast.error("Please verify your University ID card with AI to proceed.");
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
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("Connection error. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Final Registration
  const finalizeRegistration = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register/requester`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            community: community,
            is_verified: isIdVerified,
            id_card_image: idFile 
        })
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
      toast.error("Registration error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 relative animate-in fade-in zoom-in duration-500">
      
      {showOTP && (
        <OTPModal email={formData.email} onVerify={finalizeRegistration} onClose={() => setShowOTP(false)} onResend={handleInitialSubmit} />
      )}

      {showModal && (
        <SuccessModal userId={registeredId} type="requester" onClose={() => navigate('/login')} />
      )}

      <div className={`bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 ${(showModal || showOTP) ? 'blur-sm pointer-events-none' : ''}`}>
        
        {/* Modern Header Section */}
        <div className="bg-slate-900 p-10 md:p-14 text-white text-center relative overflow-hidden border-b-8 border-red-600">
            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/10">
                <UserPlus size={36} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Requester Sign Up</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic">LifeDrop Emergency Portal</p>
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleInitialSubmit} className="p-6 md:p-12 space-y-12">
          
          {/* COMMUNITY SELECTION */}
          <div className="max-w-md mx-auto space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1">
                <School size={12}/> Select Community
            </label>
            <select 
                className="w-full p-5 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-black text-slate-700 transition-all shadow-inner"
                onChange={(e) => { setCommunity(e.target.value); setIsIdVerified(false); }}
                value={community}
            >
                <option value="Public">Public (General)</option>
                <option value="Periyar University">Periyar University, Salem</option>
            </select>
          </div>

          {/* --- UNIVERSITY SPECIAL SECTION (Responsive Grid) --- */}
          {community === 'Periyar University' && (
            <div className="bg-indigo-50/50 p-8 rounded-[40px] border-2 border-dashed border-indigo-100 animate-in slide-in-from-top duration-500">
                <h3 className="font-black text-indigo-900 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6">
                    <School size={20} className="text-indigo-600"/> University Details
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Department</label>
                            <input type="text" placeholder="e.g. Computer Science" className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, department: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Role</label>
                                <select className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, roleType: e.target.value})}>
                                    <option value="Student">Student</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                            {/* ✅ YEAR FIELD ADDED BACK HERE */}
                            {formData.roleType === 'Student' && (
                             <div className="space-y-1.5 animate-in fade-in duration-300">
                               <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Year</label>
                               <select 
                        className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm appearance-none cursor-pointer" 
                                 onChange={e => setFormData({...formData, year: e.target.value})}
                                 required // ✅ Ippo ithu mandatory
                             >
                                 <option value="">Select Year</option>
                                 <option value="I YEAR">I YEAR</option>
                                 <option value="II YEAR">II YEAR</option>
                                 <option value="III YEAR">III YEAR</option>
                                 <option value="IV YEAR">IV YEAR</option>
                                 <option value="V YEAR">V YEAR</option>
                             </select>
                           </div>
                          )}
                        </div>
                    </div>

                    {/* AI UPLOAD BOX */}
                    <IDCardUpload 
                        mode="ai" 
                        isVerified={isIdVerified}
                        onImageSelect={(base64, verified, role) => {
                            setIdFile(base64);
                            if(verified) {
                                setIsIdVerified(true);
                                setFormData(prev => ({ ...prev, roleType: role }));
                            }
                        }} 
                    />
                </div>
            </div>
          )}

          {/* ACCOUNT DETAILS BLOCK (Responsive Grid) */}
          <div className="space-y-6">
            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter border-b pb-2 border-gray-50">
                <ShieldCheck size={18} className="text-red-600"/> Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><User size={10}/> Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="text" placeholder="Your Name" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Phone size={10}/> Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="tel" placeholder="+91" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Mail size={10}/> Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="email" placeholder="mail@example.com" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Lock size={10}/> Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="password" placeholder="••••••••" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, password: e.target.value})} required />
                  </div>
               </div>
            </div>
          </div>

          {/* Legal Alert */}
          <div className="flex gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100 shadow-sm">
             <ShieldAlert size={28} className="text-red-600 shrink-0" />
             <p className="text-[11px] font-bold text-red-800 leading-relaxed uppercase tracking-tight">
               By creating an account, you agree that LifeDrop is a connector platform. Please verify medical details and donor identity manually before the extraction process.
             </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> PROCESSING...</div> : <><ArrowRight size={24}/> VERIFY & SIGN UP</>}
            </button>

            <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                Already part of the mission? 
                <span className="text-red-600 font-black cursor-pointer hover:underline ml-2" onClick={() => navigate('/login')}>
                    Sign In
                </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequesterRegister;
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createWorker } from 'tesseract.js'; // ✅ Frontend OCR
import LocationPicker from '../components/LocationPicker';
import SuccessModal from '../components/SuccessModal';
import OTPModal from '../components/OTPModal'; 
import { 
  Activity, ShieldCheck, ShieldAlert, User, Mail, 
  Phone, Lock, Calendar, Droplet, ArrowRight, UserPlus,
  School, UploadCloud, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

const DonorRegister = () => {
  const navigate = useNavigate();
  
  // --- MODAL & LOADING STATES ---
  const [showModal, setShowModal] = useState(false); 
  const [showOTP, setShowOTP] = useState(false); 
  const [registeredId, setRegisteredId] = useState(''); 
  const [loading, setLoading] = useState(false);

  // --- UNIVERSITY / OCR STATES ---
  const [community, setCommunity] = useState('Public');
  const [idFile, setIdFile] = useState(null);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [verifyingId, setVerifyingId] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // --- MAP & HEALTH STATES ---
  const [position, setPosition] = useState({ lat: 13.0827, lng: 80.2707 });
  const [healthScore, setHealthScore] = useState(100);
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', bloodGroup: '', dob: '',
    community: 'Public', department: '', roleType: 'Student', year: '',
    weight: true, alcohol: false, surgery: false, tattoo: false, medication: false
  });

  // Health Score Calculation
  useEffect(() => {
    let score = 100;
    if (!formData.weight) score -= 30;
    if (formData.alcohol) score -= 20;
    if (formData.surgery) score -= 25;
    if (formData.tattoo) score -= 15;
    if (formData.medication) score -= 10;
    setHealthScore(score < 0 ? 0 : score);
  }, [formData]);

  // --- ✅ NEW: FRONTEND OCR VERIFICATION LOGIC ---
  const handleIdVerify = async () => {
    if (!idFile) return toast.error("Please select your ID card image first");
    
    setVerifyingId(true);
    setOcrProgress(0);

    try {
      // 1. Create Tesseract Worker
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      // 2. Perform OCR
      const { data: { text } } = await worker.recognize(idFile);
      const extractedText = text.toUpperCase();
      
      // 3. Clean up worker
      await worker.terminate();

      console.log("Extracted Text:", extractedText);

      // 4. Keyword Matching (Based on your Periyar University ID)
      const keywords = ["PERIYAR", "UNIVERSITY", "SALEM"];
      const isMatched = keywords.every(key => extractedText.includes(key));
      
      const isStudent = extractedText.includes("STUDENT") || extractedText.includes("IDENTITY");

      if (isMatched) {
        setIsIdVerified(true);
        setFormData(prev => ({ ...prev, roleType: isStudent ? "Student" : "Staff" }));
        toast.success("Periyar University ID Verified Locally! ✅");
      } else {
        toast.error("Invalid ID Card. Please ensure 'Periyar University' is clearly visible.");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      toast.error("AI Scanning failed. Please use a clearer photo.");
    } finally {
      setVerifyingId(false);
    }
  };

  // STEP 1: Initial Submit (Sends OTP)
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    if (community === 'Periyar University' && !isIdVerified) {
        return toast.error("Please verify your University ID card to proceed.");
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
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Final Registration
  const finalizeRegistration = async () => {
    setLoading(true);
    const finalData = {
      ...formData,
      community: community,
      lat: position.lat,
      lng: position.lng,
      healthScore: healthScore
    };

    try {
      const res = await fetch(`${API_URL}/register/donor`, {
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
    <div className="max-w-7xl mx-auto p-4 md:p-10 relative animate-in fade-in zoom-in duration-500">
      
      {showOTP && (
        <OTPModal email={formData.email} onVerify={finalizeRegistration} onClose={() => setShowOTP(false)} onResend={handleInitialSubmit} />
      )}

      {showModal && (
        <SuccessModal userId={registeredId} type="donor" onClose={() => navigate('/login')} />
      )}

      <div className={`bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 ${(showModal || showOTP) ? 'blur-sm pointer-events-none' : ''}`}>
        
        {/* Header Section */}
        <div className="bg-slate-900 p-10 md:p-14 text-white text-center relative overflow-hidden border-b-8 border-red-600">
            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/10">
                <UserPlus size={36} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Become a Hero</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic">LifeDrop Hero Registration</p>
            <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>
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
            >
                <option value="Public">Public (General)</option>
                <option value="Periyar University">Periyar University, Salem</option>
            </select>
          </div>

          {/* --- UNIVERSITY SPECIAL SECTION --- */}
          {community === 'Periyar University' && (
            <div className="bg-indigo-50/50 p-8 rounded-[40px] border-2 border-dashed border-indigo-100 animate-in slide-in-from-top duration-500">
                <h3 className="font-black text-indigo-900 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6">
                    <School size={20} className="text-indigo-600"/> University Verification
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Department</label>
                            <input type="text" placeholder="e.g. Computer Science" className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, department: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Role</label>
                                <select className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, roleType: e.target.value})}>
                                    <option value="Student">Student</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                            {formData.roleType === 'Student' && (
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">Year (Optional)</label>
                                    <input type="text" placeholder="e.g. 2nd Year" className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, year: e.target.value})} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OCR UPLOAD BOX */}
                    <div className={`p-6 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-4 ${isIdVerified ? 'bg-green-50 border-green-200' : 'bg-white border-indigo-200'}`}>
                        {isIdVerified ? (
                            <>
                                <div className="bg-green-500 p-3 rounded-full text-white shadow-lg animate-bounce"><CheckCircle2 size={32}/></div>
                                <p className="font-black text-green-700 uppercase text-xs tracking-widest">ID Verified Successfully</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud size={40} className="text-indigo-300" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-indigo-900 uppercase">Upload ID Card</p>
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Front side clear image</p>
                                </div>
                                <input type="file" accept="image/*" className="hidden" id="id-upload" onChange={(e) => setIdFile(e.target.files[0])} />
                                <label htmlFor="id-upload" className="cursor-pointer bg-indigo-100 text-indigo-600 px-6 py-2 rounded-full font-black text-[10px] hover:bg-indigo-200 transition">
                                    {idFile ? idFile.name : "SELECT IMAGE"}
                                </label>
                                
                                {verifyingId ? (
                                    <div className="w-full space-y-2">
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
                                        </div>
                                        <p className="text-[9px] font-black text-indigo-600 animate-pulse uppercase">AI Scanning: {ocrProgress}%</p>
                                    </div>
                                ) : (
                                    <button type="button" onClick={handleIdVerify} disabled={!idFile} className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50">
                                        START AI VERIFICATION
                                    </button>
                                )}
                                <p className="text-[8px] text-slate-400 italic font-bold"><AlertCircle size={8} className="inline mr-1"/> Processed locally for privacy</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
          )}

          {/* IDENTITY DETAILS BLOCK */}
          <div className="space-y-6">
            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter border-b pb-2 border-gray-50">
                <User size={18} className="text-red-600"/> Identity Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Lock size={10}/> Security Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="password" placeholder="••••••••" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, password: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Droplet size={10}/> Blood Group</label>
                  <div className="relative group">
                    <Droplet className="absolute left-4 top-4 text-red-500 transition-colors" size={18}/>
                    <select className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 appearance-none cursor-pointer transition-all shadow-inner" onChange={e => setFormData({...formData, bloodGroup: e.target.value})} required>
                        <option value="">Choose Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Calendar size={10}/> Date of Birth</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="date" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-400 transition-all shadow-inner cursor-pointer" onChange={e => setFormData({...formData, dob: e.target.value})} required />
                  </div>
               </div>
            </div>
          </div>

          {/* MAIN GRID: Desktop 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT: Location & Legal */}
            <div className="space-y-8 flex flex-col h-full">
               <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6 border-b pb-2 border-gray-50">
                      <ShieldCheck size={18} className="text-blue-600"/> Current Location
                  </h3>
                  <LocationPicker position={position} setPosition={setPosition} />
               </div>
               <div className="flex gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100 mt-auto shadow-sm">
                  <ShieldAlert size={28} className="text-red-600 shrink-0" />
                  <p className="text-[11px] font-bold text-red-800 leading-relaxed uppercase tracking-tight">
                    By creating a hero account, you confirm that all information provided is true. LifeDrop is a connector platform; please verify medical details manually before donation.
                  </p>
               </div>
            </div>

            {/* RIGHT: Health & Submit */}
            <div className="space-y-8 flex flex-col h-full">
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl border-b-4 border-red-600">
                   <Activity className="absolute right-[-10px] bottom-[-10px] opacity-10" size={120} />
                   <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">Medical Trust Rating</p>
                   <div className="flex items-end gap-2">
                      <h4 className="text-6xl font-black italic tracking-tighter">{healthScore}%</h4>
                      <span className="text-xs font-bold opacity-50 mb-2 uppercase tracking-widest leading-none border-l pl-2 border-white/20">Safe Score</span>
                   </div>
                   <div className="mt-6 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
                   </div>
                </div>

                <div>
                   <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6 border-b pb-2 border-gray-50">
                       <ShieldCheck size={18} className="text-green-600"/> Eligibility Screening
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <HealthCheck label="Weight > 50kg" checked={formData.weight} onChange={() => setFormData({...formData, weight: !formData.weight})} />
                     <HealthCheck label="No alcohol (24h)" checked={!formData.alcohol} onChange={() => setFormData({...formData, alcohol: !formData.alcohol})} />
                     <HealthCheck label="No surgery (6m)" checked={!formData.surgery} onChange={() => setFormData({...formData, surgery: !formData.surgery})} />
                     <HealthCheck label="No Tattoos (6m)" checked={!formData.tattoo} onChange={() => setFormData({...formData, tattoo: !formData.tattoo})} />
                   </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-auto uppercase tracking-widest"
                >
                  {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> PROCESSING...</div> : <><ShieldCheck size={24}/> GET VERIFIED & JOIN</>}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const HealthCheck = ({ label, checked, onChange }) => (
  <label className={`flex justify-between items-center p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${checked ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-gray-50 border-transparent opacity-60'}`}>
    <span className={`text-[10px] font-black uppercase tracking-tight ${checked ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked ? 'bg-green-600 border-green-600' : 'border-gray-200 bg-white'}`}>
       {checked && <ShieldCheck size={14} className="text-white" />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
  </label>
);

export default DonorRegister;
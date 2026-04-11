import React, { useState, useEffect } from 'react';
import { API_URL } from '../config'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LocationPicker from '../components/LocationPicker';
import SuccessModal from '../components/SuccessModal';
import OTPModal from '../components/OTPModal'; 
import IDCardUpload from '../components/IDCardUpload'; // ✅ PUDHU IMPORT
import { 
  Activity, ShieldCheck, ShieldAlert, User, Mail, 
  Phone, Lock, Calendar, Droplet, ArrowRight, UserPlus,
  School, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DonorRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // --- MODAL & LOADING STATES ---
  const [showModal, setShowModal] = useState(false); 
  const [showOTP, setShowOTP] = useState(false); 
  const [registeredId, setRegisteredId] = useState(''); 
  const [loading, setLoading] = useState(false);

  // --- UNIVERSITY / COMMUNITY STATES ---
  const [community, setCommunity] = useState('Public');
  const [idFile, setIdFile] = useState(null); // ✅ Inga thaan compressed image store aagum

  // --- MAP & HEALTH STATES ---
  const [position, setPosition] = useState({ lat: 13.0827, lng: 80.2707 });
  const [healthScore, setHealthScore] = useState(100);
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', bloodGroup: '', dob: '',
    department: '', roleType: 'Student', year: '',
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

  // STEP 1: Initial Submit (Sends OTP)
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for University Members
    if (community === 'Periyar University' && !idFile) {
        return toast.error(t('donor_reg.toast_id_req'));
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
        toast.success(t('donor_reg.toast_otp_sent'));
      } else {
        toast.error(data.message || t('donor_reg.toast_otp_fail'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('donor_reg.toast_conn_err'));
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Final Registration (Runs after OTP Success)
  const finalizeRegistration = async () => {
    setLoading(true);
    try {
      const finalData = {
        ...formData,
        community: community,
        id_card_image: idFile, // ✅ idFile ippo direct-ah compressed base64 string-ah irukkum
        lat: position.lat,
        lng: position.lng,
        healthScore: healthScore
      };

      console.log("📤 Sending Registration Data to Backend...");

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
        toast.error(data.message || t('donor_reg.toast_reg_fail'));
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      toast.error(t('donor_reg.toast_reg_err'));
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
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">{t('donor_reg.title')}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic">{t('donor_reg.subtitle')}</p>
            <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-red-600/10 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleInitialSubmit} className="p-6 md:p-12 space-y-12">
          
          {/* COMMUNITY SELECTION */}
          <div className="max-w-md mx-auto space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1">
                <School size={12}/> {t('donor_reg.select_community')}
            </label>
            <select 
                className="w-full p-5 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-black text-slate-700 transition-all shadow-inner"
                onChange={(e) => setCommunity(e.target.value)}
                value={community}
            >
                <option value="Public">{t('donor_reg.comm_public')}</option>
                <option value="Periyar University">{t('donor_reg.comm_pu')}</option>
            </select>
          </div>

          {/* --- UNIVERSITY SPECIAL SECTION --- */}
          {community === 'Periyar University' && (
            <div className="bg-indigo-50/50 p-8 rounded-[40px] border-2 border-dashed border-indigo-100 animate-in slide-in-from-top duration-500">
                <h3 className="font-black text-indigo-900 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6">
                    <School size={20} className="text-indigo-600"/> {t('donor_reg.uni_details')}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">{t('donor_reg.dept')}</label>
                            <input type="text" placeholder={t('donor_reg.dept_ph')} className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, department: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">{t('donor_reg.role')}</label>
                                <select className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm" onChange={e => setFormData({...formData, roleType: e.target.value})}>
                                    <option value="Student">{t('donor_reg.role_student')}</option>
                                    <option value="Staff">{t('donor_reg.role_staff')}</option>
                                </select>
                            </div>
                            {formData.roleType === 'Student' && (
                             <div className="space-y-1.5 animate-in fade-in duration-300">
                               <label className="text-[9px] font-black text-indigo-400 uppercase ml-2">{t('donor_reg.year')}</label>
                               <select 
                        className="w-full p-4 bg-white rounded-2xl border-none font-bold text-indigo-900 shadow-sm appearance-none cursor-pointer" 
                                 onChange={e => setFormData({...formData, year: e.target.value})}
                                 required // ✅ Ippo ithu mandatory
                             >
                                 <option value="">{t('donor_reg.year_select')}</option>
                                 <option value="I YEAR">{t('donor_reg.year_1')}</option>
                                 <option value="II YEAR">{t('donor_reg.year_2')}</option>
                                 <option value="III YEAR">{t('donor_reg.year_3')}</option>
                                 <option value="IV YEAR">{t('donor_reg.year_4')}</option>
                                 <option value="V YEAR">{t('donor_reg.year_5')}</option>
                             </select>
                           </div>
                          )}
                        </div>
                    </div>

                    {/* ✅ INTEGRATED ID CARD UPLOAD COMPONENT */}
                    <IDCardUpload 
                        mode="admin" 
                        onImageSelect={(base64) => setIdFile(base64)} 
                    />
                </div>
            </div>
          )}

          {/* IDENTITY DETAILS BLOCK */}
          <div className="space-y-6">
            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter border-b pb-2 border-gray-50">
                <User size={18} className="text-red-600"/> {t('donor_reg.identity')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><User size={10}/> {t('donor_reg.name')}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="text" placeholder={t('donor_reg.name_ph')} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Phone size={10}/> {t('donor_reg.phone')}</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="tel" placeholder="+91" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, phone: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Mail size={10}/> {t('donor_reg.email')}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="email" placeholder={t('donor_reg.email_ph')} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Lock size={10}/> {t('donor_reg.password')}</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18}/>
                    <input type="password" placeholder="••••••••" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 transition-all shadow-inner" onChange={e => setFormData({...formData, password: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Droplet size={10}/> {t('donor_reg.blood')}</label>
                  <div className="relative group">
                    <Droplet className="absolute left-4 top-4 text-red-500 transition-colors" size={18}/>
                    <select className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white outline-none font-bold text-gray-700 appearance-none cursor-pointer transition-all shadow-inner" onChange={e => setFormData({...formData, bloodGroup: e.target.value})} required>
                        <option value="">{t('donor_reg.blood_ph')}</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest flex items-center gap-1"><Calendar size={10}/> {t('donor_reg.dob')}</label>
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
                      <ShieldCheck size={18} className="text-blue-600"/> {t('donor_reg.location')}
                  </h3>
                  <LocationPicker position={position} setPosition={setPosition} />
               </div>
               <div className="flex gap-4 bg-red-50 p-6 rounded-[32px] border border-red-100 mt-auto shadow-sm">
                  <ShieldAlert size={28} className="text-red-600 shrink-0" />
                  <p className="text-[11px] font-bold text-red-800 leading-relaxed uppercase tracking-tight">
                    {t('donor_reg.legal_warning')}
                  </p>
               </div>
            </div>

            {/* RIGHT: Health & Submit */}
            <div className="space-y-8 flex flex-col h-full">
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl border-b-4 border-red-600">
                   <Activity className="absolute right-[-10px] bottom-[-10px] opacity-10" size={120} />
                   <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">{t('donor_reg.trust_rating')}</p>
                   <div className="flex items-end gap-2">
                      <h4 className="text-6xl font-black italic tracking-tighter">{healthScore}%</h4>
                      <span className="text-xs font-bold opacity-50 mb-2 uppercase tracking-widest leading-none border-l pl-2 border-white/20">{t('donor_reg.safe_score')}</span>
                   </div>
                   <div className="mt-6 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
                   </div>
                </div>

                <div>
                   <h3 className="font-black text-gray-800 text-lg flex items-center gap-2 uppercase tracking-tighter mb-6 border-b pb-2 border-gray-50">
                       <ShieldCheck size={18} className="text-green-600"/> {t('donor_reg.screening')}
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <HealthCheck label={t('donor_reg.check_weight')} checked={formData.weight} onChange={() => setFormData({...formData, weight: !formData.weight})} />
                     <HealthCheck label={t('donor_reg.check_alcohol')} checked={!formData.alcohol} onChange={() => setFormData({...formData, alcohol: !formData.alcohol})} />
                     <HealthCheck label={t('donor_reg.check_surgery')} checked={!formData.surgery} onChange={() => setFormData({...formData, surgery: !formData.surgery})} />
                     <HealthCheck label={t('donor_reg.check_tattoo')} checked={!formData.tattoo} onChange={() => setFormData({...formData, tattoo: !formData.tattoo})} />
                   </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-auto uppercase tracking-widest"
                >
                  {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> {t('donor_reg.processing')}</div> : <><ShieldCheck size={24}/> {t('donor_reg.btn_verify')}</>}
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
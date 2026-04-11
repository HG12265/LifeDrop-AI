import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { 
  ShieldCheck, ArrowLeft, User, School, 
  CheckCircle2, XCircle, Eye, Loader2, Search,
  AlertCircle, Phone, X, Maximize2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- LIGHTBOX STATE ---
  const [selectedImg, setSelectedImg] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/pending-verifications`);
      const data = await res.json();
      setPendingList(data);
    } catch (err) {
      toast.error(t('admin_ver.toast_fetch_err'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (u_id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/approve-donor/${u_id}`, {
        method: 'POST'
      });
      if (res.ok) {
        toast.success(t('admin_ver.toast_verified', { name }));
        fetchPending();
      }
    } catch (err) {
      toast.error(t('admin_ver.toast_appr_fail'));
    }
  };

  const filteredList = pendingList.filter(donor => 
    donor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.unique_id.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">{t('admin_ver.loading')}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* --- 1. IMAGE LIGHTBOX MODAL (Fixes Blank Page Issue) --- */}
      {selectedImg && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in zoom-in duration-300">
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 bg-white/10 text-white p-3 rounded-full hover:bg-red-600 transition-all"
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImg} 
            alt="Full ID Card" 
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain border-4 border-white/10"
          />
          <p className="absolute bottom-6 text-white/40 font-black text-[10px] uppercase tracking-[0.5em]">{t('admin_ver.secure_viewer')}</p>
        </div>
      )}

      {/* --- 2. HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{t('admin_ver.header_title')}</h2>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2">{t('admin_ver.header_subtitle')}</p>
            </div>
          </div>
        </div>
        <div className="relative w-full md:w-80 z-10">
          <Search className="absolute left-4 top-4 text-slate-500" size={18} />
          <input 
            type="text" placeholder={t('admin_ver.search_ph')} 
            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-red-500 focus:bg-white/10 transition-all font-bold text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <School size={180} className="absolute right-[-40px] top-[-40px] opacity-5 -rotate-12" />
      </div>

      {/* --- 3. PENDING LIST GRID (Responsive) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredList.map((donor) => (
          <div key={donor.unique_id} className="bg-white rounded-[48px] shadow-xl border border-gray-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
            
            {/* Card Header */}
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-3 rounded-2xl text-red-600 shadow-sm"><User size={24} /></div>
                <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">{t('admin_ver.status_pending')}</span>
              </div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">{donor.full_name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{donor.department} • {donor.role_type}</p>
            </div>

            {/* ID Card Preview (Clickable) */}
            <div className="px-8 flex-1">
              <div 
                onClick={() => setSelectedImg(donor.id_card_image)}
                className="relative aspect-[4/3] bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden cursor-zoom-in group-hover:border-red-200 transition-all"
              >
                <img src={donor.id_card_image} alt="ID Card" className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <div className="bg-white p-3 rounded-full shadow-xl text-slate-900"><Maximize2 size={20} /></div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-8 pt-6 space-y-4">
              <div className="flex gap-3">
                {/* ✅ CALL BUTTON: Direct Dial Pad Access */}
                <a 
                  href={`tel:${donor.phone}`}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition active:scale-95"
                >
                  <Phone size={16} fill="currentColor" /> {t('admin_ver.btn_call')}
                </a>
                
                {/* APPROVE BUTTON */}
                <button 
                  onClick={() => handleApprove(donor.unique_id, donor.full_name)}
                  className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> {t('admin_ver.btn_verify')}
                </button>
              </div>
              <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">{t('admin_ver.lifedrop_id', { id: donor.unique_id })}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredList.length === 0 && (
        <div className="py-32 bg-white rounded-[60px] border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
          <ShieldCheck size={60} className="text-slate-100 mb-4" />
          <h3 className="font-black text-slate-300 uppercase tracking-widest">{t('admin_ver.empty_state')}</h3>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
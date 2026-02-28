import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { 
  ShieldCheck, ArrowLeft, User, School, 
  CheckCircle2, XCircle, Eye, Loader2, Search,
  AlertCircle, Image as ImageIcon
} from 'lucide-react';

const AdminVerification = () => {
  const navigate = useNavigate();
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Pending University Donors
  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/pending-verifications`);
      const data = await res.json();
      setPendingList(data);
    } catch (err) {
      toast.error("Failed to fetch pending verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // 2. Approve Donor Logic
  const handleApprove = async (u_id, name) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/approve-donor/${u_id}`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`${name} has been verified successfully!`);
        fetchPending(); // Refresh list
      } else {
        toast.error("Approval failed. Try again.");
      }
    } catch (err) {
      toast.error("Server error during approval");
    }
  };

  // Filter logic for search
  const filteredList = pendingList.filter(donor => 
    donor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.unique_id.includes(searchTerm) ||
    donor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing Verification Vault...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Verification Center</h2>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] mt-1">University Member Audit</p>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80 z-10">
          <Search className="absolute left-4 top-4 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-red-500 focus:bg-white/10 transition-all font-bold text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ShieldCheck size={150} className="absolute right-[-30px] top-[-30px] opacity-5 -rotate-12" />
      </div>

      {/* --- PENDING LIST GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredList.length > 0 ? filteredList.map((donor) => (
          <div key={donor.unique_id} className="bg-white rounded-[48px] shadow-xl border border-gray-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
            
            {/* Donor Info Header */}
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                  <User size={24} />
                </div>
                <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">
                  Pending Review
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">{donor.full_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <School size={12} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {donor.department} • {donor.role_type}
                </p>
              </div>
            </div>

            {/* ID Card Image Preview */}
            <div className="px-8 flex-1">
              <div className="relative aspect-[4/3] bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden group-hover:border-red-200 transition-colors">
                {donor.id_card_image ? (
                  <img 
                    src={donor.id_card_image} 
                    alt="University ID" 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <ImageIcon size={48} />
                    <p className="text-[10px] font-black mt-2">NO IMAGE UPLOADED</p>
                  </div>
                )}
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <a href={donor.id_card_image} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-xl">
                      <Eye size={14} /> View Full Size
                   </a>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-8 pt-6">
              <div className="flex items-center justify-between mb-6 px-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">LifeDrop ID: #{donor.unique_id}</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{donor.year || 'N/A'}</p>
              </div>
              
              <button 
                onClick={() => handleApprove(donor.unique_id, donor.full_name)}
                className="w-full bg-green-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-100 hover:bg-green-700 transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Approve & Verify Hero
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 bg-white rounded-[60px] border-2 border-dashed border-gray-100 text-center flex flex-col items-center animate-in zoom-in">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <ShieldCheck size={60} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Pending Verifications</h3>
            <p className="text-xs font-bold text-slate-300 mt-2 italic">All university members are currently audited.</p>
          </div>
        )}
      </div>

      {/* --- INFO BOX --- */}
      <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex items-start gap-4">
        <AlertCircle className="text-blue-600 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Admin Audit Protocol</h4>
          <p className="text-xs font-medium text-blue-700 mt-1 leading-relaxed">
            Please ensure the uploaded ID card clearly shows the <b>Periyar University</b> logo, student/staff name, and department before approving. Verified donors will gain immediate access to the University Circle matching pool.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminVerification;
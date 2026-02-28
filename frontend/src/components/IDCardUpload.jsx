import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { API_URL } from '../config';
import { toast } from 'sonner';

const IDCardUpload = ({ onVerified }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an ID card image");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('idCard', file);

    try {
      const res = await fetch(`${API_URL}/api/verify-id-card`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setVerified(true);
        toast.success(data.message);
        onVerified(data.detectedRole); // Parent-ku role-ah anupuroam
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error("Error connecting to OCR server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-slate-200 text-center">
      {verified ? (
        <div className="flex flex-col items-center gap-2 animate-in zoom-in">
          <div className="bg-green-100 p-3 rounded-full text-green-600 shadow-lg shadow-green-100">
            <ShieldCheck size={32} />
          </div>
          <p className="font-black text-green-700 uppercase text-xs tracking-widest">University ID Verified</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={40} className="text-slate-300" />
            <p className="text-xs font-bold text-slate-400 uppercase">Upload Periyar University ID Card</p>
          </div>
          
          <input 
            type="file" accept="image/*" 
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button 
            type="button"
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "VERIFY ID CARD"}
          </button>
        </div>
      )}
    </div>
  );
};

export default IDCardUpload;
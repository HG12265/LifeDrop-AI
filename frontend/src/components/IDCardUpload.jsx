import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, Loader2, AlertCircle, XCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';

const IDCardUpload = ({ onImageSelect, mode = "admin", isVerified = false }) => {
  const [idPreview, setIdPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Handle Image Selection & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size too large! Please upload under 5MB.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result);
        // Parent-ku image data-va anupuroam
        onImageSelect(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Gemini AI Verification (Only for Requesters)
  const handleAiVerify = async () => {
    if (!idPreview) return toast.error("Please select an image first");
    
    setLoading(true);
    const base64Data = idPreview.split(',')[1]; // Get raw base64

    try {
      const res = await fetch(`${API_URL}/api/verify-id-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      
      const data = await res.json();

      if (res.ok && data.is_valid) {
        toast.success("AI Verified: Periyar University Member! ✅");
        onImageSelect(idPreview, true, data.role); // Success callback
      } else {
        toast.error("AI could not verify this ID. Please use a clearer photo.");
      }
    } catch (err) {
      toast.error("AI Service Error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setIdPreview(null);
    onImageSelect(null, false);
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 text-center shadow-inner relative overflow-hidden">
      
      {isVerified ? (
        <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-500 py-4">
          <div className="bg-green-100 p-4 rounded-full text-green-600 shadow-lg shadow-green-100">
            <ShieldCheck size={40} />
          </div>
          <p className="font-black text-green-700 uppercase text-xs tracking-widest">Identity Verified</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!idPreview ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600 mb-2">
                <UploadCloud size={32} />
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Upload University ID</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Front side clear image</p>
              
              <input 
                type="file" accept="image/*" id="id-input"
                className="hidden"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="id-input"
                className="mt-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
              >
                Select Image
              </label>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Image Preview */}
              <div className="relative group mx-auto w-full max-w-[200px] aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <img src={idPreview} alt="ID Preview" className="w-full h-full object-contain p-2" />
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircle size={16} />
                </button>
              </div>

              {/* Action Button based on Mode */}
              {mode === "ai" ? (
                <button 
                  type="button"
                  onClick={handleAiVerify}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <><Zap size={16} fill="white"/> START AI VERIFICATION</>}
                </button>
              ) : (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 text-left">
                   <AlertCircle size={18} className="text-amber-600 shrink-0" />
                   <p className="text-[9px] font-bold text-amber-800 leading-relaxed uppercase">
                     Image selected. Admin will verify this ID after you complete registration.
                   </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IDCardUpload;
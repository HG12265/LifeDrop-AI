import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, Loader2, AlertCircle, XCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';

const IDCardUpload = ({ onImageSelect, mode = "admin", isVerified = false }) => {
  const [idPreview, setIdPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: Image Compression Logic
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resize to 800px width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Quality 0.7 (70%) - Size romba kuraiyum, clarity irukkum
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const compressedBase64 = await compressImage(file);
      setIdPreview(compressedBase64);
      onImageSelect(compressedBase64); // Parent-ku compressed image pogum
      setLoading(false);
    }
  };

  const handleAiVerify = async () => {
    if (!idPreview) return toast.error("Please select an image first");
    
    setLoading(true);
    // Gemini-ku anuppum pothu 'data:image/jpeg;base64,' prefix-ah thookanum
    const base64Data = idPreview.split(',')[1]; 

    try {
      const res = await fetch(`${API_URL}/api/verify-id-gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      
      const data = await res.json();
      if (res.ok && data.is_valid) {
        toast.success("AI Verified Successfully! ✅");
        onImageSelect(idPreview, true, data.role);
      } else {
        toast.error(data.message || "AI could not verify this ID.");
      }
    } catch (err) {
      toast.error("AI Service Error. Try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setIdPreview(null);
    onImageSelect(null, false);
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 text-center shadow-inner relative">
      {isVerified ? (
        <div className="flex flex-col items-center gap-2 py-4 animate-in zoom-in">
          <div className="bg-green-100 p-4 rounded-full text-green-600 shadow-lg"><ShieldCheck size={40} /></div>
          <p className="font-black text-green-700 uppercase text-xs tracking-widest">Identity Verified</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!idPreview ? (
            <div className="flex flex-col items-center gap-2 py-4">
              {loading ? <Loader2 className="animate-spin text-indigo-600" size={32} /> : (
                <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600 mb-2"><UploadCloud size={32} /></div>
              )}
              <p className="text-xs font-black text-slate-500 uppercase">Upload University ID</p>
              <input type="file" accept="image/*" id="id-input" className="hidden" onChange={handleFileChange} />
              <label htmlFor="id-input" className="mt-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase cursor-pointer active:scale-95 shadow-lg">
                {loading ? "COMPRESSING..." : "Select Image"}
              </label>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="relative group mx-auto w-full max-w-[200px] aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                <img src={idPreview} alt="ID Preview" className="w-full h-full object-contain p-2" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg"><XCircle size={16} /></button>
              </div>
              {mode === "ai" && (
                <button type="button" onClick={handleAiVerify} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <><Zap size={16} fill="white"/> START AI VERIFICATION</>}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IDCardUpload;
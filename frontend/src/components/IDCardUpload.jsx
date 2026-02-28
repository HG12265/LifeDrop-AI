import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js'; // Changed import for better control
import { toast } from 'sonner';

const IDCardUpload = ({ onVerified }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verified, setVerified] = useState(false);

  const handleVerifyLocal = async () => {
    if (!file) return toast.error("Please select an ID card image");

    setLoading(true);
    setProgress(0);

    try {
      // 1. Create Worker
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      // 2. Recognize Text
      const { data: { text } } = await worker.recognize(file);
      const extractedText = text.toUpperCase();
      
      // 3. Terminate Worker (Memory save panna)
      await worker.terminate();

      console.log("Extracted Text:", extractedText);

      // ✅ KEYWORD MATCHING
      const keywords = ["PERIYAR", "UNIVERSITY", "SALEM"];
      const isMatched = keywords.every(key => extractedText.includes(key));
      const isStudent = extractedText.includes("STUDENT") || extractedText.includes("IDENTITY");

      if (isMatched) {
        setVerified(true);
        toast.success("Periyar University ID Verified!");
        onVerified(isStudent ? "Student" : "Staff");
      } else {
        toast.error("Invalid ID Card. Please ensure 'Periyar University' is clearly visible.");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      toast.error("AI Scanning failed. Please use a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-200 text-center shadow-inner">
      {verified ? (
        <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-500">
          <div className="bg-green-100 p-4 rounded-full text-green-600 shadow-lg">
            <ShieldCheck size={40} />
          </div>
          <p className="font-black text-green-700 uppercase text-xs tracking-widest">Verified University Member</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-red-50 p-3 rounded-2xl text-red-600 mb-2">
                <UploadCloud size={32} />
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Upload ID Card (Front Side)</p>
          </div>
          
          <input 
            type="file" accept="image/*" 
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {loading ? (
            <div className="space-y-2">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[10px] font-black text-red-600 animate-pulse uppercase">AI Scanning: {progress}%</p>
            </div>
          ) : (
            <button 
              type="button"
              onClick={handleVerifyLocal}
              disabled={!file}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition active:scale-95 disabled:opacity-50"
            >
              START AI VERIFICATION
            </button>
          )}
          
          <p className="text-[9px] text-slate-400 font-bold italic flex items-center justify-center gap-1">
            <AlertCircle size={10}/> Processed locally on your device.
          </p>
        </div>
      )}
    </div>
  );
};

export default IDCardUpload;
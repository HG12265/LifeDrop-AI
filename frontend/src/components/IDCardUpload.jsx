import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js'; // Frontend OCR
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
      // Tesseract Frontend Processing
      const result = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => {
            if(m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
            }
          } 
        }
      );

      const extractedText = result.data.text.toUpperCase();
      console.log("Extracted Text:", extractedText);

      // ✅ KEYWORD MATCHING (Based on your Periyar University ID)
      const keywords = ["PERIYAR", "UNIVERSITY", "SALEM"];
      const isMatched = keywords.every(key => extractedText.includes(key));
      
      const isStudent = extractedText.includes("STUDENT") || extractedText.includes("IDENTITY");

      if (isMatched) {
        setVerified(true);
        toast.success("Periyar University ID Verified!");
        onVerified(isStudent ? "Student" : "Staff");
      } else {
        toast.error("Invalid ID Card. Please upload a clear image of your Periyar University ID.");
      }
    } catch (err) {
      console.error(err);
      toast.error("OCR Processing failed. Try a clearer photo.");
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
            <AlertCircle size={10}/> Image is processed locally for privacy.
          </p>
        </div>
      )}
    </div>
  );
};

export default IDCardUpload;
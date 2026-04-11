import React, { useEffect, useState } from 'react';
import { API_URL } from '../config'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Link2, ShieldCheck, Clock, Hash, ShieldAlert, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';
import { downloadProfessionalIDCard } from '../utils/DownloadIDCard';
import { useTranslation } from 'react-i18next';

const BlockchainView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [chain, setChain] = useState([]);
  const [isSecure, setIsSecure] = useState(true);
  const [loading, setLoading] = useState(true);
  const trackingUrl = window.location.href;

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blockchain/view/${id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setChain(data);
        
        // Check if any block in the chain is tampered
        const tampered = data.some(block => block.is_tampered);
        if (tampered) {
          setIsSecure(false);
          toast.error(t('blockchain.toast_secure_alert'), { duration: 10000 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChain();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">{t('blockchain.loading')}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <button onClick={() => navigate(-1)} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-slate-400 hover:text-red-600 transition">
          <ArrowLeft size={24} />
        </button>
        
        <div className="text-center flex-1">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl mb-4 transition-colors duration-500 ${isSecure ? 'bg-green-100 text-green-600 shadow-green-100' : 'bg-red-100 text-red-600 shadow-red-100 animate-pulse'}`}>
              {isSecure ? <ShieldCheck size={40} /> : <ShieldAlert size={40} />}
           </div>
           <h2 className="text-4xl font-black italic tracking-tighter text-slate-900">{t('blockchain.ledger_title')}</h2>
           <div className="flex items-center justify-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isSecure ? 'bg-green-500' : 'bg-red-500 animate-ping'}`}></div>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isSecure ? 'text-green-600' : 'text-red-600'}`}>
                {isSecure ? t('blockchain.status_verified') : t('blockchain.status_broken')}
              </p>
           </div>
        </div>
        <div className="w-12 hidden md:block"></div>
      </div>

      {/* --- QR & INFO CARD --- */}
      <div className="bg-slate-900 rounded-[48px] p-8 md:p-12 text-white flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
         <div className="bg-white p-4 rounded-[32px] shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <QRCodeCanvas id="blockchain-qr-code" value={trackingUrl} size={160} level={"H"} includeMargin={true} />
         </div>
         <div className="space-y-4 text-center lg:text-left">
            <h4 className="text-2xl font-black italic text-red-500 uppercase tracking-tighter">{t('blockchain.asset_title')}</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {t('blockchain.asset_desc')}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
               <span className="bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">{t('blockchain.algo_tag')}</span>
               <span className="bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">{t('blockchain.sec_tag')}</span>
               <button onClick={() => downloadProfessionalIDCard("blockchain-qr-code", "THIS IS BLOOD DONATION DIGITAL ID CARD")} className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-500 hover:bg-red-700 transition shadow-lg shadow-red-900/50">{t('blockchain.btn_download')}</button>
            </div>
         </div>
         <Link2 size={200} className="absolute right-[-50px] bottom-[-50px] opacity-5 -rotate-12" />
      </div>

      {/* --- BLOCKCHAIN TIMELINE --- */}
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {chain.map((block, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* Timeline Dot */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-500 ${block.is_tampered ? 'bg-red-600 text-white animate-bounce' : 'bg-slate-900 text-white'}`}>
              {block.is_tampered ? <AlertTriangle size={20} /> : <Clock size={20} />}
            </div>

            {/* Block Card */}
            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-[40px] shadow-2xl border-2 transition-all duration-500 ${block.is_tampered ? 'bg-red-50 border-red-200 scale-105' : 'bg-white border-gray-50 hover:border-red-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${block.is_tampered ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}>
                        {block.event}
                    </span>
                    {block.is_tampered && (
                        <p className="text-red-600 font-black text-[10px] mt-2 flex items-center gap-1 animate-pulse">
                            <ShieldAlert size={12}/> {t('blockchain.tamper_alert')}
                        </p>
                    )}
                </div>
                <span className="text-[10px] font-bold text-gray-300">{block.time}</span>
              </div>

              <div className={`p-5 rounded-3xl mb-6 transition-colors ${block.is_tampered ? 'bg-red-100/50' : 'bg-slate-50'}`}>
                 <pre className={`text-xs font-mono overflow-hidden ${block.is_tampered ? 'text-red-700 font-black' : 'text-slate-500'}`}>
                    {JSON.stringify(block.data, null, 2)}
                 </pre>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Hash size={12} className="text-slate-400" />
                    <p className="text-[9px] font-mono text-slate-400 truncate">PREV: {block.prev_hash}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <Hash size={12} className={block.is_tampered ? 'text-red-500' : 'text-green-500'} />
                    <p className={`text-[9px] font-mono truncate ${block.is_tampered ? 'text-red-600 font-black' : 'text-green-600'}`}>
                        CURR: {block.curr_hash}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER SECURITY NOTE --- */}
      {!isSecure && (
        <div className="bg-red-600 text-white p-6 rounded-[32px] shadow-2xl flex items-center gap-4 animate-bounce">
           <ShieldAlert size={32} />
           <div>
              <h4 className="font-black uppercase italic">{t('blockchain.breach_title')}</h4>
              <p className="text-xs font-bold opacity-80">{t('blockchain.breach_desc')}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainView;
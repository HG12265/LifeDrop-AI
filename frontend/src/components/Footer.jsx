import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Github, Twitter, Instagram, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* --- TOP SECTION: BRAND & LINKS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          {/* 1. Brand Area */}
          <div className="flex flex-col items-center md:items-start gap-1 flex-1">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-100">
                <Droplet className="text-white fill-white" size={16} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter italic leading-none">LifeDrop</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('footer.tech_hum')}</p>
          </div>

          {/* 2. Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-widest text-slate-500 flex-1">
            <Link to="/" className="hover:text-red-600 transition-colors">{t('footer.home')}</Link>
            <Link to="/login" className="hover:text-red-600 transition-colors">{t('footer.donate')}</Link>
            <Link to="/login" className="hover:text-red-600 transition-colors">{t('footer.request')}</Link>
            <Link to="/contact" className="hover:text-red-600 transition-colors">{t('footer.support')}</Link>
          </div>

          {/* 3. Social Icons */}
          <div className="flex justify-center md:justify-end gap-5 text-slate-300 flex-1">
            <Twitter size={18} className="hover:text-red-600 cursor-pointer transition-all hover:-translate-y-1" />
            <Instagram size={18} className="hover:text-red-600 cursor-pointer transition-all hover:-translate-y-1" />
            <Github size={18} className="hover:text-red-600 cursor-pointer transition-all hover:-translate-y-1" />
          </div>
        </div>

        {/* --- BOTTOM SECTION: 2-LINE STRUCTURE --- */}
        <div className="pt-1 border-t border-gray-50 flex flex-col items-center gap-5">
          
          {/* ✅ LINE 1: Signature + Origin + Status (All in one row on Desktop) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-15 w-full">
            
            {/* Developer Signature */}
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-all duration-300 group">
               <Code2 size={14} className="text-slate-400 group-hover:text-red-600" />
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                 {t('footer.dev_by')} <span className="text-slate-900 group-hover:text-red-600">Gowtham G</span>
               </p>
            </div>

            {/* Made in India */}
            <div className="flex items-center gap-1.5">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                 {t('footer.made_in')} <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> {t('footer.made_in_india')}
               </p>
            </div>

            {/* Systems Live Status */}
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-green-700 uppercase tracking-tighter">{t('footer.sys_live')}</span>
            </div>
          </div>

          {/* ✅ LINE 2: Copyright (Centered Bottom) */}
          <div className="text-center">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              © 2026 LifeDrop AI. {t('footer.copy')}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
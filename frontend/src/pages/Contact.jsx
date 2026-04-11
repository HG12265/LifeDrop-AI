import React, { useState } from 'react';
import { API_URL } from '../config'; 
import { toast } from 'sonner';
import { Mail, User, MessageSquare, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.info(t('contact.toast_success'));
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      toast.error(t('contact.toast_err'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in zoom-in duration-500">
      <div className="bg-white shadow-2xl rounded-[48px] overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Info */}
        <div className="bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter mb-4">{t('contact.title')}</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {t('contact.desc')}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="bg-red-600/20 p-3 rounded-2xl text-red-500 border border-red-600/20"><Mail size={20}/></div>
                 <div><p className="text-[10px] font-black text-gray-500 uppercase">{t('contact.label_email')}</p><p className="text-sm font-bold">lifedrop108@gmail.com</p></div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="bg-green-600/20 p-3 rounded-2xl text-green-500 border border-green-600/20"><ShieldCheck size={20}/></div>
                 <div><p className="text-[10px] font-black text-gray-500 uppercase">{t('contact.label_status')}</p><p className="text-sm font-bold text-green-400">{t('contact.status_val')}</p></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-red-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
         <form onSubmit={handleSubmit} className="p-10 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1"><User size={10}/> {t('contact.label_name')}</label>
            <input type="text" placeholder={t('contact.ph_name')} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1"><Mail size={10}/> {t('contact.label_addr')}</label>
            <input type="email" placeholder={t('contact.ph_addr')} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1"><MessageSquare size={10}/> {t('contact.label_msg')}</label>
            <textarea rows="4" placeholder={t('contact.ph_msg')} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-red-200 font-bold resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            {loading ? t('contact.btn_sending') : t('contact.btn_send')} <ArrowRight size={18}/>
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;
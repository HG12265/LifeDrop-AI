import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, ShieldCheck, Users, History, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UniversityDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin-dashboard')} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-slate-400 hover:text-red-600 transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">{t('uni_dash.title')}</h2>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.3em]">{t('uni_dash.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MenuCard label={t('uni_dash.card_verify')} sub={t('uni_dash.card_verify_sub')} icon={<ShieldCheck/>} color="bg-orange-500" onClick={() => navigate('/admin/verifications')} />
        <MenuCard label={t('uni_dash.card_donors')} sub={t('uni_dash.card_donors_sub')} icon={<Users/>} color="bg-blue-600" onClick={() => navigate('/admin/university/details/donors')} />
        <MenuCard label={t('uni_dash.card_requesters')} sub={t('uni_dash.card_requesters_sub')} icon={<Users/>} color="bg-purple-600" onClick={() => navigate('/admin/university/details/requesters')} />
        <MenuCard label={t('uni_dash.card_history')} sub={t('uni_dash.card_history_sub')} icon={<History/>} color="bg-green-600" onClick={() => navigate('/admin/university/details/history')} />
      </div>
    </div>
  );
};

const MenuCard = ({ label, sub, icon, color, onClick }) => (
  <button onClick={onClick} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 flex flex-col items-center text-center group hover:border-red-100 transition-all duration-500">
    <div className={`${color} p-4 rounded-3xl text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="text-lg font-black text-gray-800">{label}</h4>
    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{sub}</p>
  </button>
);

export default UniversityDashboard;
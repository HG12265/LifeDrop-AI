import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'ta' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-900 px-4 py-2 rounded-xl border border-gray-100 transition-all group"
    >
      <Globe size={16} className={`${i18n.language.startsWith('ta') ? 'text-red-500' : 'text-blue-500'} group-hover:rotate-12 transition-transform`} />
      <span className="text-[10px] font-black uppercase tracking-widest">
        {i18n.language.startsWith('ta') ? 'தமிழ்' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;

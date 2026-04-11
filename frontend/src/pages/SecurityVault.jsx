import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { 
  ShieldAlert, ArrowLeft, Search, FileSpreadsheet, FileText, 
  Clock, Globe, Monitor, User, Fingerprint, Loader2, Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ✅ CAPACITOR IMPORTS FOR EXPORT
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SecurityVault = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/audit-logs`, {
        credentials: 'include'
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      toast.error(t('security_vault.toast_access_fail'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); // Auto refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address?.includes(searchTerm)
  );

  // --- EXPORT LOGIC (Sync with your other pages) ---
  const saveAndShare = async (fileName, base64Data) => {
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });
      toast.success(t('security_vault.toast_audit_saved'));
      try {
        await Share.share({ title: 'Security Audit', url: result.uri });
      } catch (e) { console.log("Share dismissed"); }
    } catch (error) { toast.error(t('security_vault.toast_export_fail')); }
  };

  const exportExcel = async () => {
    setIsExporting(true);
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SecurityLogs");
    const fileName = `LifeDrop_Security_Audit_${new Date().getTime()}.xlsx`;

    if (Capacitor.getPlatform() === 'web') {
      XLSX.writeFile(workbook, fileName);
    } else {
      const excelBase64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
      await saveAndShare(fileName, excelBase64);
    }
    setIsExporting(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="font-black uppercase tracking-[0.3em] text-xs">{t('security_vault.loading')}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden border-b-4 border-red-600">
        <div className="relative z-10 flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="bg-white/10 p-3 rounded-2xl hover:bg-red-600 transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">{t('security_vault.title')}</h2>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] mt-1">{t('security_vault.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full lg:w-auto">
            <button onClick={exportExcel} className="flex-1 lg:flex-none bg-white/10 hover:bg-green-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <FileSpreadsheet size={16}/> {t('security_vault.btn_excel')}
            </button>
            <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  type="text" placeholder={t('security_vault.search_ph')}
                  className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-red-600 focus:bg-white/10 transition-all font-bold text-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <Fingerprint size={200} className="absolute right-[-50px] top-[-50px] opacity-5 -rotate-12" />
      </div>

      {/* --- LOGS TABLE --- */}
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="p-6">{t('security_vault.th_time')}</th>
                <th className="p-6">{t('security_vault.th_user')}</th>
                <th className="p-6">{t('security_vault.th_action')}</th>
                <th className="p-6">{t('security_vault.th_network')}</th>
                <th className="p-6">{t('security_vault.th_device')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition group">
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:text-red-600 transition-colors">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="font-black text-gray-800 text-sm">{log.email}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{t('security_vault.id_prefix')}: {log.user_id}</p>
                        </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        log.action.includes('SUCCESS') ? 'bg-green-50 text-green-600 border-green-100' :
                        log.action.includes('FAILED') || log.action.includes('DELETE') ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                        {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Globe size={14} className="text-blue-400" />
                        <span className="text-xs font-mono font-bold">{log.ip_address}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-400 max-w-[200px]">
                        <Monitor size={14} />
                        <span className="text-[9px] font-medium truncate italic">{log.device_info}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
                <ShieldAlert size={48} className="text-slate-200 mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest">{t('security_vault.empty_state')}</p>
            </div>
        )}
      </div>

      {/* --- SECURITY FOOTER --- */}
      <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 flex items-center gap-4">
        <Fingerprint className="text-red-600" size={32} />
        <div>
            <h4 className="text-sm font-black text-red-900 uppercase tracking-tight">{t('security_vault.footer_title')}</h4>
            <p className="text-[10px] font-bold text-red-700 opacity-70 leading-relaxed uppercase">
                {t('security_vault.footer_text')}
            </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityVault;
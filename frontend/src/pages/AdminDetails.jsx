import React, { useEffect, useState } from 'react';
import { API_URL } from '../config'; 
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, Phone, Search, FileSpreadsheet, FileText, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// ✅ CAPACITOR IMPORTS
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDetails = () => {
  const { t } = useTranslation();
  const { category } = useParams(); 
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); 
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = () => {
    let url = '';
    if (category === 'users') url = `${API_URL}/api/admin/all-users`;
    if (category === 'donors') url = `${API_URL}/api/admin/donors-detailed`;
    if (category === 'requests') url = `${API_URL}/api/admin/requests-detailed?type=${type}`;
    
    fetch(url).then(res => res.json()).then(data => setList(data));
  };

  useEffect(() => {
    fetchData();
  }, [category, type]);

  const filteredList = list.filter(item => 
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.patient && item.patient.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.blood && item.blood.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- ✅ FIXED EXCEL EXPORT (WEB + ANDROID) ---
  const exportToExcel = async () => {
    setIsExporting(true);
    const fileName = `LifeDrop_${category}_Report.xlsx`;
    const worksheet = XLSX.utils.json_to_sheet(filteredList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    if (Capacitor.getPlatform() === 'web') {
      XLSX.writeFile(workbook, fileName);
      toast.success(t('admin_details.toast_excel_dl'));
    } else {
      try {
        // 1. Generate Base64
        const excelBase64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
        
        // 2. Save to Device
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: excelBase64,
          directory: Directory.Documents,
          recursive: true
        });

        // ✅ SUCCESS: Show toast immediately after save
        toast.success(t('admin_details.toast_excel_saved'));

        // 3. Optional Share (Nested try-catch to prevent fake errors)
        try {
          await Share.share({
            title: 'LifeDrop Report',
            url: savedFile.uri,
          });
        } catch (shareError) {
          console.log("Share dismissed by user");
        }
      } catch (error) {
        console.error("Excel Export Error:", error);
        toast.error(t('admin_details.toast_excel_fail'));
      }
    }
    setIsExporting(false);
  };

  // --- ✅ FIXED PDF EXPORT (WEB + ANDROID) ---
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const title = t('admin_details.pdf_report_title', { category: category.toUpperCase() });
      doc.setFontSize(20);
      doc.setTextColor(220, 38, 38);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(t('admin_details.pdf_gen_on', { date: new Date().toLocaleString() }), 14, 30);

      let columns = [];
      let rows = [];

      if(category === 'users') {
          columns = [t('admin_details.pdf_col_name'), t('admin_details.pdf_col_email'), t('admin_details.pdf_col_role'), t('admin_details.pdf_col_phone')];
          rows = filteredList.map(item => [item.name, item.email, item.role, item.phone]);
      } else if(category === 'donors') {
          columns = [t('admin_details.pdf_col_status'), t('admin_details.pdf_col_name'), t('admin_details.pdf_col_id'), t('admin_details.pdf_col_blood'), t('admin_details.pdf_col_health'), t('admin_details.pdf_col_phone')];
          rows = filteredList.map(item => [item.status, item.name, item.u_id, item.blood, `${item.health}%`, item.phone]);
      } else {
          columns = [t('admin_details.pdf_col_patient'), t('admin_details.pdf_col_group'), t('admin_details.pdf_col_requester'), t('admin_details.pdf_col_donor'), t('admin_details.pdf_col_hospital')];
          rows = filteredList.map(item => [item.patient, item.blood, item.requester, item.donor || "N/A", item.hospital]);
      }

      autoTable(doc, {
        startY: 40,
        head: [columns],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [220, 38, 38] }
      });

      const fileName = `LifeDrop_${category}_Report.pdf`;

      if (Capacitor.getPlatform() === 'web') {
        doc.save(fileName);
        toast.success(t('admin_details.toast_pdf_dl'));
      } else {
        try {
          // 1. Generate Base64
          const pdfBase64 = doc.output('datauristring').split(',')[1];
          
          // 2. Save to Device
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: pdfBase64,
            directory: Directory.Documents,
            recursive: true
          });

          // ✅ SUCCESS: Show toast immediately after save
          toast.success(t('admin_details.toast_pdf_saved'));

          // 3. Optional Share
          try {
            await Share.share({
              title: 'LifeDrop PDF Report',
              url: savedFile.uri,
            });
          } catch (shareError) {
            console.log("Share dismissed by user");
          }
        } catch (saveError) {
          console.error("PDF Save Error:", saveError);
          toast.error(t('admin_details.toast_pdf_save_fail'));
        }
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error(t('admin_details.toast_pdf_gen_err'));
    }
    setIsExporting(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="bg-slate-100 p-2 rounded-xl text-slate-500 hover:text-red-600 transition"><ArrowLeft/></button>
            <div>
               <h2 className="text-2xl font-black capitalize text-gray-800 tracking-tight">
                 {type === 'completed' ? t('admin_details.title_saves') : type ? type : t('admin_details.title_total')} {category}
               </h2>
               <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic leading-none mt-1">{t('admin_details.audit_mode')}</p>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={exportToExcel} 
              disabled={isExporting}
              className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-xl font-black text-[10px] border border-green-100 active:scale-95 transition uppercase tracking-widest"
            >
              {isExporting ? <Loader2 className="animate-spin" size={14}/> : <FileSpreadsheet size={16}/>} {t('admin_details.btn_excel')}
            </button>
            
            <button 
              onClick={exportToPDF} 
              disabled={isExporting}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] hover:bg-black transition shadow-lg active:scale-95 uppercase tracking-widest"
            >
              {isExporting ? <Loader2 className="animate-spin" size={14}/> : <FileText size={16}/>} {t('admin_details.btn_pdf')}
            </button>

            <div className="relative">
                <input 
                  type="text" placeholder={t('admin_details.search_ph')} 
                  className="p-2.5 pl-8 bg-slate-50 rounded-xl border-none outline-red-200 font-bold text-xs w-full md:w-48 shadow-inner"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2.5 top-3 text-gray-300" size={14} />
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                {category === 'users' && <><th className="p-6">{t('admin_details.th_name')}</th><th className="p-6">{t('admin_details.th_email')}</th><th className="p-6">{t('admin_details.th_role')}</th><th className="p-6">{t('admin_details.th_phone')}</th></>}
                {category === 'donors' && <><th className="p-6">{t('admin_details.th_status')}</th><th className="p-6">{t('admin_details.th_donor_details')}</th><th className="p-6 text-center">{t('admin_details.th_blood')}</th><th className="p-6 text-center">{t('admin_details.th_health')}</th><th className="p-6">{t('admin_details.th_location')}</th></>}
                {category === 'requests' && <>
                  <th className="p-6">{t('admin_details.th_patient')}</th>
                  <th className="p-6 text-center">{t('admin_details.th_group')}</th>
                  <th className="p-6">{t('admin_details.th_requester')}</th>
                  {type === 'completed' && <th className="p-6">{t('admin_details.th_donor_hero')}</th>}
                  <th className="p-6">{t('admin_details.th_hospital')}</th>
                  {type === 'completed' && <th className="p-6 text-center">{t('admin_details.th_ledger')}</th>}
                </>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.length > 0 ? filteredList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition group font-medium text-gray-700">
                  {category === 'users' && <>
                    <td className="p-6 font-black text-gray-800">{item.name}</td>
                    <td className="p-6 text-xs">{item.email}</td>
                    <td className="p-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.role === 'Donor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{item.role}</span></td>
                    <td className="p-6 text-xs font-bold text-gray-400">{item.phone}</td>
                  </>}
                  {category === 'donors' && <>
                    <td className="p-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{item.status}</span></td>
                    <td className="p-6"><p className="font-black text-gray-800">{item.name}</p><p className="text-[10px] text-gray-400 uppercase">{t('admin_details.id_prefix')}: #{item.u_id}</p></td>
                    <td className="p-6 text-2xl font-black text-red-600 text-center">{item.blood}</td>
                    <td className="p-6 font-black text-green-600 text-center">{item.health}%</td>
                    <td className="p-6 text-[10px] font-bold text-gray-400 italic">{item.location}</td>
                  </>}
                  {category === 'requests' && <>
                    <td className="p-6 font-black text-gray-800">{item.patient}</td>
                    <td className="p-6 text-2xl font-black text-red-600 text-center">{item.blood}</td>
                    <td className="p-6 text-xs font-bold text-gray-400 uppercase">{item.requester}</td>
                    {type === 'completed' && <td className="p-6 font-black text-green-600 text-xs uppercase">{item.donor || t('admin_details.not_applicable')}</td>}
                    <td className="p-6 text-xs italic text-gray-400 leading-tight max-w-[150px]">{item.hospital}</td>
                    {type === 'completed' && (
                        <td className="p-6 text-center">
                           <button 
                             onClick={() => navigate(`/blockchain/${item.id}`)}
                             className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-red-600 transition shadow-md active:scale-95"
                           >
                             <Link2 size={16} />
                           </button>
                        </td>
                    )}
                  </>}
                </tr>
              )) : (
                <tr><td colSpan="10" className="p-20 text-center text-gray-400 font-bold italic">{t('admin_details.empty_state')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
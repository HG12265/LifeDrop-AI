import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSpreadsheet, FileText, Search, Link2, Phone, User, ShieldCheck, Clock } from 'lucide-react';
import { API_URL } from '../config';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ✅ CAPACITOR IMPORTS
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

const UniversityDetails = () => {
  const { type } = useParams(); // donors, requesters, history
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = () => {
    setLoading(true);
    fetch(`${API_URL}/api/admin/university/${type}`)
      .then(res => res.json())
      .then(data => {
        setList(data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Error fetching data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const filteredList = list.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- ✅ FIXED EXCEL EXPORT (WEB + ANDROID) ---
  const exportExcel = async () => {
    const fileName = `LifeDrop_PU_${type}_Report.xlsx`;
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PU_Data");

    if (Capacitor.getPlatform() === 'web') {
      XLSX.writeFile(wb, fileName);
      toast.success("Excel file downloaded!");
    } else {
      try {
        // 1. Generate Base64
        const excelBase64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
        
        // 2. Save to Device
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: excelBase64,
          directory: Directory.Documents,
          recursive: true
        });

        // ✅ SUCCESS: Show toast immediately after save
        toast.success("Excel report saved to Documents!");

        // 3. Optional Share (Nested try-catch to prevent fake errors)
        try {
          await Share.share({
            title: 'University Excel Report',
            url: savedFile.uri,
          });
        } catch (shareError) {
          console.log("Share dismissed by user");
        }
      } catch (error) {
        console.error("Excel Export Error:", error);
        toast.error("Failed to save Excel file on device");
      }
    }
  };

  // --- ✅ FIXED PDF EXPORT (WEB + ANDROID) ---
  const exportPDF = async () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text(`Periyar University - ${type.toUpperCase()} REPORT`, 14, 15);
    
    let headers = [];
    let body = [];

    if (type === 'history') {
      headers = [["Patient", "Blood", "Requester", "Requester Phone", "Donor Hero", "Donor Phone", "Hospital", "Date"]];
      body = filteredList.map(i => [i.patient, i.blood, i.requester_name, i.requester_phone, i.donor_name, i.donor_phone, i.hospital, i.date]);
    } else if (type === 'donors') {
      headers = [["Name", "Email", "Phone", "Blood", "Dept", "Role", "Status"]];
      body = filteredList.map(i => [i.name, i.email, i.phone, i.blood, i.dept, i.role, i.status]);
    } else {
      headers = [["Name", "Email", "Phone", "Dept", "Role", "Year"]];
      body = filteredList.map(i => [i.name, i.email, i.phone, i.dept, i.role, i.year]);
    }

    autoTable(doc, {
      startY: 25,
      head: headers,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }
    });

    const fileName = `LifeDrop_PU_${type}_Report.pdf`;

    if (Capacitor.getPlatform() === 'web') {
      doc.save(fileName);
      toast.success("PDF Report downloaded!");
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
        toast.success("PDF report saved to Documents!");

        // 3. Optional Share
        try {
          await Share.share({
            title: 'University PDF Report',
            url: savedFile.uri,
          });
        } catch (shareError) {
          console.log("Share dismissed by user");
        }
      } catch (error) {
        console.error("PDF Export Error:", error);
        toast.error("Failed to save PDF file on device");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-slate-100 p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition"><ArrowLeft/></button>
          <div>
             <h2 className="text-2xl font-black capitalize tracking-tight text-gray-800">
               PU {type === 'history' ? 'Donation History' : type}
             </h2>
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">University Circle Audit</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <button onClick={exportExcel} className="bg-green-50 text-green-700 px-5 py-2.5 rounded-xl font-black text-[10px] border border-green-100 hover:bg-green-100 transition uppercase tracking-widest">Excel</button>
            <button onClick={exportPDF} className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] shadow-lg shadow-red-100 hover:bg-red-700 transition uppercase tracking-widest">PDF Report</button>
            <div className="relative w-full md:w-64">
                <input 
                  type="text" placeholder="Search records..." 
                  className="w-full p-3 pl-10 bg-slate-50 rounded-2xl border-none outline-red-200 font-bold text-xs"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3 text-gray-300" size={16} />
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                {type === 'history' ? (
                  <>
                    <th className="p-6">Patient & Blood</th>
                    <th className="p-6">Requester Details</th>
                    <th className="p-6">Donor Hero</th>
                    <th className="p-6">Hospital & Date</th>
                    <th className="p-6 text-center">Ledger</th>
                  </>
                ) : type === 'donors' ? (
                  <>
                    <th className="p-6">Status</th>
                    <th className="p-6">Donor Info</th>
                    <th className="p-6">Blood</th>
                    <th className="p-6">Dept / Role</th>
                    <th className="p-6">Contact</th>
                  </>
                ) : (
                  <>
                    <th className="p-6">Requester Name</th>
                    <th className="p-6">Email</th>
                    <th className="p-6">Dept / Role</th>
                    <th className="p-6">Phone</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="10" className="p-20 text-center font-bold text-gray-400 animate-pulse">LOADING DATA...</td></tr>
              ) : filteredList.length > 0 ? filteredList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition group">
                  
                  {type === 'history' && (
                    <>
                      <td className="p-6">
                        <p className="font-black text-gray-800">{item.patient}</p>
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">Group: {item.blood}</span>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-700 text-sm">{item.requester_name}</p>
                        <p className="text-[10px] font-black text-blue-500 flex items-center gap-1 mt-1"><Phone size={10}/> {item.requester_phone}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 bg-green-50 p-2 rounded-2xl border border-green-100 w-fit">
                           <ShieldCheck size={14} className="text-green-600" />
                           <div className="text-left">
                              <p className="text-[10px] font-black text-green-700 uppercase leading-none">{item.donor_name}</p>
                              <p className="text-[9px] font-bold text-green-600 mt-1">{item.donor_phone}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-bold text-gray-500 italic">{item.hospital}</p>
                        <p className="text-[10px] font-black text-slate-400 mt-1 flex items-center gap-1"><Clock size={10}/> {item.date}</p>
                      </td>
                      <td className="p-6 text-center">
                        <button onClick={() => navigate(`/blockchain/${item.id}`)} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-red-600 transition shadow-lg">
                          <Link2 size={16}/>
                        </button>
                      </td>
                    </>
                  )}

                  {type === 'donors' && (
                    <>
                      <td className="p-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{item.status}</span></td>
                      <td className="p-6"><p className="font-black text-gray-800">{item.name}</p><p className="text-[9px] text-gray-400 uppercase">ID: {item.email}</p></td>
                      <td className="p-6 text-xl font-black text-red-600">{item.blood}</td>
                      <td className="p-6"><p className="text-xs font-black text-gray-700 uppercase">{item.dept}</p><p className="text-[9px] font-bold text-gray-400 uppercase">{item.role} | {item.year}</p></td>
                      <td className="p-6 text-xs font-black text-blue-500">{item.phone}</td>
                    </>
                  )}

                  {type === 'requesters' && (
                    <>
                      <td className="p-6 font-black text-gray-800 uppercase">{item.name}</td>
                      <td className="p-6 text-xs font-bold text-gray-400">{item.email}</td>
                      <td className="p-6"><p className="text-xs font-black text-gray-700 uppercase">{item.dept}</p><p className="text-[9px] font-bold text-gray-400 uppercase">{item.role} | {item.year}</p></td>
                      <td className="p-6 text-xs font-black text-blue-500">{item.phone}</td>
                    </>
                  )}

                </tr>
              )) : (
                <tr><td colSpan="10" className="p-20 text-center text-gray-400 font-bold italic">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;
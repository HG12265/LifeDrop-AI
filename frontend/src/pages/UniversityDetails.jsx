import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSpreadsheet, FileText, Search, Link2, Phone, Mail } from 'lucide-react';
import { API_URL } from '../config';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UniversityDetails = () => {
  const { type } = useParams(); // donors, requesters, history
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/admin/university/${type}`).then(res => res.json()).then(data => setList(data));
  }, [type]);

  const filteredList = list.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PU_Data");
    XLSX.writeFile(wb, `LifeDrop_PU_${type}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text(`Periyar University - ${type.toUpperCase()} Report`, 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [Object.keys(list[0] || {})],
      body: filteredList.map(item => Object.values(item)),
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] }
    });
    doc.save(`LifeDrop_PU_${type}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-slate-100 p-2 rounded-xl"><ArrowLeft/></button>
          <h2 className="text-2xl font-black capitalize">PU {type}</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2"><FileSpreadsheet size={16}/> EXCEL</button>
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2"><FileText size={16}/> PDF</button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-widest font-black">
              <tr>
                {list.length > 0 && Object.keys(list[0]).map(key => <th key={key} className="p-6">{key}</th>)}
                {type === 'history' && <th className="p-6">Ledger</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition text-xs font-bold text-gray-600">
                  {Object.values(item).map((val, i) => <td key={i} className="p-6">{val}</td>)}
                  {type === 'history' && (
                    <td className="p-6">
                      <button onClick={() => navigate(`/blockchain/${item.id}`)} className="text-red-600"><Link2 size={18}/></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;
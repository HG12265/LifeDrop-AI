import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from '../config';
import LocationPicker from '../components/LocationPicker';
import { User, Phone, Mail, MapPin, ShieldCheck, ArrowLeft, Save, Settings } from 'lucide-react';

const EditProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: "", // Fetch pannanum
  });
  const [position, setPosition] = useState({ lat: 13.0827, lng: 80.2707 });

  // 1. Initial Data Fetch (To get current phone and location)
  useEffect(() => {
    const fetchProfile = async () => {
      const endpoint = user.role === 'donor' ? `/api/donor/${user.unique_id}` : `/api/requester/history/${user.unique_id}`;
      // Note: Requester-ku namma thani profile API ezhudhala, so basic info-ve podhum
      if(user.role === 'donor') {
          const res = await fetch(`${API_URL}/api/donor/${user.unique_id}`);
          const data = await res.json();
          setFormData({ fullName: data.name, phone: data.phone });
          setPosition(data.location);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  const updatePayload = {
    full_name: formData.fullName,
    phone: formData.phone,
    lat: position.lat,
    lng: position.lng
  };

  // Debugging: Intha URL-ah browser console-la check pannunga
  console.log("Calling API:", `${API_URL}/api/profile/update/${user.role}/${user.unique_id}`);

  try {
    const res = await fetch(`${API_URL}/api/profile/update/${user.role}/${user.unique_id}`, {
      method: 'PUT', // ✅ Method PUT-ah irukanum
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    
    const data = await res.json();
    if (res.ok && data.success) {
      setUser(data.user);
      toast.success("Profile Updated!");
      navigate(-1);
    } else {
      toast.error(data.message || "Update failed");
    }
  } catch (err) {
    console.error("Network Error:", err);
    toast.error("Connection error. Check if backend is live.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-slate-400 hover:text-red-600 transition">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
          <Settings className="text-red-600" /> Account Settings
        </h2>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Basic Info */}
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 space-y-6">
          <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest border-b pb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-300" size={18} />
                <input 
                  type="text" value={formData.fullName}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none outline-red-200 font-bold"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-gray-300" size={18} />
                <input 
                  type="tel" value={formData.phone}
                  className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none outline-red-200 font-bold"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
               <ShieldCheck className="text-blue-600 shrink-0" size={20} />
               <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase">
                 Email and Blood Group are verified and cannot be changed manually. Contact admin for corrections.
               </p>
            </div>
          </div>
        </div>

        {/* Right: Location Update */}
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 space-y-6">
          <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest border-b pb-4">Location Settings</h3>
          <LocationPicker position={position} setPosition={setPosition} />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? "SAVING..." : <><Save size={20}/> SAVE CHANGES</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;
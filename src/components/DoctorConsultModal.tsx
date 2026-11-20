import React, { useState } from 'react';
import { X, Stethoscope, CheckCircle2, Calendar, Clock, User, Phone } from 'lucide-react';

interface DoctorConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorConsultModal: React.FC<DoctorConsultModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consultType, setConsultType] = useState('Ayurvedic Vaidya (Prakriti & Herbs)');
  const [slot, setSlot] = useState('Today (Within 30 mins)');
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Talk to Doctor / Vaidya</h3>
              <p className="text-[11px] text-slate-500">Free 10-minute teleconsultation with certified practitioner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {booked ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Consultation Scheduled!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Dr. Priya Sharma's clinic desk will connect with you on <span className="font-semibold text-slate-800">{phone}</span> ({slot}).
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number (for Doctor Call) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Consultation Specialty</label>
              <select
                value={consultType}
                onChange={(e) => setConsultType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Ayurvedic Vaidya (Prakriti & Herbs)">Ayurvedic Vaidya (Prakriti, Diet & Herbal Elixirs)</option>
                <option value="General Physician (Allopathy & Chronic Care)">General Physician (Diabetes, BP, Chronic Care)</option>
                <option value="Clinical Pharmacist (Dosage & Medicine Interactions)">Clinical Pharmacist (Dosage & Botanical Interactions)</option>
                <option value="Skin & Hair Specialist">Ayurvedic Dermatologist (Acne, Glow, Hair Fall)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Time Window</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="Today (Within 30 mins)">Immediate (Within 30 minutes)</option>
                <option value="Today Evening (5:00 PM - 7:00 PM)">Today Evening (5:00 PM - 7:00 PM)</option>
                <option value="Tomorrow Morning (10:00 AM - 12:00 PM)">Tomorrow Morning (10:00 AM - 12:00 PM)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
            >
              Confirm Doctor Call
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

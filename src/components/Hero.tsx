import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Lock, Stethoscope, Award } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenDoctorConsult: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenDoctorConsult
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50/50 py-6 md:py-10 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quiet kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/60 w-fit px-3 py-1 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Trusted Pan-India Pharmacy & Ayurvedic Dispensary</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0F2C59] tracking-tight leading-[1.15] text-balance">
              Healthcare & Authentic Ayurveda, Delivered To Your Doorstep.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Order authentic Ayurvedic herbs, laboratory-verified vitamins, chronic care medicines, and wellness essentials with lightning-fast delivery across India.
            </p>

            {/* 3 Core Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>100% Genuine Medicine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100/80 flex items-center justify-center text-[#0F2C59] shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Secure UPI & COD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100/80 flex items-center justify-center text-teal-700 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Fast Dispatch</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreCatalog}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-md shadow-emerald-900/15 hover:shadow-lg cursor-pointer"
              >
                <span>Shop All Medicines & Herbs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDoctorConsult}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#0F2C59] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Talk to a Doctor</span>
              </button>
            </div>
          </div>

          {/* Right Column: Doctor Visual & Trust Assurance Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Doctor Visual Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-16/11 bg-slate-100">
                <img
                  src="/src/assets/images/hero_doctor_banner_1794289669837.jpg"
                  alt="Saatvik Pharma Senior Pharmacist & Ayurvedic Doctor"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold font-mono">Expert Medical Panel</p>
                  <p className="text-sm font-medium">Dr. Priya Sharma & Team · Ayurvedic Vaidyas & Clinical Pharmacists</p>
                </div>
              </div>

              {/* Floating Quality Assurance Card */}
              <div className="sm:absolute -bottom-6 -left-6 sm:max-w-xs w-full mt-4 sm:mt-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Direct Pharmacy Dispatch</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">Every order is sealed in tamper-proof packaging directly from our certified dispensary.</p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pan-India Same-Day Dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

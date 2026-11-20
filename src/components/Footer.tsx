import React from 'react';
import { ShieldCheck, HeartPulse, Award, RotateCcw, Phone, Mail, MapPin } from 'lucide-react';
import { PolicyType } from './PolicyModal';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenAccount: () => void;
  onOpenTrackOrder: () => void;
  onOpenDoctorConsult: () => void;
  onOpenPolicy: (type: PolicyType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAccount,
  onOpenTrackOrder,
  onOpenDoctorConsult,
  onOpenPolicy
}) => {
  return (
    <footer className="bg-[#0A192F] text-slate-300 pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Value Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Medicine</h4>
              <p className="text-xs text-slate-400 mt-0.5">Sourced directly from licensed GMP manufacturers</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Ayush Certified Herbs</h4>
              <p className="text-xs text-slate-400 mt-0.5">Vedic formulations verified by classical Ayurvedic standards</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Expert Clinical Audits</h4>
              <p className="text-xs text-slate-400 mt-0.5">All wellness formulations verified by certified experts</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Pan-India Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Tamper-proof temperature controlled courier packaging</p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-serif font-black text-lg">
                S
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif">Saatvik</span>
                <span className="text-xl font-semibold tracking-tight text-emerald-400">Pharma</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Saatvik Pharma is dedicated to bringing authentic Ayurvedic science, lab-tested herbal supplements, and essential healthcare formulations directly to households across India. Committed to pure wellness, transparency, and clinical efficacy.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 flex-wrap">
              <button
                onClick={() => onOpenPolicy('about')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                About Our Heritage →
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">GMP CERTIFIED</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">ISO 9001:2015</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">AYUSH COMPLIANT</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-4 tracking-wide">Popular Categories</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('Ayurvedic & Herbal')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Ayurvedic & Herbal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Vitamins & Supplements')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Vitamins & Supplements
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Daily Wellness')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Daily Wellness
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Skin & Haircare')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Ayurvedic Skincare
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Pain Relief')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Pain Relief & Oils
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Health Devices')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Medical Devices
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Services & Policies */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-4 tracking-wide">Healthcare Services</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={onOpenAccount} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  My Account & Order History
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button onClick={onOpenDoctorConsult} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Ayurvedic Wellness Consult
                </button>
              </li>
              <li>
                <button onClick={onOpenDoctorConsult} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Free Pharmacist Consult
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('cod')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Cash on Delivery (COD) Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Shipping & Returns Terms
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('dosha')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Ayurvedic Dosha Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Helpline */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-4 tracking-wide">Contact Pharmacy</h5>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plot 42, Okhla Industrial Area Phase III, New Delhi 110020, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:18002667288" className="hover:text-emerald-400 transition-colors">
                  +91 1800-266-7288 (Toll Free)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:care@saatvikpharma.com" className="hover:text-emerald-400 transition-colors">
                  care@saatvikpharma.com
                </a>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Mon - Sat: 8:00 AM – 9:00 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Legal Links */}
        <div className="pt-6 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} Saatvik Pharma Healthcare Pvt Ltd.</span>
            <span className="text-slate-600">·</span>
            <button onClick={() => onOpenPolicy('privacy')} className="hover:text-slate-200 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-slate-600">·</span>
            <button onClick={() => onOpenPolicy('terms')} className="hover:text-slate-200 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span className="text-slate-600">·</span>
            <button onClick={() => onOpenPolicy('about')} className="hover:text-slate-200 transition-colors cursor-pointer">
              About Us
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 mr-1">Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">UPI</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Visa</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-medium text-[10px]">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

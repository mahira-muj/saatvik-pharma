import React from 'react';
import { X, ShieldCheck, Truck, Banknote, BookOpen, FileText, Phone, Mail, CheckCircle2 } from 'lucide-react';

export type PolicyType = 'cod' | 'shipping' | 'dosha' | 'privacy' | 'terms' | 'about';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PolicyType;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  if (!isOpen) return null;

  const contentMap: Record<PolicyType, {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    body: React.ReactNode;
  }> = {
    cod: {
      title: 'Cash on Delivery (COD) Policy',
      subtitle: 'Pay securely in cash or via dynamic UPI QR code at your doorstep',
      icon: <Banknote className="w-5 h-5 text-emerald-600" />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Prepayment Required</span>
            </h4>
            <p>
              Saatvik Pharma offers genuine Cash on Delivery across 19,000+ Indian postal PIN codes through India Post Speed Post, Blue Dart, and Delhivery.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">How COD Works:</h5>
            <ol className="list-decimal pl-4 space-y-2">
              <li><strong>Place Order:</strong> Select "Cash on Delivery (COD)" at checkout. No advance deposit or credit card details needed.</li>
              <li><strong>Dispatched in Tamper-Proof Box:</strong> Your items are packed in sealed, opaque medical boxes with batch numbers and holograms.</li>
              <li><strong>Doorstep Delivery:</strong> Hand over exact cash to the courier representative, or scan the digital UPI QR code printed on their delivery device.</li>
              <li><strong>Receipt:</strong> You receive an instant SMS delivery receipt and a physical printed tax invoice inside the box.</li>
            </ol>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            <strong>Note:</strong> Free shipping applies automatically on all orders above ₹499. Orders below ₹499 carry a flat ₹49 dispatch fee.
          </div>
        </div>
      )
    },
    shipping: {
      title: 'Shipping & Returns Terms',
      subtitle: 'Fast, temperature-controlled courier dispatch and 7-day hassle-free replacement',
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="font-bold text-[#0F2C59]">Metro Cities</p>
              <p className="text-[11px] text-slate-500 mt-1">24 to 48 Hours Delivery (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad)</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="font-bold text-emerald-900">Rest of India</p>
              <p className="text-[11px] text-slate-500 mt-1">3 to 5 Business Days with live tracking SMS & WhatsApp alerts</p>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">7-Day Replacement Guarantee:</h5>
            <p>
              Because pharmaceutical items require strict hygienic integrity, we replace any product free of charge if:
            </p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>The outer security seal or hologram was compromised during transit.</li>
              <li>You received a bottle, jar, or strip with manufacturing or physical defects.</li>
              <li>The delivered pack size differs from your confirmed online order.</li>
            </ul>
          </div>

          <p className="text-[11px] text-slate-500">
            To initiate a replacement, email <a href="mailto:care@saatvikpharma.com" className="text-emerald-700 underline font-semibold">care@saatvikpharma.com</a> or call toll-free <a href="tel:18002667288" className="text-emerald-700 underline font-semibold">1800-266-7288</a> with your order number.
          </p>
        </div>
      )
    },
    dosha: {
      title: 'Ayurvedic Dosha & Wellness Guide',
      subtitle: 'Understanding Vata, Pitta, and Kapha balance for holistic health',
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            In traditional Ayurvedic medicine, vibrant health is the harmonious balance of the three elemental energies (Doshas): <strong>Vata</strong> (Air & Space), <strong>Pitta</strong> (Fire & Water), and <strong>Kapha</strong> (Earth & Water).
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <h5 className="font-bold text-amber-900 text-xs">1. Vata (Energy of Movement & Mind)</h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                <strong>Symptoms of Imbalance:</strong> Restlessness, anxiety, dry skin, joint stiffness, disrupted sleep.
                <br />
                <strong>Recommended Saatvik Herbs:</strong> Ashwagandha Gold, Mahanarayan Joint Oil, warm herbal decoctions.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <h5 className="font-bold text-rose-900 text-xs">2. Pitta (Metabolic & Digestive Fire)</h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                <strong>Symptoms of Imbalance:</strong> Acidity, skin redness, hyperpigmentation, irritable digestion.
                <br />
                <strong>Recommended Saatvik Herbs:</strong> Pure Kashmiri Kumkumadi Tailam, Triphala, Saffron and Sandalwood elixirs.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200">
              <h5 className="font-bold text-teal-900 text-xs">3. Kapha (Structure, Lubrication & Fluidity)</h5>
              <p className="text-[11px] text-slate-600 mt-0.5">
                <strong>Symptoms of Imbalance:</strong> Sluggish metabolism, chest congestion, fatigue, excess mucus.
                <br />
                <strong>Recommended Saatvik Herbs:</strong> Himalayan Shilajit Resin, Tulsi & Ginger Kadha Syrup, Piperine Bio-Enhancers.
              </p>
            </div>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Strict protection of patient details, prescriptions, and health records',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      body: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Saatvik Pharma respects your privacy and complies with the Digital Personal Data Protection (DPDP) Act of India and pharmacy confidentiality laws.
          </p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Data Encryption:</strong> All orders, delivery addresses, and phone numbers are encrypted with 256-bit TLS/SSL encryption.</li>
            <li><strong>No Third-Party Sharing:</strong> We never sell, rent, or trade your medical history, browsing habits, or personal contact info to advertising brokers.</li>
            <li><strong>Confidential Packaging:</strong> Orders are dispatched in discrete, unbranded outer boxes to ensure personal privacy.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Licensed e-pharmacy conditions, fair pricing, and compliance',
      icon: <FileText className="w-5 h-5 text-slate-700" />,
      body: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            By purchasing through Saatvik Pharma, you agree to comply with our online dispensary terms:
          </p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li>All prices listed throughout the site are in Indian Rupees (₹) and include statutory GST taxes.</li>
            <li>Nutraceutical supplements and Ayurvedic proprietary formulations are certified by the Ministry of Ayush.</li>
            <li>Customer teleconsultations provide informational wellness recommendations and do not replace emergency clinical triage.</li>
          </ul>
        </div>
      )
    },
    about: {
      title: 'About Saatvik Pharma',
      subtitle: 'Vedic heritage, classical formulations, and modern pharmaceutical purity',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Founded by dedicated Ayurvedic Vaidyas and licensed pharmacists, <strong>Saatvik Pharma</strong> was established with a singular mission: to make pure, unadulterated, lab-tested Ayurvedic remedies and clinical grade vitamins accessible to every household across India.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-[#0F2C59] text-base">100%</p>
              <p className="text-[10px] text-slate-500">Pure Herbs</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-emerald-700 text-base">GMP</p>
              <p className="text-[10px] text-slate-500">Certified Facility</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-blue-700 text-base">19K+</p>
              <p className="text-[10px] text-slate-500">PIN Codes Served</p>
            </div>
          </div>
          <p>
            Our formulations adhere to classical texts including Charaka Samhita, Sushruta Samhita, and modern Ayush Pharmacopoeia guidelines.
          </p>
        </div>
      )
    }
  };

  const current = contentMap[type] || contentMap.about;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {current.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{current.title}</h3>
              <p className="text-[11px] text-slate-500">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto pr-1">
          {current.body}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

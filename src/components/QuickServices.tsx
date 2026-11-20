import React from 'react';
import { UserCheck, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface QuickServicesProps {
  onOpenDoctorConsult: () => void;
  onExploreCatalog: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const QuickServices: React.FC<QuickServicesProps> = ({
  onOpenDoctorConsult,
  onExploreCatalog,
  onSelectCategory
}) => {
  const services = [
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Free Doctor Consultation',
      description: 'Discuss symptoms and get customized Ayurvedic or allopathic advice.',
      actionText: 'Book Consult',
      onClick: onOpenDoctorConsult,
      bg: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      title: 'Ayurvedic Herbal Care',
      description: 'Authentic classical formulations prepared according to ancient Charaka Samhita.',
      actionText: 'Explore Herbs',
      onClick: () => {
        if (onSelectCategory) {
          onSelectCategory('Ayurvedic & Herbal');
        }
        onExploreCatalog();
      },
      bg: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100'
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      title: 'Express 24-48h Delivery',
      description: 'Temperature-protected packing dispatched from certified local hubs.',
      actionText: 'Order Now',
      onClick: onExploreCatalog,
      bg: 'bg-amber-50/50 hover:bg-amber-50 border-amber-100'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      title: '100% Genuine & Tested',
      description: 'Direct manufacturer sourcing with batch lab reports & full traceability.',
      actionText: 'Browse Catalog',
      onClick: onExploreCatalog,
      bg: 'bg-teal-50/50 hover:bg-teal-50 border-teal-100'
    }
  ];

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">Healthcare Services</h2>
          <p className="text-2xl font-serif font-bold text-[#0F2C59] mt-1">Dedicated Pharmacy Care For Your Family</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${s.bg}`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.description}</p>
              </div>

              <button
                onClick={s.onClick}
                className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer group"
              >
                <span>{s.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

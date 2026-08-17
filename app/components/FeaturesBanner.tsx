import React from "react";
import { Truck, Headphones, RotateCcw } from "lucide-react";

export default function FeaturesBanner() {
  const features = [
    {
      icon: <Truck className="w-5 h-5 text-white" />,
      iconBg: "bg-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
      title: "Free Shipping & Delivery",
      description: "Hassle-free delivery service",
    },
    {
      icon: <Headphones className="w-5 h-5 text-white" />,
      iconBg: "bg-[#10b981] shadow-[0_4px_12px_rgba(16,185,129,0.25)]",
      title: "24/7 Customer Support",
      description: "Contact us day or night for any questions.",
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-white" />,
      iconBg: "bg-[#ef4444] shadow-[0_4px_12px_rgba(239,68,68,0.25)]",
      title: "Easy Return Policy",
      description: "Return facility available if you don't like the product or face any issues.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-4 relative group"
            >
              {/* Icon Container */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>

              {/* Text Info */}
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-slate-950 text-[15px] sm:text-base leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-normal">
                  {feature.description}
                </p>
              </div>

              {/* Divider lines on desktop */}
              {idx < 2 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-slate-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

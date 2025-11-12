"use client";

interface LogoProps {
  className?: string;
  maskLeft?: boolean;
  maskRight?: boolean;
}

export default function Logo({ className = "", maskLeft = false, maskRight = false }: LogoProps) {
  const maskStyle = maskLeft 
    ? { clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)" }
    : maskRight
    ? { clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)" }
    : {};

  return (
    <div className={`relative ${className}`} style={maskStyle}>
      {/* Black background circle */}
      <div className="w-64 h-64 rounded-full bg-black flex items-center justify-center relative overflow-visible">
        {/* Yellow border */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400" />
        
        {/* White inner circle */}
        <div className="w-[240px] h-[240px] rounded-full bg-white relative">
          {/* Top arcing text */}
          <div className="absolute top-3 left-0 right-0 text-center">
            <span className="text-[9px] font-bold text-black leading-tight">
              مؤسسة التربية و التعليم الخاصة
            </span>
          </div>
          
          {/* Bottom arcing text */}
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="text-[9px] font-bold text-black leading-tight">
              تحضيري - ابتدائي - متوسط - ثانوي
            </span>
          </div>
          
          {/* Central Arabic text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center">
              <span className="text-5xl font-bold text-black relative inline-block">
                <span className="relative inline-block">
                  أ
                  {/* Graduation cap */}
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path
                        d="M10 0L0 3.5v1.5h20V3.5L10 0z"
                        fill="black"
                      />
                      <rect x="6" y="5" width="8" height="7" fill="black" />
                      {/* Yellow tassel */}
                      <circle cx="10" cy="12" r="1" fill="#FACC15" />
                    </svg>
                  </span>
                </span>
                <span className="mx-1">لبراع</span>
                <span className="relative inline-block">
                  ة
                  {/* Two dots above */}
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  </span>
                </span>
              </span>
              
              {/* Yellow feather on the right */}
              <span className="absolute -right-10 top-1/2 transform -translate-y-1/2">
                <svg
                  width="28"
                  height="36"
                  viewBox="0 0 28 36"
                  fill="none"
                  className="text-yellow-400"
                >
                  <path
                    d="M2 2 Q6 8, 10 14 T16 24 Q18 28, 24 32"
                    stroke="#FACC15"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 3 Q7 9, 11 15 T17 25"
                    stroke="#FACC15"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

type Department = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  characterPosition: string;
};

type DepartmentSectionProps = {
  department: Department;
  index: number;
  isFirst?: boolean;
};

export const DepartmentSection = ({ department, index, isFirst }: DepartmentSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [efficiency, setEfficiency] = useState<number>(97.0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.2, rootMargin: '50px' },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate efficiency value between 95% and 98%
  useEffect(() => {
    let current = 97.0;
    let direction = 1; // 1 = up, -1 = down
    const step = 0.05; // change per tick
    const intervalMs = 80;

    const id = setInterval(() => {
      current += step * direction;
      if (current >= 98) {
        current = 98;
        direction = -1;
      } else if (current <= 95) {
        current = 95;
        direction = 1;
      }
      setEfficiency(Number(current.toFixed(1)));
    }, intervalMs);

    return () => clearInterval(id);
  }, []);

  const isEven = index % 2 === 0;

  // Department-specific benefits with time-savings and impact
  const benefitsByDepartment: Record<string, { label: string; metric: string }[]> = {
    hr: [
      { label: 'Automated candidate screening', metric: 'Save 10+ hrs/week' },
      { label: 'AI interview scheduling', metric: '−6 hrs/week' },
      { label: 'One-click onboarding workflows', metric: '40% faster ramp' },
      { label: 'Pulse surveys & insights', metric: '15% lower attrition' },
    ],
    finance: [
      { label: 'Auto expense reconciliation', metric: 'Save 12 hrs/week' },
      { label: 'Real-time cashflow forecast', metric: 'Decisions in minutes' },
      { label: 'Invoice processing automation', metric: '3× faster close' },
      { label: 'Compliance checks & audit trail', metric: '−90% manual errors' },
    ],
    operations: [
      { label: 'SOP & checklist automation', metric: 'Save 8 hrs/week' },
      { label: 'Smart ticket triage', metric: '50% faster resolution' },
      { label: 'Inventory & asset tracking', metric: '−30% stockouts' },
      { label: 'Cross-team runbooks', metric: 'Fewer escalations' },
    ],
    marketing: [
      { label: 'Campaign brief generator', metric: 'Save 6 hrs/launch' },
      { label: 'Audience segmentation', metric: '+20% CTR' },
      { label: 'Content calendar automation', metric: '2× output' },
      { label: 'Sales enablement summaries', metric: '30% faster follow-ups' },
    ],
    it: [
      { label: 'Incident summarization', metric: '60% faster postmortems' },
      { label: 'PR review assistant', metric: 'Save 4 hrs/sprint' },
      { label: 'IaC drift alerts', metric: '−70% config errors' },
      { label: 'ChatOps automations', metric: 'Resolve routine requests' },
    ],
  };

  const benefits = benefitsByDepartment[department.id] ?? [
    { label: 'AI-powered automation', metric: 'Save hours/week' },
    { label: 'Real-time analytics', metric: 'Decisions in minutes' },
    { label: 'Smart workflows', metric: 'Fewer manual steps' },
    { label: 'Collaboration tools', metric: 'Faster alignment' },
  ];

  return (
    <section
      ref={sectionRef}
      id={isFirst ? 'departments' : `department-${department.id}`}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isEven ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-900 to-purple-900'
      }`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Department Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
        isEven ? 'sm:grid-flow-col lg:grid-flow-col' : 'sm:grid-flow-col-dense lg:grid-flow-col-dense'
      }`}
      >

        {/* Department Info */}
        <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'} ${
          isEven ? 'lg:order-1' : 'lg:order-2'
        }`}
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-3xl sm:text-4xl lg:text-6xl">{department.emoji}</div>
              <div className="flex-1">
                <h2 className="font-['Press_Start_2P'] text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white mb-1 sm:mb-2 leading-tight">
                  {department.name}
                </h2>
                <div className={`h-1 w-12 sm:w-16 bg-gradient-to-r ${department.color} rounded`} />
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">
              {department.description}
            </p>
          </div>

          {/* Department-specific Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            {benefits.map((item, idx) => (
              <div key={idx} className="glassmorphism p-2 sm:p-3 lg:p-4 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-['Press_Start_2P'] text-xs sm:text-sm text-white">{item.label}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 whitespace-nowrap">
                    {item.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Department Visualization */}
        <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'} ${
          isEven ? 'lg:order-2' : 'lg:order-1'
        }`}
        >
          <div className="relative glassmorphism rounded-2xl p-4 sm:p-6 lg:p-8 h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            {/* Office Room Visualization */}
            <div className="pixel-office-room w-full h-full relative">
              {/* Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-600 to-gray-500 rounded-b-2xl" />

              {/* Walls */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gray-400 rounded-t-2xl" />
              <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-l-2xl" />
              <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-gray-500 to-gray-400 rounded-r-2xl" />

              {/* Furniture - varies by department */}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="text-8xl opacity-80">
                  {department.emoji}
                </div>
              </div>

              {/* Floating UI Elements */}
              <div className="absolute top-8 left-8">
                <div className="glassmorphism px-3 py-2 rounded border border-cyan-400">
                  <span className="font-['Press_Start_2P'] text-xs text-cyan-400">AI Active</span>
                </div>
              </div>

              <div className="absolute top-8 right-8">
                <div className="glassmorphism px-3 py-2 rounded border border-green-400">
                  <span className="font-['Press_Start_2P'] text-xs text-green-400">Online</span>
                </div>
              </div>

              <div className="absolute bottom-8 left-8">
                <div className="glassmorphism px-3 py-2 rounded border border-purple-400">
                  <span className="font-['Press_Start_2P'] text-xs text-purple-400">{`Efficiency: ${efficiency.toFixed(1)}%`}</span>
                </div>
              </div>

              {/* Animated Particles */}
              {[...Array.from({ length: 3 })].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${40 + i * 10}%`,
                    animation: `float-particle-${i} ${8 + i * 2}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-cyan-400 opacity-60" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-r-4 border-t-4 border-purple-400 opacity-60" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-4 border-b-4 border-purple-400 opacity-60" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-4 border-b-4 border-cyan-400 opacity-60" />
        </div>
      </div>

      {/* Section Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

      <style jsx>
        {`
        @keyframes animate-slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes animate-slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: animate-slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: animate-slide-in-right 0.8s ease-out forwards;
        }
        
        @keyframes float-particle-0 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.2); }
        }
        
        @keyframes float-particle-1 {
          0%, 100% { transform: translateY(-5px) scale(1.1); }
          50% { transform: translateY(-15px) scale(0.9); }
        }
        
        @keyframes float-particle-2 {
          0%, 100% { transform: translateY(-2px) scale(0.9); }
          50% { transform: translateY(-12px) scale(1.3); }
        }
      `}
      </style>
    </section>
  );
};

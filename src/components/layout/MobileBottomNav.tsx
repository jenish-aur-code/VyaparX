import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Users, User, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dockRef = useRef<HTMLDivElement>(null);
  const [dockWidth, setDockWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 380
  );

  useEffect(() => {
    if (!dockRef.current) return;
    const updateWidth = () => {
      if (dockRef.current) {
        setDockWidth(dockRef.current.clientWidth || window.innerWidth);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDockWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(dockRef.current);
    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const W = Math.max(dockWidth, 300);
  const H = 66;
  const CX = W / 2;
  const scoopStart = CX - 38;
  const scoopEnd = CX + 38;
  const scoopDepth = 26;

  // Flush bottom edge-to-edge path with center scoop cradle
  const pathD = `M 0 0 L ${scoopStart} 0 C ${CX - 22} 0, ${CX - 22} ${scoopDepth}, ${CX} ${scoopDepth} C ${CX + 22} ${scoopDepth}, ${CX + 22} 0, ${scoopEnd} 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z`;

  // Specular top edge highlight line
  const topSpecularD = `M 0 1 L ${scoopStart} 1 C ${CX - 22} 1, ${CX - 22} ${scoopDepth + 1}, ${CX} ${scoopDepth + 1} C ${CX + 22} ${scoopDepth + 1}, ${CX + 22} 1, ${scoopEnd} 1 L ${W} 1`;

  const leftTabs = [
    {
      to: '/home',
      label: t('nav.home', 'Home'),
      icon: Home,
      isActive: location.pathname === '/home',
    },
    {
      to: '/vyapar',
      label: t('nav.saudaShort', 'Vyapar'),
      icon: Package,
      // Only active on the list page, NOT when on /vyapar/create
      isActive: location.pathname === '/vyapar' || location.pathname === '/sauda',
    },
  ];

  const rightTabs = [
    {
      to: '/parties',
      label: t('nav.partiesShort', 'Parties'),
      icon: Users,
      isActive: location.pathname === '/parties',
    },
    {
      to: '/profile',
      label: t('nav.profile', 'Profile'),
      icon: User,
      isActive: location.pathname === '/profile',
    },
  ];

  return (
    <nav
      ref={dockRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full h-[66px] select-none"
      aria-label="Mobile Navigation Dock"
    >
      {/* Backdrop Glass Skin (Flush on left, right, and bottom) */}
      <div className="absolute inset-0 overflow-hidden backdrop-blur-2xl pointer-events-none">
        <div className="w-full h-full bg-[#061d44]/75" />
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
      >
        <defs>
          <linearGradient id="dockGrad" x1={CX} y1="0" x2={CX} y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0e3a80" stop-opacity="0.94" />
            <stop offset="50%" stop-color="#07204c" stop-opacity="0.96" />
            <stop offset="100%" stop-color="#021028" stop-opacity="0.99" />
          </linearGradient>

          <linearGradient id="specularGlow" x1={0} y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
            <stop offset="25%" stop-color="#bae6fd" stop-opacity="0.75" />
            <stop offset="50%" stop-color="#00ADEF" stop-opacity="0.95" />
            <stop offset="75%" stop-color="#bae6fd" stop-opacity="0.75" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2" />
          </linearGradient>
        </defs>

        {/* Main Glass Body */}
        <path
          d={pathD}
          fill="url(#dockGrad)"
        />

        {/* Specular Top Lip Line */}
        <path
          d={topSpecularD}
          stroke="url(#specularGlow)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Center Floating Plus Button - Toned Down, No Rotating Animation */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-30">
        <button
          type="button"
          onClick={() => navigate('/vyapar/create')}
          className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center border-2 border-white/60 active:scale-95 transition-transform duration-150 cursor-pointer"
          style={{
            background: 'linear-gradient(145deg, #0ea5e9 0%, #00ADEF 50%, #0284c7 100%)',
            boxShadow:
              '0 4px 14px rgba(0, 30, 80, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.45)',
          }}
          aria-label="Create New Vyapar"
          title="Create New Vyapar"
        >
          {/* Static Clean Plus Icon - No Rotate / Spin Animation */}
          <Plus className="w-6 h-6 text-white stroke-[2.6]" />
        </button>
      </div>

      {/* Navigation Content Bar */}
      <div className="relative z-20 w-full h-full flex items-center justify-between px-3">
        {/* Left Tabs (Home, Vyapar) */}
        <div className="flex-1 flex items-center justify-around pr-6">
          {leftTabs.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center active:scale-95 transition-transform duration-150 cursor-pointer"
              >
                {item.isActive ? (
                  <div
                    className="relative flex flex-col items-center justify-center w-[66px] h-[48px] rounded-2xl transition-all"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      boxShadow:
                        'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.25)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  >
                    <Icon className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(0,173,239,0.7)] stroke-[2.2]" />
                    <span className="text-[11px] font-semibold text-white tracking-tight leading-none mt-0.5">
                      {item.label}
                    </span>
                    {/* Active Neon Pill Indicator Dash */}
                    <div
                      className="w-5 h-[3px] rounded-full bg-[#00ADEF] mt-0.5"
                      style={{
                        boxShadow: '0 0 8px #00ADEF, 0 0 14px rgba(0, 173, 239, 0.9)',
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-[66px] h-[48px] text-white/75 hover:text-white transition-colors">
                    <Icon className="w-5 h-5 text-white/80 stroke-[2]" />
                    <span className="text-[11px] font-medium text-white/80 tracking-tight mt-1 leading-none">
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Center Gap Spacer for the Circular FAB */}
        <div className="w-14 shrink-0 pointer-events-none" />

        {/* Right Tabs (Parties, Profile) */}
        <div className="flex-1 flex items-center justify-around pl-6">
          {rightTabs.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center active:scale-95 transition-transform duration-150 cursor-pointer"
              >
                {item.isActive ? (
                  <div
                    className="relative flex flex-col items-center justify-center w-[66px] h-[48px] rounded-2xl transition-all"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      boxShadow:
                        'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.25)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  >
                    <Icon className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(0,173,239,0.7)] stroke-[2.2]" />
                    <span className="text-[11px] font-semibold text-white tracking-tight leading-none mt-0.5">
                      {item.label}
                    </span>
                    {/* Active Neon Pill Indicator Dash */}
                    <div
                      className="w-5 h-[3px] rounded-full bg-[#00ADEF] mt-0.5"
                      style={{
                        boxShadow: '0 0 8px #00ADEF, 0 0 14px rgba(0, 173, 239, 0.9)',
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-[66px] h-[48px] text-white/75 hover:text-white transition-colors">
                    <Icon className="w-5 h-5 text-white/80 stroke-[2]" />
                    <span className="text-[11px] font-medium text-white/80 tracking-tight mt-1 leading-none">
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

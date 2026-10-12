import React from 'react';
import { Terminal, BookOpen } from 'lucide-react';

export type NavTabId = 'overview' | 'install' | 'backend' | 'commands' | 'skills' | 'trouble' | 'youtube';

interface NavbarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  onQuickInstall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onQuickInstall }) => {
  const navItems: { id: NavTabId; label: string }[] = [
    { id: 'overview', label: '1. 개요 & 아키텍처' },
    { id: 'install', label: '2. 준비 & 설치' },
    { id: 'backend', label: '3. 백엔드 & 메모리' },
    { id: 'commands', label: '4. 모델 & 커맨드' },
    { id: 'skills', label: '5. 텔레그램 & 스킬' },
    { id: 'trouble', label: '6. 보안 & 트러블슈팅' },
    { id: 'youtube', label: '7. 유튜브 학습 센터' },
  ];

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800/80 sticky top-0 z-50 shadow-md">
      {/* 3-Zone Top Navigation Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-sm">
            H
          </div>
          <button
            onClick={() => onTabChange('overview')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
              Hermes Agent Guide
            </div>
            <div className="text-[11px] text-slate-400 whitespace-nowrap">
              자율 학습형 AI 런타임 엔지니어링 포털
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto text-xs font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onQuickInstall}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>원클릭 설치 복사</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Secondary Horizontal Scroll Bar */}
      <div className="xl:hidden border-t border-slate-800/60 bg-slate-900/90 overflow-x-auto py-2 px-4">
        <div className="flex items-center gap-1 min-w-max text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

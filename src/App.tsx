import React, { useState } from 'react';
import { Navbar, NavTabId } from './components/Navbar';
import { OverviewSection } from './components/OverviewSection';
import { InstallSection } from './components/InstallSection';
import { BackendMemorySection } from './components/BackendMemorySection';
import { CommandsSection } from './components/CommandsSection';
import { TelegramSkillsSection } from './components/TelegramSkillsSection';
import { SecurityTroubleSection } from './components/SecurityTroubleSection';
import { YouTubeHubSection } from './components/YouTubeHubSection';
import { Check, Terminal, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleQuickInstall = async () => {
    const cmd = 'curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash';
    try {
      await navigator.clipboard.writeText(cmd);
      showToast('설치 명령어가 클립보드에 복사되었습니다! 터미널에 붙여넣으세요.');
    } catch {
      showToast('설치 명령어: ' + cmd);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickInstall={handleQuickInstall}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-blue-400 animate-fade-in">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewSection onNavigateToInstall={() => setActiveTab('install')} />
        )}
        {activeTab === 'install' && <InstallSection />}
        {activeTab === 'backend' && <BackendMemorySection />}
        {activeTab === 'commands' && <CommandsSection />}
        {activeTab === 'skills' && <TelegramSkillsSection />}
        {activeTab === 'trouble' && <SecurityTroubleSection />}
        {activeTab === 'youtube' && <YouTubeHubSection />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-semibold text-slate-300">
              Hermes Agent Interactive Engineering Portal
            </div>
            <p className="text-[11px] text-slate-400">
              Nous Research 공식 아키텍처 및 커뮤니티 베스트 프랙티스 기반
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <a
              href="https://github.com/NousResearch/hermes-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>OpenRouter Live Metrics</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

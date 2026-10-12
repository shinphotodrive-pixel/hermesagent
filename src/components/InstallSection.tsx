import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Layers, Laptop } from 'lucide-react';

export const InstallSection: React.FC = () => {
  const [selectedOS, setSelectedOS] = useState<'linux' | 'wsl' | 'windows' | 'docker'>('linux');
  const [includeWebUI, setIncludeWebUI] = useState(false);
  const [selectedBackend, setSelectedBackend] = useState<'local' | 'docker' | 'modal'>('local');

  // Generate tailored setup command
  const getCustomInstallScript = () => {
    if (selectedOS === 'windows') {
      return `# [Windows PowerShell - 관리자 권한 필수]
# 1. Windows Defender 오탐지 방지 예외 등록
Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\\hermes\\bin"

# 2. 헤르메스 공식 단일 설치 스크립트 실행
iex (irm https://hermes-agent.nousresearch.com/install.ps1)

# 3. 환경 설정 및 초기화
hermes setup
${includeWebUI ? 'hermes webui start\n' : ''}hermes doctor`;
    }

    if (selectedOS === 'docker') {
      return `# [Docker 컨테이너 격리 배포]
# 1. 호스트 작업 디렉토리 생성
mkdir -p ~/workspace ~/.hermes

# 2. 호스트 UID/GID 매핑 컨테이너 구동 (권한 꼬임 방지)
docker run -d \\
  --name hermes-agent \\
  --restart unless-stopped \\
  -e WANTED_UID=$(id -u) \\
  -e WANTED_GID=$(id -g) \\
  -v ~/.hermes:/home/hermeswebui/.hermes \\
  -v ~/workspace:/workspace \\
  -p 8787:8787 \\
  ghcr.io/nesquena/hermes-webui:latest

# 3. 브라우저 접속: http://127.0.0.1:8787`;
    }

    // Linux / macOS / WSL2
    return `# [${selectedOS === 'wsl' ? 'Windows WSL2' : 'Linux / macOS'} 단일 실행 설치]
# 1. 공식 자동화 인스톨러 (Python 3.11 및 uv 자동 번들)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 2. 쉘 환경변수 즉시 반영 (중요!)
export PATH="$HOME/.hermes/bin:$PATH"
source ~/.bashrc

# 3. 백엔드 설정 (${selectedBackend.toUpperCase()})
hermes config set execution.backend "${selectedBackend}"

# 4. 초기 인터랙티브 셋업 & 시스템 진단
hermes setup
${includeWebUI ? 'curl -fsSL https://get-hermes.ai/install.sh | bash\nhermes webui start\n' : ''}hermes doctor`;
  };

  return (
    <div className="space-y-8">
      {/* OS Matrix Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-blue-400" />
          사전 준비 사항 및 지원 환경 점검
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          헤르메스 에이전트는 별도로 사전에 복잡한 파이썬 가상환경이나 root 권한을 요구하지 않습니다.
          공식 인스톨러가 내부적으로 최적화된 독립 파이썬과 Rust 기반 초고속 패키지 매니저 <code className="text-blue-300 font-mono">uv</code>를 자동 배포합니다.
        </p>

        <div className="grid md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Linux / macOS</span>
              <span className="text-[11px] font-semibold text-emerald-400">공식 1순위</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ubuntu 20.04+, Debian, Fedora, Arch 및 macOS (Apple Silicon / Intel) 완벽 지원. 별도 권한 없이 일반 계정에서 구동.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Windows WSL2</span>
              <span className="text-[11px] font-semibold text-emerald-400">윈도우 권장</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Windows 10/11 환경에서 가장 안정적인 구동 방식. 완벽한 POSIX 호환성과 Docker 데스크탑 통합을 지원합니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Windows Native</span>
              <span className="text-[11px] font-semibold text-amber-400">Defender 예외 필수</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              PowerShell 7+ 기반 네이티브 구동. 단, 백신 소프트웨어의 uv.exe 오탐지 예외 처리가 설치 전에 반드시 선행되어야 합니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Android (Termux)</span>
              <span className="text-[11px] font-semibold text-blue-400">aarch64 지원</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              안드로이드 스마트폰 또는 태블릿의 Termux 터미널 환경에서 APT 패키지와 함께 휴대용 에이전트로 운용 가능합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Windows Defender Notice Banner */}
      <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-amber-200">
              Windows 네이티브 환경 필수 사전 작업 (Windows Defender 오탐지 예외 등록)
            </div>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              윈도우 네이티브 환경에서 설치 시, Windows Defender가 초고속 패키지 관리자 <code className="bg-amber-900/60 px-1 rounded text-amber-200 font-mono">uv.exe</code>를 미확인 바이너리로 분류하여 다운로드를 강제 차단할 수 있습니다. 
              PowerShell을 <strong className="text-white">관리자 권한</strong>으로 실행한 후 아래 명령을 먼저 실행하세요:
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <code className="text-xs font-mono text-amber-300 break-all select-all">
            Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"
          </code>
          <CopyButton text='Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\hermes\bin"' />
        </div>
      </div>

      {/* Interactive Command Generator / Configurator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            맞춤형 원클릭 설치 스크립트 생성기
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            사용자 운영체제와 선호하는 백엔드 설정을 선택하면 복사해서 바로 실행할 수 있는 명령어가 즉시 생성됩니다.
          </p>
        </div>

        {/* Options Controls */}
        <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-950/80 rounded-xl border border-slate-850 text-xs">
          {/* OS Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300">1. 대상 운영체제 (OS)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'linux', label: 'Linux / macOS' },
                { id: 'wsl', label: 'Windows WSL2' },
                { id: 'windows', label: 'Windows Native' },
                { id: 'docker', label: 'Docker Container' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOS(opt.id as any)}
                  className={`p-2 rounded-lg font-medium text-left transition-colors ${
                    selectedOS === opt.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backend Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300">2. 도구 실행 백엔드</label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'local', label: 'Local (초고속 네이티브 호스트)' },
                { id: 'docker', label: 'Docker (격리 샌드박스 안전)' },
                { id: 'modal', label: 'Modal ($0 대기비용 서버리스 GPU)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedBackend(opt.id as any)}
                  disabled={selectedOS === 'docker'}
                  className={`p-2 rounded-lg font-medium text-left transition-colors ${
                    selectedBackend === opt.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 disabled:opacity-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Web UI Toggle */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300">3. 웹 UI 확장 포함</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIncludeWebUI(!includeWebUI)}
                disabled={selectedOS === 'docker'}
                className={`p-2.5 rounded-lg font-medium text-left transition-colors flex items-center justify-between ${
                  includeWebUI
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>웹 인터페이스(Web UI) 함께 설치</span>
                <span className="text-xs font-mono">{includeWebUI ? 'ON' : 'OFF'}</span>
              </button>
              <p className="text-[11px] text-slate-500 leading-tight">
                경량 웹 채팅 UI와 파일 브라우저가 포트 8787로 함께 제공됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Generated Script Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>생성된 설치 스크립트 (터미널에 붙여넣기):</span>
            <CopyButton text={getCustomInstallScript()} label="스크립트 전체 복사" />
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <pre className="text-xs font-mono text-blue-300 leading-relaxed select-all">
              {getCustomInstallScript()}
            </pre>
          </div>
        </div>

        {/* Strict Cautions */}
        <div className="grid md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 bg-rose-950/30 border border-rose-900/60 rounded-xl space-y-1.5 text-rose-200">
            <div className="font-bold flex items-center gap-1.5 text-rose-300">
              <AlertTriangle className="w-4 h-4" />
              <span>절대 금지: sudo 권한으로 설치하지 마세요</span>
            </div>
            <p className="text-[11px] text-rose-300/80 leading-relaxed">
              인스톨러를 <code className="font-mono bg-rose-900/60 px-1 rounded text-white">sudo bash</code>로 실행하면
              ~/.hermes 디렉토리의 파일 소유권이 root로 생성되어 이후 일반 계정에서 세션 읽기/쓰기 오류가 발생합니다.
            </p>
          </div>

          <div className="p-3.5 bg-blue-950/30 border border-blue-900/60 rounded-xl space-y-1.5 text-blue-200">
            <div className="font-bold flex items-center gap-1.5 text-blue-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>환경변수(PATH) 갱신 필수 안내</span>
            </div>
            <p className="text-[11px] text-blue-300/80 leading-relaxed">
              설치 직후 <code className="font-mono bg-blue-900/60 px-1 rounded text-white">hermes: command not found</code> 오류가 발생할 경우,
              터미널 창을 다시 열거나 <code className="font-mono text-white">source ~/.bashrc</code>를 실행해야 전역 커맨드가 활성화됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

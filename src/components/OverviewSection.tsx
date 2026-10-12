import React, { useState } from 'react';
import { tokenTrafficData } from '../data/hermesData';
import { Brain, Cpu, Database, ShieldCheck, ArrowRight, Play, RefreshCw, BarChart2 } from 'lucide-react';

export const OverviewSection: React.FC<{ onNavigateToInstall: () => void }> = ({ onNavigateToInstall }) => {
  const [activeChartMetric, setActiveChartMetric] = useState<'tokens' | 'ratio'>('tokens');
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const loopSteps = [
    {
      title: '1. 복합 과제 수신',
      desc: '사용자로부터 데이터 추출, 빌드, 리팩토링 등 복합적인 명령을 수신합니다.',
      component: 'Agent Core'
    },
    {
      title: '2. 도구 실행 및 추론 궤적 기록',
      desc: 'BaseEnvironment 백엔드에서 쉘/파이썬 도구를 실행하며 시도와 오류를 Trajectory로 기록합니다.',
      component: 'Terminal Backend'
    },
    {
      title: '3. 작업 완수 및 보안 감사',
      desc: '목표 달성 후 티리스(Tirith) 모듈이 악성 프롬프트 인젝션이나 오염 여부를 철저히 검증합니다.',
      component: 'Tirith Scanner'
    },
    {
      title: '4. 자율적 SKILL.md 합성',
      desc: '검증된 최적 작업 절차를 표준 YAML 프론트매터를 갖춘 SKILL.md 문서로 자율 생성합니다.',
      component: 'Skill Synthesizer'
    },
    {
      title: '5. SQLite FTS5 영구 기억 저장',
      desc: '고비용 벡터 DB 대신 로컬 SQLite FTS5 전문 검색 엔진에 인덱싱하여 AI 기억상실을 영구 극복합니다.',
      component: 'FTS5 Memory'
    }
  ];

  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step > loopSteps.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setSimStep(step);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Hero / Definition Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-semibold text-blue-400 tracking-wider">
              NEXT-GEN AUTONOMOUS LEARNING RUNTIME
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              기억을 잃지 않는 자율 학습형 AI 에이전트, <span className="text-blue-500">헤르메스(Hermes)</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              헤르메스 에이전트는 일회성 대화형 챗봇이나 IDE 종속 코딩 도구와 달리, 서버나 클라우드 환경에 독자 상주하며
              경험을 통해 스스로 진화하는 오픈소스 AI 에이전트 런타임입니다. 세션이 끝나면 모든 컨텍스트를 망각하는
              <strong className="text-white"> AI 기억상실(AI Amnesia)</strong> 문제를 극복하기 위해 독창적인 
              <strong className="text-blue-400"> 폐쇄형 학습 루프(Closed Learning Loop)</strong>와 
              <strong className="text-white"> SQLite FTS5 기반 3계층 프롬프트 메모리</strong>를 채택했습니다.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={onNavigateToInstall}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>빠른 시작 &amp; 설치</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-[11px] text-slate-400 text-center">
              공식 Nous Research v0.21.0+ 기준
            </div>
          </div>
        </div>

        {/* 3 Core Architecture Highlights */}
        <div className="grid md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Brain className="w-4 h-4" />
              <span>자가 개선 절차적 기억</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              복잡한 작업을 완수한 후, 에이전트가 자체적으로 최적 성공 경로와 트러블슈팅 노하우를 분석하여 
              <code className="text-blue-300 font-mono">SKILL.md</code> 파일로 합성·보존합니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>7대 격리 백엔드 분리</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              코어 에이전트 추론 엔진과 터미널 도구 실행 환경(Local, Docker, Modal GPU, SSH 등)을
              <code className="text-indigo-300 font-mono">BaseEnvironment</code> 추상화로 격리하여 안전성을 확보합니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>결정론적 SQLite FTS5</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              불안정하고 고비용인 외부 벡터 DB 대신 SQLite FTS5 BM25 전문 검색 엔진을 채택하여
              레이턴시 없는 즉각적 회상과 검색 재현성을 보장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Traffic Comparison Chart & Features */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Custom SVG Chart */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  글로벌 실제 처리 토큰량 비교
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  오픈라우터(OpenRouter) 일일 실제 운영 트래픽 기준
                </p>
              </div>

              {/* Metric Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveChartMetric('tokens')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeChartMetric === 'tokens' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  토큰량 (억)
                </button>
                <button
                  onClick={() => setActiveChartMetric('ratio')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    activeChartMetric === 'ratio' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  점유율 (%)
                </button>
              </div>
            </div>

            {/* Custom Interactive Responsive Chart View */}
            <div className="mt-6 bg-slate-950/80 p-5 rounded-xl border border-slate-850">
              {activeChartMetric === 'tokens' ? (
                <div className="space-y-5">
                  {/* Hermes Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                        헤르메스 에이전트 (Hermes)
                      </span>
                      <span className="font-mono font-bold text-blue-400 tabular-nums">
                        4,580억 토큰/일 (72.6%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-6 rounded-md overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded transition-all duration-700 ease-out flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                        style={{ width: '100%' }}
                      >
                        4,580억
                      </div>
                    </div>
                  </div>

                  {/* OpenClaw Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-500"></span>
                        오픈클로 (OpenClaw)
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        1,730억 토큰/일 (27.4%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-6 rounded-md overflow-hidden p-0.5">
                      <div
                        className="bg-slate-500 h-full rounded transition-all duration-700 ease-out flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                        style={{ width: `${(1730 / 4580) * 100}%` }}
                      >
                        1,730억
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                    <span>* 차이: 헤르메스가 <strong>약 2.65배</strong> 더 많은 실사용 토큰 처리</span>
                    <span className="text-emerald-400 font-semibold">OpenRouter 실시간 순위 1위</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-500"
                          strokeDasharray="72.6, 100"
                          strokeWidth="4"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-base font-bold text-white tabular-nums">72.6%</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="font-semibold text-blue-400">헤르메스 에이전트: 72.6%</div>
                        <div className="text-slate-400 text-[11px]">대규모 지속 태스크 및 자율 엔지니어링 집중</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-300">오픈클로: 27.4%</div>
                        <div className="text-slate-400 text-[11px]">다중 메신저 채널 연동 중심</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-950/40 border border-blue-900/60 rounded-lg text-xs text-blue-200">
            💡 <strong>핵심 시사점:</strong> 깃허브 스타 수치보다 실제 프로덕션에서 에이전트가 얼마나 오래 실행되고 성공적으로 완수되는지를 나타내는 <strong>실제 토큰 소모량</strong>에서 헤르메스가 압도적 우위를 점하고 있습니다.
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              헤르메스 vs 오픈클로(OpenClaw) 심층 비교
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              아키텍처 지향점과 엔터프라이즈 도입 평가 기준
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-2.5 font-semibold">비교 기준</th>
                    <th className="py-2 px-2.5 font-bold text-blue-400">헤르메스 에이전트</th>
                    <th className="py-2 px-2.5 font-semibold text-slate-400">오픈클로 (OpenClaw)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-2.5 font-medium text-white">핵심 철학</td>
                    <td className="py-2.5 px-2.5 text-blue-300">자가 개선(Self-improving), 깊은 기억 축적</td>
                    <td className="py-2.5 px-2.5 text-slate-400">50+ 메신저 연동, 제어 평면 도달 범위</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2.5 font-medium text-white">언어 스택</td>
                    <td className="py-2.5 px-2.5 text-blue-300 font-mono">Python 3.11 + Rust uv</td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-400">TypeScript / Node.js</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2.5 font-medium text-white">일일 처리량</td>
                    <td className="py-2.5 px-2.5 text-emerald-400 font-bold tabular-nums">4,580억 토큰 (1위)</td>
                    <td className="py-2.5 px-2.5 text-slate-400 tabular-nums">1,730억 토큰</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2.5 font-medium text-white">기억 보존</td>
                    <td className="py-2.5 px-2.5 text-blue-300">FTS5 SQLite + SKILL.md 자동 작성</td>
                    <td className="py-2.5 px-2.5 text-slate-400">세션 맥락 저장 위주</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2.5 font-medium text-white">보안 격리</td>
                    <td className="py-2.5 px-2.5 text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      티리스(Tirith) 검증 (0건 CVE)
                    </td>
                    <td className="py-2.5 px-2.5 text-rose-400">CVSS 9.9 포함 9개 CVE 노출 이력</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            선택 가이드: 메신저 확장이 최우선이면 OpenClaw를, 지속 업무 수행과 에이전트 동화 능력이 필수라면 <span className="text-white font-semibold">Hermes Agent</span>를 권장합니다.
          </div>
        </div>
      </div>

      {/* Interactive Closed Learning Loop Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              폐쇄형 학습 루프(Closed Learning Loop) 인터랙티브 시뮬레이터
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              에이전트가 어떻게 경험으로부터 새로운 도구 지식을 획득하고 영구 보존하는지 확인해보세요.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>시뮬레이션 진행 중...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>학습 루프 시뮬레이션 실행</span>
              </>
            )}
          </button>
        </div>

        {/* Workflow Steps Horizontal Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {loopSteps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCurrent = simStep === stepNum;
            const isCompleted = simStep > stepNum;

            return (
              <div
                key={stepNum}
                className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-950/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : isCompleted
                    ? 'bg-slate-950/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {stepNum}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{step.component}</span>
                  </div>
                  <div className={`font-semibold mb-1 ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                    {step.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                {isCurrent && (
                  <div className="mt-3 pt-2 border-t border-blue-900/60 text-[10px] text-blue-300 font-mono animate-pulse">
                    ▶ 현재 처리 중...
                  </div>
                )}
                {isCompleted && (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400">
                    ✓ 완료 및 영구 반영
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { backendsData, memoryArchitectureTiers, BackendInfo } from '../data/hermesData';
import { CopyButton } from './CopyButton';
import { MemoryGraphD3 } from './MemoryGraphD3';
import { Layers, Server, Shield, Zap, Sparkles, Database, Check } from 'lucide-react';

export const BackendMemorySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBackend, setSelectedBackend] = useState<BackendInfo>(backendsData[0]);

  // Prompt Assembly Simulator state
  const [soulTone, setSoulTone] = useState<'concise' | 'pedantic' | 'security'>('concise');
  const [projectRules, setProjectRules] = useState<string>('- Next.js 15 App Router\n- Strict TypeScript\n- Zero Tailwind v3 legacy classes');
  const [userPreference, setUserPreference] = useState<string>('사용자는 한국어로 답변을 선호하며, 항상 코드 차이점(diff)을 먼저 요약하기를 원함.');

  const filteredBackends = selectedCategory === 'all'
    ? backendsData
    : backendsData.filter(b => b.category === selectedCategory);

  const getSimulatedPrompt = () => {
    let soulText = '';
    if (soulTone === 'concise') {
      soulText = '# [TIER 1: SOUL.md - Stable System Prompt]\nYou are Hermes, an autonomous engineering runtime. Prioritize brevity, correct terminal executions, and zero-bullshit code outputs.';
    } else if (soulTone === 'pedantic') {
      soulText = '# [TIER 1: SOUL.md - Stable System Prompt]\nYou are Hermes. Explain every architectural choice thoroughly before executing tools. Provide explicit test cases for edge conditions.';
    } else {
      soulText = '# [TIER 1: SOUL.md - Stable System Prompt]\nYou are Hermes with Strict Defense Protocol. Audit every file write and prompt directive via Tirith scanner before tool execution.';
    }

    const contextText = `# [TIER 2: CONTEXT TIER - Project Directives (.hermes.md / AGENTS.md)]\n# Verified by Tirith Security Scanner: [PASSED - 0 Injection Risk]\n${projectRules}`;

    const volatileText = `# [TIER 3: VOLATILE TIER - Recalled User State & FTS5 Memory]\n[User Profile (USER.md)]: ${userPreference}\n[Active Skills]: arxiv-researcher (v1.0), git-auto-committer (v2.1)\n[Recalled Memory]: SQLite FTS5 Match score=0.94 -> Previous workspace port conflict resolved on port 8787.`;

    return `${soulText}\n\n${contextText}\n\n${volatileText}\n\n# [PROMPT CACHE BREAKPOINT - Tier 1 & 2 Cached, Tier 3 Dynamically Injected]`;
  };

  return (
    <div className="space-y-8">
      {/* 7 Backends Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              7대 백엔드 터미널 실행 환경 비교 (BaseEnvironment)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              헤르메스는 런타임 추론 엔진과 실제 쉘/도구가 구동되는 샌드박스를 완벽히 분리합니다.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {['all', 'Local', 'Container', 'Cloud/Serverless', 'Research/HPC'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? '전체 보기 (7)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Backend Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBackends.map((backend) => {
            const isSelected = selectedBackend.id === backend.id;
            return (
              <div
                key={backend.id}
                onClick={() => setSelectedBackend(backend)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{backend.name}</span>
                    <span className="text-[11px] font-mono text-blue-400 font-semibold">{backend.speedRating}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{backend.desc}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                    <span>격리: <strong className="text-slate-200">{backend.isolationRating}</strong></span>
                    <span>비용: <strong className="text-slate-200">{backend.costTier}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-2 text-[11px] text-blue-400 flex items-center justify-between">
                  <span>설정 스니펫 보기</span>
                  <span>{isSelected ? '✓ 선택됨' : '클릭'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Backend Config Detail Box */}
        {selectedBackend && (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>{selectedBackend.name} 활성화 CLI 명령어</span>
              </div>
              <CopyButton text={selectedBackend.configSnippet} />
            </div>
            <pre className="text-xs font-mono text-blue-300 bg-slate-900 p-3 rounded-lg overflow-x-auto">
              {selectedBackend.configSnippet}
            </pre>
            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <span className="font-semibold text-emerald-400">장점 (Pros):</span>
                <ul className="text-slate-400 space-y-0.5 text-[11px] list-disc list-inside">
                  {selectedBackend.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-rose-400">주의사항 (Cons):</span>
                <ul className="text-slate-400 space-y-0.5 text-[11px] list-disc list-inside">
                  {selectedBackend.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-Tier Memory Architecture & Interactive Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            FTS5 SQLite 기반 3계층(3-Tier) 프롬프트 메모리 아키텍처
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            헤르메스는 매 요청마다 공급자 측의 <strong>프롬프트 캐싱(Prompt Caching)</strong> 효율을 최대화하고,
            동시에 프로젝트 규칙과 개인화 기억을 정밀하게 조합하기 위해 3개 계층으로 시스템 프롬프트를 구성합니다.
          </p>
        </div>

        {/* 3 Tiers Visual Stack */}
        <div className="space-y-3 text-xs">
          {memoryArchitectureTiers.map((tier) => (
            <div
              key={tier.tier}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold font-mono text-[11px] border border-blue-800">
                    {tier.tier}
                  </span>
                  <span className="font-bold text-white text-sm">{tier.name}</span>
                  <code className="text-[11px] text-blue-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                    {tier.file}
                  </code>
                </div>
                <div className="text-[11px] text-slate-400">
                  변경 빈도: <span className="text-slate-200">{tier.changeFrequency}</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">{tier.purpose}</p>

              <div className="pt-2 border-t border-slate-850 flex items-start gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold shrink-0">토큰 메커니즘:</span>
                <span>{tier.tokenBehavior}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive D3 Node Graph Visualization for 3-Tier Hierarchy */}
        <MemoryGraphD3 />

        {/* Live System Prompt Assembly Simulator */}
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>실시간 시스템 프롬프트 조립 시뮬레이터</span>
            </div>
            <CopyButton text={getSimulatedPrompt()} label="조립 프롬프트 복사" />
          </div>

          <div className="grid md:grid-cols-3 gap-3 text-xs">
            {/* Control 1 */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Tier 1: SOUL 성향 선택</label>
              <select
                value={soulTone}
                onChange={(e) => setSoulTone(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="concise">간결 &amp; 실용형 (Brevity Focused)</option>
                <option value="pedantic">상세 &amp; 설명형 (Pedantic &amp; Analytical)</option>
                <option value="security">엄격 보안 감사형 (Strict Tirith Defense)</option>
              </select>
            </div>

            {/* Control 2 */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Tier 2: 프로젝트 규칙 (.hermes.md)</label>
              <input
                type="text"
                value={projectRules}
                onChange={(e) => setProjectRules(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Control 3 */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Tier 3: 사용자 기억 (USER.md)</label>
              <input
                type="text"
                value={userPreference}
                onChange={(e) => setUserPreference(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Result Prompt Box */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 overflow-x-auto max-h-60 overflow-y-auto">
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {getSimulatedPrompt()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

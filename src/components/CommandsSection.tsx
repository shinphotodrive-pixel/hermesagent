import React, { useState, useRef, useEffect, useMemo } from 'react';
import { slashCommandsList, SlashCommand } from '../data/hermesData';
import { CopyButton } from './CopyButton';
import {
  Terminal,
  Search,
  Key,
  Command,
  Play,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CommandSimData {
  shellInput: string;
  output: string;
  mechanism: string;
  tokenImpact: string;
  bestPractice: string;
  variants?: { label: string; cmdArg: string; output: string }[];
}

const commandSimulations: Record<string, CommandSimData> = {
  '/new (또는 /reset)': {
    shellInput: 'hermes /new refactor-core --yes',
    output: `[Hermes Agent Session Initializer]
✓ Active memory buffer: flushed (24,180 tokens cleared)
✓ Generated Session UUID: ses_20261012_98bf1a
✓ Workspace root: /home/user/workspace
✓ Loaded Tier 1: SOUL.md (Cached 2,048 tokens)
✓ Loaded Tier 2: .hermes.md (Docker sandbox verified)
Agent Ready. Type your goal or query.`,
    mechanism: '현재 프로세스의 대화 기록을 SQLite session_history 테이블에 안전하게 영구 보존(Archive)한 뒤, 인메모리 컨텍스트 버퍼를 비웁니다.',
    tokenImpact: '컨텍스트 윈도우가 0으로 초기화되어 100% 여유 공간 확보. 이전 세션의 추론 편향(Hallucination Bias)을 원천 차단합니다.',
    bestPractice: '작업 주제가 완전히 바뀌었거나, 50턴 이상 장기 대화로 인해 에이전트의 응답 레이턴시가 증가했을 때 즉시 실행하세요.',
    variants: [
      {
        label: '기본 리셋',
        cmdArg: '/new --yes',
        output: `[Hermes Session Reset]\n✓ Cleared memory buffer.\n✓ Created session: ses_default_01\nReady for fresh task.`
      },
      {
        label: '이름 지정 세션 생성',
        cmdArg: '/new backend-auth --yes',
        output: `[Hermes Named Session Created]\n✓ Target workspace: backend-auth\n✓ Initialized clean Git branch context\n✓ Ready.`
      }
    ]
  },
  '/model': {
    shellInput: 'hermes /model anthropic/claude-3-5-sonnet',
    output: `[Model Switcher Protocol]
Target Endpoint: anthropic/claude-3-5-sonnet-20241022
✓ OpenRouter routing endpoint resolved
✓ Max Context Window: 200,000 tokens
✓ Provider Prompt Caching: ENABLED (Tier 1 & Tier 2 cached)
✓ Fallback Model: meta-llama/llama-3.3-70b-instruct
Active session context preserved (4,210 tokens retained).
New inferences will route through Claude 3.5 Sonnet.`,
    mechanism: '진행 중인 세션의 메시지 히스토리를 100% 유지한 채, LLM 추론 엔진과 API 파라미터(Temperature, Max Tokens)를 실시간 핫스왑합니다.',
    tokenImpact: '새 공급자의 프롬프트 캐시 규격에 맞추어 접두사(Prefix) 헤더가 재계산됩니다. Tier 1 SOUL.md는 즉시 캐시 재적중됩니다.',
    bestPractice: '초기 아키텍처 브레인스토밍은 저렴한 모델로 진행하고, 정밀 코드 리팩토링 시에 플래그십 코딩 모델로 스위칭하여 비용을 최대 80% 절감하세요.',
    variants: [
      {
        label: 'Claude 3.5 Sonnet',
        cmdArg: '/model anthropic/claude-3-5-sonnet',
        output: `[Model Switch: anthropic/claude-3-5-sonnet]\n✓ Context window: 200k tokens\n✓ Prompt caching: ENABLED\n✓ Code reasoning optimized.`
      },
      {
        label: 'Llama 3.3 70B (초고속)',
        cmdArg: '/model openrouter/meta-llama/llama-3.3-70b-instruct',
        output: `[Model Switch: meta-llama/llama-3.3-70b-instruct]\n✓ Max Tokens: 128k\n✓ High-speed streaming enabled\n✓ Cost tier: $0.12 / 1M tokens.`
      },
      {
        label: 'DeepSeek R1 (추론형)',
        cmdArg: '/model deepseek/deepseek-r1',
        output: `[Model Switch: deepseek/deepseek-r1]\n✓ Reasoning tokens: Visible chain-of-thought\n✓ Mathematical verification enabled.`
      }
    ]
  },
  '/goal': {
    shellInput: 'hermes /goal status',
    output: `[Goal Hierarchy Monitor]
Active Goal: "Migrate database schema from SQLite to PostgreSQL"
Status: IN_PROGRESS (Progress: 66%)
--------------------------------------------------
[✓] Phase 1: Inspect SQLite schema & tables (Completed)
[✓] Phase 2: Generate Drizzle migration files (Completed)
[▶] Phase 3: Run migration tests in Docker container (Running - PID 8941)
[ ] Phase 4: Verify foreign keys and integrity constraints (Pending)
--------------------------------------------------
Estimated remaining turns: 2 turns.
Autonomous loop will continue until all phases succeed.`,
    mechanism: '단일 턴으로 끝나지 않는 대규모 다단계 태스크를 분할하고, 하위 태스크 완료 여부를 에이전트 자율 판별 루프가 추적합니다.',
    tokenImpact: '목표 진행 큐(Goal Queue)가 시스템 프롬프트 휘발성 계층(Tier 3)에 콤팩트하게 주입되어 방황(Drift)을 방지합니다.',
    bestPractice: '5단계 이상의 복합 마이그레이션이나 대규모 리팩토링 시 등록하여 에이전트가 중도에 멈추지 않고 끝까지 완주하도록 지시하세요.',
    variants: [
      {
        label: '상태 조회 (status)',
        cmdArg: '/goal status',
        output: `[Goal Status]\nActive: "PostgreSQL Migration"\nProgress: 2/4 completed\nSubprocess: Nominal.`
      },
      {
        label: '일시 정지 (pause)',
        cmdArg: '/goal pause',
        output: `[Goal Suspended]\n✓ Saved execution checkpoint to SQLite.\n✓ Background sub-agents placed in sleep state.`
      },
      {
        label: '재개 (resume)',
        cmdArg: '/goal resume',
        output: `[Goal Resumed]\n✓ Loaded checkpoint: Phase 3\nContinuing autonomous execution.`
      }
    ]
  },
  '/compress': {
    shellInput: 'hermes /compress here 10',
    output: `[Context Compression Routine]
Scanning turns 1 to 24 (Initial tokens: 74,210 / 128,000)
✓ Extracted 5 architectural decisions & milestones
✓ Indexed 3 code snippets into SQLite FTS5 table: session_fts
✓ Generated dense semantic summary (420 tokens)
--------------------------------------------------
Context Size: 74,210 tokens -> 9,840 tokens (-86.7% reduction)
Prompt Cache Breakpoint: Updated
Session latency restored to <1.2s.`,
    mechanism: '과거 대화의 긴 코드 블록과 도구 표준 출력을 내부 LLM이 핵심 결정 요약문으로 압축하고, 원문은 SQLite FTS5로 아카이빙합니다.',
    tokenImpact: '컨텍스트 소비량을 즉각 80% 이상 줄여 컨텍스트 윈도우 오버플로우를 막고, 턴당 API 요금을 급격히 낮춥니다.',
    bestPractice: '장시간 디버깅으로 터미널 로그 출력이 쌓여 컨텍스트 윈도우가 60% 이상 도달했을 때 필수적으로 호출하세요.',
    variants: [
      {
        label: '최근 10턴 압축',
        cmdArg: '/compress here 10',
        output: `[Compression: 10 turns]\nCompressed 32,000 tokens to 1,200 tokens.\nFTS5 search index updated.`
      },
      {
        label: '특정 주제 집중 압축',
        cmdArg: '/compress focus "database schema"',
        output: `[Focused Compression]\nRetained DB schema decisions.\nPruned irrelevant package manager logs.`
      }
    ]
  },
  '/skills': {
    shellInput: 'hermes /skills browse',
    output: `[Hermes Skills Registry - agentskills.io]
Found 3 validated procedural skills:
1. arxiv-researcher (v1.0.0) [ACADEMIC]
   - Search & summarize academic arXiv papers via API.
2. docker-pruner (v1.2.0) [DEVOPS]
   - Prune dangling containers and reclaim host disk storage.
3. git-squash-merge (v2.0.0) [VCS]
   - Analyze diff and format semantic commit message.
Type '/skills install <name>' to activate in current runtime.`,
    mechanism: '공식 스킬 카탈로그 및 로컬 ~/.hermes/skills 디렉토리의 YAML 프론트매터 규격을 실시간 검증하고 목록을 렌더링합니다.',
    tokenImpact: '스킬 전체 본문이 아닌 경량 인덱스(이름, 설명)만 프롬프트에 상주하다가, 실제 도구 호출 시에만 본문이 동적 로드됩니다.',
    bestPractice: '반복적인 배포, 크롤링, 코드 리뷰 루틴이 필요할 때 새로운 스킬을 설치하거나 자체 SKILL.md를 합성하세요.',
    variants: [
      {
        label: '스킬 탐색 (browse)',
        cmdArg: '/skills browse',
        output: `[Catalog]\narxiv-researcher, docker-pruner, git-squash-merge, aws-s3-sync.`
      },
      {
        label: '스킬 설치 (install)',
        cmdArg: '/skills install arxiv-researcher',
        output: `[Installing Skill: arxiv-researcher]\n✓ Verified YAML frontmatter\n✓ Description: 58 chars (Valid)\n✓ Installed to ~/.hermes/skills/arxiv-researcher.`
      }
    ]
  },
  '/usage': {
    shellInput: 'hermes /usage',
    output: `[Real-Time Token & Cost Telemetry]
Session ID: ses_20261012_98bf1a (Duration: 42m 18s)
- Prompt Tokens: 42,850 (Cached: 36,400 / 84.9% Cache Hit)
- Completion Tokens: 3,120
- Total Tokens Processed: 45,970 tokens
- Estimated Session Cost: $0.0712 USD (Saved ~$0.48 via Caching)
- OpenRouter Balance: $48.20 USD (Remaining Credit)
- Rate Limits: 12 / 200 RPM (Nominal)`,
    mechanism: '클라이언트 세션 인스턴스가 누적 추적한 토큰 카운터와 공급자 API 응답 헤더(x-ratelimit, cost)를 합산하여 실시간 계산합니다.',
    tokenImpact: '추가적인 LLM API 호출 없이 로컬 세션 메타데이터에서 읽어오므로 토큰 소비가 0입니다.',
    bestPractice: '장시간 자동화 스크립트 실행 전후에 호출하여 비용 및 분당 요청 제한(RPM) 여유분을 점검하세요.'
  },
  '/yolo': {
    shellInput: 'hermes /yolo on',
    output: `[SECURITY WARNING: YOLO Mode ENGAGED]
! Human-in-the-loop confirmation modal has been BYPASSED.
! Commands like rm, mkfs, drop table will execute WITHOUT PROMPT.
! Fail-safe 300s timeout disabled.
Recommendation: Ensure you are running in Docker Sandbox backend.
Type '/yolo off' to restore Smart Approval Gates.`,
    mechanism: '티리스(Tirith) 스마트 승인 게이트의 대화형 확인(Human-in-the-loop) 인터럽트를 무시하고 비동기 자동 실행 플래그를 켭니다.',
    tokenImpact: '사용자 승인 대기 턴이 생략되어 불필요한 확인 대화 토큰 소모를 방지하고 처리 속도를 극대화합니다.',
    bestPractice: 'Docker 또는 Modal 등 격리된 컨테이너 샌드박스에서 신뢰할 수 있는 일괄 배치 작업을 돌릴 때만 사용하세요.',
    variants: [
      {
        label: 'YOLO 활성화 (on)',
        cmdArg: '/yolo on',
        output: `[YOLO: ON]\nHuman confirmation bypassed.\nDangerous commands execute automatically.`
      },
      {
        label: 'YOLO 비활성화 (off)',
        cmdArg: '/yolo off',
        output: `[YOLO: OFF]\nSmart Approval Gates restored.\nFail-closed 300s timeout active.`
      }
    ]
  },
  '/doctor': {
    shellInput: 'hermes /doctor --verbose',
    output: `[Hermes Doctor v0.21.0 System Health Audit]
============================================================
[✓] Python Runtime: Python 3.11.8 (/root/.hermes/bin/python)
[✓] Package Manager: uv 0.4.18 (Isolated Rust environment)
[✓] SQLite Database: ~/.hermes/hermes.db (FTS5 enabled, 64KB page)
[✓] Sandbox Backend: Docker (27.0.3, socket reachable)
[✓] Security Scanner: Tirith v1.4.2 (Zero CVE ruleset active)
[✓] Gateway Daemon: Telegram polling active (PID 14209)
[✓] API Key Status: OpenRouter & Anthropic connectivity OK (120ms)
============================================================
Health Score: 100% Nominal (All 7 subsystems operational)`,
    mechanism: '호스트 파일시스템, 패키지 매니저, 로컬 SQLite DB, 백엔드 컨테이너 소켓, 암호화 키 볼트의 무결성을 전수 진단합니다.',
    tokenImpact: '로컬 환경 진단 스크립트이므로 LLM API 토큰 소모가 0입니다.',
    bestPractice: '설치 직후 또는 네트워크 에러, 권한 거부 오류가 발생했을 때 가장 먼저 실행해야 하는 종합 진단 도구입니다.'
  },
  '/export': {
    shellInput: 'hermes /export markdown ./session_report.md',
    output: `[Session Trajectory Export]
Target Format: GitHub Flavored Markdown
Destination: /home/user/workspace/session_report.md
✓ Serialized 18 user turns, 24 tool executions, 4 bash logs
✓ Sanitized API keys and sensitive environment variables
File written successfully (14.2 KB). Ready to commit or share.`,
    mechanism: '현재 세션의 전체 실행 궤적(Trajectory), 도구 호출 입력값과 결과물을 지정한 포맷(Markdown/JSON)으로 직렬화하여 파일로 저장합니다.',
    tokenImpact: '토큰 소모 없음. 민감한 키값(API Keys)은 Tirith 마스커에 의해 자동 가려진 후 추출됩니다.',
    bestPractice: '복잡한 리팩토링이나 버그 수정 후 팀원에게 PR 설명문이나 결과 보고서로 공유할 때 활용하세요.',
    variants: [
      {
        label: '마크다운 내보내기',
        cmdArg: '/export markdown ./summary.md',
        output: `[Export Markdown]\nSaved formatted session report to ./summary.md.`
      },
      {
        label: 'JSON 원본 궤적 내보내기',
        cmdArg: '/export json ./trajectory.json',
        output: `[Export JSON]\nSaved complete raw tool trajectories to ./trajectory.json.`
      }
    ]
  }
};

export const CommandsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCommand, setActiveCommand] = useState<SlashCommand>(slashCommandsList[0]);
  const [activeSimulation, setActiveSimulation] = useState<CommandSimData>(
    commandSimulations[slashCommandsList[0].cmd] || commandSimulations['/model']
  );
  const [currentVariantOutput, setCurrentVariantOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const categories = ['all', '세션 관리', '모델/토큰', '작업/목표', '기억/스킬', '시스템/보안'];

  // Global keyboard shortcut to focus search input with '/' or 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
        }
        return;
      }

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time normalized filtering
  const filteredCommands = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const queryWithoutSlash = normalizedQuery.startsWith('/')
      ? normalizedQuery.slice(1)
      : normalizedQuery;

    return slashCommandsList.filter((cmd) => {
      const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!normalizedQuery) return true;

      const cmdText = cmd.cmd.toLowerCase();
      const paramText = cmd.param.toLowerCase();
      const descText = cmd.desc.toLowerCase();
      const tipsText = cmd.tips.toLowerCase();
      const exampleText = cmd.example.toLowerCase();
      const catText = cmd.category.toLowerCase();

      return (
        cmdText.includes(normalizedQuery) ||
        cmdText.includes(queryWithoutSlash) ||
        paramText.includes(normalizedQuery) ||
        descText.includes(normalizedQuery) ||
        tipsText.includes(normalizedQuery) ||
        exampleText.includes(normalizedQuery) ||
        catText.includes(normalizedQuery)
      );
    });
  }, [searchQuery, selectedCategory]);

  // Keyword highlighting helper
  const renderHighlighted = (text: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return text;

    const searchTarget = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    if (!searchTarget) return text;

    try {
      const escaped = searchTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-blue-500/35 text-blue-200 px-0.5 rounded font-semibold"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  const handleTestRun = (cmd: SlashCommand) => {
    setActiveCommand(cmd);
    const simData = commandSimulations[cmd.cmd] || {
      shellInput: `hermes ${cmd.cmd.split(' ')[0]}`,
      output: `[Executed ${cmd.cmd}]\nStatus: OK`,
      mechanism: '에이전트 런타임이 해당 명령어를 파싱하고 프로세스를 제어합니다.',
      tokenImpact: '명령어에 따라 토큰 컨텍스트를 최적화하거나 유지합니다.',
      bestPractice: cmd.tips
    };
    setActiveSimulation(simData);
    setCurrentVariantOutput(null);

    // Trigger execution flash
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      // Smooth scroll to terminal console
      terminalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 280);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleQuickKeyword = (kw: string) => {
    setSearchQuery(kw);
    searchInputRef.current?.focus();
  };

  const activeOutputText = currentVariantOutput || activeSimulation.output;

  return (
    <div className="space-y-8">
      {/* BYOK & Model Integrations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-400" />
          모델 연동 및 보안 키 관리 (BYOK)
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          헤르메스는 특정 폐쇄형 공급자에 종속되지 않으며, 사용자 소유의 API 키(Bring Your Own Key)를 통해
          OpenRouter, Anthropic, OpenAI, DeepSeek, Google Gemini 및 로컬 vLLM/Ollama 모델을 자유롭게 라우팅합니다.
        </p>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>인터랙티브 셋업</span>
              <code className="text-blue-400 font-mono text-[11px]">hermes setup</code>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              터미널 마법사 또는 웹 포털(<code className="text-blue-300 font-mono">hermes setup --portal</code>)을 통해
              OAuth 로그인 및 API 키를 안전하게 등록합니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>클로드 코드 CLI 플러그인</span>
              <span className="text-emerald-400 text-[11px]">Claude Pro/Max 연동</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Anthropic 공식 Claude Code CLI를 백엔드로 연동하여 구독 요금제 사용량을 그대로 공유하고
              토큰 추가 과금 없이 실행할 수 있습니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>보안 볼트 &amp; 암호화</span>
              <span className="text-indigo-400 text-[11px]">Bitwarden 지원</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              평문 <code className="text-blue-300 font-mono">.env</code> 저장 외에도 Bitwarden CLI 또는 시스템 키체인과
              연계하여 민감한 자격 증명을 암호화 저장합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Slash Commands Finder with Real-time Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Command className="w-5 h-5 text-blue-400" />
              핵심 슬래시(Slash) 명령어 실시간 검색 및 테스트 실행
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              각 명령어의 <strong className="text-blue-400">[Test Run]</strong> 버튼을 클릭하여 에이전트의 실제 콘솔 응답과 내부 메커니즘을 체험해보세요.
            </p>
          </div>

          {/* Real-time Search Input Box with Hotkey & Clear Button */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="명령어 검색 (단축키 '/' 또는 'Ctrl+K')"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />

            {/* Clear Button or Shortcut Hint */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="검색어 초기화"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded pointer-events-none">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar & Quick Keyword Suggestions */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? '전체 명령어' : cat}
                </button>
              ))}
            </div>

            {/* Real-time Match Count Metadata (Zero-Pill Discipline) */}
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>
                일치 결과: <strong className="text-white font-mono tabular-nums">{filteredCommands.length}</strong> / {slashCommandsList.length}개
              </span>
              {searchQuery && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <button
                    onClick={handleClearSearch}
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors text-[11px]"
                  >
                    필터 해제
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Keywords Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] text-slate-400">
            <span className="shrink-0 text-slate-500">추천 검색:</span>
            {[
              { label: '/model', kw: 'model' },
              { label: '압축 (compress)', kw: 'compress' },
              { label: '목표 (/goal)', kw: 'goal' },
              { label: '토큰 비용', kw: 'usage' },
              { label: '위험 모드 (yolo)', kw: 'yolo' },
              { label: '자가 진단', kw: 'doctor' },
              { label: '스킬', kw: 'skills' },
            ].map((item) => (
              <button
                key={item.kw}
                onClick={() => handleQuickKeyword(item.kw)}
                className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-slate-850 hover:text-slate-200 border border-slate-850 whitespace-nowrap shrink-0 transition-colors font-mono"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Commands Table with Live Highlighting & Explicit 'Test Run' Button */}
        <div className="overflow-x-auto bg-slate-950/80 rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3 font-semibold w-40">명령어</th>
                <th className="p-3 font-semibold w-44">매개변수</th>
                <th className="p-3 font-semibold">설명 &amp; 운영 가이드</th>
                <th className="p-3 font-semibold w-32 text-right">테스트 실행</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {filteredCommands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center space-y-3">
                    <div className="text-slate-400 text-sm">
                      '<strong className="text-white">{searchQuery}</strong>' 키워드와 일치하는 슬래시 명령어가 없습니다.
                    </div>
                    <p className="text-xs text-slate-500">
                      다른 검색어를 입력하거나 아래 버튼을 눌러 전체 목록으로 돌아가세요.
                    </p>
                    <button
                      onClick={handleClearSearch}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>검색어 초기화</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCommands.map((cmd) => {
                  const isActive = activeCommand.cmd === cmd.cmd;
                  return (
                    <tr
                      key={cmd.cmd}
                      className={`transition-colors ${
                        isActive ? 'bg-blue-950/30' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {renderHighlighted(cmd.cmd)}
                      </td>
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                        {renderHighlighted(cmd.param)}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="text-white font-medium">
                          {renderHighlighted(cmd.desc)}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-tight">
                          💡 <strong>팁:</strong> {renderHighlighted(cmd.tips)}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          예제: <code className="text-slate-400">{renderHighlighted(cmd.example)}</code>
                        </div>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleTestRun(cmd)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs ${
                            isActive
                              ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
                              : 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700'
                          }`}
                          title={`${cmd.cmd} 가상 실행`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Test Run</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dedicated Educational Simulated Terminal Console */}
        <div
          ref={terminalRef}
          className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl transition-all"
        >
          {/* Terminal Window Chrome Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-2">
              {/* Traffic light window controls */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                hermes-tui — zsh — v0.21.0
              </span>
            </div>

            {/* Current Active Command & Status */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-blue-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>{activeCommand.cmd}</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                ● SIMULATOR ACTIVE
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <CopyButton text={activeOutputText} label="출력 복사" />
            </div>
          </div>

          {/* Terminal Content Split Layout: Output Terminal + Educational Insight */}
          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Left: Terminal Output Screen */}
            <div className="lg:col-span-7 p-5 font-mono text-xs space-y-4 bg-black/40">
              {/* Prompt line */}
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400 font-semibold">hermes@node-1</span>
                <span>:</span>
                <span className="text-blue-400">~/workspace</span>
                <span className="text-slate-500">$</span>
                <span className="text-white font-bold">{activeSimulation.shellInput}</span>
                {isExecuting && (
                  <span className="w-2 h-4 bg-blue-500 animate-pulse inline-block"></span>
                )}
              </div>

              {/* Pre Output */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-850 overflow-x-auto">
                <pre className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-all">
                  {activeOutputText}
                </pre>
              </div>

              {/* Variant Switcher Chips (if available) */}
              {activeSimulation.variants && activeSimulation.variants.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] text-slate-400">파라미터 변경 테스트:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSimulation.variants.map((v) => {
                      const isSelected = currentVariantOutput === v.output;
                      return (
                        <button
                          key={v.label}
                          onClick={() => setCurrentVariantOutput(v.output)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Educational Mechanism Analysis Panel */}
            <div className="lg:col-span-5 p-5 space-y-4 bg-slate-950 text-xs">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>에이전트 내부 응답 메커니즘 분석</span>
              </div>

              {/* 1. Behind the scenes mechanism */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-850 space-y-1.5">
                <div className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>내부 런타임 동작 원리 (Mechanism)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeSimulation.mechanism}
                </p>
              </div>

              {/* 2. Token & Memory Impact */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-850 space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>토큰 및 메모리 계층 영향 (Token &amp; Cache)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeSimulation.tokenImpact}
                </p>
              </div>

              {/* 3. Best Practice & When to use */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-850 space-y-1.5">
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>엔지니어 권장 활용 시점 (When to use)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeSimulation.bestPractice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TUI Keyboard Shortcuts */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-200">
            ⌨️ TUI 콘솔 필수 키보드 단축키
          </div>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
              <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 font-mono rounded text-[11px] border border-slate-700">
                Ctrl + Enter
              </kbd>
              <span className="text-slate-300">여러 줄 개행 입력 (Multiline)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
              <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 font-mono rounded text-[11px] border border-slate-700">
                Ctrl + S
              </kbd>
              <span className="text-slate-300">현재 입력 임시 보류 (Stash)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
              <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 font-mono rounded text-[11px] border border-slate-700">
                Ctrl + T / F6
              </kbd>
              <span className="text-slate-300">백그라운드 작업 모니터 토글</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

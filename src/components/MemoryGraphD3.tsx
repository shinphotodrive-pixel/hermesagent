import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { CopyButton } from './CopyButton';
import { ZoomIn, ZoomOut, RotateCcw, Info, Sparkles, Shield, Database, Cpu, Play, Check } from 'lucide-react';

export interface MemoryNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  tier: 0 | 1 | 2 | 3;
  tierLabel: string;
  type: 'core' | 'hub' | 'leaf';
  path: string;
  frequency: string;
  mechanism: string;
  desc: string;
  sampleSnippet: string;
  color: string;
  radius: number;
}

export interface MemoryLink extends d3.SimulationLinkDatum<MemoryNode> {
  source: string | MemoryNode;
  target: string | MemoryNode;
  relation: string;
  tier: 1 | 2 | 3;
}

const rawNodes: MemoryNode[] = [
  // Core Assembler Node (Tier 0)
  {
    id: 'core_llm',
    name: 'LLM Context Assembler',
    tier: 0,
    tierLabel: 'Core Engine',
    type: 'core',
    path: 'runtime/prompt_assembler.py',
    frequency: '매 API 요청마다 실시간 결합',
    mechanism: '3개 계층의 프롬프트를 캐시 최적화 순서대로 정렬하여 LLM 토큰 윈도우로 공급',
    desc: 'Tier 1과 Tier 2를 프롬프트 캐시 경계 앞에 배치하고, Tier 3 휘발성 기억을 뒤쪽에 동적 주입하여 TTFT 레이턴시와 토큰 비용을 최소화합니다.',
    sampleSnippet: `[SYSTEM PROMPT SEQUENCE]\n1. Tier 1: SOUL.md (Cached Anchor)\n2. Tier 2: Project Rules (Tirith Verified)\n--- PROMPT CACHE BOUNDARY ---\n3. Tier 3: USER.md & FTS5 Relevant Recall\n4. Current Turn User Prompt`,
    color: '#38bdf8',
    radius: 34,
  },

  // Tier 1 Hub & Leaves (Stable Tier)
  {
    id: 'tier1_hub',
    name: 'Tier 1: 안정 계층 (Stable Tier)',
    tier: 1,
    tierLabel: 'Tier 1: Stable',
    type: 'hub',
    path: '~/.hermes/SOUL.md',
    frequency: '불변 (수개월간 유지)',
    mechanism: 'LLM 공급자측 Prompt Caching 100% 적중 (토큰 비용 최대 90% 절감)',
    desc: '에이전트의 불변 정체성, 핵심 윤리 원칙 및 도구 사용 철학이 정의되어 있는 최상위 기반 계층입니다.',
    sampleSnippet: `# SOUL OF HERMES\nYou are an autonomous learning runtime.\nAlways verify tool return code before proceeding.`,
    color: '#3b82f6',
    radius: 26,
  },
  {
    id: 't1_soul_md',
    name: 'SOUL.md',
    tier: 1,
    tierLabel: 'Tier 1: Stable',
    type: 'leaf',
    path: '~/.hermes/SOUL.md',
    frequency: '설치 시 생성 후 거의 불변',
    mechanism: '프롬프트 최상단에 상주하는 불변 자아 앵커',
    desc: '에이전트의 성격, 추론 스타일, 툴 콜 규약 등 핵심 행동 양식을 규정합니다.',
    sampleSnippet: `identity: "Hermes Autonomous Agent v0.21.0"\nreasoning_style: "Concise, verified, action-oriented"`,
    color: '#60a5fa',
    radius: 18,
  },
  {
    id: 't1_tool_philo',
    name: 'Tool Philosophy',
    tier: 1,
    tierLabel: 'Tier 1: Stable',
    type: 'leaf',
    path: 'core/runtime/tools.py',
    frequency: '코드 릴리스 단위',
    mechanism: '결정론적 도구 호출 안전 가이드라인',
    desc: '파괴적 명령어 사전 차단, 비동기 타임아웃 규칙, 출력 스트림 처리 원칙을 정의합니다.',
    sampleSnippet: `safety_rules:\n  - timeout_seconds: 300\n  - human_approval_for_delete: true`,
    color: '#60a5fa',
    radius: 18,
  },
  {
    id: 't1_cache_anchor',
    name: 'Prompt Cache Anchor',
    tier: 1,
    tierLabel: 'Tier 1: Stable',
    type: 'leaf',
    path: 'runtime/cache_provider.py',
    frequency: '불변',
    mechanism: 'OpenRouter & Anthropic 5-minute Prompt Cache 만료 방지',
    desc: '프롬프트의 접두사(Prefix) 일관성을 유지하여 첫 토큰 생성 속도(TTFT)를 70% 단축시킵니다.',
    sampleSnippet: `X-Cache-Control: "ephemeral"\nCache-Prefix-Tokens: 2,048`,
    color: '#60a5fa',
    radius: 17,
  },

  // Tier 2 Hub & Leaves (Context Tier)
  {
    id: 'tier2_hub',
    name: 'Tier 2: 컨텍스트 계층 (Context Tier)',
    tier: 2,
    tierLabel: 'Tier 2: Context',
    type: 'hub',
    path: './.hermes.md, ./AGENTS.md',
    frequency: '프로젝트 / 레포지토리 전환 시',
    mechanism: 'Tirith 보안 스캐너 사전 검증 후 주입',
    desc: '현재 프로젝트의 코딩 스타일, 빌드 명령어, 모노레포 구조 및 에이전트 간 협업 프로토콜을 규정합니다.',
    sampleSnippet: `# PROJECT DIRECTIVES\n- Language: TypeScript strict\n- Lint: tsc --noEmit && vite build`,
    color: '#818cf8',
    radius: 26,
  },
  {
    id: 't2_hermes_md',
    name: '.hermes.md',
    tier: 2,
    tierLabel: 'Tier 2: Context',
    type: 'leaf',
    path: './.hermes.md',
    frequency: '프로젝트 루트 설정',
    mechanism: '워크스페이스 로컬 환경 설정 자동 로드',
    desc: '로컬 빌드 스크립트, 패키지 매니저 종류, 디렉토리 구조 규칙을 지정합니다.',
    sampleSnippet: `build_command: "npm run build"\ndefault_branch: "main"\nsandbox: "docker"`,
    color: '#a5b4fc',
    radius: 18,
  },
  {
    id: 't2_agents_md',
    name: 'AGENTS.md',
    tier: 2,
    tierLabel: 'Tier 2: Context',
    type: 'leaf',
    path: './AGENTS.md',
    frequency: '멀티 에이전트 협업 시',
    mechanism: '서브에이전트 역할 분담 및 핸드오프 프로토콜',
    desc: '코드 리뷰어, QA 테스터, 문서 작성기 등 다중 에이전트 간 권한 경계를 정의합니다.',
    sampleSnippet: `agents:\n  - role: "architect"\n    can_edit_db_schema: true\n  - role: "frontend"\n    can_edit_ui: true`,
    color: '#a5b4fc',
    radius: 18,
  },
  {
    id: 't2_tirith_guard',
    name: 'Tirith Security Scanner',
    tier: 2,
    tierLabel: 'Tier 2: Context',
    type: 'leaf',
    path: 'security/tirith_guard.py',
    frequency: '외부 파일 주입 시 실시간',
    mechanism: '프롬프트 인젝션 재정의 차단 [BLOCKED: INJECTION]',
    desc: '외부 웹페이지나 리포지토리 파일에 숨겨진 악성 시스템 프롬프트 오버라이드를 원천 격리합니다.',
    sampleSnippet: `[Tirith Audit: CLEAN]\nScanned 3,420 tokens in .cursorrules -> 0 injection vectors found.`,
    color: '#c084fc',
    radius: 18,
  },

  // Tier 3 Hub & Leaves (Volatile Tier)
  {
    id: 'tier3_hub',
    name: 'Tier 3: 휘발성 계층 (Volatile Tier)',
    tier: 3,
    tierLabel: 'Tier 3: Volatile',
    type: 'hub',
    path: '~/.hermes/hermes.db & USER.md',
    frequency: '매 대화 턴마다 동적 갱신',
    mechanism: 'SQLite FTS5 BM25 전문 검색 동적 질의',
    desc: '축적된 사용자 선호도와 과거 세션 데이터베이스에서 현재 대화와 가장 연관된 상위 N개 청크만 실시간 인덱싱하여 주입합니다.',
    sampleSnippet: `# RECALLED EPISODES [FTS5 BM25]\nMatch #1 (Score: 0.96): Fixed port 8787 EADDRINUSE by fuser -k.`,
    color: '#10b981',
    radius: 26,
  },
  {
    id: 't3_user_md',
    name: 'USER.md',
    tier: 3,
    tierLabel: 'Tier 3: Volatile',
    type: 'leaf',
    path: '~/.hermes/USER.md',
    frequency: '사용자 피드백 수신 시',
    mechanism: '개인화 프로필 지속적 반영',
    desc: '사용자의 선호 언어(한국어), 응답 스타일(간결형), 선호하는 라이브러리 취향이 점진적으로 누적됩니다.',
    sampleSnippet: `user_persona:\n  preferred_language: "Korean"\n  diff_preference: "unified diff first"\n  timezone: "Asia/Seoul"`,
    color: '#34d399',
    radius: 18,
  },
  {
    id: 't3_sqlite_fts5',
    name: 'SQLite FTS5 Engine',
    tier: 3,
    tierLabel: 'Tier 3: Volatile',
    type: 'leaf',
    path: '~/.hermes/hermes.db (FTS5 Table)',
    frequency: '매 질의 시 마이크로초 단위 검색',
    mechanism: '결정론적 BM25 Full-Text Search (벡터 DB 불필요)',
    desc: '과거 대화 로그, 성공했던 트러블슈팅 사례를 수 밀리초 만에 찾아내어 프롬프트 윈도우에 주입합니다.',
    sampleSnippet: `SELECT session_id, snippet(session_fts, 2, '<b>', '</b>', '...', 10)\nFROM session_fts WHERE session_fts MATCH 'docker permission'\nORDER BY rank LIMIT 3;`,
    color: '#34d399',
    radius: 19,
  },
  {
    id: 't3_skills_registry',
    name: 'SKILL.md Registry',
    tier: 3,
    tierLabel: 'Tier 3: Volatile',
    type: 'leaf',
    path: '~/.hermes/skills/*/SKILL.md',
    frequency: '스킬 호출 시 동적 로드',
    mechanism: '자율 학습으로 합성된 절차적 스킬 인덱스',
    desc: '완벽 검증을 통과한 절차적 스킬들 중 현재 태스크에 필요한 스킬 절차만 취사선택하여 로드합니다.',
    sampleSnippet: `loaded_skills:\n  - arxiv-researcher (v1.0.0)\n  - docker-pruner (v1.2.0)`,
    color: '#34d399',
    radius: 18,
  },
];

const rawLinks: MemoryLink[] = [
  // Links to core assembler
  { source: 'tier1_hub', target: 'core_llm', relation: '프롬프트 캐싱 접두사 주입', tier: 1 },
  { source: 'tier2_hub', target: 'core_llm', relation: '티리스 보안 검증 컨텍스트 전달', tier: 2 },
  { source: 'tier3_hub', target: 'core_llm', relation: 'FTS5 동적 검색 조각 스트리밍', tier: 3 },

  // Tier 1 children
  { source: 't1_soul_md', target: 'tier1_hub', relation: '불변 자아 정의', tier: 1 },
  { source: 't1_tool_philo', target: 'tier1_hub', relation: '도구 안전 규약', tier: 1 },
  { source: 't1_cache_anchor', target: 'tier1_hub', relation: '캐시 접두사 고정', tier: 1 },

  // Tier 2 children
  { source: 't2_hermes_md', target: 'tier2_hub', relation: '워크스페이스 규칙', tier: 2 },
  { source: 't2_agents_md', target: 'tier2_hub', relation: '협업 에이전트 정의', tier: 2 },
  { source: 't2_tirith_guard', target: 'tier2_hub', relation: '인젝션 필터링', tier: 2 },

  // Tier 3 children
  { source: 't3_user_md', target: 'tier3_hub', relation: '개인화 선호도', tier: 3 },
  { source: 't3_sqlite_fts5', target: 'tier3_hub', relation: 'BM25 결정론적 회상', tier: 3 },
  { source: 't3_skills_registry', target: 'tier3_hub', relation: '절차적 스킬 로드', tier: 3 },
];

export const MemoryGraphD3: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTierFilter, setActiveTierFilter] = useState<0 | 1 | 2 | 3 | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<MemoryNode>(rawNodes[0]);
  const [layoutMode, setLayoutMode] = useState<'force' | 'radial'>('force');

  // Node lookup
  const nodesMap = useMemo(() => {
    const map = new Map<string, MemoryNode>();
    rawNodes.forEach(n => map.set(n.id, n));
    return map;
  }, []);

  // Zoom control refs
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for glowing drop shadows & markers
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers
    defs.append('marker')
      .attr('id', 'arrow-tier1')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#3b82f6');

    defs.append('marker')
      .attr('id', 'arrow-tier2')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#818cf8');

    defs.append('marker')
      .attr('id', 'arrow-tier3')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#10b981');

    // Clone data for simulation
    const currentNodes: MemoryNode[] = rawNodes.map(d => ({ ...d }));
    const currentLinks: MemoryLink[] = rawLinks.map(d => ({
      ...d,
      source: d.source,
      target: d.target,
    }));

    // Main graph group for zoom
    const g = svg.append('g').attr('class', 'graph-container');

    // Setup Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Simulation configuration
    let simulation: d3.Simulation<MemoryNode, MemoryLink>;

    if (layoutMode === 'radial') {
      // Set fixed concentric radial positions based on tier
      const centerX = width / 2;
      const centerY = height / 2;

      currentNodes.forEach((node) => {
        if (node.tier === 0) {
          node.fx = centerX;
          node.fy = centerY;
        } else if (node.type === 'hub') {
          const angles = { 1: -Math.PI / 2, 2: Math.PI / 6, 3: (5 * Math.PI) / 6 };
          const r = 110;
          const a = angles[node.tier as 1 | 2 | 3];
          node.fx = centerX + r * Math.cos(a);
          node.fy = centerY + r * Math.sin(a);
        } else {
          // Leaf nodes spaced around their hub
          const baseAngles = { 1: -Math.PI / 2, 2: Math.PI / 6, 3: (5 * Math.PI) / 6 };
          const baseA = baseAngles[node.tier as 1 | 2 | 3];
          const siblings = currentNodes.filter(n => n.tier === node.tier && n.type === 'leaf');
          const index = siblings.findIndex(s => s.id === node.id);
          const offset = (index - (siblings.length - 1) / 2) * 0.42;
          const r = 190;
          node.fx = centerX + r * Math.cos(baseA + offset);
          node.fy = centerY + r * Math.sin(baseA + offset);
        }
      });

      simulation = d3.forceSimulation<MemoryNode>(currentNodes)
        .force('link', d3.forceLink<MemoryNode, MemoryLink>(currentLinks).id(d => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-80));
    } else {
      // Dynamic force physics
      simulation = d3.forceSimulation<MemoryNode>(currentNodes)
        .force('link', d3.forceLink<MemoryNode, MemoryLink>(currentLinks).id(d => d.id).distance((d) => {
          if ((d.target as MemoryNode).tier === 0 || (d.source as MemoryNode).tier === 0) return 120;
          return 75;
        }))
        .force('charge', d3.forceManyBody().strength((d: any) => (d.tier === 0 ? -450 : d.type === 'hub' ? -280 : -140)))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius((d: any) => d.radius + 18));
    }

    // Render Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(currentLinks)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        if (d.tier === 1) return '#3b82f6';
        if (d.tier === 2) return '#818cf8';
        return '#10b981';
      })
      .attr('stroke-width', (d) => (d.target === 'core_llm' || (d.target as MemoryNode).id === 'core_llm' ? 2.5 : 1.5))
      .attr('stroke-opacity', (d) => {
        if (activeTierFilter === 'all') return 0.55;
        return d.tier === activeTierFilter ? 0.85 : 0.12;
      })
      .attr('stroke-dasharray', (d) => (d.tier === 1 ? 'none' : d.tier === 2 ? '4,3' : '2,2'))
      .attr('marker-end', (d) => `url(#arrow-tier${d.tier})`);

    // Render Nodes Group
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(currentNodes)
      .enter()
      .append('g')
      .attr('class', 'node-item cursor-pointer')
      .call(
        d3.drag<SVGGElement, MemoryNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            if (layoutMode !== 'radial') {
              d.fx = null;
              d.fy = null;
            }
          })
      );

    // Node Circle Outer Halo (Glow)
    node.append('circle')
      .attr('r', (d) => d.radius + 4)
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => (d.type === 'core' ? 3 : d.type === 'hub' ? 2 : 1))
      .attr('stroke-opacity', (d) => {
        if (activeTierFilter === 'all') return 0.4;
        return d.tier === activeTierFilter || d.tier === 0 ? 0.7 : 0.08;
      })
      .attr('filter', (d) => (d.type === 'core' ? 'url(#node-glow)' : 'none'));

    // Node Main Circle
    node.append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => (d.type === 'core' ? '#0f172a' : '#090d16'))
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => (d.type === 'core' ? 2.5 : 1.8))
      .attr('opacity', (d) => {
        if (activeTierFilter === 'all') return 1;
        return d.tier === activeTierFilter || d.tier === 0 ? 1 : 0.2;
      });

    // Node Center Icon / Indicator
    node.append('circle')
      .attr('r', (d) => (d.type === 'core' ? 8 : d.type === 'hub' ? 5 : 3))
      .attr('fill', (d) => d.color)
      .attr('opacity', (d) => {
        if (activeTierFilter === 'all') return 0.9;
        return d.tier === activeTierFilter || d.tier === 0 ? 0.9 : 0.2;
      });

    // Node Text Label
    node.append('text')
      .text((d) => d.name)
      .attr('dy', (d) => d.radius + 13)
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => (d.type === 'core' ? '12px' : d.type === 'hub' ? '10px' : '9px'))
      .attr('font-weight', (d) => (d.type === 'core' ? '700' : d.type === 'hub' ? '600' : '400'))
      .attr('fill', (d) => (d.type === 'core' ? '#38bdf8' : '#e2e8f0'))
      .attr('opacity', (d) => {
        if (activeTierFilter === 'all') return 1;
        return d.tier === activeTierFilter || d.tier === 0 ? 1 : 0.2;
      })
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 3px rgba(0,0,0,0.8)');

    // Node Click Handler
    node.on('click', (event, d) => {
      event.stopPropagation();
      setSelectedNode(d);

      // Highlight clicked node
      node.selectAll('circle')
        .attr('stroke-width', (n: any) => (n.id === d.id ? 4 : n.type === 'core' ? 2.5 : 1.8));
    });

    // Tick update
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [activeTierFilter, layoutMode]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 1.25);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 0.8);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            3계층 메모리 계층 구조 D3 인터랙티브 노드 그래프
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            헤르메스 에이전트의 <strong>안정적(Stable)</strong>, <strong>컨텍스트(Context)</strong>, <strong>휘발성(Volatile)</strong> 메모리가
            어떻게 LLM 컨텍스트 조립기(Context Assembler)로 스트리밍되는지 마우스로 드래그, 줌, 클릭하여 탐색하세요.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setLayoutMode('force')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                layoutMode === 'force' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              동적 포스 (Physics)
            </button>
            <button
              onClick={() => setLayoutMode('radial')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                layoutMode === 'radial' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              동심원 구조 (Radial)
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="확대 (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="축소 (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="뷰 초기화 (Reset)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tier Filter Segments */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => setActiveTierFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTierFilter === 'all'
              ? 'bg-slate-800 text-white font-semibold border border-slate-700'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
          }`}
        >
          전체 계층 뷰 (14개 노드)
        </button>

        <button
          onClick={() => setActiveTierFilter(1)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTierFilter === 1
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'bg-slate-950 text-blue-400 hover:text-blue-300 border border-slate-850'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Tier 1: 안정 계층 (SOUL.md &amp; 캐시)</span>
        </button>

        <button
          onClick={() => setActiveTierFilter(2)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTierFilter === 2
              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
              : 'bg-slate-950 text-indigo-400 hover:text-indigo-300 border border-slate-850'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          <span>Tier 2: 컨텍스트 계층 (Tirith 검증)</span>
        </button>

        <button
          onClick={() => setActiveTierFilter(3)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeTierFilter === 3
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-slate-850'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Tier 3: 휘발성 계층 (SQLite FTS5)</span>
        </button>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* D3 Canvas Container */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden min-h-[460px] flex items-center justify-center select-none"
        >
          <svg
            ref={svgRef}
            className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
          />

          {/* Canvas Overlay Legend */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs border border-slate-800 p-2.5 rounded-lg text-[10px] space-y-1 text-slate-300 pointer-events-none">
            <div className="font-semibold text-white mb-1">토큰 흐름 방향</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-blue-500"></span>
              <span>Tier 1 $\rightarrow$ 캐시 접두사 고정</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-indigo-500"></span>
              <span>Tier 2 $\rightarrow$ Tirith 보안 주입</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-emerald-500"></span>
              <span>Tier 3 $\rightarrow$ FTS5 동적 질의</span>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 pointer-events-none">
            * 노드를 클릭하여 세부 인스펙터를 확인하고 마우스로 드래그할 수 있습니다.
          </div>
        </div>

        {/* Interactive Node Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold font-mono border"
                style={{
                  color: selectedNode.color,
                  borderColor: selectedNode.color,
                  backgroundColor: `${selectedNode.color}15`,
                }}
              >
                {selectedNode.tierLabel}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedNode.type.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
              <code className="text-[11px] text-slate-400 font-mono mt-0.5 block break-all">
                {selectedNode.path}
              </code>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedNode.desc}
            </p>

            {/* Metrics */}
            <div className="space-y-2 pt-2 border-t border-slate-850 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 text-[11px] shrink-0">갱신 주기:</span>
                <span className="text-slate-200 text-[11px] font-medium text-right">
                  {selectedNode.frequency}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 text-[11px] shrink-0">토큰 메커니즘:</span>
                <span className="text-emerald-400 text-[11px] font-medium text-right">
                  {selectedNode.mechanism}
                </span>
              </div>
            </div>

            {/* Code / Prompt Snippet */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>실제 프롬프트 / 설정 스니펫:</span>
                <CopyButton text={selectedNode.sampleSnippet} label="복사" />
              </div>
              <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-blue-300 overflow-x-auto max-h-36 overflow-y-auto whitespace-pre-wrap select-all border border-slate-850">
                {selectedNode.sampleSnippet}
              </pre>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>선택한 노드는 그래프 시뮬레이션에서 중앙과 연결 상태를 유지합니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

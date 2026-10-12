export interface SlashCommand {
  cmd: string;
  param: string;
  category: '세션 관리' | '모델/토큰' | '작업/목표' | '기억/스킬' | '시스템/보안';
  desc: string;
  example: string;
  tips: string;
}

export interface TroubleItem {
  id: string;
  err: string;
  category: '설치/환경' | 'API/모델' | '게이트웨이' | '성능/메모리' | '보안/도커';
  cause: string;
  fix: string;
  codeSnippet?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  creator: string;
  level: '초급' | '중급' | '고급';
  duration: string;
  url: string;
  youtubeId: string;
  desc: string;
  highlights: string[];
  audience: string;
}

export interface BackendInfo {
  id: string;
  name: string;
  category: 'Local' | 'Container' | 'Cloud/Serverless' | 'Research/HPC';
  speedRating: '최고 속도' | '고속' | '중간';
  isolationRating: '최상' | '우수' | '격리 없음';
  costTier: '로컬 무료' | '초단위 과금' | '클라우드 비용';
  desc: string;
  pros: string[];
  cons: string[];
  configSnippet: string;
}

// Global Token Traffic Comparison
export const tokenTrafficData = {
  hermes: {
    name: '헤르메스 에이전트 (Hermes)',
    tokensBillion: 4580,
    sharePercent: 72.6,
    openRouterRank: '1위 (실제 트래픽 기준)',
    primaryRuntime: 'Python + Rust uv (고효율 비동기)',
    cveRecord: '0건 (Tirith 프롬프트 가드 내장)',
  },
  openClaw: {
    name: '오픈클로 (OpenClaw)',
    tokensBillion: 1730,
    sharePercent: 27.4,
    openRouterRank: '깃허브 스타 대비 실사용량 낮음',
    primaryRuntime: 'TypeScript / Node.js',
    cveRecord: 'CVSS 9.9 등 누적 9건 CVE 이력',
  }
};

// 7 Backends Data
export const backendsData: BackendInfo[] = [
  {
    id: 'local',
    name: '1. Local Backend',
    category: 'Local',
    speedRating: '최고 속도',
    isolationRating: '격리 없음',
    costTier: '로컬 무료',
    desc: '호스트 OS의 로컬 쉘과 파이썬 가상환경에서 직접 도구와 명령을 실행합니다. 파일 입출력 및 로컬 저장소 조작에 최적화되어 있습니다.',
    pros: ['네이티브 I/O로 레이턴시 0ms', '외부 의존성 및 컨테이너 오버헤드 없음', '로컬 IDE 및 파일과 완벽 연동'],
    cons: ['샌드박스 부재로 악성 프롬프트 인젝션 시 호스트 파일 위험', 'root 명령 실행 주의 필요'],
    configSnippet: 'hermes config set execution.backend "local"'
  },
  {
    id: 'docker',
    name: '2. Docker Backend',
    category: 'Container',
    speedRating: '고속',
    isolationRating: '최상',
    costTier: '로컬 무료',
    desc: '호스트 파일시스템을 읽기 전용으로 보호하고 전용 컨테이너 내에서 제한된 UID/GID로 도구를 격리 실행합니다.',
    pros: ['루트 파일시스템 읽기 전용 마운트', 'PID 수량 및 메모리 상한선 강제', '신뢰할 수 없는 스크립트 안전 실행'],
    cons: ['Docker 데몬 구동 필수', '호스트 볼륨 마운트 시 권한 매핑(-e WANTED_UID) 필요'],
    configSnippet: 'hermes config set execution.backend "docker"\nhermes config set execution.docker.image "ghcr.io/nousresearch/hermes-sandbox:latest"'
  },
  {
    id: 'ssh',
    name: '3. SSH Remote Backend',
    category: 'Local',
    speedRating: '중간',
    isolationRating: '우수',
    costTier: '클라우드 비용',
    desc: '원격 서버(AWS EC2, GCP Compute, 베어메탈 등)의 SSH 포트로 원격 쉘 명령을 송출하여 긴 빌드나 서버 인프라를 직접 제어합니다.',
    pros: ['로컬 리소스 소모 없이 원격 대규모 인프라 작업 가능', '키 기반 암호화 보안 세션 유지', '원격 서버 데몬 배포에 최적'],
    cons: ['SSH 키 관리 및 방화벽 포트 22 개방 필요', '네트워크 지연 시간에 따른 응답 시간 영향'],
    configSnippet: 'hermes config set execution.backend "ssh"\nhermes config set execution.ssh.host "ubuntu@192.168.1.100"\nhermes config set execution.ssh.key_path "~/.ssh/id_rsa"'
  },
  {
    id: 'modal',
    name: '4. Modal Serverless GPU',
    category: 'Cloud/Serverless',
    speedRating: '고속',
    isolationRating: '최상',
    costTier: '초단위 과금',
    desc: '유휴 상태 시 대기비용 $0로 유지되다가, 무거운 머신러닝 연산이나 크롤링 필요 시 1초 만에 클라우드 컨테이너가 부팅되어 작업 후 즉시 종료됩니다.',
    pros: ['서버 유지 관리 비용 0원', '필요 시 A100/H100 GPU 클라우드 즉시 활용', '초단위 정밀 과금으로 대규모 배치 비용 절감'],
    cons: ['Modal 계정 및 API Token 발급 필요', '콜드 스타트 약 1~2초 발생 가능'],
    configSnippet: 'hermes config set execution.backend "modal"\nhermes config set execution.modal.app_name "hermes-agent-worker"'
  },
  {
    id: 'daytona',
    name: '5. Daytona Cloud Workspace',
    category: 'Cloud/Serverless',
    speedRating: '고속',
    isolationRating: '최상',
    costTier: '초단위 과금',
    desc: '개발 환경 표준화 오케스트레이터인 Daytona를 통해 매 실행마다 완벽하게 초기화된 클린룸 컨테이너를 동적 프로비저닝합니다.',
    pros: ['매 작업마다 오염되지 않은 깨끗한 환경 보장', '팀 단위 표준 컨테이너 템플릿 배포 용이', '엔터프라이즈 감사 로그 완벽 추적'],
    cons: ['Daytona Server 엔드포인트 세팅 필요', '네트워크 대역폭 의존'],
    configSnippet: 'hermes config set execution.backend "daytona"\nhermes config set execution.daytona.workspace_template "python-standard"'
  },
  {
    id: 'singularity',
    name: '6. Singularity (Apptainer)',
    category: 'Research/HPC',
    speedRating: '최고 속도',
    isolationRating: '우수',
    costTier: '로컬 무료',
    desc: '루트 데몬(daemonless)이 없는 슈퍼컴퓨팅 및 연구소 HPC 환경용 컨테이너 백엔드로 일반 사용자 권한으로 즉시 구동됩니다.',
    pros: ['루트 권한 불필요 (HPC 클러스터 규정 준수)', 'MPI 및 GPU 다이렉트 패스스루 성능 우수', '학술 연구 및 과학 연산에 표준'],
    cons: ['SIF 컨테이너 이미지 사전 빌드 필요', '일반 데스크탑에서는 도커 대비 세팅 번거로움'],
    configSnippet: 'hermes config set execution.backend "singularity"\nhermes config set execution.singularity.sif_path "~/containers/hermes.sif"'
  },
  {
    id: 'vercel',
    name: '7. Vercel Sandbox',
    category: 'Cloud/Serverless',
    speedRating: '고속',
    isolationRating: '최상',
    costTier: '초단위 과금',
    desc: '웹 애플리케이션 및 Edge 함수 연동을 위한 초경량 샌드박스로 안전한 일회성 코드 스니펫 평가 및 웹 렌더링에 적합합니다.',
    pros: ['경량 엣지 런타임 호환', '즉각적인 마이크로 VM 격리', '웹훅 및 서버리스 라우팅 최적'],
    cons: ['장기 상주 프로세스나 대용량 디스크 I/O 작업 제한', 'Vercel 계정 토큰 필요'],
    configSnippet: 'hermes config set execution.backend "vercel-sandbox"'
  }
];

// Slash Commands
export const slashCommandsList: SlashCommand[] = [
  {
    cmd: '/new (또는 /reset)',
    param: '[name] --yes',
    category: '세션 관리',
    desc: '완전히 새로운 세션 ID와 빈 히스토리를 생성하여 대화를 새로 시작합니다.',
    example: '/new refactor-db --yes',
    tips: '이전 대화가 길어져 에이전트의 판단력이 흐려졌거나 새로운 태스크로 전환할 때 실행하세요.'
  },
  {
    cmd: '/model',
    param: '[provider:model]',
    category: '모델/토큰',
    desc: '현재 활성화된 세션의 추론 모델을 즉시 교체합니다. (컨텍스트 유지)',
    example: '/model anthropic/claude-3-5-sonnet',
    tips: '아이디어 구상이나 빠른 초안은 저렴한 모델로, 복잡한 리팩토링은 플래그십 모델로 스위칭하여 비용을 절감합니다.'
  },
  {
    cmd: '/goal',
    param: 'status | pause | resume | clear',
    category: '작업/목표',
    desc: '여러 턴에 걸친 장기 목표(Long-horizon goal)를 등록하고 상태를 추적합니다.',
    example: '/goal status',
    tips: '에이전트가 단일 턴에서 끝나지 않는 복합 다단계 작업을 수행할 때 진행 큐를 시각화합니다.'
  },
  {
    cmd: '/compress',
    param: 'here [N] | focus [주제]',
    category: '기억/스킬',
    desc: '오래된 대화를 내부 압축 요약하여 컨텍스트 윈도우 한계 초과를 방지하고 속도를 최적화합니다.',
    example: '/compress here 10',
    tips: '컨텍스트 윈도우가 80% 이상 차서 응답이 느려질 때 필수적으로 호출하세요.'
  },
  {
    cmd: '/skills',
    param: 'browse | install [name] | list',
    category: '기억/스킬',
    desc: '공식 스킬 카탈로그 및 agentskills.io에서 검증된 절차적 기억을 런타임에 검색/설치합니다.',
    example: '/skills install arxiv-researcher',
    tips: '설치된 스킬은 자동으로 검증기(Validator)를 통과한 후 에이전트의 Volatile Tier에 등록됩니다.'
  },
  {
    cmd: '/usage',
    param: '없음',
    category: '모델/토큰',
    desc: '누적 소모 토큰량, 예상 누적 비용($), 공급자 잔여 크레딧 및 분당 한도를 실시간 확인합니다.',
    example: '/usage',
    tips: '비용 초과를 방지하기 위해 장시간 작업 중간에 주기적으로 실행하세요.'
  },
  {
    cmd: '/yolo',
    param: 'on | off',
    category: '시스템/보안',
    desc: '위험한 명령어(rm, 파일 덮어쓰기 등) 실행 시 발생하는 사용자 승인 팝업을 건너뛰는 모드를 토글합니다.',
    example: '/yolo on',
    tips: '주의: 샌드박스(Docker) 환경이 아닌 Local 모드에서 사용 시 호스트 파일 삭제 위험이 있습니다.'
  },
  {
    cmd: '/doctor',
    param: '--verbose',
    category: '시스템/보안',
    desc: '시스템 환경, Python/uv 경로, 백엔드 데몬, API 키 유효성, SQLite FTS5 상태를 자가 점검합니다.',
    example: '/doctor',
    tips: '설치 직후 또는 오류 발생 시 가장 먼저 실행하는 무결성 진단 도구입니다.'
  },
  {
    cmd: '/export',
    param: '[markdown | json] [filepath]',
    category: '세션 관리',
    desc: '현재 세션의 전체 실행 로그, 도구 호출 이력, 최종 결과물을 파일로 추출합니다.',
    example: '/export markdown ./session_report.md',
    tips: '협업 팀원에게 에이전트의 작업 추론 궤적(Trajectory)을 공유할 때 유용합니다.'
  }
];

// Troubleshooting Data
export const troubleList: TroubleItem[] = [
  {
    id: 'not-found',
    err: 'hermes: command not found',
    category: '설치/환경',
    cause: '설치 스크립트 실행 후 쉘 환경변수(PATH)가 갱신되지 않았거나 ~/.hermes/bin 디렉토리가 미등록됨',
    fix: '현재 쉘에 환경변수를 반영하거나 프로필에 추가합니다.',
    codeSnippet: 'export PATH="$HOME/.hermes/bin:$PATH"\nsource ~/.bashrc  # (zsh 사용 시 source ~/.zshrc)'
  },
  {
    id: 'rate-limit',
    err: 'HTTP 429 Too Many Requests / Rate Limit Exceeded',
    category: 'API/모델',
    cause: '선택한 모델의 분당 요청수(RPM) 또는 일일 토큰 한도(TPM) 초과',
    fix: 'OpenRouter 또는 공급자 콘솔에서 크레딧 잔액을 확인하고 백업 모델로 세션을 변경합니다.',
    codeSnippet: '/model openrouter/meta-llama/llama-3.3-70b-instruct'
  },
  {
    id: 'model-404',
    err: 'HTTP 404 Model Not Found / Invalid Model String',
    category: 'API/모델',
    cause: '무료 티어 모델이 비활성화되었거나 모델명 형식 오타 (provider/model 슬래시 누락)',
    fix: 'hermes config에서 기본 fallback 모델을 재지정하거나 정확한 모델 식별자를 입력합니다.',
    codeSnippet: 'hermes config set llm.default_model "anthropic/claude-3-5-sonnet-20241022"'
  },
  {
    id: 'telegram-silent',
    err: 'Gateway: Telegram 봇이 메시지에 무응답',
    category: '게이트웨이',
    cause: '텔레그램 봇 토큰 오류 또는 allowed_users 목록에 본인의 텔레그램 고유 숫자 ID가 미등록됨',
    fix: '@userinfobot 대화로 확인한 본인의 숫자 ID를 allowed_users에 등록하고 게이트웨이를 재시작합니다.',
    codeSnippet: 'hermes config set messaging.telegram.allowed_users "[123456789]"\nhermes gateway restart'
  },
  {
    id: 'context-overflow',
    err: '메모리 과점유 / 응답 지연 / Context Window Exceeded',
    category: '성능/메모리',
    cause: '장기 세션 동안 누적된 코드 및 도구 출력 결과가 모델의 컨텍스트 창 크기에 근접함',
    fix: '/compress 명령어로 불필요한 과거 턴을 압축 요약하거나 FTS5 메모리로 내보냅니다.',
    codeSnippet: '/compress here 15'
  },
  {
    id: 'docker-perm',
    err: 'Docker 실행 시 Permission Denied (UID/GID 불일치)',
    category: '보안/도커',
    cause: '호스트 파일시스템 마운트 시 Docker 내부 컨테이너의 root UID(0)와 로컬 계정 권한 충돌',
    fix: '도커 실행 시 호스트의 UID 및 GID를 환경변수로 전달합니다.',
    codeSnippet: 'docker run -d -e WANTED_UID=$(id -u) -e WANTED_GID=$(id -g) \\\n  -v ~/.hermes:/home/hermeswebui/.hermes \\\n  -p 8787:8787 ghcr.io/nesquena/hermes-webui:latest'
  },
  {
    id: 'defender-block',
    err: 'Windows Native 설치 중 uv.exe 바이러스 오탐 차단',
    category: '설치/환경',
    cause: 'Windows Defender가 패키지 매니저 uv.exe를 알 수 없는 바이너리로 오탐지하여 실행 차단',
    fix: '관리자 권한 PowerShell에서 헤르메스 바이너리 디렉토리를 Defender 제외 항목에 추가합니다.',
    codeSnippet: 'Add-MpPreference -ExclusionPath "$env:LOCALAPPDATA\\hermes\\bin"'
  },
  {
    id: 'cron-silent',
    err: 'Cron 스케줄 자동화 작업이 지정 시간에 미수행됨',
    category: '게이트웨이',
    cause: '게이트웨이 백그라운드 데몬이 미실행 중이거나 태스크 프롬프트에 [SILENT] 태그가 적용되어 결과 송출 누락',
    fix: '게이트웨이 상태를 확인하고 데몬이 상시 가동 중인지 점검합니다.',
    codeSnippet: 'hermes gateway status\nhermes gateway logs --tail 50'
  }
];

// YouTube Videos Data
export const youtubeTutorials: YouTubeVideo[] = [
  {
    id: 'metics-beginner',
    title: '궁극의 초보자 가이드 (Ultimate Beginner Guide)',
    creator: 'Metics Media',
    level: '초급',
    duration: '24:18',
    url: 'https://www.youtube.com/watch?v=XNcKUSL1CTE',
    youtubeId: 'XNcKUSL1CTE',
    desc: '코딩 지식이 전혀 없는 입문자도 구글 드라이브, 텔레그램 연동 및 24시간 가동 인프라를 제로 베이스에서 완성할 수 있는 6단계 친절 튜토리얼입니다.',
    highlights: ['비전공자를 위한 원클릭 터미널 설치', '텔레그램 봇 토큰 생성 및 1:1 대화 연결', '구글 드라이브 문서 자동 동기화'],
    audience: 'AI 에이전트를 처음 접하는 일반 사용자 및 비개발자'
  },
  {
    id: 'metics-vps',
    title: '초보자를 위한 전체 설정 및 VPS 클라우드 배포',
    creator: 'Metics Media',
    level: '초급',
    duration: '28:45',
    url: 'https://www.youtube.com/watch?v=DYdvJCxWd6M',
    youtubeId: 'DYdvJCxWd6M',
    desc: '개인 PC를 켜둘 필요 없이 저렴한 Hostinger VPS 환경에 헤르메스를 원클릭 수준으로 배포하고, 월 유지 비용 분석 및 트러블슈팅 로그 읽는 법을 다룹니다.',
    highlights: ['Hostinger/Ubuntu VPS 원격 환경 세팅', '월 $4~6 수준의 가성비 인프라 구성', 'systemd 데몬을 활용한 무중단 가동'],
    audience: '상시 켜져 있는 24시간 자율 에이전트가 필요한 입문자'
  },
  {
    id: 'sharbel-31min',
    title: '31분 만에 배우는 헤르메스 에이전트 95%',
    creator: 'Sharbel A.',
    level: '중급',
    duration: '31:20',
    url: 'https://www.youtube.com/watch?v=Ta2wg6xPaY4',
    youtubeId: 'Ta2wg6xPaY4',
    desc: '핵심 슬래시 명령어의 실제 활용 철학, 사용자 정의 스킬(SKILL.md) 작성법, 그리고 Cron 기반 스케줄링 배치 작업을 압축 요약한 실전 강의입니다.',
    highlights: ['핵심 슬래시 명령어 실무 활용 꿀팁', '자체 절차적 기억 SKILL.md 작성 및 등록', '매일 아침 리서치 보고서를 보내는 Cron 자동화'],
    audience: 'CLI 환경에 익숙하고 자동화 파이프라인을 구축하려는 개발자'
  },
  {
    id: 'sharbel-fullsetup',
    title: '처음부터 구성하는 전체 설정 가이드',
    creator: 'Sharbel A.',
    level: '중급',
    duration: '26:50',
    url: 'https://www.youtube.com/watch?v=CcsgednSRfE',
    youtubeId: 'CcsgednSRfE',
    desc: '로컬 데스크탑 구동과 VPS 클라우드 운영 간의 장단점을 심층 비교하고, 최적 추론 모델 선택 전략 및 위험 작업 승인 게이트(Approval Gate) 구성법을 소개합니다.',
    highlights: ['Local vs Docker vs Remote VPS 장단점 비교', '작업 난이도별 최적 모델 라우팅 전략', '스마트 승인(Approval Gate) 보안 정책 커스텀'],
    audience: '보안과 비용의 균형을 맞춘 프로덕션 세팅을 원하는 엔지니어'
  },
  {
    id: 'python-simplified-cs',
    title: '실전 AI 고객 서비스 시스템 구축',
    creator: 'Python Simplified',
    level: '중급',
    duration: '35:12',
    url: 'https://www.youtube.com/watch?v=iDxBhPWF2RY',
    youtubeId: 'iDxBhPWF2RY',
    desc: '실제 기업 환경에서 24시간 무중단 고객 지원(CS) 및 문의 분류를 자동으로 수행하는 에이전트 시스템을 파이썬 스크립트와 결합하여 구축합니다.',
    highlights: ['비즈니스 정책 문서 주입 및 환각 방지', '접근 권한 격리 및 고객 개인정보 보호', 'OpenRouter 토큰 비용 절감 튜닝'],
    audience: '비즈니스 자동화 솔루션을 구축하려는 실무 개발자 및 창업자'
  },
  {
    id: 'tech-with-tim',
    title: '개발자 관점의 설정 및 시스템 연동 가이드',
    creator: 'Tech With Tim',
    level: '고급',
    duration: '42:05',
    url: 'https://www.youtube.com/watch?v=1ve4Atbqmoo',
    youtubeId: '1ve4Atbqmoo',
    desc: '에이전트 보안 위협 및 리스크 분석, TUI 내부의 복합 명령 파이프라인 제어, 실시간 웹 브라우징 도구 통합 및 음성 인터페이스(Voice Mode)를 연동합니다.',
    highlights: ['프롬프트 인젝션 방어(Tirith) 심층 분석', '헤들리스 브라우저 도구 자동화 연동', '음성 입출력(STT/TTS) 실시간 파이프라인'],
    audience: '풀스택 엔지니어, 보안 연구원 및 시스템 아키텍트'
  },
  {
    id: 'samin-yasar-masterclass',
    title: '3시간 풀 코스 빌드 및 서비스 패키징 마스터클래스',
    creator: 'Samin Yasar',
    level: '고급',
    duration: '3:05:40',
    url: 'https://www.youtube.com/watch?v=8yE6G1Lup1s',
    youtubeId: '8yE6G1Lup1s',
    desc: '다중 에이전트(Multi-agent) 시스템을 기획하고 SaaS 상용 서비스로 상품화하여 판매하는 엔드투엔드 전략 및 장기 메모리 큐레이션 기법을 총망라합니다.',
    highlights: ['Multi-Agent 협업 오케스트레이션 아키텍처', '헤르메스 기반 상용 B2B SaaS 패키징', 'SQLite FTS5 벡터 하이브리드 메모리 최적화'],
    audience: 'AI 스타트업 창업자, 테크 리드 및 시니어 아키텍트'
  }
];

// Memory 3-Tier Structure Reference
export const memoryArchitectureTiers = [
  {
    tier: 'Tier 1',
    name: '안정적 계층 (Stable Tier)',
    file: 'SOUL.md',
    changeFrequency: '거의 변경되지 않음 (불변에 가까움)',
    purpose: '에이전트의 근본 정체성, 도구 사용 철학, 행동 원칙 정의',
    tokenBehavior: 'LLM 공급자 측의 프롬프트 캐싱(Prompt Caching)을 100% 활용하여 비용 절감 및 첫 토큰 응답 속도(TTFT) 극대화',
    exampleExcerpt: '# SOUL OF HERMES\nYou are an autonomous learning runtime. Prioritize precision, tool accuracy, and safe execution...'
  },
  {
    tier: 'Tier 2',
    name: '컨텍스트 계층 (Context Tier)',
    file: '.hermes.md / AGENTS.md / .cursorrules',
    changeFrequency: '프로젝트 또는 워크스페이스 단위 변경',
    purpose: '현재 작업 디렉토리의 코딩 컨벤션, 빌드 스크립트, 프로젝트 도메인 규칙',
    tokenBehavior: '티리스(Tirith) 보안 모듈이 사전 스캔하여 명령 재정의나 탈옥 시도가 감지되면 무력화 후 프롬프트에 주입',
    exampleExcerpt: '# PROJECT CONVENTIONS\n- TypeScript strict mode enabled\n- Run npm run lint before completing task...'
  },
  {
    tier: 'Tier 3',
    name: '휘발성 계층 (Volatile Tier)',
    file: 'USER.md / MEMORY.md / Skills',
    changeFrequency: '매 턴마다 동적 변경',
    purpose: '대화 중 축적된 사용자 선호도, FTS5 검색으로 불러온 과거 대화 스니펫, 로드된 스킬 인덱스',
    tokenBehavior: '현재 질의어와 가장 연관된 상위 N개 청크만 FTS5 BM25 알고리즘으로 동적 선별 주입하여 토큰 낭비 방지',
    exampleExcerpt: '# RECALLED MEMORY [SQLite FTS5]\nUser prefers concise diffs. Previous issue: port 3000 collision resolved by kill -9...'
  }
];

import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { Send, FileCode, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const TelegramSkillsSection: React.FC = () => {
  // Telegram Config Helper State
  const [tgToken, setTgToken] = useState('1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ');
  const [tgUserId, setTgUserId] = useState('987654321');

  // SKILL.md Studio State
  const [skillName, setSkillName] = useState('arxiv-researcher');
  const [skillVersion, setSkillVersion] = useState('1.0.0');
  const [skillDesc, setSkillDesc] = useState('Search and summarize academic papers from arXiv.');
  const [skillProcedure, setSkillProcedure] = useState('1. Query arXiv API using curl.\n2. Extract title, abstract, and PDF link using python script.');
  const [skillPitfalls, setSkillPitfalls] = useState('- API limits requests; handle HTTP 429 retries.\n- Always sanitize paper URLs.');
  const [selectedTemplate, setSelectedTemplate] = useState<'arxiv' | 'docker' | 'git'>('arxiv');

  // SKILL.md strict rules validation
  const descLength = skillDesc.trim().length;
  const hasTrailingPeriod = skillDesc.trim().endsWith('.');
  const isLengthValid = descLength > 0 && descLength <= 60;
  const isSkillValid = isLengthValid && hasTrailingPeriod && skillName.trim().length > 0;

  const loadTemplate = (tmpl: 'arxiv' | 'docker' | 'git') => {
    setSelectedTemplate(tmpl);
    if (tmpl === 'arxiv') {
      setSkillName('arxiv-researcher');
      setSkillVersion('1.0.0');
      setSkillDesc('Search and summarize academic papers from arXiv.');
      setSkillProcedure('1. Query arXiv API using curl.\n2. Extract title, abstract, and PDF link using python script.');
      setSkillPitfalls('- API limits requests; handle HTTP 429 retries.\n- Always sanitize paper URLs.');
    } else if (tmpl === 'docker') {
      setSkillName('docker-pruner');
      setSkillVersion('1.2.0');
      setSkillDesc('Prune dangling images and reclaim disk storage.');
      setSkillProcedure('1. Check disk usage via docker system df.\n2. Execute docker image prune -a with safety flags.');
      setSkillPitfalls('- Never prune named volume volumes without explicit backup.\n- Verify container statuses first.');
    } else {
      setSkillName('git-conventional-commit');
      setSkillVersion('2.0.0');
      setSkillDesc('Analyze git diff and draft semantic commit message.');
      setSkillProcedure('1. Run git status and git diff --staged.\n2. Format commit message according to Conventional Commits.');
      setSkillPitfalls('- Exclude sensitive .env files from staging.\n- Keep first commit line under 72 characters.');
    }
  };

  const generatedSkillMd = `---
name: ${skillName}
version: ${skillVersion}
description: ${skillDesc}
---
# ${skillName} Skill

## When to Use
Use when required to execute this procedural routine.

## Procedure
${skillProcedure}

## Pitfalls
${skillPitfalls}

## Verification Checklist
- [ ] Requirements checked and validated.
- [ ] Safe execution in sandbox verified.`;

  const getTelegramSetupCommands = () => {
    return `# 1. 환경변수 파일에 텔레그램 토큰 기입 (따옴표 제외)
echo "TELEGRAM_BOT_TOKEN=${tgToken}" >> ~/.hermes/.env

# 2. 본인 텔레그램 ID를 허용 사용자(Allowlist)로 등록
hermes config set messaging.telegram.allowed_users "[${tgUserId}]"

# 3. 텔레그램 게이트웨이 유효성 검증
hermes gateway setup

# 4. 백그라운드 게이트웨이 데몬 가동
hermes gateway start

# 5. 상태 확인
hermes gateway status`;
  };

  return (
    <div className="space-y-8">
      {/* 5-Step Telegram Setup Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            텔레그램 메신저 게이트웨이 5단계 연동 가이드
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            헤르메스 에이전트를 모바일 스마트폰 텔레그램과 연동하면, 이동 중에도 언제 어디서나 음성/텍스트로 장기 과제를 지시하고 보고받을 수 있습니다.
          </p>
        </div>

        {/* 5 Step Cards */}
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              1
            </span>
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">BotFather 통해 공식 봇 생성</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                텔레그램 앱에서 <code className="text-blue-400 font-mono">@BotFather</code> 검색 후 대화 시작 → <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">/newbot</code> 입력 → 봇 이름과 사용자명을 입력하고 발급되는 긴 API Token을 복사합니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              2
            </span>
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">그룹 채팅 시 프라이버시 해제 (Privacy Mode OFF)</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                봇을 팀 단체방에 초대하여 모든 메시지의 맥락을 파악하게 하려면, BotFather에게 <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">/setprivacy off</code>를 지시하여 프라이버시 모드를 끕니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              3
            </span>
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">사용자 ID 확인 및 보안 화이트리스트 등록</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                모르는 외부인이 내 에이전트 봇에 명령을 내리지 못하도록 차단해야 합니다. 텔레그램에서 <code className="text-blue-400 font-mono">@userinfobot</code>과 대화하여 본인의 고유 숫자 ID(예: 987654321)를 확인합니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              4
            </span>
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">환경변수 파일 등록 (.env)</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">~/.hermes/.env</code> 파일에 <code className="text-blue-300 font-mono">TELEGRAM_BOT_TOKEN=토큰값</code> 형식으로 저장합니다. (따옴표를 붙이지 마세요!)
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              5
            </span>
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">게이트웨이 검증 및 백그라운드 데몬 가동</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">hermes gateway setup</code>으로 검증하고, <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">hermes gateway start</code>로 백그라운드 서비스를 시작합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Telegram Setup Script Helper */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>텔레그램 맞춤 설정 스크립트 생성</span>
            </span>
            <CopyButton text={getTelegramSetupCommands()} label="설정 명령어 전체 복사" />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px]">발급받은 Bot Token:</label>
              <input
                type="text"
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px]">본인의 Telegram 숫자 ID:</label>
              <input
                type="text"
                value={tgUserId}
                onChange={(e) => setTgUserId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <pre className="text-xs font-mono text-blue-300 bg-slate-900 p-3 rounded-lg overflow-x-auto select-all">
            {getTelegramSetupCommands()}
          </pre>
        </div>
      </div>

      {/* SKILL.md Studio & Strict Live Validator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              절차적 기억 스킬(SKILL.md) 스튜디오 &amp; 엄격 검증기
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              헤르메스가 자체적으로 학습하거나 사용자가 주입하는 표준 SKILL.md 포맷 규칙을 실시간 검증합니다.
            </p>
          </div>

          {/* Template Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => loadTemplate('arxiv')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedTemplate === 'arxiv' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              arXiv 논문
            </button>
            <button
              onClick={() => loadTemplate('docker')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedTemplate === 'docker' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              도커 정리
            </button>
            <button
              onClick={() => loadTemplate('git')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedTemplate === 'git' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Git 커밋
            </button>
          </div>
        </div>

        {/* Validator Status Indicator */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
            isSkillValid
              ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
              : 'bg-rose-950/30 border-rose-800/80 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isSkillValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span className="font-semibold">
              {isSkillValid
                ? '공식 헤르메스 스킬 검증기(Validator) 통과 완료'
                : '스킬 검증 실패: 아래 검증 규칙을 확인하세요'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>
              description 길이:{' '}
              <strong className={isLengthValid ? 'text-emerald-400' : 'text-rose-400'}>
                {descLength}/60자
              </strong>
            </span>
            <span>
              마침표(.) 포함 여부:{' '}
              <strong className={hasTrailingPeriod ? 'text-emerald-400' : 'text-rose-400'}>
                {hasTrailingPeriod ? '통과' : '누락됨'}
              </strong>
            </span>
          </div>
        </div>

        {/* Input Form & Preview Split */}
        <div className="grid lg:grid-cols-2 gap-6 text-xs">
          {/* Inputs */}
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold text-[11px]">스킬 이름 (name):</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold text-[11px]">버전 (version):</label>
                <input
                  type="text"
                  value={skillVersion}
                  onChange={(e) => setSkillVersion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-semibold text-[11px]">
                  설명 (description - 최대 60자, 마침표 필수):
                </label>
                <span className={`text-[10px] font-mono ${descLength <= 60 ? 'text-slate-400' : 'text-rose-400'}`}>
                  {descLength}/60
                </span>
              </div>
              <input
                type="text"
                value={skillDesc}
                onChange={(e) => setSkillDesc(e.target.value)}
                className={`w-full bg-slate-900 border rounded-lg p-2 text-white focus:outline-none ${
                  isLengthValid && hasTrailingPeriod ? 'border-slate-800 focus:border-blue-500' : 'border-rose-500'
                }`}
              />
              <p className="text-[10px] text-slate-500">
                * 공식 검증기 규칙: 마케팅 미사여구 배제, 단일 문장, 문장 끝 온점(.) 필수.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold text-[11px]">실행 절차 (Procedure):</label>
              <textarea
                rows={3}
                value={skillProcedure}
                onChange={(e) => setSkillProcedure(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold text-[11px]">주의사항 &amp; 함정 (Pitfalls):</label>
              <textarea
                rows={2}
                value={skillPitfalls}
                onChange={(e) => setSkillPitfalls(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Code Preview */}
          <div className="space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>최종 합성된 SKILL.md 코드:</span>
              <CopyButton text={generatedSkillMd} label="SKILL.md 복사" />
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-blue-300 leading-relaxed overflow-x-auto flex-grow select-all">
              {generatedSkillMd}
            </pre>
            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-850 text-[11px] text-slate-400">
              📁 저장 위치: <code className="text-blue-400 font-mono">~/.hermes/skills/{skillName}/SKILL.md</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { troubleList, TroubleItem } from '../data/hermesData';
import { CopyButton } from './CopyButton';
import { ShieldCheck, Wrench, Search, AlertTriangle, Stethoscope, Terminal, CheckCircle2 } from 'lucide-react';

export const SecurityTroubleSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [doctorRunning, setDoctorRunning] = useState(false);
  const [doctorResult, setDoctorResult] = useState<string | null>(null);

  const categories = ['all', '설치/환경', 'API/모델', '게이트웨이', '성능/메모리', '보안/도커'];

  const filteredTrouble = troubleList.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.err.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fix.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const runDoctorSim = () => {
    setDoctorRunning(true);
    setDoctorResult(null);
    setTimeout(() => {
      setDoctorRunning(false);
      setDoctorResult(`[HERMES DOCTOR - DIAGNOSTIC REPORT]
=========================================
[1/6] Python Environment: Python 3.11.8 (/root/.hermes/bin/python) -> OK
[2/6] Package Manager: uv 0.4.18 (Isolated, Rust-backed) -> OK
[3/6] SQLite Storage: ~/.hermes/hermes.db (FTS5 enabled, 48 pages) -> OK
[4/6] Execution Sandbox: Docker Daemon accessible -> OK
[5/6] Tirith Security Filter: Active (v1.4.2 ruleset) -> OK
[6/6] Telegram Gateway: Running on PID 14209 -> OK
=========================================
Diagnostic Status: ALL SYSTEMS NOMINAL (0 Errors, 0 Warnings)`);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Enterprise Security Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          엔터프라이즈 보안 및 티리스(Tirith) 프롬프트 인젝션 방어
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          헤르메스는 자율 에이전트 도입 시 가장 큰 위협인 원격 프롬프트 인젝션, 위험 명령어 탈취 및 데이터 유출을 방어하기 위해
          3중 보안 방어벽을 기본 탑재하고 있습니다.
        </p>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>스마트 승인 게이트</span>
              <span className="text-amber-400 font-mono text-[11px]">Fail-Closed</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              <code className="text-rose-400 font-mono">rm -rf</code>, 파일 덮어쓰기, 시스템 설정 변경 등 위험도가 높은 작업은 
              300초 타임아웃 팝업으로 사용자 승인을 요구하며 응답 부재 시 안전하게 차단됩니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>티리스(Tirith) 인젝션 가드</span>
              <span className="text-emerald-400 font-mono text-[11px]">0건 CVE 기록</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              외부 웹페이지나 파일 내부에 숨겨진 시스템 지시문 재정의 시도를 실시간 탐지하여 
              <code className="text-blue-300 font-mono">[BLOCKED: INJECTION]</code> 태그로 대체합니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Regolo AI 유럽 주권 클라우드</span>
              <span className="text-blue-400 font-mono text-[11px]">ZDR 준수</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              EU GDPR 및 민감 엔터프라이즈 규정을 충족하는 Zero Data Retention(데이터 미보관) 유럽 서버 연동을 지원하여 기업 자산 유출을 원천 방지합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Troubleshooting Diagnostic Search Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-400" />
              자가 진단 트러블슈팅 데이터베이스
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              에러 메시지나 이상 증상을 검색하면 원인 분석과 즉각적인 복구 조치 방안을 제시합니다.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="에러 메시지 검색 (예: 429, not found, docker...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
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
              {cat === 'all' ? '전체 오류 항목' : cat}
            </button>
          ))}
        </div>

        {/* Troubleshooting Table */}
        <div className="overflow-x-auto bg-slate-950/80 rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3 font-semibold w-56">발생 현상 &amp; 오류 메시지</th>
                <th className="p-3 font-semibold w-64">원인 분석</th>
                <th className="p-3 font-semibold">트러블슈팅 조치 방안</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {filteredTrouble.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    일치하는 오류 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTrouble.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 align-top font-mono font-bold text-rose-400">
                      {item.err}
                    </td>
                    <td className="p-3 align-top text-slate-400 leading-relaxed text-[11px]">
                      {item.cause}
                    </td>
                    <td className="p-3 align-top space-y-2">
                      <div className="text-white font-medium text-[11px] leading-relaxed">
                        {item.fix}
                      </div>
                      {item.codeSnippet && (
                        <div className="relative group">
                          <pre className="p-2.5 bg-slate-900 rounded-lg text-[11px] font-mono text-blue-300 overflow-x-auto">
                            {item.codeSnippet}
                          </pre>
                          <div className="mt-1 flex justify-end">
                            <CopyButton text={item.codeSnippet} label="명령어 복사" />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Interactive Hermes Doctor Runner */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>시스템 무결성 자동 진단 (hermes doctor)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                파이썬, uv, 백엔드 컨테이너 및 텔레그램 데몬의 작동 상태를 즉각 시뮬레이션 진단합니다.
              </p>
            </div>

            <button
              onClick={runDoctorSim}
              disabled={doctorRunning}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                doctorRunning
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{doctorRunning ? '진단 진행 중...' : 'hermes doctor 실행'}</span>
            </button>
          </div>

          {doctorResult && (
            <pre className="p-3.5 bg-slate-900 rounded-lg text-xs font-mono text-emerald-400 border border-slate-850 overflow-x-auto whitespace-pre-wrap">
              {doctorResult}
            </pre>
          )}

          <div className="pt-2 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>실시간 에러 로그 추적 커맨드:</span>
            <div className="flex items-center gap-2">
              <code className="text-blue-400 font-mono bg-slate-900 px-2 py-0.5 rounded">
                hermes logs errors --since 30m -f
              </code>
              <CopyButton text="hermes logs errors --since 30m -f" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { youtubeTutorials, YouTubeVideo } from '../data/hermesData';
import { Youtube, ExternalLink, Play, Search, Clock, User, CheckCircle, BookOpen } from 'lucide-react';

export const YouTubeHubSection: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<'all' | '초급' | '중급' | '고급'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const filteredVideos = youtubeTutorials.filter((video) => {
    const matchesLevel = levelFilter === 'all' || video.level === levelFilter;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header & Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Youtube className="w-5 h-5 text-rose-500" />
          헤르메스 에이전트 추천 유튜브 학습 센터
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          헤르메스 에이전트의 제로 베이스 셋업부터 스킬(SKILL.md) 최적화, 24시간 고객 응대 자동화, 그리고 B2B SaaS 패키징까지
          단계별로 깊이 있게 마스터할 수 있는 글로벌 전문가들의 엄선된 시청각 튜토리얼입니다.
        </p>

        {/* Analytics & Filter Controls */}
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Donut Chart / Level Breakdown */}
          <div className="lg:col-span-5 bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* 초급: 2/7 = 28.57% */}
                <path
                  className="text-blue-500"
                  strokeDasharray="28.57, 100"
                  strokeDashoffset="0"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* 중급: 3/7 = 42.86% */}
                <path
                  className="text-purple-500"
                  strokeDasharray="42.86, 100"
                  strokeDashoffset="-28.57"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* 고급: 2/7 = 28.57% */}
                <path
                  className="text-amber-500"
                  strokeDasharray="28.57, 100"
                  strokeDashoffset="-71.43"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-bold text-white tabular-nums">7개</span>
                <span className="block text-[9px] text-slate-400">강좌</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-white text-[11px] mb-1">난이도별 분포 비중</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                <span className="text-slate-300">입문/초급: <strong>2개</strong> (28.6%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                <span className="text-slate-300">중급/실무: <strong>3개</strong> (42.8%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                <span className="text-slate-300">고급/비즈니스: <strong>2개</strong> (28.6%)</span>
              </div>
            </div>
          </div>

          {/* Filter Controls & Search */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'all', label: '전체 (7)' },
                  { id: '초급', label: '입문/초급 (2)' },
                  { id: '중급', label: '중급/실무 (3)' },
                  { id: '고급', label: '고급/비즈니스 (2)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setLevelFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      levelFilter === tab.id
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="강의명, 크리에이터..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              💡 카드의 <strong className="text-rose-400">[유튜브에서 시청하기]</strong> 버튼을 누르면 새 탭에서 바로 고화질 영상으로 이동합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredVideos.map((video) => {
          let badgeColor = 'bg-blue-950 text-blue-300 border-blue-800';
          if (video.level === '중급') badgeColor = 'bg-purple-950 text-purple-300 border-purple-800';
          if (video.level === '고급') badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';

          return (
            <div
              key={video.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${badgeColor}`}>
                      {video.level}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {video.creator}
                    </span>
                  </div>

                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {video.duration}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {video.desc}
                </p>

                {/* Highlights */}
                <div className="pt-2 border-t border-slate-850 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">주요 학습 포인트:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {video.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  추천 대상: <span className="text-slate-200">{video.audience}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>학습 노트 보기</span>
                </button>

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>유튜브에서 시청하기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Details Modal / Drawer */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedVideo.level}
                </span>
                <span className="text-xs text-slate-400">{selectedVideo.creator} · {selectedVideo.duration}</span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedVideo.title}</h3>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo.desc}</p>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-blue-400">핵심 실무 핵심 요약 (Cheat Sheet)</h4>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {selectedVideo.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">대상: {selectedVideo.audience}</span>
              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                <span>강의 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

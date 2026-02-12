'use client';

import { useRouter } from 'next/navigation';

export default function IntroHero() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center">
        {/* Title */}
        <h1 className="animate-fade-in text-6xl md:text-8xl font-light tracking-[0.3em] text-foreground mb-2">
          TB
        </h1>
        <h2 className="animate-slide-up text-lg md:text-2xl font-light tracking-[0.5em] text-muted-light uppercase mb-16">
          Storyboard
        </h2>

        {/* Divider */}
        <div className="animate-slide-up w-16 h-px bg-border-light mx-auto mb-16" />

        {/* Description */}
        <p className="animate-slide-up-delay text-sm text-muted mb-12 tracking-wider">
          애니메이션 · 영상 스토리보드 제작 도구
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/studio/storyboard')}
          className="animate-slide-up-delay group relative px-10 py-3 border border-border-light text-foreground text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
        >
          시작하기
        </button>
      </div>

      {/* Bottom credit */}
      <div className="absolute bottom-8 text-[11px] text-muted tracking-[0.2em] animate-fade-in">
        STORYBOARD TOOL
      </div>
    </div>
  );
}

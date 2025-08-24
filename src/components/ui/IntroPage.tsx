import React, { useState, useEffect } from 'react';

interface IntroPageProps {
  onComplete: () => void;
}

export function IntroPage({ onComplete }: IntroPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 애니메이션 시작
    setIsVisible(true);
    
    // 단계별 애니메이션 타이밍
    const stepTimings = [1000, 1500, 2000, 2500, 3000];
    
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 총 3.5초 후 완료

    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    // 단계별 진행
    const stepTimer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      }
    }, 800);

    return () => clearTimeout(stepTimer);
  }, [currentStep]);

  return (
    <div className={`intro-page ${isVisible ? 'visible' : ''}`}>
      {/* 배경 그라데이션 */}
      <div className="intro-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="intro-content">
        {/* 로고/아이콘 */}
        <div className={`intro-logo ${currentStep >= 0 ? 'animate-in' : ''}`}>
          <div className="logo-container">
            <svg viewBox="0 0 100 100" className="logo-svg">
              <circle cx="50" cy="50" r="45" className="logo-circle" />
              <path d="M30 35 L50 65 L70 35" className="logo-check" />
            </svg>
          </div>
        </div>

        {/* 메인 타이틀 */}
        <div className={`intro-title ${currentStep >= 1 ? 'animate-in' : ''}`}>
          <h1 className="main-title">
            <span className="title-line">Made with</span>
            <span className="title-line highlight">Action</span>
          </h1>
        </div>

        {/* 서브 타이틀 */}
        <div className={`intro-subtitle ${currentStep >= 2 ? 'animate-in' : ''}`}>
          <h2 className="subtitle-text">
            <span className="subtitle-line">Team 이직발사대</span>
            <span className="subtitle-line">Developer</span>
          </h2>
        </div>

        {/* 시그니처 */}
        <div className={`intro-signature ${currentStep >= 3 ? 'animate-in' : ''}`}>
          <div className="signature-container">
            <span className="signature-text">Binkoon</span>
            <div className="signature-underline"></div>
          </div>
        </div>

        {/* 태그라인 */}
        <div className={`intro-tagline ${currentStep >= 4 ? 'animate-in' : ''}`}>
          <p className="tagline-text">Innovation • Excellence • Impact</p>
        </div>
      </div>

      {/* 로딩 바 */}
      <div className="intro-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 파티클 효과 */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              '--delay': `${i * 0.1}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
    </div>
  );
}

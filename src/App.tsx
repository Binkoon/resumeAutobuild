import React, { useState, useEffect } from 'react';
import HomePage from './pages';
import { IntroPage } from './components/ui/IntroPage';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 인트로 표시 여부 확인
    const hasSeen = localStorage.getItem('hasSeenIntro');
    if (hasSeen === 'true') {
      setShowIntro(false);
      setHasSeenIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setHasSeenIntro(true);
    // 로컬 스토리지에 표시 완료 기록
    localStorage.setItem('hasSeenIntro', 'true');
  };

  // 인트로 페이지 표시
  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  // 메인 앱 표시
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;

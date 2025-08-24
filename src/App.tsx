import React, { useState, useEffect } from 'react';
import HomePage from './pages';
import { IntroPage } from './components/ui/IntroPage';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // 인트로 페이지 표시
  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  // 메인 앱 표시
  return (
    <div className="App">
      <HomePage />
      {/* IntroPage를 다시 보는 버튼 */}
      <button 
        onClick={() => setShowIntro(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Intro 다시보기
      </button>
    </div>
  );
}

export default App;

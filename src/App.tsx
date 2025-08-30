import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages';
import { IntroPage } from './components/ui/IntroPage';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroPage key="intro" onComplete={handleIntroComplete} />
        ) : (
          <div key="main">
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
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

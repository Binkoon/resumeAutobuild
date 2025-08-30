import { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoading } from './components/ui/LoadingSpinner';

// 레이지 로딩으로 컴포넌트 분할
const HomePage = lazy(() => import('./pages'));
const IntroPage = lazy(() => import('./components/ui/IntroPage').then(module => ({ default: module.IntroPage })));

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <Suspense key="intro" fallback={<PageLoading />}>
              <IntroPage onComplete={handleIntroComplete} />
            </Suspense>
          ) : (
            <div key="main">
              <Suspense fallback={<PageLoading />}>
                <HomePage />
              </Suspense>
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
    </ErrorBoundary>
  );
}

export default App;

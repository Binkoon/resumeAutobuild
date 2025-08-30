

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  message = '로딩 중...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`loading-spinner ${className}`}>
      <div className={`spinner ${sizeClasses[size]}`}>
        <div className="spinner-inner"></div>
      </div>
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
}

// 페이지 전체 로딩 컴포넌트
export function PageLoading() {
  return (
    <div className="page-loading">
      <LoadingSpinner size="lg" message="페이지를 불러오는 중..." />
    </div>
  );
}

// 섹션별 로딩 컴포넌트
export function SectionLoading({ message = '데이터를 불러오는 중...' }: { message?: string }) {
  return (
    <div className="section-loading">
      <LoadingSpinner size="md" message={message} />
    </div>
  );
}

// 버튼 로딩 컴포넌트
export function ButtonLoading() {
  return (
    <div className="button-loading">
      <LoadingSpinner size="sm" message="" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Resume AutoBuild</h3>
            <p className="footer-description">
              AI 기반의 스마트한 이력서 작성 도구로, 전문적이고 매력적인 CV를 쉽게 만들어보세요.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-section-title">기능</h4>
            <ul className="footer-links">
              <li><a href="#templates">CV 템플릿</a></li>
              <li><a href="#ai-suggestions">AI 제안</a></li>
              <li><a href="#preview">실시간 미리보기</a></li>
              <li><a href="#download">다양한 형식 다운로드</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-section-title">지원</h4>
            <ul className="footer-links">
              <li><a href="#help">사용법 가이드</a></li>
              <li><a href="#faq">자주 묻는 질문</a></li>
              <li><a href="#contact">문의하기</a></li>
              <li><a href="#feedback">피드백</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-section-title">연결</h4>
            <ul className="footer-links">
              <li><a href="#github">GitHub</a></li>
              <li><a href="#blog">블로그</a></li>
              <li><a href="#community">커뮤니티</a></li>
              <li><a href="#newsletter">뉴스레터</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2025 Secret Resume. All rights reserved Binkoon.
          </div>
          <div className="footer-social">
            <a href="#github" className="footer-social-link" aria-label="GitHub">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#linkedin" className="footer-social-link" aria-label="LinkedIn">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

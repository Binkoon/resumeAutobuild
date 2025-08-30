import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 번들 크기 경고 임계값 증가
    chunkSizeWarningLimit: 1000,
    
    // 수동 청크 분할
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'react-vendor': ['react', 'react-dom'],
          
          // 애니메이션 라이브러리
          'animation': ['framer-motion'],
          
          // 3D 라이브러리
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          
          // PDF 생성 라이브러리
          'pdf': ['jspdf'],
          
          // 상태 관리
          'state': ['zustand'],
          
          // UI 컴포넌트들
          'ui-components': [
            './src/components/ui/Header.tsx',
            './src/components/ui/Footer.tsx',
            './src/components/ui/StarRating.tsx',
            './src/components/ui/LoadingSpinner.tsx'
          ],
          
          // 빌더 컴포넌트들
          'builder-components': [
            './src/components/builder/CVBuilder.tsx',
            './src/components/builder/Preview.tsx',
            './src/components/builder/SectionEditor.tsx'
          ],
          
          // 유틸리티
          'utils': [
            './src/lib/download.ts',
            './src/lib/validation.ts',
            './src/lib/translation.ts'
          ]
        }
      }
    },
    
    // 압축 최적화
    minify: 'esbuild'
  },
  
  // 개발 서버 설정
  server: {
    hmr: {
      overlay: false
    }
  },
  
  // 의존성 최적화
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'zustand',
      'jspdf'
    ]
  }
})

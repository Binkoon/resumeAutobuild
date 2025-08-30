import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface IntroPageProps {
  onComplete: () => void;
}

// Three.js 배경 컴포넌트 - 미니멀 & 세련된 스타일
function FloatingDots() {
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  // 미니멀한 점들
  const dotsPosition = new Float32Array(100);
  for (let i = 0; i < 100; i++) {
    dotsPosition[i] = (Math.random() - 0.5) * 15;
  }

  return (
    <Points ref={pointsRef} positions={dotsPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0ea5e9"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function GeometricShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -6]}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial 
        color="#0ea5e9" 
        transparent 
        opacity={0.08}
        wireframe={true}
      />
    </mesh>
  );
}

function SubtleLines() {
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  const points = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 4;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      -3
    ));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color: "#0ea5e9", 
      transparent: true, 
      opacity: 0.15 
    }))} ref={lineRef} />
  );
}

export function IntroPage({ onComplete }: IntroPageProps) {
  useEffect(() => {
    // 6.5초 후 완료 (애니메이션 시간 고려 + 각인 시간)
    const timer = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="intro-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
      transition={{ duration: 0.8 }}
    >
        {/* Three.js 배경 - 미니멀 & 세련된 스타일 */}
        <div className="three-background">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ background: 'transparent' }}
          >
            <FloatingDots />
            <GeometricShape />
            <SubtleLines />
          </Canvas>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="intro-content">
          {/* 로고/아이콘 */}
          <motion.div 
            className="intro-logo"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
          >
            <motion.div 
              className="logo-container"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg viewBox="0 0 100 100" className="logo-svg">
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="logo-circle"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.path 
                  d="M30 35 L50 65 L70 35" 
                  className="logo-check"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.div 
            className="intro-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.8,
              ease: "easeOut"
            }}
          >
            <motion.h1 
              className="main-title"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.span 
                className="title-line"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                Made with{' '}
              </motion.span>
              <motion.span 
                className="title-line highlight"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
              >
                Action
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* 서브 타이틀 */}
          <motion.div 
            className="intro-subtitle"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.8,
              ease: "easeOut"
            }}
          >
            <motion.h2 
              className="subtitle-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 2.0 }}
            >
              <motion.span 
                className="subtitle-line brake-text"
                initial={{ x: -100, opacity: 0, scale: 0.8 }}
                animate={{ 
                  x: [0, 15, -5, 0], 
                  opacity: 1, 
                  scale: [1, 1.1, 0.95, 1],
                  rotate: [0, 2, -1, 0]
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 2.2,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut"
                }}
              >
                Team 이직발사대
              </motion.span>
            </motion.h2>
          </motion.div>

          {/* 시그니처 */}
          <motion.div 
            className="intro-signature"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 150, 
              damping: 12,
              delay: 2.6
            }}
          >
            <motion.div 
              className="signature-container"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="developer-text"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.6, ease: "easeOut" }}
              >
                Developer{' '}
              </motion.span>
              <motion.span 
                className="signature-text-handwritten"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 2.0, delay: 3.0, ease: "easeOut" }}
                whileHover={{ 
                  textShadow: "0 0 30px rgba(14, 165, 233, 1), 0 0 60px rgba(14, 165, 233, 0.8), 0 0 90px rgba(14, 165, 233, 0.5)",
                  scale: 1.08,
                  rotate: 2,
                  transition: { duration: 0.4, type: "spring", stiffness: 200 }
                }}
              >
                Binkoon
              </motion.span>
              <motion.div 
                className="signature-underline"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.0, delay: 3.5, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>

          {/* 태그라인 */}
          <motion.div 
            className="intro-tagline"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 1.0, 
              delay: 4.0,
              ease: "easeOut"
            }}
          >
            <motion.p 
              className="tagline-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 4.2 }}
            >
              Innovation • Excellence • Impact
            </motion.p>
          </motion.div>
        </div>

        {/* 로딩 바 */}
        <motion.div 
          className="intro-progress"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5.0, ease: "easeInOut" }}
            />
          </div>
        </motion.div>


      </motion.div>
  );
}

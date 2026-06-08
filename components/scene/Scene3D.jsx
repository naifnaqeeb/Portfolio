'use client';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

// ─── HackerRoom Model ─────────────────────────────────────────────────────────
function HackerRoom({ onMonitorClick }) {
  const { nodes, materials } = useGLTF('/models/hacker-room.glb');
  const monitortxt = useTexture('/textures/desk/monitor.png');

  // HTML Canvas for Left Monitor Terminal Screen
  const canvas = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    return c;
  }, []);

  const canvasTexture = useMemo(() => {
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [canvas]);

  // Terminal typewriter state
  const terminalState = useRef({
    lineIndex: 0,
    charIndex: 0,
    elapsed: 0,
    lines: [
      "> Hello, I'm Naif",
      "> Welcome to my portfolio",
      "> Click the monitor to enter"
    ],
    typedLines: ["", "", ""],
    pauseTime: 0,
    phase: 'typing', // 'typing' | 'waiting'
  });

  // Programmatically split screens_0 geometry into Main Screen and TV Screen
  const { mainGeom, tvGeom, tvUvBounds } = useMemo(() => {
    if (!nodes || !nodes.screen_screens_0) return { mainGeom: null, tvGeom: null, tvUvBounds: null };

    const geom = nodes.screen_screens_0.geometry;
    const main = geom.clone();
    const tv = geom.clone();

    const posAttr = geom.attributes.position;
    const uvAttr = geom.attributes.uv;
    const indexAttr = geom.index;

    let minU = Infinity, maxU = -Infinity;
    let minV = Infinity, maxV = -Infinity;

    // Find UV bounds of TV Screen vertices (where local X > 35.0)
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      if (px > 35.0) {
        const u = uvAttr.getX(i);
        const v = uvAttr.getY(i);
        if (u < minU) minU = u;
        if (u > maxU) maxU = u;
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
      }
    }

    if (indexAttr) {
      const mainIndices = Array.from(indexAttr.array);
      const tvIndices = Array.from(indexAttr.array);

      for (let i = 0; i < indexAttr.count; i += 3) {
        const idx0 = indexAttr.getX(i);
        const idx1 = indexAttr.getX(i + 1);
        const idx2 = indexAttr.getX(i + 2);

        const px0 = posAttr.getX(idx0);
        const px1 = posAttr.getX(idx1);
        const px2 = posAttr.getX(idx2);

        const isTv = (px0 > 35.0 || px1 > 35.0 || px2 > 35.0);

        if (isTv) {
          mainIndices[i] = 0;
          mainIndices[i + 1] = 0;
          mainIndices[i + 2] = 0;
        } else {
          tvIndices[i] = 0;
          tvIndices[i + 1] = 0;
          tvIndices[i + 2] = 0;
        }
      }

      main.setIndex(new THREE.BufferAttribute(new indexAttr.array.constructor(mainIndices), 1));
      tv.setIndex(new THREE.BufferAttribute(new indexAttr.array.constructor(tvIndices), 1));
    } else {
      const mainPos = main.attributes.position.clone();
      const tvPos = tv.attributes.position.clone();

      for (let i = 0; i < posAttr.count; i += 3) {
        const px0 = posAttr.getX(i);
        const px1 = posAttr.getX(i + 1);
        const px2 = posAttr.getX(i + 2);

        const isTv = (px0 > 35.0 || px1 > 35.0 || px2 > 35.0);

        if (isTv) {
          mainPos.setXYZ(i, 0, 0, 0);
          mainPos.setXYZ(i + 1, 0, 0, 0);
          mainPos.setXYZ(i + 2, 0, 0, 0);
        } else {
          tvPos.setXYZ(i, 0, 0, 0);
          tvPos.setXYZ(i + 1, 0, 0, 0);
          tvPos.setXYZ(i + 2, 0, 0, 0);
        }
      }
      main.setAttribute('position', mainPos);
      tv.setAttribute('position', tvPos);
    }

    return {
      mainGeom: main,
      tvGeom: tv,
      tvUvBounds: { minU, maxU, minV, maxV }
    };
  }, [nodes]);

  const tvShaderUniforms = useMemo(() => {
    if (!tvUvBounds) return null;
    return {
      map: { value: canvasTexture },
      minU: { value: tvUvBounds.minU },
      maxU: { value: tvUvBounds.maxU },
      minV: { value: tvUvBounds.minV },
      maxV: { value: tvUvBounds.maxV },
    };
  }, [canvasTexture, tvUvBounds]);

  useFrame((state, delta) => {
    if (!canvas || !canvasTexture) return;
    const s = terminalState.current;

    // 1. Advance typewriter animation
    if (s.phase === 'typing') {
      s.elapsed += delta;
      if (s.elapsed > 0.05) { // 50ms per character
        s.elapsed = 0;
        const currentFullLine = s.lines[s.lineIndex];
        if (s.charIndex < currentFullLine.length) {
          s.charIndex++;
          s.typedLines[s.lineIndex] = currentFullLine.substring(0, s.charIndex);
        } else {
          // Finished typing current line
          if (s.lineIndex < s.lines.length - 1) {
            s.lineIndex++;
            s.charIndex = 0;
          } else {
            // Finished typing all lines
            s.phase = 'waiting';
            s.pauseTime = 0;
          }
        }
      }
    } else if (s.phase === 'waiting') {
      s.pauseTime += delta;
      if (s.pauseTime > 3.0) { // 3 seconds pause before restart
        s.phase = 'typing';
        s.lineIndex = 0;
        s.charIndex = 0;
        s.elapsed = 0;
        s.typedLines = ["", "", ""];
      }
    }

    // 2. Draw to the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber scanlines
      ctx.fillStyle = 'rgba(0, 20, 0, 0.12)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      // Green text styling
      ctx.fillStyle = '#00ff41';
      ctx.font = 'bold 26px "Courier New", Courier, monospace';

      const lineHeight = 45;
      const startX = 35;
      const startY = 85;

      for (let i = 0; i <= s.lineIndex; i++) {
        let text = s.typedLines[i];
        const isCurrentLine = (i === s.lineIndex);
        const isLastLine = (i === s.lines.length - 1);

        if (isCurrentLine) {
          const isBlinking = Math.floor(state.clock.elapsedTime * 3) % 2 === 0;
          if (s.phase === 'typing') {
            text += '_';
          } else if (s.phase === 'waiting' && isLastLine) {
            if (isBlinking) {
              text += '_';
            }
          }
        }

        ctx.fillText(text, startX, startY + i * lineHeight);
      }

      // Refresh texture
      canvasTexture.needsUpdate = true;
    }
  });

  return (
    <group dispose={null}>
      {/* clickable main monitor screen */}
      {mainGeom && (
        <mesh
          geometry={mainGeom}
          onClick={(e) => { e.stopPropagation(); onMonitorClick(e); }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() =>  { document.body.style.cursor = 'default'; }}
        >
          <meshStandardMaterial
            color="#1a0030"
            emissive="#3d0070"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Left Monitor TV Screen (renders terminal screen only, not clickable) */}
      {tvGeom && tvShaderUniforms && (
        <mesh geometry={tvGeom}>
          <shaderMaterial
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec2 vUv;
              uniform sampler2D map;
              uniform float minU;
              uniform float maxU;
              uniform float minV;
              uniform float maxV;
              void main() {
                float u = (vUv.x - minU) / (maxU - minU);
                float v = (vUv.y - minV) / (maxV - minV);
                if (u >= 0.0 && u <= 1.0 && v >= 0.0 && v <= 1.0) {
                  gl_FragColor = texture2D(map, vec2(u, v));
                } else {
                  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                }
              }
            `}
            uniforms={tvShaderUniforms}
            toneMapped={false}
          />
        </mesh>
      )}

      <mesh geometry={nodes.screen_glass_glass_0.geometry} material={materials.glass} />
      <mesh geometry={nodes.table_table_mat_0_1.geometry} material={materials.table_mat} />
      
      {/* Restored computer casing to original matcap material */}
      <mesh geometry={nodes.table_table_mat_0_2.geometry} material={materials.computer_mat}>
        <meshMatcapMaterial map={monitortxt} />
      </mesh>
      
      <mesh geometry={nodes.table_table_mat_0_3.geometry} material={materials.server_mat} />
      <mesh geometry={nodes.table_table_mat_0_4.geometry} material={materials.vhsPlayer_mat} />
      <mesh geometry={nodes.table_table_mat_0_5.geometry} material={materials.stand_mat} />
      <mesh geometry={nodes.table_table_mat_0_6.geometry} material={materials.mat_mat} />
      <mesh geometry={nodes.table_table_mat_0_7.geometry} material={materials.arm_mat} />
      
      {/* Restored TV casing to original matcap material */}
      <mesh geometry={nodes.table_table_mat_0_8.geometry} material={materials.tv_mat}>
        <meshMatcapMaterial map={monitortxt} />
      </mesh>
      
      <mesh geometry={nodes.table_table_mat_0_9.geometry}  material={materials.cables_mat} />
      <mesh geometry={nodes.table_table_mat_0_10.geometry} material={materials.props_mat} />
      <mesh geometry={nodes.table_table_mat_0_11.geometry} material={materials.ground_mat} />
      <mesh geometry={nodes.table_table_mat_0_12.geometry} material={materials.key_mat} />
    </group>
  );
}

useGLTF.preload('/models/hacker-room.glb');

// ─── Camera Controller ────────────────────────────────────────────────────────
function CameraRig({ zoomTarget, onZoomComplete }) {
  const { camera } = useThree();
  const zooming = useRef(false);

  useEffect(() => {
    if (!zoomTarget) return;
    if (zooming.current) return;
    zooming.current = true;

    // Animate to very close to the monitor screen
    gsap.to(camera.position, {
      x: zoomTarget.x,
      y: zoomTarget.y + 0.05,
      z: zoomTarget.z + 0.3,
      duration: 1.4,
      ease: 'power3.inOut',
    });

    gsap.to(camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.4,
      ease: 'power3.inOut',
      onComplete: () => {
        zooming.current = false;
        onZoomComplete();
      },
    });
  }, [zoomTarget]);

  return null;
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
export default function Scene3D({ onEnterDesktop }) {
  const [zoomTarget, setZoomTarget] = useState(null);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMonitorClick = (e) => {
    if (zoomTarget) return; // already zooming
    const point = e.point.clone();
    setZoomTarget(point);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#c5c5c5', position: 'relative' }}>
      {/* Top-Left HUD Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        pointerEvents: 'none',
      }}>
        <div style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '5px 10px',
          width: 'fit-content',
          letterSpacing: '0.02em',
        }}>
          Naif Naqeeb
        </div>
        <div style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '14px',
          padding: '5px 10px',
          width: 'fit-content',
          letterSpacing: '0.02em',
        }}>
          Full Stack AI Engineer
        </div>
        <div style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '14px',
          padding: '5px 10px',
          width: 'fit-content',
          letterSpacing: '0.02em',
        }}>
          {timeString}
        </div>
      </div>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-3, 4, 2]} intensity={0.8} color="#ffffff" />
        <pointLight position={[3, 2, -2]} intensity={0.5} color="#b0d0ff" />

        {/* Environment */}
        <color attach="background" args={['#c5c5c5']} />
        <fog attach="fog" args={['#c5c5c5', 10, 25]} />

        {/* The hacker room model */}
        <group position={[1.0, -5.0, -0.2]} rotation={[0.15, -Math.PI, 0]} scale={0.055}>
          <HackerRoom onMonitorClick={handleMonitorClick} />
        </group>

        {/* Subtle ground shadow */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={12}
          blur={2}
          far={4}
          color="#888888"
        />

        {/* Camera animation + orbit controls */}
        <CameraRig zoomTarget={zoomTarget} onZoomComplete={onEnterDesktop} />
        <OrbitControls
          enabled={!zoomTarget}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0.5, 0]}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>



      {/* Zoom loading overlay */}
      {zoomTarget && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(197, 197, 197, 0)',
          animation: 'fadeToWhite 1.4s ease-in-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-4px); }
        }
        @keyframes fadeToWhite {
          0% { background: rgba(197,197,197,0); }
          100% { background: rgba(197,197,197,1); }
        }
      `}</style>
    </div>
  );
}

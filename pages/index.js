import Ubuntu from "../components/ubuntu";
import ReactGA from 'react-ga4';
import Meta from "../components/SEO/Meta";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
ReactGA.initialize(TRACKING_ID);

// Load 3D scene client-side only (Three.js is not SSR-compatible)
const Scene3D = dynamic(() => import('../components/scene/Scene3D'), { ssr: false });

function App() {
  const [desktopMode, setDesktopMode] = useState(false);

  // ESC key → return to 3D scene
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && desktopMode) {
        setDesktopMode(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [desktopMode]);

  const handleEnterDesktop = () => {
    setDesktopMode(true);
  };

  return (
    <>
      <Meta />

      {/* 3D Scene — entry point */}
      {!desktopMode && (
        <Scene3D onEnterDesktop={handleEnterDesktop} />
      )}

      {/* Ubuntu Desktop — shown after zoom */}
      {desktopMode && (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
          <Ubuntu />
          {/* ESC hint */}
          <div style={{
            position: 'fixed',
            bottom: '12px',
            right: '16px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            pointerEvents: 'none',
            zIndex: 9999,
            letterSpacing: '0.05em',
          }}>
            ESC → back to desk
          </div>
        </div>
      )}
    </>
  )
}

export default App;

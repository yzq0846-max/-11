import React, { useState, useEffect, useCallback } from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';
import { generateHolidayWish } from './services/geminiService';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.SCATTERED);
  const [greeting, setGreeting] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Sound effect handler (simulated)
  const playSound = useCallback(() => {
    // In a real production app, we would use Howler.js here
    // const audio = new Audio('/chime.mp3');
    // audio.play().catch(e => console.log('Audio blocked'));
  }, []);

  const handleToggle = useCallback(async () => {
    const newState = treeState === TreeState.SCATTERED ? TreeState.TREE_SHAPE : TreeState.SCATTERED;
    setTreeState(newState);
    playSound();

    // If moving to Tree shape and haven't generated a wish yet (or want a new one every time)
    if (newState === TreeState.TREE_SHAPE) {
      if (!hasGenerated || Math.random() > 0.7) { // 30% chance to regenerate if already generated
        setLoading(true);
        try {
          // If API key is not present, the service falls back to default text smoothly
          const wish = await generateHolidayWish();
          setGreeting(wish);
          setHasGenerated(true);
        } finally {
          setLoading(false);
        }
      }
    }
  }, [treeState, hasGenerated, playSound]);

  return (
    <div className="relative w-full h-screen bg-[#010502]">
      {/* 3D Scene Container */}
      <div className="absolute inset-0 z-0">
        <Experience treeState={treeState} />
      </div>

      {/* UI Overlay */}
      <Overlay 
        treeState={treeState} 
        onToggle={handleToggle} 
        greeting={greeting}
        loading={loading}
      />

      {/* Cinematic Vignette Overlay (CSS based for extra depth) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,10,5,0.4)_100%)]" />
    </div>
  );
};

export default App;

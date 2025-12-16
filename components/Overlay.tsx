import React from 'react';
import { TreeState } from '../types';
import { Sparkles, Play, Maximize2 } from 'lucide-react';

interface OverlayProps {
  treeState: TreeState;
  onToggle: () => void;
  greeting: string;
  loading: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ treeState, onToggle, greeting, loading }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Header */}
      <div className="flex justify-between items-start opacity-0 animate-[fadeIn_2s_ease-out_forwards]">
        <div>
          <h1 className="text-4xl md:text-6xl text-amber-100 font-serif tracking-tighter font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
            ARIX
          </h1>
          <p className="text-emerald-500/80 text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-medium" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            臻选系列 · 圣诞限定
          </p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-amber-100/50 text-xs tracking-widest" style={{ fontFamily: '"Noto Serif SC", serif' }}>沉浸式 3D 交互体验</p>
            <p className="text-amber-100/30 text-[10px] mt-1">V.19.0.0 // REACT THREE FIBER</p>
        </div>
      </div>

      {/* Center Message (Greeting) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-3xl px-4">
        {treeState === TreeState.TREE_SHAPE && (
            <div className="transition-all duration-1000 ease-out transform translate-y-0 opacity-100">
                <p className="text-amber-200 text-xl md:text-3xl font-serif italic leading-relaxed drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {loading ? (
                        <span className="animate-pulse opacity-50 text-base">正在以此刻的灵感为您以此...</span>
                    ) : (
                        `"${greeting}"`
                    )}
                </p>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-8"></div>
            </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto">
        <button
          onClick={onToggle}
          className={`
            group relative px-8 py-4 bg-black/40 backdrop-blur-md border border-amber-500/30 
            hover:border-amber-400/80 hover:bg-emerald-950/40 transition-all duration-500 rounded-sm
            flex items-center gap-3 overflow-hidden
          `}
        >
          {/* Button Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          
          {treeState === TreeState.SCATTERED ? (
            <>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-amber-100 tracking-[0.2em] text-sm font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>聚合 · 圣诞树</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-100 tracking-[0.2em] text-sm font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>散开 · 漫天星</span>
            </>
          )}
        </button>

        <p className="text-amber-100/20 text-[10px] uppercase tracking-widest mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
          滚动缩放 • 拖拽旋转
        </p>
      </div>
    </div>
  );
};
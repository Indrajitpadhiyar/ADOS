import React, { useState } from 'react';
import Home from './pages/Home/Home';
import FullPageAuth from './components/FullPageAuth';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth'

  return (
    <div className="w-full min-h-screen">
      {currentView === 'home' ? (
        <Home onOpenAuth={() => setCurrentView('auth')} />
      ) : (
        <div className="relative">
          {/* Quick Back to Landing Bar */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 transition-all hover:scale-105 cursor-pointer"
            >
              ← Back to Landing
            </button>
          </div>
          <FullPageAuth />
        </div>
      )}
    </div>
  );
}

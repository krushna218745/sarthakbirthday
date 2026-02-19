import { useState, useCallback } from 'react';
import WhatsAppIntro from './components/WhatsAppIntro';
import HeroSection from './components/HeroSection';
import TickerBanner from './components/TickerBanner';
import AchievementSection from './components/AchievementSection';
import RoastSection from './components/RoastSection';
import MemeWall from './components/MemeWall';
import EvolutionTimeline from './components/EvolutionTimeline';
import FinalSection from './components/FinalSection';
import RandomPopups from './components/RandomPopups';
import CursorEffects from './components/CursorEffects';
import SarthakCharacter from './components/characters/SarthakCharacter';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    console.log('handleIntroComplete called! Setting showIntro to false');
    setShowIntro(false);
  }, []);

  return (
    <>
      {/* WhatsApp Intro Overlay */}
      {showIntro && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>
          <WhatsAppIntro onComplete={handleIntroComplete} />
        </div>
      )}

      {/* Main Content - shown after intro */}
      {!showIntro && (
        <>
          <CursorEffects />
          <RandomPopups />
          <SarthakCharacter />
          <HeroSection />
          <TickerBanner />
          <AchievementSection />
          <RoastSection />
          <EvolutionTimeline />
          <MemeWall />
          <FinalSection />
        </>
      )}
    </>
  );
}

export default App;

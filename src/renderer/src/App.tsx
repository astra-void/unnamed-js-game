import GameCanvas from './ui/components/GameCanvas';
import { useUIManager } from './ui';
import { useEffect } from 'react';
import TestUI from './ui/components/testUI';

const App = () => {
  const ui = useUIManager();

  useEffect(() => {
    ui.addDOMUI(<TestUI />);
  }, []);

  return (
    <div className="relative w-[1000px] h-[800px]">
      <GameCanvas onReady={(game) => {}} />
      {ui.domComponents.map((Component, idx) => (
        <div key={idx}>{Component}</div>
      ))}
    </div>
  );
};

export default App;
